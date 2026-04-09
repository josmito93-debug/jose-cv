import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { airtableTrading } from '../lib/integrations/airtable-trading';

async function testTradingBot() {
  console.log('====== INICIANDO PRUEBA DEL TRADING BOT EN AIRTABLE ======');

  const testLog = {
    timestamp: new Date().toISOString(),
    accion: 'COMPRA' as const,
    precio: 65123.45,
    razon: 'RSI Sobrevendido / Divergencia Alcista Detectada',
    capital_actual: 10500,
    sector: 'CRYPTO',
    simbolo: 'BTC/USD'
  };

  try {
    console.log('Validando conexión a la tabla de Trading...');
    const recordId = await airtableTrading.saveLog(testLog);
    console.log('✅ TRADING LOG EXITOSO. Airtable devolvió Token/ID:', recordId);
  } catch (err: any) {
    console.error('❌ ERROR TRADING LOG:', err.message || err);
    console.log('Probablemente no existe la tabla "Trading Logs" en la misma Base, o faltan sus columnas exactas (Timestamp, Accion, Precio, Razon, Capital Actual).');
  }
}

testTradingBot();
