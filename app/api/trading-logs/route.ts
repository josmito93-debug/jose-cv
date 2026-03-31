import { NextResponse } from 'next/server';
import { airtableTrading } from '@/lib/integrations/airtable-trading';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await airtableTrading.getLogs(50);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ success: false, logs: [] }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Correcting trigger to match Airtable Single Select constraints
    // The Python bot now looks for AND({Accion}='ESPERA', {Razon}='TRIGGER')
    await airtableTrading.saveLog({
      timestamp: new Date().toISOString(),
      accion: 'ESPERA' as any,
      precio: 0,
      razon: 'TRIGGER',
      capital_actual: 0
    });
    return NextResponse.json({ success: true, message: 'Bot trigger signal sent to Airtable' });
  } catch (error) {
    console.error('Error triggering bot:', error);
    return NextResponse.json({ success: false, message: 'Failed to send trigger' }, { status: 500 });
  }
}
