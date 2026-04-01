import { NextResponse } from 'next/server';
import { airtableBots } from '@/lib/integrations/airtable-bots';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch all registered bots from Airtable Surveillance
 */
export async function GET() {
  try {
    const bots = await airtableBots.getAllBots();
    
    return NextResponse.json({
      success: true,
      bots
    });
  } catch (error: any) {
    console.error('Bots Registry GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch bots registry' 
    }, { status: 500 });
  }
}
