import { NextRequest, NextResponse } from 'next/server';
import { airtableTrading } from '@/lib/integrations/airtable-trading';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const [logs, performance] = await Promise.all([
      airtableTrading.getLogs(50, category || undefined),
      airtableTrading.getPerformanceHistory(30)
    ]);
    return NextResponse.json({ success: true, logs, performance });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, logs: [], performance: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, category } = body;

    await airtableTrading.saveLog({
      timestamp: new Date().toISOString(),
      accion: 'ESPERA' as any,
      precio: 0,
      razon: reason || 'TRIGGER',
      capital_actual: 0,
      categoria: category || 'Crypto'
    });
    return NextResponse.json({ success: true, message: `Bot ${reason || 'TRIGGER'} signal sent for ${category || 'Crypto'}` });
  } catch (error) {
    console.error('Error triggering bot:', error);
    return NextResponse.json({ success: false, message: 'Failed to send trigger' }, { status: 500 });
  }
}
