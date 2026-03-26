import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { createLogger } from '../utils/logger';

const logger = createLogger('DriveManager');

export class DriveManager {
  private drive: any;
  private mainFolderId: string;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    this.mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
  }

  /**
   * Create client folder structure in Google Drive
   */
  async createClientFolder(businessName: string, clientId: string): Promise<string> {
    try {
      logger.info('Creating client folder in Drive', { clientId });

      // Create main client folder
      const clientFolder = await this.drive.files.create({
        requestBody: {
          name: `${businessName} (${clientId.slice(0, 8)})`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [this.mainFolderId],
        },
        fields: 'id, webViewLink',
      });

      const clientFolderId = clientFolder.data.id;

      // Create subfolders
      const subfolders = ['logo', 'wireframes', 'images', 'SEO', 'exports'];

      for (const subfolder of subfolders) {
        await this.drive.files.create({
          requestBody: {
            name: subfolder,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [clientFolderId],
          },
        });
      }

      logger.success('Client folder structure created in Drive', {
        folderId: clientFolderId,
        webViewLink: clientFolder.data.webViewLink,
      });

      return clientFolderId;
    } catch (error) {
      logger.error('Failed to create client folder in Drive', error);
      throw error;
    }
  }

  /**
   * Upload file to specific folder
   */
  async uploadFile(
    localFilePath: string,
    driveFolder: string,
    clientFolderId: string
  ): Promise<{ id: string; webViewLink: string; webContentLink: string }> {
    try {
      const fileName = path.basename(localFilePath);
      logger.info('Uploading file to Drive', { fileName, folder: driveFolder });

      // Get subfolder ID
      const subfolderResponse = await this.drive.files.list({
        q: `name='${driveFolder}' and '${clientFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id)',
      });

      const subfolderId = subfolderResponse.data.files[0]?.id;

      if (!subfolderId) {
        throw new Error(`Subfolder ${driveFolder} not found`);
      }

      // Read file
      const fileContent = await fs.readFile(localFilePath);

      // Upload file
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [subfolderId],
        },
        media: {
          body: fileContent,
        },
        fields: 'id, webViewLink, webContentLink',
      });

      // Make file publicly accessible (optional)
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      logger.success('File uploaded to Drive', { fileId: response.data.id });

      return {
        id: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      };
    } catch (error) {
      logger.error('Failed to upload file to Drive', error);
      throw error;
    }
  }

  /**
   * Upload multiple files from a directory
   */
  async uploadDirectory(
    localDirPath: string,
    driveFolder: string,
    clientFolderId: string
  ): Promise<any[]> {
    try {
      const files = await fs.readdir(localDirPath);
      const uploadPromises = files.map(file =>
        this.uploadFile(path.join(localDirPath, file), driveFolder, clientFolderId)
      );

      const results = await Promise.all(uploadPromises);
      logger.success(`Uploaded ${results.length} files to ${driveFolder}`);

      return results;
    } catch (error) {
      logger.error('Failed to upload directory to Drive', error);
      throw error;
    }
  }

  /**
   * Create and upload SEO document
   */
  async uploadSEODocument(
    clientFolderId: string,
    seoData: any
  ): Promise<{ id: string; webViewLink: string }> {
    try {
      logger.info('Creating SEO document in Drive');

      // Get SEO subfolder ID
      const subfolderResponse = await this.drive.files.list({
        q: `name='SEO' and '${clientFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id)',
      });

      const subfolderId = subfolderResponse.data.files[0]?.id;

      if (!subfolderId) {
        throw new Error('SEO subfolder not found');
      }

      // Create Google Doc with SEO data
      const response = await this.drive.files.create({
        requestBody: {
          name: 'SEO Metadata',
          mimeType: 'application/vnd.google-apps.document',
          parents: [subfolderId],
        },
        fields: 'id, webViewLink',
      });

      // Update document content
      const docs = google.docs({ version: 'v1', auth: this.drive._options.auth });
      await docs.documents.batchUpdate({
        documentId: response.data.id,
        requestBody: {
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: `SEO Metadata\n\nTitle: ${seoData.title}\n\nDescription: ${seoData.description}\n\nKeywords: ${seoData.keywords.join(', ')}\n\n`,
              },
            },
          ],
        },
      });

      logger.success('SEO document created in Drive', { docId: response.data.id });

      return {
        id: response.data.id,
        webViewLink: response.data.webViewLink,
      };
    } catch (error) {
      logger.error('Failed to create SEO document in Drive', error);
      throw error;
    }
  }
}

export const driveManager = new DriveManager();
