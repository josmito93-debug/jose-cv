import { Octokit } from 'octokit';
import { ClientData } from '../types/client';

export interface GitHubRepository {
  name: string;
  description: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
}

export interface GitHubDeployment {
  url: string;
  status: string;
  environment: string;
}

export class GitHubManager {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('GitHub token not configured');
    }

    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Create a new repository for a client
   */
  async createClientRepository(clientData: ClientData): Promise<GitHubRepository> {
    try {
      const repoName = this.generateRepoName(clientData.info.businessName);
      const description = `Website for ${clientData.info.businessName} - Client: ${clientData.info.contactName}`;

      const response = await this.octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description,
        private: false,
        auto_init: true,
        gitignore_template: 'Next.js',
        license_template: 'mit',
      });

      const repo = response.data;
      
      // Initialize with basic template
      await this.initializeRepository(repo.owner.login, repo.name, clientData);

      return {
        name: repo.name,
        description: repo.description || '',
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        default_branch: repo.default_branch,
      };
    } catch (error) {
      console.error('Failed to create repository:', error);
      throw new Error(`Repository creation failed: ${error}`);
    }
  }

  /**
   * Initialize repository with template structure
   */
  private async initializeRepository(owner: string, repo: string, clientData: ClientData): Promise<void> {
    try {
      // Create basic file structure
      const files = await this.generateTemplateFiles(clientData);

      for (const file of files) {
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: file.path,
          message: `Initial commit: Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64'),
        });
      }

      // Set up GitHub Pages
      await this.enableGitHubPages(owner, repo);
    } catch (error) {
      console.error('Failed to initialize repository:', error);
      throw error;
    }
  }

  /**
   * Generate template files based on client business type
   */
  private async generateTemplateFiles(clientData: any): Promise<Array<{path: string; content: string}>> {
    const businessType = clientData.info.businessType.toLowerCase();
    const primaryColor = clientData.branding.colors.primary || '#6366f1';

    const baseFiles = [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: clientData.info.businessName.replace(/\s+/g, '-').toLowerCase(),
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint',
          },
          dependencies: {
            next: '^14.0.0',
            react: '^18.0.0',
            'react-dom': '^18.0.0',
            'tailwindcss': '^3.0.0',
          },
          devDependencies: {
            '@types/node': '^20.0.0',
            '@types/react': '^18.0.0',
            '@types/react-dom': '^18.0.0',
            eslint: '^8.0.0',
            'eslint-config-next': '^14.0.0',
            typescript: '^5.0.0',
          },
        }, null, 2),
      },
      {
        path: 'tailwind.config.js',
        content: `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${primaryColor}',
      },
    },
  },
  plugins: [],
}
        `.trim(),
      },
      {
        path: 'next.config.js',
        content: `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
        `.trim(),
      },
      {
        path: 'app/layout.tsx',
        content: `
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${clientData.info.businessName}',
  description: '${this.generateBusinessDescription(clientData)}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
        `.trim(),
      },
      {
        path: 'app/page.tsx',
        content: this.generateHomePage(clientData),
      },
      {
        path: 'app/globals.css',
        content: this.generateGlobalStyles(clientData),
      },
    ];

    // Add business-specific pages
    const businessPages = this.generateBusinessPages(clientData);
    baseFiles.push(...businessPages);

    return baseFiles;
  }

  /**
   * Generate home page content based on client data
   */
  private generateHomePage(clientData: ClientData): string {
    const { info, branding, assets } = clientData;
    const primaryColor = branding.colors.primary || '#6366f1';
    const secondaryColor = branding.colors.secondary || '#8b5cf6';

    return `
'use client';

import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '${primaryColor}' }}>
                ${info.businessName}
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-gray-900">Services</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
            </nav>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span style={{ color: '${primaryColor}' }}>Professional ${info.businessType}</span>
            <br />
            <span className="text-gray-900">Excellence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ${this.generateBusinessDescription(info)}
          </p>
          <button 
            className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '${primaryColor}' }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            ${this.generateServiceCards(info)}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p><strong>Phone:</strong> ${info.phone}</p>
              ${info.email ? `<p><strong>Email:</strong> ${info.email}</p>` : ''}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 ${info.businessName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
    `.trim();
  }

  /**
   * Generate business-specific pages
   */
  private generateBusinessPages(clientData: ClientData): Array<{path: string; content: string}> {
    const businessType = clientData.info.businessType.toLowerCase();
    
    switch (businessType) {
      case 'restaurant':
        return [
          {
            path: 'app/menu/page.tsx',
            content: this.generateRestaurantMenuPage(clientData),
          },
        ];
      case 'retail':
        return [
          {
            path: 'app/products/page.tsx',
            content: this.generateProductsPage(clientData),
          },
        ];
      default:
        return [
          {
            path: 'app/services/page.tsx',
            content: this.generateServicesPage(clientData),
          },
        ];
    }
  }

  /**
   * Helper methods for generating page content
   */
  private generateBusinessDescription(clientData: ClientData['info']): string {
    return `Professional ${clientData.businessType} services in your area. Quality, reliability, and customer satisfaction guaranteed.`;
  }

  private generateServiceCards(info: ClientData['info']): string {
    return `
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Service 1</h3>
              <p className="text-gray-600">Description of first service</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Service 2</h3>
              <p className="text-gray-600">Description of second service</p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Service 3</h3>
              <p className="text-gray-600">Description of third service</p>
            </div>
    `.trim();
  }

  private generateRestaurantMenuPage(clientData: ClientData): string {
    return `
export default function Menu() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Menu</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Appetizers</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Appetizer 1</span>
                <span>$12.99</span>
              </div>
              <div className="flex justify-between">
                <span>Appetizer 2</span>
                <span>$14.99</span>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Main Courses</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Main Course 1</span>
                <span>$24.99</span>
              </div>
              <div className="flex justify-between">
                <span>Main Course 2</span>
                <span>$26.99</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
    `.trim();
  }

  private generateProductsPage(clientData: ClientData): string {
    return `
export default function Products() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Product 1</h3>
              <p className="text-gray-600 mb-4">Product description</p>
              <p className="text-2xl font-bold">$29.99</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Product 2</h3>
              <p className="text-gray-600 mb-4">Product description</p>
              <p className="text-2xl font-bold">$39.99</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Product 3</h3>
              <p className="text-gray-600 mb-4">Product description</p>
              <p className="text-2xl font-bold">$49.99</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    `.trim();
  }

  private generateServicesPage(clientData: ClientData): string {
    return `
export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        
        <div className="space-y-8">
          <div className="border-l-4 border-blue-500 pl-8">
            <h3 className="text-2xl font-semibold mb-2">Service 1</h3>
            <p className="text-gray-600">Detailed description of service 1</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-8">
            <h3 className="text-2xl font-semibold mb-2">Service 2</h3>
            <p className="text-gray-600">Detailed description of service 2</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-8">
            <h3 className="text-2xl font-semibold mb-2">Service 3</h3>
            <p className="text-gray-600">Detailed description of service 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
    `.trim();
  }

  private generateGlobalStyles(clientData: ClientData): string {
    return `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: ${clientData.branding.colors.primary || '#6366f1'};
    --secondary: ${clientData.branding.colors.secondary || '#8b5cf6'};
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity;
    background-color: var(--primary);
  }
  
  .btn-secondary {
    @apply px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity;
    background-color: var(--secondary);
  }
}
    `.trim();
  }

  /**
   * Enable GitHub Pages for the repository
   */
  private async enableGitHubPages(owner: string, repo: string): Promise<void> {
    try {
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: '.github/workflows/deploy.yml',
        message: 'Add GitHub Pages deployment workflow',
        content: Buffer.from(`
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        `).toString('base64'),
      });
    } catch (error) {
      console.error('Failed to enable GitHub Pages:', error);
    }
  }

  /**
   * Deploy repository to GitHub Pages
   */
  async deployToGitHubPages(owner: string, repo: string): Promise<GitHubDeployment> {
    try {
      // Trigger deployment by creating a deployment
      const deployment = await this.octokit.rest.repos.createDeployment({
        owner,
        repo,
        ref: 'main',
        environment: 'github-pages',
        description: 'Deploy to GitHub Pages',
      });

      return {
        url: `https://${owner}.github.io/${repo}`,
        status: 'success',
        environment: 'github-pages',
      };
    } catch (error) {
      console.error('Failed to deploy:', error);
      throw new Error(`Deployment failed: ${error}`);
    }
  }

  /**
   * Get repository status and deployment info
   */
  async getRepositoryStatus(owner: string, repo: string): Promise<{
    repo: any;
    deployments: any[];
    pagesEnabled: boolean;
  }> {
    try {
      const [repoData, deployments] = await Promise.all([
        this.octokit.rest.repos.get({ owner, repo }),
        this.octokit.rest.repos.listDeployments({ owner, repo }),
      ]);

      const pagesEnabled = await this.checkPagesEnabled(owner, repo);

      return {
        repo: repoData.data,
        deployments: deployments.data,
        pagesEnabled,
      };
    } catch (error) {
      console.error('Failed to get repository status:', error);
      throw error;
    }
  }

  /**
   * Check if GitHub Pages is enabled
   */
  private async checkPagesEnabled(owner: string, repo: string): Promise<boolean> {
    try {
      const pages = await this.octokit.rest.repos.getPages({ owner, repo });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate repository name from business name
   */
  private generateRepoName(businessName: string): string {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 39); // GitHub limit
  }
}