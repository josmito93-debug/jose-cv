import { NextResponse } from 'next/server';

const VERCEL_TOKEN = 'vcp_624jYh1coZXgNeBbyMYUP9A4Ze0ZonVMbYA1nJliIKgihYCJxB21Dcby';

export async function GET() {
  try {
    // Increase limit to 100 to see all projects
    const response = await fetch('https://api.vercel.com/v9/projects?limit=100', {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN || VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, projects: data.projects });
  } catch (error: any) {
    console.error('Failed to fetch Vercel projects:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
