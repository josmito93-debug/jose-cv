import { NextRequest, NextResponse } from 'next/server';
import { GitHubManager } from '@/lib/integrations/github-manager';

export async function POST(request: NextRequest) {
  try {
    const { action, clientData, repoData, deploymentData } = await request.json();

    const githubManager = new GitHubManager();

    switch (action) {
      case 'createRepository':
        if (!clientData) {
          return NextResponse.json(
            { error: 'Client data is required for repository creation' },
            { status: 400 }
          );
        }

        const repository = await githubManager.createClientRepository(clientData);
        return NextResponse.json({ repository });

      case 'deploy':
        if (!repoData) {
          return NextResponse.json(
            { error: 'Repository data is required for deployment' },
            { status: 400 }
          );
        }

        const deployment = await githubManager.deployToGitHubPages(
          repoData.owner,
          repoData.name
        );
        return NextResponse.json({ deployment });

      case 'getStatus':
        if (!repoData) {
          return NextResponse.json(
            { error: 'Repository data is required for status check' },
            { status: 400 }
          );
        }

        const status = await githubManager.getRepositoryStatus(
          repoData.owner,
          repoData.name
        );
        return NextResponse.json({ status });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to process GitHub request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const githubManager = new GitHubManager();

    switch (action) {
      case 'status':
        if (!owner || !repo) {
          return NextResponse.json(
            { error: 'Owner and repo are required for status check' },
            { status: 400 }
          );
        }

        const status = await githubManager.getRepositoryStatus(owner, repo);
        return NextResponse.json({ status });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}