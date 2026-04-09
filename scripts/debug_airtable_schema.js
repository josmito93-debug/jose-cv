
const Airtable = require('airtable');
require('dotenv').config({ path: '.env.local' });

async function debugAirtable() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  console.log('--- Airtable Debug ---');
  console.log('API KEY prefix:', apiKey?.substring(0, 5));
  console.log('BASE ID:', baseId);

  if (!apiKey || !baseId) {
    console.error('Missing credentials!');
    return;
  }

  const base = new Airtable({ apiKey }).base(baseId);

  // Try common table names
  const tables = ['Clientes Web', 'Clientes', 'Clients', 'Trading Logs'];
  
  for (const table of tables) {
    try {
      const records = await base(table).select({ maxRecords: 1 }).firstPage();
      console.log(`✅ Table "${table}" exists. Records found: ${records.length}`);
      if (records.length > 0) {
        console.log('Sample Record Fields:', Object.keys(records[0].fields));
      }
    } catch (err) {
      console.log(`❌ Table "${table}" does not exist or error: ${err.message}`);
    }
  }
}

debugAirtable();
