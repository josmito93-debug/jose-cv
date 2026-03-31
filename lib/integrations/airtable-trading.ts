import Airtable from 'airtable';
import { createLogger } from '../utils/logger';

const logger = createLogger('AirtableTrading');

export interface TradingLog {
  id?: string;
  timestamp: string;
  accion: 'COMPRA' | 'VENTA' | 'ESPERA';
  precio: number;
  razon: string;
  capital_actual: number;
  news_analysis?: string;
  raw_intel?: string;
  categoria: 'Crypto' | 'Metals' | 'Forex' | 'Stocks';
}

export class AirtableTrading {
  private _base: any;
  private tableName: string;

  constructor() {
    this.tableName = process.env.AIRTABLE_TABLE_NAME_LOGS || 'Trading Logs';
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
   * Save a new trading log to Airtable
   */
  async saveLog(log: TradingLog): Promise<string> {
    try {
      logger.info('Saving trading log to Airtable', { accion: log.accion, precio: log.precio });

      const fields = {
        'Timestamp': log.timestamp,
        'Accion': log.accion,
        'Precio': log.precio,
        'Razon': log.razon,
        'Capital Actual': log.capital_actual,
        'News Analysis': log.news_analysis,
        'Raw Intel': log.raw_intel,
        'Categoria': log.categoria,
      };

      const record = await this.base(this.tableName).create(fields);
      const recordId = record.getId();

      logger.success('Trading log saved', { recordId });
      return recordId;
    } catch (error) {
      logger.error('Failed to save trading log to Airtable', error);
      throw error;
    }
  }
  /**
   * Get recent trading logs from Airtable, optionally filtered by category
   */
  async getLogs(limit: number = 50, categoria?: string): Promise<TradingLog[]> {
    try {
      const filterByFormula = categoria ? `{Categoria} = '${categoria}'` : '';
      
      const records = await this.base(this.tableName)
        .select({
          maxRecords: limit,
          sort: [{ field: 'Timestamp', direction: 'desc' }],
          filterByFormula
        })
        .firstPage();

      return records.map((record: any) => ({
        id: record.getId(),
        timestamp: record.get('Timestamp'),
        accion: record.get('Accion'),
        precio: record.get('Precio'),
        razon: record.get('Razon'),
        capital_actual: record.get('Capital Actual'),
        news_analysis: record.get('News Analysis'),
        raw_intel: record.get('Raw Intel'),
        categoria: record.get('Categoria') || 'Crypto',
      }));
    } catch (error) {
      logger.error('Failed to fetch trading logs from Airtable', error);
      return [];
    }
  }

  /**
   * Get performance history from Airtable
   */
  async getPerformanceHistory(limit: number = 30): Promise<any[]> {
    try {
      const records = await this.base('Performance History')
        .select({
          maxRecords: limit,
          sort: [{ field: 'Timestamp', direction: 'asc' }],
        })
        .firstPage();

      return records.map((record: any) => ({
        timestamp: record.get('Timestamp'),
        value: record.get('Portfolio Value'),
      }));
    } catch (error) {
      logger.error('Failed to fetch performance history', error);
      return [];
    }
  }
}

export const airtableTrading = new AirtableTrading();
