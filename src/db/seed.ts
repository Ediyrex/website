import "dotenv/config";
import { eq, inArray, notInArray } from "drizzle-orm";
import {
  getDb,
  closeDb,
  roles,
  serviceDivisions,
  services,
  projects,
  caseStudies,
  projectServices,
  studioProducts,
  siteSettings,
  cmsPages,
  blogCategories,
  seoRedirects,
} from "./index";
import { SERVICES_DATA } from "../features/services/data";
import { PROJECTS_DATA } from "../features/work/data";
import { HYBRID_PRODUCTS_DATA } from "../features/products/data";

const INITIAL_DIVISIONS = [
  {
    displayNumber: "01",
    name: "Branding & Marketing",
    slug: "branding",
    heading: "Build brands that",
    italicHeading: "last.",
    description:
      "Strategic branding, growth marketing and campaigns that create real demand.",
    tags: ["BRAND IDENTITY", "GROWTH", "SEO", "CAMPAIGNS", "PACKAGING"],
    ctaLabel: "Explore Branding",
    destinationUrl: "/services/branding",
    coverImageUrl: "/images/services/branding.jpg",
    coverAlt:
      "Cinema camera lens with warm orange reflections in a dark studio representing Branding and Marketing",
    iconName: "Megaphone",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    displayNumber: "02",
    name: "Web Development",
    slug: "digital",
    heading: "Digital products with",
    italicHeading: "intent.",
    description:
      "High-performance websites, SaaS platforms and digital experiences built for scale.",
    tags: ["WEBSITES", "SAAS", "DASHBOARDS", "UI / UX", "INTEGRATIONS"],
    ctaLabel: "Explore Web Dev",
    destinationUrl: "/services/digital",
    coverImageUrl: "/images/services/web-dev.jpg",
    coverAlt:
      "Minimalist dark laptop showing software engineering environment on textured rock representing Web Development",
    iconName: "Globe",
    displayOrder: 2,
    isActive: true,
    isFeatured: true,
  },
  {
    displayNumber: "03",
    name: "Agents & Automation",
    slug: "ai",
    heading: "Intelligence",
    italicHeading: "into action.",
    description:
      "AI agents, conversational systems and workflow automation that get things done.",
    tags: ["AI AGENTS", "CHATBOTS", "AUTOMATION", "INTEGRATIONS", "WORKFLOW"],
    ctaLabel: "Explore Automation",
    destinationUrl: "/services/ai",
    coverImageUrl: "/images/services/automation.jpg",
    coverAlt:
      "Translucent computational glass core with connected AI workflow nodes representing Agents and Automation",
    iconName: "Bot",
    displayOrder: 3,
    isActive: true,
    isFeatured: true,
  },
  {
    displayNumber: "04",
    name: "Media",
    slug: "media",
    heading: "Stories worth",
    italicHeading: "seeing.",
    description:
      "End-to-end media production, from concept to cinematic content that engages and inspires.",
    tags: ["VIDEO PRODUCTION", "MOTION GRAPHICS", "PHOTOGRAPHY", "EDITING"],
    ctaLabel: "Explore Media",
    destinationUrl: "/services/media",
    coverImageUrl: "/images/services/media.jpg",
    coverAlt:
      "Ediyrex production clapperboard, cinema camera, and studio headphones in dramatic orange studio light",
    iconName: "Film",
    displayOrder: 4,
    isActive: true,
    isFeatured: true,
  },
];

const INITIAL_ROLES = [
  {
    name: "admin",
    description: "Full administrative access across content, enquiries, settings, and users.",
  },
  {
    name: "editor",
    description: "Create and publish services, projects, case studies, and blog content.",
  },
  {
    name: "viewer",
    description: "Read-only administrative visibility for review workflows.",
  },
];

async function runSeed() {
  const db = getDb();
  if (!db) {
    console.error(
      "DATABASE_URL is not configured. Set DATABASE_URL in .env before running seed."
    );
    process.exit(1);
  }

  console.log("[seed] Starting idempotent Ediyrex Studio database seed...");

  await db.transaction(async (tx) => {
    // 1. Seed Roles
    for (const role of INITIAL_ROLES) {
      await tx.insert(roles).values(role).onConflictDoNothing({
        target: roles.name,
      });
    }

    // 2. Seed Service Divisions
    const divisionIdBySlug = new Map<string, string>();
    for (const div of INITIAL_DIVISIONS) {
      await tx
        .insert(serviceDivisions)
        .values(div)
        .onConflictDoUpdate({
          target: serviceDivisions.slug,
          set: {
            name: div.name,
            description: div.description,
            iconName: div.iconName,
            displayOrder: div.displayOrder,
            isActive: div.isActive,
          },
        });

      const [row] = await tx
        .select({ id: serviceDivisions.id })
        .from(serviceDivisions)
        .where(eq(serviceDivisions.slug, div.slug))
        .limit(1);

      if (row) {
        divisionIdBySlug.set(div.slug, row.id);
      }
    }

    // 3. Seed Services across Branding/Marketing, Media, Web Dev, and Agents & Automation
    const activeServiceSlugs = SERVICES_DATA.map((s) => s.slug);
    const serviceIdByTitle = new Map<string, string>();
    for (const svc of SERVICES_DATA) {
      const divisionId = divisionIdBySlug.get(svc.division);
      if (!divisionId) continue;

      await tx
        .insert(services)
        .values({
          divisionId,
          title: svc.title,
          slug: svc.slug,
          summary: svc.description.slice(0, 300),
          description: svc.description,
          deliverables: svc.capabilities,
          iconName: svc.iconName,
          isFeatured: svc.featured,
          displayOrder: svc.displayOrder,
          status: svc.isPublished ? "published" : "draft",
          publishedAt: svc.isPublished ? new Date() : null,
        })
        .onConflictDoUpdate({
          target: services.slug,
          set: {
            divisionId,
            title: svc.title,
            summary: svc.description.slice(0, 300),
            description: svc.description,
            deliverables: svc.capabilities,
            iconName: svc.iconName,
            isFeatured: svc.featured,
            displayOrder: svc.displayOrder,
            status: svc.isPublished ? "published" : "draft",
          },
        });

      const [row] = await tx
        .select({ id: services.id })
        .from(services)
        .where(eq(services.slug, svc.slug))
        .limit(1);

      if (row) {
        serviceIdByTitle.set(svc.title, row.id);
      }
    }

    if (activeServiceSlugs.length > 0) {
      const staleServices = await tx
        .select({ id: services.id })
        .from(services)
        .where(notInArray(services.slug, activeServiceSlugs));

      const staleIds = staleServices.map((s) => s.id);
      if (staleIds.length > 0) {
        await tx
          .delete(projectServices)
          .where(inArray(projectServices.serviceId, staleIds));
        await tx.delete(services).where(inArray(services.id, staleIds));
      }
    }

    // 4. Seed Concept Projects & Case Studies (Honest concept labeling)
    for (let idx = 0; idx < PROJECTS_DATA.length; idx++) {
      const proj = PROJECTS_DATA[idx];
      const projectType = proj.isConcept ? "concept" : "client";

      await tx
        .insert(projects)
        .values({
          title: proj.title,
          slug: proj.slug,
          summary: proj.summary,
          description: proj.description,
          projectType,
          clientName: null,
          clientIsPublic: false,
          isFeatured: proj.featured,
          displayOrder: idx + 1,
          status: proj.isPublished ? "published" : "draft",
          publishedAt: proj.isPublished ? new Date(proj.createdAt) : null,
        })
        .onConflictDoUpdate({
          target: projects.slug,
          set: {
            title: proj.title,
            summary: proj.summary,
            description: proj.description,
            projectType,
            isFeatured: proj.featured,
            displayOrder: idx + 1,
            status: proj.isPublished ? "published" : "draft",
          },
        });

      const [projRow] = await tx
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.slug, proj.slug))
        .limit(1);

      if (!projRow) continue;

      if (proj.challenge || proj.approach) {
        await tx
          .insert(caseStudies)
          .values({
            projectId: projRow.id,
            challenge: proj.challenge || "",
            approach: proj.approach || "",
            solution: proj.description,
            verifiedOutcomes: proj.outcomes || [],
            processSteps: [],
            status: proj.isPublished ? "published" : "draft",
            publishedAt: proj.isPublished ? new Date(proj.createdAt) : null,
          })
          .onConflictDoUpdate({
            target: caseStudies.projectId,
            set: {
              challenge: proj.challenge || "",
              approach: proj.approach || "",
              solution: proj.description,
              verifiedOutcomes: proj.outcomes || [],
              status: proj.isPublished ? "published" : "draft",
            },
          });
      }

      for (const serviceTitle of proj.servicesDemonstrated) {
        const serviceId = serviceIdByTitle.get(serviceTitle);
        if (!serviceId) continue;

        await tx
          .insert(projectServices)
          .values({
            projectId: projRow.id,
            serviceId,
          })
          .onConflictDoNothing();
      }
    }

    // 5. Seed Hybrid Studio Products
    for (let idx = 0; idx < HYBRID_PRODUCTS_DATA.length; idx++) {
      const prod = HYBRID_PRODUCTS_DATA[idx];
      const divisionId =
        prod.division === "hybrid"
          ? null
          : divisionIdBySlug.get(prod.division) || null;

      await tx
        .insert(studioProducts)
        .values({
          divisionId,
          name: prod.name,
          slug: prod.slug,
          tagline: prod.tagline,
          description: prod.description,
          productStage: prod.status,
          techStack: prod.techStack,
          status: "published",
          displayOrder: idx + 1,
        })
        .onConflictDoUpdate({
          target: studioProducts.slug,
          set: {
            divisionId,
            name: prod.name,
            tagline: prod.tagline,
            description: prod.description,
            productStage: prod.status,
            techStack: prod.techStack,
          },
        });
    }

    // 6. Seed Public Site Settings (Non-secret public configuration only)
    const defaultSettings = [
      {
        settingKey: "contact_info",
        settingValue: { email: "ediyrex@gmail.com", region: "India & Global" },
        description: "Public studio contact metadata",
        isPublic: true,
      },
      {
        settingKey: "availability_banner",
        settingValue: {
          enabled: true,
          label: "Available for selected projects",
        },
        description: "Hero availability indicator",
        isPublic: true,
      },
    ];

    for (const setting of defaultSettings) {
      await tx
        .insert(siteSettings)
        .values(setting)
        .onConflictDoNothing({ target: siteSettings.settingKey });
    }

    // 7. Seed Core CMS Pages
    const defaultPages = [
      {
        title: "Home",
        subtitle: "Main landing page",
        slug: "/",
        pageType: "home",
        status: "published" as const,
        seoTitle: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
        seoDescription:
          "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems.",
        canonicalUrl: "/",
        displayOrder: 1,
        publishedAt: new Date(),
      },
      {
        title: "About",
        subtitle: "Our studio, values, and approach",
        slug: "/about",
        pageType: "static",
        status: "published" as const,
        seoTitle: "About | Ediyrex Studio",
        seoDescription:
          "About Ediyrex Studio: an independent creative technology studio uniting Media, Digital, and Artificial Intelligence.",
        canonicalUrl: "/about",
        displayOrder: 2,
        publishedAt: new Date(),
      },
      {
        title: "Services",
        subtitle: "What we offer across Media, Digital & AI",
        slug: "/services",
        pageType: "static",
        status: "published" as const,
        seoTitle: "Services | Ediyrex Studio",
        seoDescription:
          "Explore Ediyrex Studio's integrated capabilities across Media, Digital, and Artificial Intelligence.",
        canonicalUrl: "/services",
        displayOrder: 3,
        publishedAt: new Date(),
      },
      {
        title: "Work & Portfolio",
        subtitle: "Our selected work and case studies",
        slug: "/work",
        pageType: "listing",
        status: "published" as const,
        seoTitle: "Work & Case Studies | Ediyrex Studio",
        seoDescription:
          "Selected blueprints, explorations, and case studies across Media, Digital, and AI by Ediyrex Studio.",
        canonicalUrl: "/work",
        displayOrder: 4,
        publishedAt: new Date(),
      },
      {
        title: "Contact",
        subtitle: "Get in touch with our studio team",
        slug: "/contact",
        pageType: "static",
        status: "published" as const,
        seoTitle: "Contact & Discovery Call | Ediyrex Studio",
        seoDescription:
          "Book a discovery call or submit a project enquiry to Ediyrex Studio.",
        canonicalUrl: "/contact",
        displayOrder: 5,
        publishedAt: new Date(),
      },
      {
        title: "Privacy Policy",
        subtitle: "Our privacy and data protection notice",
        slug: "/privacy",
        pageType: "legal",
        status: "published" as const,
        seoTitle: "Privacy Policy | Ediyrex Studio",
        seoDescription:
          "How Ediyrex Studio collects, processes, and protects project enquiry information.",
        canonicalUrl: "/privacy",
        displayOrder: 6,
        publishedAt: new Date(),
      },
      {
        title: "Terms of Service",
        subtitle: "Terms and conditions of using our services",
        slug: "/terms",
        pageType: "legal",
        status: "published" as const,
        seoTitle: "Terms of Service | Ediyrex Studio",
        seoDescription:
          "Terms governing use of the Ediyrex Studio website and informational materials.",
        canonicalUrl: "/terms",
        displayOrder: 7,
        publishedAt: new Date(),
      },
    ];

    for (const page of defaultPages) {
      await tx
        .insert(cmsPages)
        .values(page)
        .onConflictDoNothing({ target: cmsPages.slug });
    }

    // 8. Seed Default Blog Categories
    const defaultCategories = [
      { name: "AI", slug: "ai", description: "AI agents, automation, and applied systems" },
      { name: "Branding", slug: "branding", description: "Brand identity, films, and visual craft" },
      { name: "Development", slug: "development", description: "Full-stack web and software engineering" },
      { name: "Workflow", slug: "workflow", description: "Creative operations and studio tooling" },
      { name: "Case Study", slug: "case-study", description: "Behind-the-scenes project breakdowns" },
      { name: "Studio", slug: "studio", description: "Ediyrex updates, culture, and perspectives" },
    ];

    for (const cat of defaultCategories) {
      await tx
        .insert(blogCategories)
        .values(cat)
        .onConflictDoNothing({ target: blogCategories.slug });
    }

    // 9. Seed Active SEO Redirects (matches next.config.ts aliases)
    const defaultRedirects = [
      { source: "/home", destination: "/", statusCode: 301, note: "Legacy home alias" },
      { source: "/portfolio", destination: "/work", statusCode: 301, note: "Portfolio route alias" },
      { source: "/projects", destination: "/work", statusCode: 301, note: "Projects listing alias" },
      { source: "/projects/:slug", destination: "/work/:slug", statusCode: 301, note: "Project detail alias" },
      { source: "/service/:division", destination: "/services/:division", statusCode: 301, note: "Singular service route" },
      { source: "/services/branding-marketing", destination: "/services/branding", statusCode: 301, note: "Division canonical" },
      { source: "/services/web-dev", destination: "/services/digital", statusCode: 301, note: "Division canonical" },
      { source: "/services/agents-and-automation", destination: "/services/ai", statusCode: 301, note: "Division canonical" },
      { source: "/privacy-policy", destination: "/privacy", statusCode: 301, note: "Legal alias" },
      { source: "/terms-and-conditions", destination: "/terms", statusCode: 301, note: "Legal alias" },
    ];

    for (const redir of defaultRedirects) {
      await tx
        .insert(seoRedirects)
        .values({ ...redir, isActive: true })
        .onConflictDoNothing({ target: seoRedirects.source });
    }
  });

  console.log("[seed] Completed successfully.");
  await closeDb();
}

runSeed().catch(async (err) => {
  console.error("[seed] Failed:", err);
  await closeDb();
  process.exit(1);
});

