import { 
  users, 
  documentTemplates, 
  generatedDocuments,
  type User, 
  type InsertUser,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type GeneratedDocument,
  type InsertGeneratedDocument
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Template methods
  getTemplate(id: number): Promise<DocumentTemplate | undefined>;
  getTemplates(): Promise<DocumentTemplate[]>;
  getTemplatesByType(type: string): Promise<DocumentTemplate[]>;
  createTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate>;
  
  // Generated document methods
  getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined>;
  getGeneratedDocumentsByUser(userId: number): Promise<GeneratedDocument[]>;
  createGeneratedDocument(document: InsertGeneratedDocument): Promise<GeneratedDocument>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, DocumentTemplate>;
  private generatedDocuments: Map<number, GeneratedDocument>;
  private currentUserId: number;
  private currentTemplateId: number;
  private currentDocumentId: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.generatedDocuments = new Map();
    this.currentUserId = 1;
    this.currentTemplateId = 1;
    this.currentDocumentId = 1;
    
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    const defaultTemplates = [
      {
        id: 1,
        name: "シンプル見積書",
        type: "estimate",
        description: "必要最小限の項目で構成された、使いやすい見積書テンプレート",
        fields: {
          companyInfo: ["name", "address", "phone", "email", "website"],
          customerInfo: ["name", "address", "phone", "email", "contactPerson"],
          items: ["name", "description", "quantity", "unitPrice", "total"]
        },
        gasCode: "// Generated GAS code will be here",
        isPublic: true,
        createdBy: null
      },
      {
        id: 2,
        name: "詳細注文書",
        type: "order",
        description: "商品詳細、数量、価格を詳細に記載できる注文書テンプレート",
        fields: {
          companyInfo: ["name", "address", "phone", "email", "website"],
          customerInfo: ["name", "address", "phone", "email", "contactPerson"],
          items: ["name", "description", "quantity", "unitPrice", "total"]
        },
        gasCode: "// Generated GAS code will be here",
        isPublic: true,
        createdBy: null
      },
      {
        id: 3,
        name: "月次請求書",
        type: "invoice",
        description: "月次での請求に特化した、自動計算機能付きの請求書テンプレート",
        fields: {
          companyInfo: ["name", "address", "phone", "email", "website"],
          customerInfo: ["name", "address", "phone", "email", "contactPerson"],
          items: ["name", "description", "quantity", "unitPrice", "total"]
        },
        gasCode: "// Generated GAS code will be here",
        isPublic: true,
        createdBy: null
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template as DocumentTemplate);
    });
    this.currentTemplateId = 4;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template methods
  async getTemplate(id: number): Promise<DocumentTemplate | undefined> {
    return this.templates.get(id);
  }

  async getTemplates(): Promise<DocumentTemplate[]> {
    return Array.from(this.templates.values()).filter(template => template.isPublic);
  }

  async getTemplatesByType(type: string): Promise<DocumentTemplate[]> {
    return Array.from(this.templates.values()).filter(
      template => template.isPublic && template.type === type
    );
  }

  async createTemplate(insertTemplate: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const id = this.currentTemplateId++;
    const template: DocumentTemplate = { 
      ...insertTemplate,
      id,
      description: insertTemplate.description || null,
      isPublic: insertTemplate.isPublic || true,
      createdBy: null // For now, not tracking user creation
    };
    this.templates.set(id, template);
    return template;
  }

  // Generated document methods
  async getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined> {
    return this.generatedDocuments.get(id);
  }

  async getGeneratedDocumentsByUser(userId: number): Promise<GeneratedDocument[]> {
    return Array.from(this.generatedDocuments.values()).filter(
      doc => doc.createdBy === userId
    );
  }

  async createGeneratedDocument(insertDocument: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const id = this.currentDocumentId++;
    const document: GeneratedDocument = { 
      id,
      templateId: insertDocument.templateId || null,
      companyInfo: insertDocument.companyInfo,
      customerInfo: insertDocument.customerInfo,
      items: insertDocument.items,
      generatedCode: insertDocument.generatedCode,
      createdBy: null, // For now, not tracking user creation
      createdAt: new Date()
    };
    this.generatedDocuments.set(id, document);
    return document;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTemplate(id: number): Promise<DocumentTemplate | undefined> {
    const { db } = await import("./db");
    const { documentTemplates } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template || undefined;
  }

  async getTemplates(): Promise<DocumentTemplate[]> {
    const { db } = await import("./db");
    const { documentTemplates } = await import("@shared/schema");
    
    return await db.select().from(documentTemplates);
  }

  async getTemplatesByType(type: string): Promise<DocumentTemplate[]> {
    const { db } = await import("./db");
    const { documentTemplates } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    return await db.select().from(documentTemplates).where(eq(documentTemplates.type, type));
  }

  async createTemplate(insertTemplate: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const { db } = await import("./db");
    const { documentTemplates } = await import("@shared/schema");
    
    const [template] = await db
      .insert(documentTemplates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async getGeneratedDocument(id: number): Promise<GeneratedDocument | undefined> {
    const { db } = await import("./db");
    const { generatedDocuments } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [document] = await db.select().from(generatedDocuments).where(eq(generatedDocuments.id, id));
    return document || undefined;
  }

  async getGeneratedDocumentsByUser(userId: number): Promise<GeneratedDocument[]> {
    const { db } = await import("./db");
    const { generatedDocuments } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    return await db.select().from(generatedDocuments).where(eq(generatedDocuments.createdBy, userId));
  }

  async createGeneratedDocument(insertDocument: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const { db } = await import("./db");
    const { generatedDocuments } = await import("@shared/schema");
    
    const [document] = await db
      .insert(generatedDocuments)
      .values(insertDocument)
      .returning();
    return document;
  }
}

export const storage = new DatabaseStorage();
