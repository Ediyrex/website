import { asc, desc, eq, and } from "drizzle-orm";
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
    return divisionSlug && ["media", "digital", "ai"].includes(divisionSlug)
      ? items.filter((s) => s.division === divisionSlug)
      : items;
  }

  const conditions = [
    eq(services.status, "published"),
    eq(serviceDivisions.isActive, true),
  ];
  if (divisionSlug && ["media", "digital", "ai"].includes(divisionSlug)) {
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
  if (unique.length === 1 && ["media", "digital", "ai"].includes(unique[0])) {
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
      ["media", "digital", "ai", "hybrid"].includes(options.category)
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
    .orderBy(asc(projects.displayOrder), desc(projects.publishedAt));

  if (projectRows.length === 0) {
    return [];
  }

  const caseStudyRows = await db
    .select()
    .from(caseStudies)
    .where(eq(caseStudies.status, "published"));

  const linkedServicesRows = await db
    .select({
      projectId: projectServices.projectId,
      serviceTitle: services.title,
      divisionSlug: serviceDivisions.slug,
    })
    .from(projectServices)
    .innerJoin(services, eq(projectServices.serviceId, services.id))
    .innerJoin(serviceDivisions, eq(services.divisionId, serviceDivisions.id));

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

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      category,
      servicesDemonstrated: linked.titles,
      coverImage: "",
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
    ["media", "digital", "ai", "hybrid"].includes(options.category)
  ) {
    mapped = mapped.filter((p) => p.category === options.category);
  }

  return mapped;
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectItem | null> {
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug) ?? null;
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
    .orderBy(asc(studioProducts.displayOrder));

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

