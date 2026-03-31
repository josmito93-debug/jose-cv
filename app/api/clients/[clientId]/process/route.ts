import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { fileManager } from '@/lib/utils/file-manager';
import { mcpCreative } from '@/lib/mcp-creative';
import { mcpOperative } from '@/lib/mcp-operative';
import { websiteGenerator } from '@/lib/utils/website-generator';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const { skipPayment = true, domain } = await request.json().catch(() => ({}));

    // Step 1: Load client data
    const clientData = await fileManager.loadClientInfo(clientId);

    if (!clientData) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Update status to in_progress
    clientData.deployment.status = 'in_progress';
    await fileManager.updateClientInfo(clientId, clientData);

    // Run the workflow asynchronously (don't await the whole thing if it's too long, 
    // but Next.js serverless functions have limits. For now we await to see errors).
    
    // 1. Creative Workflow (Wireframes, Images, SEO)
    const creativeData = await mcpCreative.execute(clientData);

    // 2. Website Generation (NEW!)
    const websiteDir = await websiteGenerator.generateWebsite(clientId, creativeData);

    // 3. Operative Workflow (Deployment)
    // For this integration, we'll skip payment to allow testing/immediate use
    const finalData = await mcpOperative.execute(creativeData, websiteDir, {
      skipPayment: true, 
    });

    return NextResponse.json({
      success: true,
      message: 'Client processed successfully',
      data: finalData
    });

  } catch (error) {
    console.error('Error processing client:', error);
    
    // Attempt to mark as failed
    try {
      const { clientId } = await params;
      const clientData = await fileManager.loadClientInfo(clientId);
      if (clientData) {
        clientData.deployment.status = 'failed';
        await fileManager.updateClientInfo(clientId, clientData);
      }
    } catch (e) { /* ignore */ }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
