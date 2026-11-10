import { relations } from "drizzle-orm";

export * from "./enums";
export * from "./auth";
export * from "./media";
export * from "./catalog";
export * from "./enquiries";
export * from "./content";

import { users, roles, userRoles, sessions } from "./auth";
import {
  serviceDivisions,
  services,
  projects,
  projectServices,
  caseStudies,
  projectMedia,
} from "./catalog";
import { mediaAssets } from "./media";
import {
  enquiries,
  enquiryNotes,
  enquiryStatusHistory,
} from "./enquiries";
import { blogPosts, blogCategories, blogPostCategories } from "./content";

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  sessions: many(sessions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const serviceDivisionsRelations = relations(
  serviceDivisions,
  ({ many }) => ({
    services: many(services),
  })
);

export const servicesRelations = relations(services, ({ one, many }) => ({
  division: one(serviceDivisions, {
    fields: [services.divisionId],
    references: [serviceDivisions.id],
  }),
  projectServices: many(projectServices),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  coverAsset: one(mediaAssets, {
    fields: [projects.coverAssetId],
    references: [mediaAssets.id],
  }),
  caseStudy: one(caseStudies, {
    fields: [projects.id],
    references: [caseStudies.projectId],
  }),
  projectServices: many(projectServices),
  projectMedia: many(projectMedia),
}));

export const projectServicesRelations = relations(
  projectServices,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectServices.projectId],
      references: [projects.id],
    }),
    service: one(services, {
      fields: [projectServices.serviceId],
      references: [services.id],
    }),
  })
);

export const caseStudiesRelations = relations(caseStudies, ({ one }) => ({
  project: one(projects, {
    fields: [caseStudies.projectId],
    references: [projects.id],
  }),
}));

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
  division: one(serviceDivisions, {
    fields: [enquiries.serviceDivisionId],
    references: [serviceDivisions.id],
  }),
  service: one(services, {
    fields: [enquiries.serviceId],
    references: [services.id],
  }),
  assignedAdmin: one(users, {
    fields: [enquiries.assignedAdminUserId],
    references: [users.id],
  }),
  notes: many(enquiryNotes),
  statusHistory: many(enquiryStatusHistory),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorUserId],
    references: [users.id],
  }),
  categories: many(blogPostCategories),
}));

export const blogPostCategoriesRelations = relations(
  blogPostCategories,
  ({ one }) => ({
    post: one(blogPosts, {
      fields: [blogPostCategories.blogPostId],
      references: [blogPosts.id],
    }),
    category: one(blogCategories, {
      fields: [blogPostCategories.categoryId],
      references: [blogCategories.id],
    }),
  })
);

