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
  sector?: string;
  simbolo?: string;
  coherence_score?: number;
  omega_score?: number;
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
      logger.info('Saving trading log to Airtable', { accion: log.accion, precio: log.precio, sector: log.sector });

      const fields: any = {
        'Timestamp': log.timestamp,
        'Accion': log.accion,
        'Precio': log.precio,
        'Razon': log.razon,
        'Capital Actual': log.capital_actual,
        'Coherence Score': log.coherence_score,
        'Omega Score': log.omega_score,
      };

      // Opcionalmente agregar sector y simbolo si existen
      if (log.sector) fields['Sector'] = log.sector;
      if (log.simbolo) fields['Simbolo'] = log.simbolo;

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
   * Get recent trading logs from Airtable
   */
  async getLogs(limit: number = 50): Promise<TradingLog[]> {
    try {
      const records = await this.base(this.tableName)
        .select({
          maxRecords: limit,
          sort: [{ field: 'Timestamp', direction: 'desc' }],
        })
        .firstPage();

      return records.map((record: any) => ({
        id: record.getId(),
        timestamp: record.get('Timestamp'),
        accion: record.get('Accion'),
        precio: record.get('Precio'),
        razon: record.get('Razon'),
        capital_actual: record.get('Capital Actual'),
        sector: record.get('Sector'),
        simbolo: record.get('Simbolo'),
        coherence_score: record.get('Coherence Score'),
        omega_score: record.get('Omega Score'),
      }));
    } catch (error) {
      logger.error('Failed to fetch trading logs from Airtable', error);
      return [];
    }
  }
}

export const airtableTrading = new AirtableTrading();
