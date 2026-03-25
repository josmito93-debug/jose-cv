import { z } from 'zod';

// Zod Schemas for validation
export const ClientInfoSchema = z.object({
  clientId: z.string().uuid(),
  businessName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  businessType: z.enum([
    'restaurant',
    'ecommerce',
    'portfolio',
    'blog',
    'corporate',
    'landing',
    'other'
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const BrandingSchema = z.object({
  logo: z.object({
    url: z.string().url().optional(),
    localPath: z.string().optional(),
    driveUrl: z.string().url().optional(),
  }).optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }),
  fonts: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
  }).optional(),
  preferences: z.string().optional(),
});

export const ProductServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number().optional(),
  image: z.string().url().optional(),
});

export const PaymentInfoSchema = z.object({
  method: z.enum(['pago_movil', 'stripe', 'both']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  amount: z.number(),
  currency: z.string().default('USD'),
  reference: z.string().optional(),
  pagoMovil: z.object({
    bank: z.string(),
    phone: z.string(),
    id: z.string(),
    reference: z.string(),
  }).optional(),
  stripe: z.object({
    paymentIntentId: z.string(),
    status: z.string(),
  }).optional(),
  completedAt: z.string().datetime().optional(),
});

export const WireframeSchema = z.object({
  pages: z.array(z.object({
    name: z.string(),
    layout: z.string(),
    sections: z.array(z.string()),
    imageUrl: z.string().url().optional(),
    localPath: z.string().optional(),
    driveUrl: z.string().url().optional(),
  })),
  generatedAt: z.string().datetime(),
});

export const SEOSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  ogImage: z.string().url().optional(),
  metaTags: z.record(z.string()),
  generatedAt: z.string().datetime(),
});

export const AssetsSchema = z.object({
  wireframes: WireframeSchema.optional(),
  images: z.array(z.object({
    type: z.enum(['banner', 'mockup', 'social', 'icon', 'other']),
    url: z.string().url().optional(),
    localPath: z.string().optional(),
    driveUrl: z.string().url().optional(),
    description: z.string().optional(),
  })).optional(),
  seo: SEOSchema.optional(),
});

export const DeploymentSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed', 'failed']),
  github: z.object({
    repoUrl: z.string().url().optional(),
    branch: z.string().default('main'),
    lastCommit: z.string().optional(),
  }).optional(),
  hosting: z.object({
    provider: z.string().default('hostinger'),
    url: z.string().url().optional(),
    domain: z.string().optional(),
    sslEnabled: z.boolean().default(false),
  }).optional(),
  deployedAt: z.string().datetime().optional(),
});

export const ClientDataSchema = z.object({
  info: ClientInfoSchema,
  branding: BrandingSchema,
  products: z.array(ProductServiceSchema).optional(),
  payment: PaymentInfoSchema,
  assets: AssetsSchema.optional(),
  deployment: DeploymentSchema,
  airtableRecordId: z.string().optional(),
  codaRowId: z.string().optional(),
});

// TypeScript Types (inferred from Zod schemas)
export type ClientInfo = z.infer<typeof ClientInfoSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type ProductService = z.infer<typeof ProductServiceSchema>;
export type PaymentInfo = z.infer<typeof PaymentInfoSchema>;
export type Wireframe = z.infer<typeof WireframeSchema>;
export type SEO = z.infer<typeof SEOSchema>;
export type Assets = z.infer<typeof AssetsSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type ClientData = z.infer<typeof ClientDataSchema>;

// Helper function to validate client data
export function validateClientData(data: unknown): ClientData {
  return ClientDataSchema.parse(data);
}
