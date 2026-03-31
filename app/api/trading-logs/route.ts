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
    // We send a special 'TRIGGER' action that the Python bot polls for
    await airtableTrading.saveLog({
      timestamp: new Date().toISOString(),
      accion: 'TRIGGER' as any,
      precio: 0,
      razon: 'Manual trigger from Dashboard',
      capital_actual: 0
    });
    return NextResponse.json({ success: true, message: 'Bot trigger signal sent to Airtable' });
  } catch (error) {
    console.error('Error triggering bot:', error);
    return NextResponse.json({ success: false, message: 'Failed to send trigger' }, { status: 500 });
  }
}
