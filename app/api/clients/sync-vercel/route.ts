import { NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export async function POST(request: Request) {
  try {
    const { projectName, projectId } = await request.json();

    if (!projectName) {
      return NextResponse.json({ success: false, error: 'Project name required' }, { status: 400 });
    }

    // 1. Double check if it already exists (to avoid races)
    const existingClients = await airtableCRM.getAllClients();
    const match = existingClients.find(c => 
      c.fields['Business Name']?.toLowerCase() === projectName.toLowerCase()
    );

    if (match) {
      return NextResponse.json({ 
        success: true, 
        clientId: match.fields['Client ID'],
        message: 'Existing client found' 
      });
    }

    // 2. Create a new "Draft" client for this Vercel project
    const newClientId = `CLNT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const clientData: any = {
      info: {
        clientId: newClientId,
        businessName: projectName,
        contactName: 'Vercel Import',
        email: '',
        phone: '',
      },
      payment: {
        status: 'UNPAID'
      }
    };

    const recordId = await airtableCRM.syncClient(clientData);

    return NextResponse.json({ 
      success: true, 
      clientId: newClientId,
      recordId,
      message: 'New CRM record created for Vercel project' 
    });
  } catch (error: any) {
    console.error('Error syncing Vercel project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
