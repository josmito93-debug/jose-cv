import { NextRequest, NextResponse } from 'next/server';
import { airtableCRM } from '@/lib/integrations/airtable-crm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    // Load client data from Airtable
    const record = await airtableCRM.getClient(clientId);

    if (!record) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Map Airtable fields back to ClientData structure
    const clientData = {
      id: record.getId(),
      airtableRecordId: record.getId(),
      info: {
        clientId: record.get('Client ID'),
        businessName: record.get('Business Name'),
        contactName: record.get('Contact Name'),
        email: record.get('Email'),
        phone: record.get('Phone'),
        businessType: record.get('Business Type'),
        createdAt: record.get('Created At'),
        updatedAt: record.get('Updated At'),
      },
      branding: {
        colors: { primary: record.get('Primary Color') },
        logo: { url: record.get('Logo URL') }
      },
      payment: {
        amount: record.get('Payment Amount'),
        currency: record.get('Payment Currency'),
        status: record.get('Payment Status'),
      },
      deployment: {
        status: record.get('Deployment Status'),
        github: { repoUrl: record.get('GitHub Repo') },
        hosting: { url: record.get('Hosting URL') }
      }
    };

    return NextResponse.json(clientData);
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const updates = await request.json();

    // In a real scenario, you'd find the record first or use the airtableRecordId
    const record = await airtableCRM.getClient(clientId);
    if (!record) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Update Airtable record
    // Note: buildAirtableFields might need adjustment to handle partial updates
    await airtableCRM.updateFields(record.getId(), updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client data:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
