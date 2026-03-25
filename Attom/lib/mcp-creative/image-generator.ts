import OpenAI from 'openai';
import { ClientData } from '../types/client';
import { createLogger } from '../utils/logger';
import { fileManager } from '../utils/file-manager';

const logger = createLogger('ImageGenerator');

export class ImageGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate all custom images for the client
   */
  async generateImages(clientData: ClientData): Promise<any[]> {
    logger.info('Generating custom images', { clientId: clientData.info.clientId });

    const images = [];

    // Generate hero banner
    const heroBanner = await this.generateHeroBanner(clientData);
    if (heroBanner) images.push(heroBanner);

    // Generate social media images
    const socialImages = await this.generateSocialMediaImages(clientData);
    images.push(...socialImages);

    // Generate product mockups if applicable
    if (clientData.products && clientData.products.length > 0) {
      const mockups = await this.generateProductMockups(clientData);
      images.push(...mockups);
    }

    logger.success(`Generated ${images.length} images successfully`);
    return images;
  }

  /**
   * Generate hero banner for homepage
   */
  private async generateHeroBanner(clientData: ClientData): Promise<any> {
    try {
      const { businessName, businessType } = clientData.info;
      const { colors } = clientData.branding;

      const prompt = `Create a professional hero banner image for "${businessName}", a ${businessType} business.
Style: Modern, clean, professional
Colors: Primary ${colors.primary}${colors.secondary ? `, Secondary ${colors.secondary}` : ''}
Requirements: High quality, web-ready, compelling visual that represents the brand
Size: 1920x1080 (landscape)`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1792x1024',
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data[0].url;

      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        const fileName = 'hero-banner.png';
        const localPath = await fileManager.saveAsset(
          clientData.info.clientId,
          'images',
          fileName,
          imageBuffer
        );

        logger.info('Hero banner generated successfully');

        return {
          type: 'banner',
          url: imageUrl,
          localPath,
          description: 'Hero banner for homepage',
        };
      }
    } catch (error) {
      logger.error('Failed to generate hero banner', error);
      return null;
    }
  }

  /**
   * Generate social media images (Open Graph, Twitter, etc.)
   */
  private async generateSocialMediaImages(clientData: ClientData): Promise<any[]> {
    const images = [];

    try {
      const { businessName, businessType } = clientData.info;
      const { colors } = clientData.branding;

      const prompt = `Create a social media share image for "${businessName}", a ${businessType} business.
Style: Eye-catching, professional, optimized for social media sharing
Colors: ${colors.primary}${colors.secondary ? `, ${colors.secondary}` : ''}
Requirements: Include business name, visually appealing, brand-focused
Format: 1200x630 (Open Graph standard)`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data[0].url;

      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        const fileName = 'social-share.png';
        const localPath = await fileManager.saveAsset(
          clientData.info.clientId,
          'images',
          fileName,
          imageBuffer
        );

        logger.info('Social media image generated successfully');

        images.push({
          type: 'social',
          url: imageUrl,
          localPath,
          description: 'Social media share image (Open Graph)',
        });
      }
    } catch (error) {
      logger.error('Failed to generate social media images', error);
    }

    return images;
  }

  /**
   * Generate product mockups
   */
  private async generateProductMockups(clientData: ClientData): Promise<any[]> {
    const mockups = [];

    try {
      const products = clientData.products?.slice(0, 3) || []; // Limit to 3 products

      for (const product of products) {
        const prompt = `Create a professional product mockup for "${product.name}".
Description: ${product.description || 'No description'}
Style: Clean, professional, product photography style
Requirements: High quality, suitable for e-commerce website`;

        const response = await this.openai.images.generate({
          model: 'dall-e-3',
          prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        });

        const imageUrl = response.data[0].url;

        if (imageUrl) {
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

          const fileName = `product-${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
          const localPath = await fileManager.saveAsset(
            clientData.info.clientId,
            'images',
            fileName,
            imageBuffer
          );

          mockups.push({
            type: 'mockup',
            url: imageUrl,
            localPath,
            description: `Product mockup for ${product.name}`,
          });
        }
      }

      logger.info(`Generated ${mockups.length} product mockups`);
    } catch (error) {
      logger.error('Failed to generate product mockups', error);
    }

    return mockups;
  }
}

export const imageGenerator = new ImageGenerator();
