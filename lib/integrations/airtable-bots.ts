import Airtable from 'airtable';
import { createLogger } from '../utils/logger';

const logger = createLogger('AirtableBots');

export type BotType = 'Trading' | 'Automation' | 'Assistant' | 'Collector' | 'System';
export type BotStatus = 'ONLINE' | 'OFFLINE' | 'ERROR' | 'SYNCING' | 'TRAINING';

export interface BotMetadata {
  currentPrice?: number;
  capitalActual?: number;
  lastAction?: string;
  readinessScore?: number;
  missingDependencies?: string[];
  activeConversations?: number;
  [key: string]: any;
}

export interface BotStatusData {
  botId: string;
  name: string;
  type: BotType;
  status: BotStatus;
  healthScore: number;
  lastActivity: string;
  metadata?: BotMetadata;
}

export class AirtableBots {
  private _base: any;
  private tableName: string;

  constructor() {
    this.tableName = process.env.AIRTABLE_BOTS_TABLE || 'Bots_Status';
  }

  private get base() {
    if (!this._base) {
      const apiKey = process.env.AIRTABLE_API_KEY;
      const baseId = process.env.AIRTABLE_BASE_ID;
      
      if (!apiKey || !baseId) {
        throw new Error('Airtable credentials missing (AIRTABLE_API_KEY, AIRTABLE_BASE_ID)');
      }
      
      Airtable.configure({ apiKey });
      this._base = Airtable.base(baseId);
    }
    return this._base;
  }

  /**
   * Sync bot status to Airtable
   * This maintains a singleton record per botId
   */
  async syncStatus(data: BotStatusData): Promise<string> {
    try {
      logger.info('Syncing bot status to Airtable', { botId: data.botId, status: data.status });

      const fields: any = {
        'Bot ID': data.botId,
        'Name': data.name,
        'Type': data.type,
        'Status': data.status,
        'Health Score': data.healthScore,
        'Last Activity': data.lastActivity,
      };

      if (data.metadata) {
        fields['Metadata'] = JSON.stringify(data.metadata, null, 2);
        // Map specific common metadata to top-level fields if they exist in the schema
        if (data.metadata.currentPrice !== undefined) fields['Current Value'] = data.metadata.currentPrice;
        if (data.metadata.capitalActual !== undefined) fields['Capital'] = data.metadata.capitalActual;
        if (data.metadata.lastAction) fields['Last Action'] = data.metadata.lastAction;
        if (data.metadata.readinessScore !== undefined) fields['Readiness %'] = data.metadata.readinessScore;
        if (data.metadata.missingDependencies) fields['Missing Dependencies'] = data.metadata.missingDependencies.join(', ');
      }

      // Check for existing record
      const records = await this.base(this.tableName)
        .select({
          filterByFormula: `{Bot ID} = '${data.botId}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (records.length > 0) {
        // Update existing
        const recordId = records[0].getId();
        await this.base(this.tableName).update(recordId, fields);
        logger.success('Bot status updated', { botId: data.botId });
        return recordId;
      } else {
        // Create new
        const record = await this.base(this.tableName).create(fields);
        const recordId = record.getId();
        logger.success('Bot status registered', { botId: data.botId, recordId });
        return recordId;
      }
    } catch (error) {
      logger.error(`Failed to sync status for bot: ${data.botId}`, error);
      throw error;
    }
  }

  /**
   * Get all registered bots
   */
  async getAllBots(): Promise<any[]> {
    try {
      const records = await this.base(this.tableName).select().all();
      return records.map((r: any) => ({
        id: r.getId(),
        fields: r.fields
      }));
    } catch (error) {
      logger.error('Failed to fetch all bots', error);
      return [];
    }
  }
}

export const airtableBots = new AirtableBots();
