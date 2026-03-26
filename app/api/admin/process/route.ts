import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Spawn the process-client script as a background process
    const scriptPath = path.resolve('./scripts/process-client.js');

    const childProcess = spawn('node', [scriptPath, clientId, '--skip-notification'], {
      detached: true,
      stdio: 'ignore',
    });

    childProcess.unref();

    return NextResponse.json({
      success: true,
      message: `Client ${clientId} is being processed in the background`,
      clientId,
    });
  } catch (error) {
    console.error('Error processing client:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process client',
      },
      { status: 500 }
    );
  }
}
