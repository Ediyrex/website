import { asc, desc, eq, and, inArray } from "drizzle-orm";
import {
  getDb,
  serviceDivisions,
  services,
  projects,
  caseStudies,
  projectServices,
  studioProducts,
} from "@/db";
import { SERVICES_DATA } from "@/features/services/data";
import { PROJECTS_DATA } from "@/features/work/data";
import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";
import type {
  HybridProduct,
  ProjectItem,
  ServiceDivision,
  ServiceItem,
} from "@/types";

export async function getPublishedServices(
  divisionSlug?: string
): Promise<ServiceItem[]> {
  const db = getDb();
  if (!db) {
    const items = SERVICES_DATA.filter((s) => s.isPublished);
    return divisionSlug && ["branding", "media", "digital", "ai"].includes(divisionSlug)
      ? items.filter((s) => s.division === divisionSlug)
      : items;
  }

  const conditions = [
    eq(services.status, "published"),
    eq(serviceDivisions.isActive, true),
  ];
  if (divisionSlug && ["branding", "media", "digital", "ai"].includes(divisionSlug)) {
    conditions.push(eq(serviceDivisions.slug, divisionSlug));
  }

  const rows = await db
    .select({
      id: services.id,
      slug: services.slug,
      title: services.title,
      description: services.description,
      divisionSlug: serviceDivisions.slug,
      featured: services.isFeatured,
      displayOrder: services.displayOrder,
      deliverables: services.deliverables,
      iconName: services.iconName,
    })
    .from(services)
    .innerJoin(serviceDivisions, eq(services.divisionId, serviceDivisions.id))
    .where(and(...conditions))
    .orderBy(asc(services.displayOrder), asc(services.title));

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    division: row.divisionSlug as ServiceDivision,
    featured: row.featured,
    displayOrder: row.displayOrder,
    isPublished: true,
    capabilities: Array.isArray(row.deliverables) ? row.deliverables : [],
    iconName: row.iconName || "Sparkles",
  }));
}

function inferProjectCategory(
  divisions: string[],
  projectType: "client" | "concept" | "internal"
): ServiceDivision | "hybrid" {
  const unique = Array.from(new Set(divisions));
  if (unique.length === 1 && ["branding", "media", "digital", "ai"].includes(unique[0])) {
    return unique[0] as ServiceDivision;
  }
  if (projectType === "internal" || unique.length > 1) {
    return "hybrid";
  }
  return "digital";
}

export async function getPublishedProjects(options?: {
  category?: string;
  featuredOnly?: boolean;
}): Promise<ProjectItem[]> {
  const db = getDb();
  if (!db) {
    let items = PROJECTS_DATA.filter((p) => p.isPublished);
    if (
      options?.category &&
      ["branding", "media", "digital", "ai", "hybrid"].includes(options.category)
    ) {
      items = items.filter((p) => p.category === options.category);
    }
    if (options?.featuredOnly) {
      items = items.filter((p) => p.featured);
    }
    return items;
  }

  const conditions = [eq(projects.status, "published")];
  if (options?.featuredOnly) {
    conditions.push(eq(projects.isFeatured, true));
  }

  const projectRows = await db
    .select()
    .from(projects)
    .where(and(...conditions))
    .orderBy(asc(projects.displayOrder), desc(projects.publishedAt))
    .limit(100);

  if (projectRows.length === 0) {
    return [];
  }

  const projectIds = projectRows.map((p) => p.id);

  // Batch fetch child records using IN clause (prevents N+1 queries)
  const [caseStudyRows, linkedServicesRows] = await Promise.all([
    db
      .select()
      .from(caseStudies)
      .where(
        and(
          inArray(caseStudies.projectId, projectIds),
          eq(caseStudies.status, "published")
        )
      ),
    db
      .select({
        projectId: projectServices.projectId,
        serviceTitle: services.title,
        divisionSlug: serviceDivisions.slug,
      })
      .from(projectServices)
      .innerJoin(services, eq(projectServices.serviceId, services.id))
      .innerJoin(serviceDivisions, eq(services.divisionId, serviceDivisions.id))
      .where(inArray(projectServices.projectId, projectIds)),
  ]);

  const caseStudyByProjectId = new Map(
    caseStudyRows.map((cs) => [cs.projectId, cs])
  );

  const servicesByProjectId = new Map<
    string,
    { titles: string[]; divisions: string[] }
  >();
  for (const link of linkedServicesRows) {
    const entry = servicesByProjectId.get(link.projectId) || {
      titles: [],
      divisions: [],
    };
    entry.titles.push(link.serviceTitle);
    entry.divisions.push(link.divisionSlug);
    servicesByProjectId.set(link.projectId, entry);
  }

  let mapped: ProjectItem[] = projectRows.map((row) => {
    const cs = caseStudyByProjectId.get(row.id);
    const linked = servicesByProjectId.get(row.id) || {
      titles: [],
      divisions: [],
    };
    const category = inferProjectCategory(linked.divisions, row.projectType);
    const staticFallback = PROJECTS_DATA.find((p) => p.slug === row.slug);

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      category,
      servicesDemonstrated: linked.titles,
      coverImage:
        staticFallback?.coverImage ||
        "/images/projects/concept-digital-strata.svg",
      coverAlt: staticFallback?.coverAlt || row.title,
      description: row.description,
      challenge: cs?.challenge,
      approach: cs?.approach,
      outcomes: cs?.verifiedOutcomes ?? [],
      isConcept: row.projectType !== "client",
      featured: row.isFeatured,
      isPublished: true,
      createdAt: (row.publishedAt ?? row.createdAt).toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  });

  if (
    options?.category &&
    ["branding", "media", "digital", "ai", "hybrid"].includes(options.category)
  ) {
    mapped = mapped.filter((p) => p.category === options.category);
  }

  return mapped;
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectItem | null> {
  const db = getDb();
  if (!db) {
    return PROJECTS_DATA.find((p) => p.slug === slug && p.isPublished) ?? null;
  }

  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
    .limit(1);

  if (!row) {
    return null;
  }

  const [csRows, linkedRows] = await Promise.all([
    db
      .select()
      .from(caseStudies)
      .where(
        and(
          eq(caseStudies.projectId, row.id),
          eq(caseStudies.status, "published")
        )
      )
      .limit(1),
    db
      .select({
        serviceTitle: services.title,
        divisionSlug: serviceDivisions.slug,
      })
      .from(projectServices)
      .innerJoin(services, eq(projectServices.serviceId, services.id))
      .innerJoin(serviceDivisions, eq(services.divisionId, serviceDivisions.id))
      .where(eq(projectServices.projectId, row.id)),
  ]);

  const cs = csRows[0];
  const titles = linkedRows.map((l) => l.serviceTitle);
  const divisions = linkedRows.map((l) => l.divisionSlug);
  const category = inferProjectCategory(divisions, row.projectType);
  const staticFallback = PROJECTS_DATA.find((p) => p.slug === row.slug);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category,
    servicesDemonstrated: titles,
    coverImage:
      staticFallback?.coverImage ||
      "/images/projects/concept-digital-strata.svg",
    coverAlt: staticFallback?.coverAlt || row.title,
    description: row.description,
    challenge: cs?.challenge,
    approach: cs?.approach,
    outcomes: cs?.verifiedOutcomes ?? [],
    isConcept: row.projectType !== "client",
    featured: row.isFeatured,
    isPublished: true,
    createdAt: (row.publishedAt ?? row.createdAt).toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getPublishedStudioProducts(): Promise<HybridProduct[]> {
  const db = getDb();
  if (!db) {
    return HYBRID_PRODUCTS_DATA;
  }

  const rows = await db
    .select({
      id: studioProducts.id,
      slug: studioProducts.slug,
      name: studioProducts.name,
      tagline: studioProducts.tagline,
      description: studioProducts.description,
      productStage: studioProducts.productStage,
      techStack: studioProducts.techStack,
      demoUrl: studioProducts.demoUrl,
      divisionSlug: serviceDivisions.slug,
    })
    .from(studioProducts)
    .leftJoin(
      serviceDivisions,
      eq(studioProducts.divisionId, serviceDivisions.id)
    )
    .where(eq(studioProducts.status, "published"))
    .orderBy(asc(studioProducts.displayOrder))
    .limit(50);

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    status: row.productStage as HybridProduct["status"],
    division: (row.divisionSlug as ServiceDivision | null) ?? "hybrid",
    techStack: Array.isArray(row.techStack) ? row.techStack : [],
    demoUrl: row.demoUrl ?? undefined,
  }));
}
