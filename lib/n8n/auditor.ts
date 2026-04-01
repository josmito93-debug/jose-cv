import { ClientData, DependencySchema } from '../types/client';
import { createLogger } from '../utils/logger';
import { z } from 'zod';

const logger = createLogger('DependencyAuditor');

type Dependency = z.infer<typeof DependencySchema>;

export class DependencyAuditor {
  
  /**
   * Performs an active check on all configured dependencies for a client
   */
  async auditClient(client: ClientData): Promise<ClientData> {
    logger.info(`Auditing dependencies for client: ${client.info.businessName}`);
    
    if (!client.dependencies) client.dependencies = {};
    
    const updatedDeps = { ...client.dependencies };
    
    for (const [id, dep] of Object.entries(updatedDeps)) {
      if (dep.status === 'missing') continue;
      
      try {
        const result = await this.verifyDependency(dep);
        updatedDeps[id] = {
          ...dep,
          status: result.success ? 'verified' : 'error',
          error: result.error,
          lastCheckedAt: new Date().toISOString()
        };
      } catch (error: any) {
        updatedDeps[id] = {
          ...dep,
          status: 'error',
          error: error.message || 'Unknown verification error',
          lastCheckedAt: new Date().toISOString()
        };
      }
    }
    
    return {
      ...client,
      dependencies: updatedDeps
    };
  }

  /**
   * Verify a specific dependency based on its type
   */
  private async verifyDependency(dep: Dependency): Promise<{ success: boolean; error?: string }> {
    const config = dep.config || {};
    
    switch (dep.type) {
      case 'llm':
        return this.verifyLLM(config);
      case 'database':
        return this.verifyDatabase(config);
      case 'webhook':
        return this.verifyWebhook(config);
      default:
        return { success: true }; // Generic success for unknown types
    }
  }

  /**
   * Mock logic for LLM verification (e.g., OpenAI API Key check)
   */
  private async verifyLLM(config: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    const apiKey = config.apiKey || config.API_KEY;
    if (!apiKey) return { success: false, error: 'API Key missing' };
    
    // Simulate API ping
    if (apiKey.startsWith('sk-') || apiKey === 'AIzaSy...') {
      return { success: true };
    }
    
    return { success: false, error: 'Invalid API Key format' };
  }

  /**
   * Mock logic for Database verification (e.g., Supabase/Airtable check)
   */
  private async verifyDatabase(config: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    const url = config.url || config.BASE_ID;
    if (!url) return { success: false, error: 'Connection string/ID missing' };
    
    return { success: true };
  }

  /**
   * Mock logic for Webhook verification
   */
  private async verifyWebhook(config: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    const url = config.url || config.webhookUrl;
    if (!url) return { success: false, error: 'Webhook URL missing' };
    
    return { success: true };
  }
}

export const dependencyAuditor = new DependencyAuditor();
