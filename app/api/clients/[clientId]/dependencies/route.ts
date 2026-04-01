import { NextRequest, NextResponse } from 'next/server';
import { fileManager } from '@/lib/utils/file-manager';
import { airtableCRM } from '@/lib/integrations/airtable-crm';
import { dependencyAuditor } from '@/lib/n8n/auditor';
import { n8nArchitect } from '@/lib/n8n/architect';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch current dependencies and audit status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const clientId = params.clientId;
    const clientData = await fileManager.loadClientInfo(clientId);
    
    // Perform fresh audit
    const auditedClient = await dependencyAuditor.auditClient(clientData);
    const auditStatus = await n8nArchitect.auditClient(auditedClient);
    
    return NextResponse.json({
      success: true,
      dependencies: auditedClient.dependencies || {},
      audit: auditStatus
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST: Add or Update a dependency
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const { dependency } = await request.json();

    if (!dependency || !dependency.id) {
      return NextResponse.json({ success: false, error: 'Dependency field (id/config) required' }, { status: 400 });
    }

    // 1. Update Local Storage
    const clientData = await fileManager.loadClientInfo(clientId);
    const currentDeps = clientData.dependencies || {};
    
    currentDeps[dependency.id] = {
      ...currentDeps[dependency.id],
      ...dependency, // Update fields (config, type, name, etc.)
      status: 'configured', // Mark as configured, audit will verify
      lastCheckedAt: new Date().toISOString()
    };

    const updatedClient = {
      ...clientData,
      dependencies: currentDeps
    };

    // 2. Perform Audit immediately
    const auditedClient = await dependencyAuditor.auditClient(updatedClient);
    const auditStatus = await n8nArchitect.auditClient(auditedClient);
    
    // 3. Save results
    await fileManager.saveClientInfo(clientId, auditedClient);
    
    // 4. Update CRM Automation Status (Sync Score to Airtable)
    const airtableClient = await airtableCRM.getClient(clientId);
    if (airtableClient) {
      await airtableCRM.syncAutomation(airtableClient.id, {
        readinessScore: auditStatus.score,
        missingDependencies: auditStatus.missing,
        status: auditStatus.isReady ? 'active' : 'error'
      });
    }

    return NextResponse.json({
      success: true,
      dependency: auditedClient.dependencies[dependency.id],
      audit: auditStatus
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
