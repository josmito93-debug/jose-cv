import Airtable from 'airtable';
import { ClientData } from '../types/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('AirtableCRM');

export class AirtableCRM {
  private _base: any;
  private tableName: string;

  constructor() {
    this.tableName = process.env.AIRTABLE_TABLE_NAME || 'Clients';
  }

  private get base() {
    if (!this._base) {
      if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
        throw new Error('Airtable credentials missing (AIRTABLE_API_KEY, AIRTABLE_BASE_ID)');
      }
      Airtable.configure({
        apiKey: process.env.AIRTABLE_API_KEY,
      });
      this._base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    }
    return this._base;
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
  private buildAirtableFields(clientData: ClientData | any): any {
    const { info, payment } = clientData;

    const fields: any = {
      'Client ID': info.clientId || `CLNT-${Date.now()}`,
      'Business Name': info.businessName || 'Sin Negocio',
      'Contact Name': info.contactName || 'Sin Nombre',
      'Email': info.email || '',
      'Phone': info.phone || '',
      'Payment Status': payment?.status || 'UNPAID',
    };

    if (payment?.method) fields['Payment Method'] = payment.method;
    if (payment?.reference) fields['Payment Reference'] = payment.reference;
    if (payment?.nextDueDate) fields['Next Due Date'] = payment.nextDueDate;

    return fields;
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

      return records.map((record: any) => ({
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
