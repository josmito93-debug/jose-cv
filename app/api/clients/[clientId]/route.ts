import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = await params;
    
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    // Attempt 1: Standard Airtable Lookup
    let record = await airtableCRM.getClient(clientId);
    
    // Attempt 2: If clientId looks like a Vercel project ID, fetch from Vercel first
    if (!record && clientId.startsWith('prj_')) {
      console.log('Detected Vercel Project ID, fetching from Vercel:', clientId);
      try {
        const vResponse = await fetch(`https://api.vercel.com/v9/projects/${clientId}`, {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          },
        });
        
        if (vResponse.ok) {
          const vData = await vResponse.json();
          const projectName = vData.name;
          console.log('Vercel project found:', projectName);
          
          // Try to find client by business name (which usually matches Vercel project name)
          record = await airtableCRM.getClientByBusinessName(projectName);
          
          if (!record) {
             // If still not found, we could potentially create it, but for now let's just return a virtual client
             // OR rely on the manual "Invoice" generation to have created it.
             // For the payment page to work, we need a business name.
             return NextResponse.json({ 
               success: true, 
               client: {
                 id: clientId,
                 name: 'Cliente Vercel',
                 business: projectName,
                 paymentStatus: 'UNPAID',
                 isVirtual: true
               } 
             });
          }
        }
      } catch (vError) {
        console.error('Vercel lookup failed:', vError);
      }
    }

    if (!record) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const client = {
      id: record.id,
      name: record.fields['Contact Name'] || 'Sin Nombre',
      business: record.fields['Business Name'] || 'Sin Negocio',
      paymentStatus: record.fields['Payment Status'] || 'UNPAID',
    };

    return NextResponse.json({ success: true, client });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
