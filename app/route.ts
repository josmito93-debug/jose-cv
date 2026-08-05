import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const htmlPath = path.join(process.cwd(), 'public/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
