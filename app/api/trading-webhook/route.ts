import { NextRequest, NextResponse } from 'next/server';
import { airtableTrading, TradingLog } from '@/lib/integrations/airtable-trading';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhook_secret, accion, precio, razon, capital_actual, sector, simbolo, coherence_score, omega_score } = body;

    // Use environment secret or the fallback for testing
    if (webhook_secret !== process.env.DASHBOARD_WEBHOOK_SECRET && webhook_secret !== "JFOS_SECURE_2026") {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const logData: TradingLog = {
      timestamp: new Date().toISOString(),
      accion,
      precio,
      razon,
      capital_actual,
      sector,
      simbolo,
      coherence_score,
      omega_score
    };

    // Almacenamiento en Airtable (Persistencia en Vercel)
    console.log('Attempting Airtable save...');
    const recordId = await airtableTrading.saveLog(logData);

    console.log(`✅ [WEBHOOK SUCCESS] - ${accion} ${simbolo || ''} | Airtable ID: ${recordId}`);

    return NextResponse.json({ success: true, id: recordId });
  } catch (error: any) {
    console.error('❌ [WEBHOOK ERROR]:', error.message || error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    }, { status: 500 });
  }
}
