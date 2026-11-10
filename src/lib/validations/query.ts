import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(25),
});

export const servicesQuerySchema = paginationSchema.extend({
  division: z.enum(["branding", "media", "digital", "ai"]).optional(),
});

export const projectsQuerySchema = paginationSchema.extend({
  category: z.enum(["branding", "media", "digital", "ai", "hybrid"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
});

