import { ClientData } from '../types/client';
import { fileManager } from './file-manager';
import { createLogger } from './logger';
import path from 'path';

const logger = createLogger('WebsiteGenerator');

export class WebsiteGenerator {
  /**
   * Generate a complete website for a client
   */
  async generateWebsite(clientId: string, clientData: ClientData): Promise<string> {
    logger.info('Generating website files', { clientId });

    const { info, branding, collectorInfo } = clientData;
    const structure = collectorInfo?.webStructure;

    if (!structure) {
      logger.warn('No web structure found for client, using defaults');
    }

    const primaryColor = branding.colors.primary || '#3b82f6';
    const secondaryColor = branding.colors.secondary || '#1d4ed8';
    const businessName = info.businessName;

    // 1. Generate index.html
    const html = this.generateHTML(clientData);
    
    // 2. Save file
    const websiteDir = 'exports';
    const filePath = await fileManager.saveAsset(clientId, websiteDir, 'website/index.html', html);

    // 3. Save a simple CSS file if needed (or include in HTML)
    
    logger.success('Website generated successfully', { filePath });
    
    return path.dirname(filePath);
  }

  /**
   * Generate landing page HTML
   */
  private generateHTML(clientData: ClientData): string {
    const { info, branding, collectorInfo, assets } = clientData;
    const structure = collectorInfo?.webStructure;
    const primaryColor = branding.colors.primary || '#3b82f6';
    const secondaryColor = branding.colors.secondary || '#1d4ed8';
    const businessName = info.businessName;
    const tagline = structure?.tagline || `Expert ${info.businessType} services`;

    const sections = structure?.sections || [];
    const products = structure?.products || [];

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} | ${tagline}</title>
    <meta name="description" content="${assets?.seo?.description || tagline}">
    <meta name="keywords" content="${assets?.seo?.keywords?.join(', ') || ''}">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: ${primaryColor};
            --secondary: ${secondaryColor};
            --text: #1f2937;
            --bg: #ffffff;
            --bg-alt: #f9fafb;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            color: var(--text);
            line-height: 1.6;
            background: var(--bg);
            overflow-x: hidden;
        }
        
        h1, h2, h3, .font-heading {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        /* Header */
        header {
            padding: 1.5rem 0;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: var(--text);
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: var(--primary);
        }
        
        /* Hero */
        .hero {
            padding: 8rem 0 6rem;
            text-align: center;
            background: radial-gradient(circle at top right, var(--primary)05, transparent),
                        radial-gradient(circle at bottom left, var(--secondary)05, transparent);
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: #4b5563;
            max-width: 700px;
            margin: 0 auto 2.5rem;
            font-weight: 300;
        }
        
        .btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 99px;
            font-weight: 600;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            background: var(--secondary);
        }
        
        /* Sections */
        section {
            padding: 6rem 0;
        }
        
        section:nth-child(even) {
            background: var(--bg-alt);
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        
        .section-header h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .section-header p {
            color: #6b7280;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Products Grid */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .card {
            background: white;
            padding: 2.5rem;
            border-radius: 2rem;
            border: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .card p {
            font-size: 0.95rem;
            color: #6b7280;
            margin-bottom: 1.5rem;
        }
        
        .card ul {
            list-style: none;
            margin-top: 1rem;
        }
        
        .card li {
            padding-left: 1.5rem;
            position: relative;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .card li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: bold;
        }
        
        /* Footer */
        footer {
            padding: 4rem 0;
            background: #0f172a;
            color: white;
            text-align: center;
        }
        
        .footer-logo {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            display: block;
        }
        
        .footer-info {
            color: #94a3b8;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <a href="#" class="logo">${businessName}</a>
                <div class="nav-links">
                    <a href="#services">Servicios</a>
                    <a href="#about">Nosotros</a>
                    <a href="#contact">Contacto</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>${businessName}</h1>
                <p>${tagline}</p>
                <a href="#contact" class="btn">Comenzar Ahora</a>
            </div>
        </section>

        <section id="services">
            <div class="container">
                <div class="section-header">
                    <h2>Nuestros Servicios</h2>
                    <p>Soluciones profesionales diseñadas para potenciar tu éxito.</p>
                </div>
                
                <div class="grid">
                    ${products.map((p: any) => `
                        <div class="card ${p.highlighted ? 'highlight' : ''}">
                            <h3>${p.name}</h3>
                            <p>${p.description}</p>
                            <ul>
                                ${p.features.map((f: any) => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section id="about">
            <div class="container">
                <div class="grid" style="align-items: center;">
                    <div>
                        <h2>Sobre ${businessName}</h2>
                        <p style="margin-top: 1.5rem;">${sections.find((s: any) => s.id === 'about')?.content || 'Somos un equipo dedicado a brindar la mejor experiencia a nuestros clientes, enfocados en la calidad y la innovación constante.'}</p>
                    </div>
                    <div style="background: var(--primary)10; height: 400px; border-radius: 3rem; display: flex; items-center; justify-center; font-size: 5rem;">
                        🏢
                    </div>
                </div>
            </div>
        </section>

        <section id="contact">
            <div class="container">
                <div class="section-header">
                    <h2>¿Listo para empezar?</h2>
                    <p>Contáctanos hoy mismo y descubre cómo podemos ayudarte.</p>
                </div>
                
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 3rem; border-radius: 2rem; box-shadow: 0 30px 60px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
                        <p>${info.email || 'contacto@' + businessName.toLowerCase().replace(/\s+/g, '') + '.com'}</p>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Teléfono</label>
                        <p>${info.phone}</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <span class="footer-logo">${businessName}</span>
            <p class="footer-info">© ${new Date().getFullYear()} ${businessName}. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>`;
  }
}

export const websiteGenerator = new WebsiteGenerator();
