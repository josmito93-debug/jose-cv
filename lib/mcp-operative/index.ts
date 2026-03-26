import { ClientData } from '../types/client';
import { paymentProcessor } from './payment-processor';
import { githubManager } from './github-manager';
import { hostingManager } from './hosting-manager';
import { fileManager } from '../utils/file-manager';
import { createLogger } from '../utils/logger';

const logger = createLogger('MCP-Operative');

/**
 * MCP Operative - Handles all operational tasks:
 * - Payment processing (Pago Móvil / Stripe)
 * - GitHub repository creation and file upload
 * - Hosting deployment (Hostinger / GitHub Pages)
 * - Domain and SSL configuration
 */
export class MCPOperative {
  /**
   * Execute complete operative workflow
   */
  async execute(
    clientData: ClientData,
    websiteDir: string,
    options?: {
      skipPayment?: boolean;
      domain?: string;
    }
  ): Promise<ClientData> {
    logger.info('Starting MCP Operative workflow', { clientId: clientData.info.clientId });

    try {
      // Step 1: Verify Payment (if not skipped)
      if (!options?.skipPayment && clientData.payment.status !== 'completed') {
        logger.warn('Payment not completed, skipping deployment');
        throw new Error('Payment must be completed before deployment');
      }

      logger.info('Payment verified, proceeding with deployment');

      // Step 2: Create GitHub Repository
      logger.info('Step 1: Creating GitHub repository');
      const { repoUrl, cloneUrl } = await githubManager.createRepository(clientData);

      // Step 3: Upload Website Files to GitHub
      logger.info('Step 2: Uploading website files to GitHub');
      await githubManager.uploadFiles(clientData, websiteDir);

      // Step 4: Enable GitHub Pages (optional)
      try {
        const pagesUrl = await githubManager.enableGitHubPages(clientData);
        logger.info('GitHub Pages enabled', { pagesUrl });
      } catch (error) {
        logger.warn('Could not enable GitHub Pages (may already be enabled)', error);
      }

      // Step 5: Deploy to Hosting Provider
      logger.info('Step 3: Deploying to hosting provider');
      const { url: hostingUrl, provider } = await hostingManager.deploy(
        clientData,
        websiteDir,
        options?.domain
      );

      // Step 6: Configure SSL (if custom domain)
      if (options?.domain && provider === 'hostinger') {
        logger.info('Step 4: Configuring SSL certificate');
        await hostingManager.configureSSL(clientData, options.domain);
      }

      // Update deployment status
      clientData.deployment.status = 'completed';
      clientData.deployment.deployedAt = new Date().toISOString();

      await fileManager.updateClientInfo(clientData.info.clientId, clientData);

      // Log action
      await fileManager.logAction(clientData.info.clientId, 'mcp-operative-completed', {
        githubRepo: repoUrl,
        hostingUrl,
        provider,
        domain: options?.domain,
      });

      logger.success('MCP Operative workflow completed successfully', {
        githubRepo: repoUrl,
        hostingUrl,
      });

      return clientData;
    } catch (error) {
      logger.error('MCP Operative workflow failed', error);

      clientData.deployment.status = 'failed';
      await fileManager.updateClientInfo(clientData.info.clientId, clientData);

      await fileManager.logAction(clientData.info.clientId, 'mcp-operative-failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Generate and save payment template
   */
  async createPaymentTemplate(clientData: ClientData, amount: number): Promise<string> {
    try {
      logger.info('Generating payment template', { clientId: clientData.info.clientId });

      const template = paymentProcessor.generatePaymentTemplate(clientData, amount);

      const fileName = 'payment.html';
      const filePath = await fileManager.saveAsset(
        clientData.info.clientId,
        'exports',
        fileName,
        template
      );

      logger.success('Payment template generated', { filePath });

      return filePath;
    } catch (error) {
      logger.error('Failed to generate payment template', error);
      throw error;
    }
  }
}

export const mcpOperative = new MCPOperative();
