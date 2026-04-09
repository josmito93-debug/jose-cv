
import { NextRequest, NextResponse } from 'next/server';
import { FigmaManager } from '@/lib/integrations/figma-manager';

export async function POST(request: NextRequest) {
  try {
    const { fileKey, action, businessType, businessName, style } = await request.json();

    if (!fileKey && !action) {
      return NextResponse.json(
        { error: 'File key or action is required' },
        { status: 400 }
      );
    }

    const figmaManager = new FigmaManager();

    switch (action) {
      case 'extractDesignSystem':
        if (!fileKey) {
          return NextResponse.json(
            { error: 'File key is required for design system extraction' },
            { status: 400 }
          );
        }
        
        const designSystem = await figmaManager.extractDesignSystem(fileKey);
        return NextResponse.json({ designSystem });

      case 'generateComponents':
        if (!fileKey) {
          return NextResponse.json(
            { error: 'File key is required for component generation' },
            { status: 400 }
          );
        }
        
        const components = await figmaManager.generateReactComponents(fileKey);
        return NextResponse.json({ components });

      case 'createWireframe':
        if (!businessType || !businessName) {
          return NextResponse.json(
            { error: 'Business type and name are required for wireframe creation' },
            { status: 400 }
          );
        }
        
        const wireframe = await figmaManager.createWireframe(businessType, businessName, style);
        return NextResponse.json({ wireframe });

      case 'getImages':
        if (!fileKey) {
          return NextResponse.json(
            { error: 'File key is required for image extraction' },
            { status: 400 }
          );
        }

        // Get all node IDs from file for image extraction
        const file = await figmaManager.getFile(fileKey);
        const nodeIds = await extractAllNodeIds(file.document);
        
        const images = await figmaManager.getFileImages(fileKey, nodeIds);
        return NextResponse.json({ images });

      default:
        // Default: get file information
        if (!fileKey) {
          return NextResponse.json(
            { error: 'File key is required' },
            { status: 400 }
          );
        }
        
        const fileData = await figmaManager.getFile(fileKey);
        return NextResponse.json({ file: fileData });
    }
  } catch (error) {
    console.error('Figma API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Figma request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');
    const action = searchParams.get('action');

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    const figmaManager = new FigmaManager();

    switch (action) {
      case 'designSystem':
        const designSystem = await figmaManager.extractDesignSystem(fileKey);
        return NextResponse.json({ designSystem });

      case 'components':
        const components = await figmaManager.generateReactComponents(fileKey);
        return NextResponse.json({ components });

      default:
        const file = await figmaManager.getFile(fileKey);
        return NextResponse.json({ file });
    }
  } catch (error) {
    console.error('Figma API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Figma data' },
      { status: 500 }
    );
  }
}

// Helper function to extract all node IDs recursively
async function extractAllNodeIds(node: any): Promise<string[]> {
  const ids: string[] = [node.id];
  
  if (node.children) {
    for (const child of node.children) {
      const childIds = await extractAllNodeIds(child);
      ids.push(...childIds);
    }
  }
  
  return ids;
}