import axios from 'axios';
import { ClientData } from '../types/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('CodaPM');

export class CodaPM {
  private apiKey: string;
  private docId: string;
  private tableId: string;
  private baseUrl = 'https://coda.io/apis/v1';

  constructor() {
    this.apiKey = process.env.CODA_API_KEY || '';
    this.docId = process.env.CODA_DOC_ID || '';
    this.tableId = process.env.CODA_TABLE_ID || '';
  }

  /**
   * Create or update client tasks in Coda
   */
  async syncClient(clientData: ClientData): Promise<string> {
    try {
      logger.info('Syncing client to Coda', { clientId: clientData.info.clientId });

      const tasks = this.buildTaskList(clientData);

      // Check if row already exists
      if (clientData.codaRowId) {
        // Update existing row
        await this.updateRow(clientData.codaRowId, tasks);
        logger.success('Coda row updated', { rowId: clientData.codaRowId });
        return clientData.codaRowId;
      } else {
        // Create new row
        const rowId = await this.createRow(tasks);
        logger.success('Coda row created', { rowId });
        return rowId;
      }
    } catch (error) {
      logger.error('Failed to sync client to Coda', error);
      throw error;
    }
  }

  /**
   * Build task list from client data
   */
  private buildTaskList(clientData: ClientData): any {
    const { info, payment, deployment, assets } = clientData;

    return {
      'Client ID': info.clientId,
      'Business Name': info.businessName,
      'Contact': info.contactName,
      'Phone': info.phone,
      'Status': this.getOverallStatus(clientData),

      // Creative Tasks Checklist
      'Wireframes': assets?.wireframes ? '✅' : '⏳',
      'Images': assets?.images && assets.images.length > 0 ? '✅' : '⏳',
      'SEO': assets?.seo ? '✅' : '⏳',
      'Drive Upload': assets?.wireframes?.pages[0]?.driveUrl ? '✅' : '⏳',

      // Operative Tasks Checklist
      'Payment': payment.status === 'completed' ? '✅' : payment.status === 'pending' ? '⏳' : '❌',
      'GitHub Repo': deployment.github?.repoUrl ? '✅' : '⏳',
      'Hosting': deployment.hosting?.url ? '✅' : '⏳',
      'SSL': deployment.hosting?.sslEnabled ? '✅' : '⏳',

      // Links
      'GitHub URL': deployment.github?.repoUrl || '',
      'Website URL': deployment.hosting?.url || '',

      // Dates
      'Created': info.createdAt,
      'Updated': info.updatedAt,
      'Deployed': deployment.deployedAt || '',
    };
  }

  /**
   * Get overall project status
   */
  private getOverallStatus(clientData: ClientData): string {
    if (clientData.deployment.status === 'completed') {
      return '✅ Completed';
    } else if (clientData.deployment.status === 'failed') {
      return '❌ Failed';
    } else if (clientData.deployment.status === 'in_progress') {
      return '⏳ In Progress';
    } else if (clientData.payment.status === 'completed') {
      return '💰 Paid - Pending Deploy';
    } else if (clientData.payment.status === 'pending') {
      return '💳 Awaiting Payment';
    }

    return '📋 New';
  }

  /**
   * Create row in Coda table
   */
  private async createRow(data: any): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/docs/${this.docId}/tables/${this.tableId}/rows`,
        {
          rows: [
            {
              cells: Object.entries(data).map(([column, value]) => ({
                column,
                value,
              })),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.rows[0].id;
    } catch (error) {
      logger.error('Failed to create Coda row', error);
      throw error;
    }
  }

  /**
   * Update row in Coda table
   */
  private async updateRow(rowId: string, data: any): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/docs/${this.docId}/tables/${this.tableId}/rows/${rowId}`,
        {
          row: {
            cells: Object.entries(data).map(([column, value]) => ({
              column,
              value,
            })),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      logger.error('Failed to update Coda row', error);
      throw error;
    }
  }

  /**
   * Get row from Coda
   */
  async getRow(rowId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/docs/${this.docId}/tables/${this.tableId}/rows/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get Coda row', error);
      throw error;
    }
  }

  /**
   * Add comment/note to client row
   */
  async addNote(rowId: string, note: string): Promise<void> {
    try {
      // Coda doesn't have a direct comments API, so we'd update a Notes column
      await this.updateRow(rowId, {
        Notes: note,
        'Last Note Date': new Date().toISOString(),
      });

      logger.success('Note added to Coda row', { rowId });
    } catch (error) {
      logger.error('Failed to add note to Coda', error);
      throw error;
    }
  }
}

export const codaPM = new CodaPM();
