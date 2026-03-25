import { NextRequest, NextResponse } from 'next/server';
import { fileManager } from '@/lib/utils/file-manager';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const clientId = params.clientId;

    // Load client data from file system
    const clientData = await fileManager.loadClientInfo(clientId);

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
  { params }: { params: { clientId: string } }
) {
  try {
    const clientId = params.clientId;
    const updates = await request.json();

    // Update client data
    const updatedData = await fileManager.updateClientInfo(clientId, updates);

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating client data:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
