const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const workspaceDir = '/Users/josefigueroa/Desktop/websites/jose-cv';
dotenv.config({ path: path.join(workspaceDir, '.env.local') });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('ERROR: VERCEL_TOKEN is missing in .env.local');
  process.exit(1);
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

// Common title cleanup regexes/strings
function cleanTitle(title, projectName) {
  if (!title) return '';
  let cleaned = title
    .replace(/<[^>]*>/g, '') // remove HTML tags just in case
    .replace(/\r?\n|\r/g, ' ') // remove newlines
    .replace(/\s+/g, ' ') // normalize spaces
    .trim();

  // Extract prefix before common title separators: —, –, |, -, : (when followed by a space)
  const splitMatch = cleaned.split(/\s*(?:\u2014|\u2013|\||-|:)\s+/);
  if (splitMatch && splitMatch.length > 0) {
    const candidate = splitMatch[0].trim();
    if (candidate.length >= 2) {
      cleaned = candidate;
    }
  }

  // Remove common marketing/landing page suffixes
  cleaned = cleaned
    .replace(/\s*\|\s*Home\s*$/i, '')
    .replace(/\s*-\s*Home\s*$/i, '')
    .replace(/\s*\|\s*Inicio\s*$/i, '')
    .replace(/\s*-\s*Inicio\s*$/i, '')
    .replace(/\s*\|\s*Welcome\s*$/i, '')
    .replace(/\s*-\s*Welcome\s*$/i, '')
    .replace(/\s*\|\s*Landing\s*Page\s*$/i, '')
    .replace(/\s*-\s*Landing\s*Page\s*$/i, '')
    .replace(/\s*\|\s*Official\s*Site\s*$/i, '')
    .replace(/\s*-\s*Official\s*Site\s*$/i, '')
    .replace(/\s*\|\s*Website\s*$/i, '')
    .replace(/\s*-\s*Website\s*$/i, '')
    .replace(/\s*\|\s*Universa\s*Agency\s*$/i, '')
    .replace(/\s*-\s*Universa\s*Agency\s*$/i, '');

  // If the clean title is too generic (e.g. "Create Next App" or "Vite + React")
  if (
    cleaned.toLowerCase().includes('create next app') ||
    cleaned.toLowerCase().includes('vite + react') ||
    cleaned.toLowerCase() === 'home' ||
    cleaned.toLowerCase() === 'inicio' ||
    cleaned.length < 2 ||
    cleaned.length > 100
  ) {
    return ''; // Return empty so it falls back to cleaned project name
  }

  return decodeHtmlEntities(cleaned);
}

async function scrapeTitle(url) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout per site

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    clearTimeout(id);
    
    if (!res.ok) return null;
    
    const html = await res.text();
    
    // Regex to extract <title> tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    // Fallback to og:title
    const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    if (ogMatch && ogMatch[1]) {
      return ogMatch[1].trim();
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  try {
    console.log('Fetching projects from Vercel...');
    const response = await fetch('https://api.vercel.com/v9/projects?limit=100', {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.statusText}`);
    }

    const data = await response.json();
    const projects = data.projects || [];
    console.log(`Found ${projects.length} projects. Scrapes will run in parallel...`);

    const metadata = {};
    const scrapePromises = projects.map(async (project) => {
      // Find domain/URL
      let bestUrl = '';
      const aliases = project.targets?.production?.alias || [];
      if (aliases.length > 0) {
        const customDomain = aliases.find((a) => !a.includes('vercel.app'));
        bestUrl = customDomain ? `https://${customDomain}` : `https://${aliases[0]}`;
      } else if (project.targets?.production?.url) {
        bestUrl = `https://${project.targets.production.url}`;
      } else {
        bestUrl = project.link || '';
      }

      if (!bestUrl) {
        return;
      }

      console.log(`Scraping [${project.name}] at: ${bestUrl}...`);
      const rawTitle = await scrapeTitle(bestUrl);
      const clean = cleanTitle(rawTitle, project.name);

      if (clean) {
        console.log(`✅ [${project.name}] -> Brand Name: "${clean}"`);
        metadata[project.name] = clean;
      } else {
        console.log(`❌ [${project.name}] -> No distinct title found (uses project name fallback)`);
      }
    });

    await Promise.all(scrapePromises);

    // Save to JSON
    const dataDir = path.join(workspaceDir, 'lib/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'project-metadata.json');
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`\n🎉 Project metadata successfully saved to: ${outputPath}`);
    console.log(`Total brand names resolved: ${Object.keys(metadata).length}`);

  } catch (error) {
    console.error('Scraper process failed:', error);
  }
}

run();
