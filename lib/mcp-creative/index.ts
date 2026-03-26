import { ClientData } from '../types/client';
import { wireframeGenerator } from './wireframe-generator';
import { imageGenerator } from './image-generator';
import { seoGenerator } from './seo-generator';
import { driveManager } from './drive-manager';
import { fileManager } from '../utils/file-manager';
import { createLogger } from '../utils/logger';

const logger = createLogger('MCP-Creative');

/**
 * MCP Creative - Handles all creative tasks:
 * - Wireframe generation
 * - Image generation (banners, mockups, social media)
 * - SEO metadata generation
 * - Google Drive organization
 */
export class MCPCreative {
  /**
   * Execute complete creative workflow
   */
  async execute(clientData: ClientData): Promise<ClientData> {
    logger.info('Starting MCP Creative workflow', { clientId: clientData.info.clientId });

    try {
      // Step 1: Generate Wireframes
      logger.info('Step 1: Generating wireframes');
      const wireframes = await wireframeGenerator.generateWireframes(clientData);

      // Step 2: Generate Custom Images
      logger.info('Step 2: Generating custom images');
      const images = await imageGenerator.generateImages(clientData);

      // Step 3: Generate SEO Metadata
      logger.info('Step 3: Generating SEO metadata');
      const seo = await seoGenerator.generateSEO(clientData);

      // Update client data with generated assets
      clientData.assets = {
        wireframes,
        images,
        seo,
      };

      // Save updated client data
      await fileManager.updateClientInfo(clientData.info.clientId, clientData);

      // Step 4: Upload to Google Drive
      logger.info('Step 4: Uploading assets to Google Drive');
      const driveFolderId = await this.uploadToGoogleDrive(clientData);

      // Log action
      await fileManager.logAction(clientData.info.clientId, 'mcp-creative-completed', {
        wireframesGenerated: wireframes.pages.length,
        imagesGenerated: images.length,
        seoGenerated: true,
        driveFolderId,
      });

      logger.success('MCP Creative workflow completed successfully');

      return clientData;
    } catch (error) {
      logger.error('MCP Creative workflow failed', error);

      await fileManager.logAction(clientData.info.clientId, 'mcp-creative-failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Upload all assets to Google Drive
   */
  private async uploadToGoogleDrive(clientData: ClientData): Promise<string> {
    try {
      const { clientId, businessName } = clientData.info;

      // Create client folder in Drive
      const driveFolderId = await driveManager.createClientFolder(businessName, clientId);

      // Upload logo if available
      if (clientData.branding.logo?.localPath) {
        const logoUpload = await driveManager.uploadFile(
          clientData.branding.logo.localPath,
          'logo',
          driveFolderId
        );

        clientData.branding.logo.driveUrl = logoUpload.webViewLink;
      }

      // Upload wireframe images
      if (clientData.assets?.wireframes) {
        for (const page of clientData.assets.wireframes.pages) {
          if (page.localPath) {
            const upload = await driveManager.uploadFile(
              page.localPath,
              'wireframes',
              driveFolderId
            );
            page.driveUrl = upload.webViewLink;
          }
        }
      }

      // Upload generated images
      if (clientData.assets?.images) {
        for (const image of clientData.assets.images) {
          if (image.localPath) {
            const upload = await driveManager.uploadFile(
              image.localPath,
              'images',
              driveFolderId
            );
            image.driveUrl = upload.webViewLink;
          }
        }
      }

      // Upload SEO document
      if (clientData.assets?.seo) {
        await driveManager.uploadSEODocument(driveFolderId, clientData.assets.seo);
      }

      // Update client data with Drive folder ID
      await fileManager.updateClientInfo(clientId, clientData);

      logger.success('All assets uploaded to Google Drive', { driveFolderId });

      return driveFolderId;
    } catch (error) {
      logger.error('Failed to upload assets to Google Drive', error);
      throw error;
    }
  }
}

export const mcpCreative = new MCPCreative();
