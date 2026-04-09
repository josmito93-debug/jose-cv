import Airtable from 'airtable';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

console.log('Testing Airtable with:');
console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');
console.log('Base ID:', baseId);

if (!apiKey || !baseId) {
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

async function test() {
  try {
    console.log('Fetching last 5 records from "Trading Logs"...');
    const records = await base('Trading Logs').select({ 
      maxRecords: 5,
      sort: [{ field: 'Timestamp', direction: 'desc' }]
    }).firstPage();
    
    console.log('Success! Found', records.length, 'records.');
    records.forEach(r => {
      console.log(`[${r.get('Timestamp')}] ${r.get('Accion')} ${r.get('Simbolo') || ''} @ ${r.get('Precio')} - ${r.get('Razon')}`);
    });
  } catch (error: any) {
    console.error('Airtable Error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

test();
