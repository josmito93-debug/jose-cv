import OpenAI from 'openai';
import { ClientData, Wireframe } from '../types/client';
import { createLogger } from '../utils/logger';
import { fileManager } from '../utils/file-manager';

const logger = createLogger('WireframeGenerator');

export class WireframeGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
    });
  }

  /**
   * Generate wireframes based on business type and preferences
   */
  async generateWireframes(clientData: ClientData): Promise<Wireframe> {
    logger.info('Generating wireframes', { clientId: clientData.info.clientId });

    const { businessType, businessName } = clientData.info;
    const { colors, preferences } = clientData.branding;

    // Define page layouts based on business type
    const pages = this.getDefaultPagesForBusinessType(businessType);

    // Generate wireframe descriptions using AI
    const wireframeDescriptions = await this.generateWireframeDescriptions(
      businessName,
      businessType,
      pages,
      preferences
    );

    // Generate actual wireframe images
    const wireframeImages = await Promise.all(
      wireframeDescriptions.map((desc, index) =>
        this.generateWireframeImage(
          clientData.info.clientId,
          desc,
          index,
          colors.primary
        )
      )
    );

    const wireframe: Wireframe = {
      pages: wireframeImages,
      generatedAt: new Date().toISOString(),
    };

    logger.success('Wireframes generated successfully');
    return wireframe;
  }

  /**
   * Get default pages for each business type
   */
  private getDefaultPagesForBusinessType(businessType: string): string[] {
    const pageTemplates: Record<string, string[]> = {
      restaurant: ['Home', 'Menu', 'About', 'Contact', 'Reservations'],
      ecommerce: ['Home', 'Products', 'Product Detail', 'Cart', 'Checkout', 'About'],
      portfolio: ['Home', 'Projects', 'About', 'Contact'],
      blog: ['Home', 'Blog List', 'Blog Post', 'About', 'Contact'],
      corporate: ['Home', 'Services', 'About', 'Team', 'Contact'],
      landing: ['Landing Page'],
      other: ['Home', 'About', 'Services', 'Contact'],
    };

    return pageTemplates[businessType] || pageTemplates.other;
  }

  /**
   * Generate wireframe descriptions using GPT
   */
  private async generateWireframeDescriptions(
    businessName: string,
    businessType: string,
    pages: string[],
    preferences?: string
  ): Promise<Array<{ name: string; layout: string; sections: string[] }>> {
    const prompt = `Create detailed wireframe layouts for a ${businessType} website called "${businessName}".

${preferences ? `Design preferences: ${preferences}` : ''}

For each of the following pages: ${pages.join(', ')}

Provide a JSON array with:
- name: page name
- layout: brief description of the layout structure
- sections: array of main sections in order

Focus on UX best practices and modern web design patterns.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert UX/UI designer specializing in wireframe creation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.pages || [];
  }

  /**
   * Generate wireframe image using DALL-E
   */
  private async generateWireframeImage(
    clientId: string,
    description: { name: string; layout: string; sections: string[] },
    index: number,
    primaryColor: string
  ): Promise<any> {
    try {
      const prompt = `Create a clean, professional website wireframe for a ${description.name} page.
Layout: ${description.layout}
Sections: ${description.sections.join(', ')}

Style: Minimalist wireframe with grey boxes, lines, and placeholder text. Use ${primaryColor} as accent color for key elements.
Format: Clean, professional, modern web design wireframe`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1792', // Portrait for website mockup
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data?.[0]?.url;

      // Download and save the image
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        const fileName = `wireframe-${description.name.toLowerCase().replace(/\s+/g, '-')}-${index}.png`;
        const localPath = await fileManager.saveAsset(
          clientId,
          'wireframes',
          fileName,
          imageBuffer
        );

        logger.info(`Wireframe image saved: ${fileName}`);

        return {
          name: description.name,
          layout: description.layout,
          sections: description.sections,
          imageUrl,
          localPath,
        };
      }
    } catch (error) {
      logger.error(`Failed to generate wireframe image for ${description.name}`, error);
      return {
        name: description.name,
        layout: description.layout,
        sections: description.sections,
      };
    }
  }
}

export const wireframeGenerator = new WireframeGenerator();
