import OpenAI from 'openai';
import { ClientData, SEO } from '../types/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('SEOGenerator');

export class SEOGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate SEO metadata for the website
   */
  async generateSEO(clientData: ClientData): Promise<SEO> {
    logger.info('Generating SEO metadata', { clientId: clientData.info.clientId });

    const { businessName, businessType } = clientData.info;
    const products = clientData.products || [];

    const prompt = `Generate comprehensive SEO metadata for "${businessName}", a ${businessType} business.

${products.length > 0 ? `Products/Services: ${products.map(p => p.name).join(', ')}` : ''}

Provide a JSON object with:
- title: SEO-optimized page title (50-60 characters)
- description: Meta description (150-160 characters)
- keywords: Array of 10-15 relevant keywords
- metaTags: Object with additional meta tags (og:title, og:description, twitter:card, etc.)

Focus on SEO best practices, local SEO if applicable, and user intent.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert specializing in on-page optimization and metadata creation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    const seo: SEO = {
      title: result.title || `${businessName} - ${businessType}`,
      description: result.description || `Welcome to ${businessName}`,
      keywords: result.keywords || [],
      metaTags: result.metaTags || {},
      generatedAt: new Date().toISOString(),
    };

    logger.success('SEO metadata generated successfully');
    return seo;
  }

  /**
   * Generate structured data (Schema.org) for the website
   */
  async generateStructuredData(clientData: ClientData): Promise<any> {
    const { businessName, businessType, email, phone } = clientData.info;

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': this.getSchemaType(businessType),
      name: businessName,
    };

    if (email) structuredData.email = email;
    if (phone) structuredData.telephone = phone;

    // Add business-specific structured data
    if (businessType === 'restaurant') {
      structuredData['@type'] = 'Restaurant';
      structuredData.servesCuisine = 'Various';
    } else if (businessType === 'ecommerce') {
      structuredData['@type'] = 'OnlineStore';
    }

    return structuredData;
  }

  /**
   * Get appropriate Schema.org type for business
   */
  private getSchemaType(businessType: string): string {
    const typeMap: Record<string, string> = {
      restaurant: 'Restaurant',
      ecommerce: 'OnlineStore',
      portfolio: 'ProfessionalService',
      blog: 'Blog',
      corporate: 'Organization',
      landing: 'WebPage',
      other: 'Organization',
    };

    return typeMap[businessType] || 'Organization';
  }
}

export const seoGenerator = new SEOGenerator();
