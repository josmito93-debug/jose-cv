import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { airtableCRM } from '../lib/integrations/airtable-crm';

async function runTest() {
  console.log('====== INICIANDO PRUEBA DE CRM DESPUES DE ARREGLAR BUG DE CAMPOS ======');

  const testClient = {
    info: {
      clientId: `SYS-TEST-${Date.now()}`,
      businessName: 'Bug Fix Prueba',
      contactName: 'Ingeniero Fix',
      email: 'bot@universa.agency',
      phone: '+584240000000',
      businessType: 'other' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    branding: {
      colors: { primary: '#000000' }
    },
    payment: {
      status: 'pending' as const,
      amount: 0,
      method: 'pago_movil' as const,
      currency: 'USD',
      reference: '',
    },
    deployment: {
      status: 'not_started' as const
    }
  };

  try {
    const recordId = await airtableCRM.syncClient(testClient);
    console.log('✅ [ÉXITO] Cliente creado correctamente en la tabla.');
    console.log('✅ Airtable devolvió el Token/ID de Registro:', recordId);
  } catch (error: any) {
    console.error('\n❌ [FALLÓ LA PRUEBA]');
    console.error('Mensaje interno:', error.message || error);
  }
}

runTest();
