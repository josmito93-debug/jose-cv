import { NextResponse } from 'next/server';
import { fileManager } from '@/lib/utils/file-manager';
import { ClientData } from '@/lib/types/client';

export async function GET() {
  try {
    const clientIds = await fileManager.getAllClientIds();
    
    const clients: ClientData[] = await Promise.all(
      clientIds.map(async (id) => {
        try {
          return await fileManager.loadClientInfo(id);
        } catch (error) {
          console.error(`Error loading client ${id}:`, error);
          return null;
        }
      })
    ).then(results => results.filter((c): c is ClientData => c !== null));

    // Sort by creation date (newest first)
    clients.sort((a, b) => {
      const dateA = new Date(a.info.createdAt).getTime();
      const dateB = new Date(b.info.createdAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ success: true, clients });
  } catch (error) {
    console.error('Error listing clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list clients' },
      { status: 500 }
    );
  }
}
