import Airtable from 'airtable';
import { ClientData } from '../types/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('AirtableCRM');

export class AirtableCRM {
  private base: any;
  private tableName: string;

  constructor() {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });

    this.base = Airtable.base(process.env.AIRTABLE_BASE_ID || '');
    this.tableName = process.env.AIRTABLE_TABLE_NAME || 'Clients';
  }

  /**
   * Create or update client record in Airtable
   */
  async syncClient(clientData: ClientData): Promise<string> {
    try {
      logger.info('Syncing client to Airtable', { clientId: clientData.info.clientId });

      const fields = this.buildAirtableFields(clientData);

      // Check if record already exists
      if (clientData.airtableRecordId) {
        // Update existing record
        await this.base(this.tableName).update(clientData.airtableRecordId, fields);
        logger.success('Airtable record updated', { recordId: clientData.airtableRecordId });
        return clientData.airtableRecordId;
      } else {
        // Create new record
        const record = await this.base(this.tableName).create(fields);
        const recordId = record.getId();

        logger.success('Airtable record created', { recordId });
        return recordId;
      }
    } catch (error) {
      logger.error('Failed to sync client to Airtable', error);
      throw error;
    }
  }

  /**
   * Build Airtable fields from client data
   */
  private buildAirtableFields(clientData: ClientData): any {
    const { info, branding, payment, deployment, assets } = clientData;

    return {
      'Client ID': info.clientId,
      'Business Name': info.businessName,
      'Contact Name': info.contactName,
      'Phone': info.phone,
      'Email': info.email || '',
      'Business Type': info.businessType,
      'Created At': info.createdAt,
      'Updated At': info.updatedAt,

      // Branding
      'Primary Color': branding.colors.primary,
      'Logo URL': branding.logo?.driveUrl || branding.logo?.url || '',

      // Payment
      'Payment Method': payment.method,
      'Payment Status': payment.status,
      'Payment Amount': payment.amount,
      'Payment Currency': payment.currency,
      'Payment Reference': payment.reference || '',
      'Payment Completed': payment.completedAt || '',

      // Deployment
      'Deployment Status': deployment.status,
      'GitHub Repo': deployment.github?.repoUrl || '',
      'Hosting URL': deployment.hosting?.url || '',
      'Domain': deployment.hosting?.domain || '',
      'SSL Enabled': deployment.hosting?.sslEnabled || false,
      'Deployed At': deployment.deployedAt || '',

      // Assets
      'Wireframes Count': assets?.wireframes?.pages.length || 0,
      'Images Count': assets?.images?.length || 0,
      'SEO Generated': assets?.seo ? 'Yes' : 'No',

      // Products
      'Products': clientData.products?.map(p => p.name).join(', ') || '',
    };
  }

  /**
   * Get client by ID from Airtable
   */
  async getClient(clientId: string): Promise<any> {
    try {
      const records = await this.base(this.tableName)
        .select({
          filterByFormula: `{Client ID} = '${clientId}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (records.length > 0) {
        return records[0];
      }

      return null;
    } catch (error) {
      logger.error('Failed to get client from Airtable', error);
      throw error;
    }
  }

  /**
   * Update specific fields in Airtable
   */
  async updateFields(recordId: string, fields: any): Promise<void> {
    try {
      await this.base(this.tableName).update(recordId, fields);
      logger.success('Airtable fields updated', { recordId });
    } catch (error) {
      logger.error('Failed to update Airtable fields', error);
      throw error;
    }
  }

  /**
   * Get all clients from Airtable
   */
  async getAllClients(): Promise<any[]> {
    try {
      const records = await this.base(this.tableName)
        .select()
        .all();

      return records.map(record => ({
        id: record.getId(),
        fields: record.fields,
      }));
    } catch (error) {
      logger.error('Failed to get all clients from Airtable', error);
      throw error;
    }
  }
}

export const airtableCRM = new AirtableCRM();
