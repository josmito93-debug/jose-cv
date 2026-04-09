
import { NextRequest, NextResponse } from 'next/server';
import { GitHubManager } from '@/lib/integrations/github-manager';
import { FigmaManager } from '@/lib/integrations/figma-manager';
import { ClientData } from '@/lib/types/client';

export async function POST(request: NextRequest) {
  try {
    const { action, clientData, figmaFileKey, deploymentConfig } = await request.json();

    switch (action) {
      case 'createAndDeploy':
        if (!clientData) {
          return NextResponse.json(
            { error: 'Client data is required' },
            { status: 400 }
          );
        }

        // Step 1: Create GitHub repository
        const githubManager = new GitHubManager();
        const repository = await githubManager.createClientRepository(clientData);

        // Step 2: Process Figma design if available
        let designAssets = {};
        if (figmaFileKey) {
          const figmaManager = new FigmaManager();
          const designSystem = await figmaManager.extractDesignSystem(figmaFileKey);
          const components = await figmaManager.generateReactComponents(figmaFileKey);
          const images = await figmaManager.getFileImages(figmaFileKey, ['all']);

          designAssets = {
            designSystem,
            components,
            images,
          };
        }

        // Step 3: Initialize deployment
        const deployment = await githubManager.deployToGitHubPages(
          repository.name.split('/')[0],
          repository.name.split('/')[1]
        );

        // Step 4: Update client data with deployment info
        const updatedClientData = {
          ...clientData,
          deployment: {
            ...clientData.deployment,
            github: {
              repoUrl: repository.html_url,
              cloneUrl: repository.clone_url,
            },
            hosting: {
              url: deployment.url,
              status: deployment.status,
            },
          },
          assets: {
            ...clientData.assets,
            figma: designAssets,
          },
        };

        return NextResponse.json({
          success: true,
          repository,
          deployment,
          designAssets,
          clientData: updatedClientData,
        });

      case 'updateDesign':
        if (!clientData || !figmaFileKey) {
          return NextResponse.json(
            { error: 'Client data and Figma file key are required' },
            { status: 400 }
          );
        }

        const figmaManager = new FigmaManager();
        const newDesignAssets = {
          designSystem: await figmaManager.extractDesignSystem(figmaFileKey),
          components: await figmaManager.generateReactComponents(figmaFileKey),
          images: await figmaManager.getFileImages(figmaFileKey, ['all']),
        };

        // Update the existing repository with new design
        const githubManagerUpdate = new GitHubManager();
        const redeployment = await githubManagerUpdate.deployToGitHubPages(
          clientData.deployment.github?.repoUrl?.split('/')[3] || 'unknown',
          clientData.deployment.github?.repoUrl?.split('/')[4] || 'unknown'
        );

        return NextResponse.json({
          success: true,
          designAssets: newDesignAssets,
          deployment: redeployment,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Failed to process deployment request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const clientId = searchParams.get('clientId');

    switch (action) {
      case 'status':
        if (!clientId) {
          return NextResponse.json(
            { error: 'Client ID is required' },
            { status: 400 }
          );
        }

        // This would typically fetch from your database
        // For now, return a mock status
        const mockStatus = {
          status: 'completed',
          url: `https://${clientId}.github.io`,
          lastDeployed: new Date().toISOString(),
        };

        return NextResponse.json({ status: mockStatus });

      case 'templates':
        const availableTemplates = [
          {
            id: 'modern-business',
            name: 'Modern Business',
            description: 'Clean, professional design for service businesses',
            preview: '/templates/modern-business.png',
          },
          {
            id: 'restaurant',
            name: 'Restaurant',
            description: 'Perfect for restaurants and food services',
            preview: '/templates/restaurant.png',
          },
          {
            id: 'ecommerce',
            name: 'E-commerce',
            description: 'Product showcase and online store',
            preview: '/templates/ecommerce.png',
          },
          {
            id: 'portfolio',
            name: 'Portfolio',
            description: 'Showcase creative work and projects',
            preview: '/templates/portfolio.png',
          },
        ];

        return NextResponse.json({ templates: availableTemplates });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Deployment status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployment status' },
      { status: 500 }
    );
  }
}