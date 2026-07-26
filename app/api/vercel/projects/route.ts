import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

export async function GET() {
  try {
    // 1. Fetch Vercel projects
    const response = await fetch('https://api.vercel.com/v9/projects?limit=100', {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN || VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`);
    }

    const data = await response.json();
    const projects = data.projects || [];

    // 2. Load project metadata (brand names) on the server side
    let projectMetadata: Record<string, string> = {};
    try {
      const metadataPath = path.join(process.cwd(), 'lib/data/project-metadata.json');
      if (fs.existsSync(metadataPath)) {
        const fileContent = fs.readFileSync(metadataPath, 'utf-8');
        projectMetadata = JSON.parse(fileContent);
      }
    } catch (metaErr) {
      console.error('Failed to load project-metadata.json on server:', metaErr);
    }

    // 3. Map projects to include brandName if found in metadata
    const enrichedProjects = projects.map((project: any) => {
      return {
        ...project,
        brandName: projectMetadata[project.name] || ''
      };
    });

    return NextResponse.json({ success: true, projects: enrichedProjects });
  } catch (error: any) {
    console.error('Failed to fetch Vercel projects:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
