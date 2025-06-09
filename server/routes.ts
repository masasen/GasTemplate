import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateGasCode } from "../client/src/lib/gas-templates";
import { z } from "zod";

const generateDocumentSchema = z.object({
  templateId: z.number(),
  companyInfo: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    website: z.string().optional(),
    logo: z.string().optional(),
  }),
  customerInfo: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    contactPerson: z.string().optional(),
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
  })),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get template by ID (supports both numeric ID and string slug)
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const idParam = req.params.id;
      let template;

      // Try to parse as numeric ID first
      const numericId = parseInt(idParam);
      if (!isNaN(numericId)) {
        template = await storage.getTemplate(numericId);
      } else {
        // If not numeric, try to find by name slug
        const templates = await storage.getTemplates();
        const nameSlug = idParam.toLowerCase().replace(/-/g, ' ');
        template = templates.find(t => 
          t.name.toLowerCase() === nameSlug ||
          t.name.toLowerCase().replace(/\s+/g, '-') === idParam
        );
      }

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Get templates by type
  app.get("/api/templates/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const templates = await storage.getTemplatesByType(type);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates by type" });
    }
  });

  // Generate GAS code
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateDocumentSchema.parse(req.body);
      
      // Get template to verify it exists
      const template = await storage.getTemplate(validatedData.templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      // Map database template to gas-templates identifier
      let templateIdentifier;
      switch (template.type) {
        case 'estimate':
          templateIdentifier = 'simple-estimate';
          break;
        case 'order':
          templateIdentifier = 'detailed-order';
          break;
        case 'invoice':
          templateIdentifier = 'monthly-invoice';
          break;
        default:
          templateIdentifier = 'simple-estimate';
      }

      // Generate GAS code using the mapped template identifier
      const { code, instructions } = generateGasCode(
        templateIdentifier, 
        validatedData
      );

      // Save the generated document
      const generatedDocument = await storage.createGeneratedDocument({
        templateId: validatedData.templateId,
        companyInfo: validatedData.companyInfo,
        customerInfo: validatedData.customerInfo,
        items: validatedData.items,
        generatedCode: code,
        createdBy: 1 // Use default user
      });

      res.json({
        id: generatedDocument.id,
        code,
        instructions,
        templateName: template.name,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.errors 
        });
      }
      
      console.error("Generation error:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  });

  // Create custom template
  app.post("/api/templates", async (req, res) => {
    try {
      const { name, type, description, fields, gasCode, isPublic = true } = req.body;
      
      // Basic validation
      if (!name || !type || !description || !fields || !gasCode) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!["estimate", "order", "invoice"].includes(type)) {
        return res.status(400).json({ error: "Invalid template type" });
      }

      const template = await storage.createTemplate({
        name,
        type,
        description,
        fields,
        gasCode,
        isPublic
      });

      res.status(201).json(template);
    } catch (error) {
      console.error("Template creation error:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  // Get user's document history
  app.get("/api/generated", async (req, res) => {
    try {
      // Get all documents for now (no user filtering)
      const documents = await storage.getGeneratedDocumentsByUser(1);
      res.json(documents);
    } catch (error) {
      console.error("Document history error:", error);
      res.status(500).json({ error: "Failed to fetch document history" });
    }
  });

  // Get specific generated document
  app.get("/api/generated/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid document ID" });
      }

      const document = await storage.getGeneratedDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Generated document not found" });
      }

      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch generated document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
