import { NextResponse } from 'next/server';
import { fileManager } from '@/lib/utils/file-manager';

export async function GET() {
  try {
    // Get all client IDs
    const clientIds = await fileManager.getAllClientIds();

    // Load all client data
    const clients = await Promise.all(
      clientIds.map(async (clientId) => {
        try {
          return await fileManager.loadClientInfo(clientId);
        } catch (error) {
          console.error(`Failed to load client ${clientId}:`, error);
          return null;
        }
      })
    );

    // Filter out failed loads and sort by creation date (newest first)
    const validClients = clients
      .filter((client): client is NonNullable<typeof client> => client !== null)
      .sort((a, b) => {
        return new Date(b.info.createdAt).getTime() - new Date(a.info.createdAt).getTime();
      });

    return NextResponse.json({
      success: true,
      clients: validClients,
      count: validClients.length,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clients',
        clients: [],
      },
      { status: 500 }
    );
  }
}
