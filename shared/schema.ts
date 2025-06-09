import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const documentTemplates = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'estimate', 'order', 'invoice'
  description: text("description"),
  fields: jsonb("fields").notNull(), // JSON structure for form fields
  gasCode: text("gas_code").notNull(),
  isPublic: boolean("is_public").default(true),
  createdBy: integer("created_by").references(() => users.id),
});

export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => documentTemplates.id),
  companyInfo: jsonb("company_info").notNull(),
  customerInfo: jsonb("customer_info").notNull(),
  items: jsonb("items").notNull(),
  generatedCode: text("generated_code").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdBy: true,
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({
  id: true,
}).extend({
  templateId: z.number(),
  createdBy: z.number().optional(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdTemplates: many(documentTemplates),
  generatedDocuments: many(generatedDocuments),
}));

export const documentTemplatesRelations = relations(documentTemplates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [documentTemplates.createdBy],
    references: [users.id],
  }),
  generatedDocuments: many(generatedDocuments),
}));

export const generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  template: one(documentTemplates, {
    fields: [generatedDocuments.templateId],
    references: [documentTemplates.id],
  }),
  createdBy: one(users, {
    fields: [generatedDocuments.createdBy],
    references: [users.id],
  }),
}));

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
