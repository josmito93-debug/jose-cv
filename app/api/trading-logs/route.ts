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
