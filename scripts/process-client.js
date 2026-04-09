#!/usr/bin/env node

/**
 * Attom - Process Single Client
 *
 * This script processes a single client through the complete workflow:
 * 1. Load client data
 * 2. Execute MCP Creative (wireframes, images, SEO, Drive)
 * 3. Sync to Airtable and Coda
 * 4. Generate payment template
 * 5. Wait for payment confirmation
 * 6. Execute MCP Operative (GitHub, Hosting)
 * 7. Notify client via WhatsApp
 */

require('dotenv').config();
const { fileManager } = require('../lib/utils/file-manager');
const { mcpCreative } = require('../lib/mcp-creative');
const { mcpOperative } = require('../lib/mcp-operative');
const { airtableCRM } = require('../lib/integrations/airtable-crm');
const { codaPM } = require('../lib/integrations/coda-pm');
const { whatsappBot } = require('../lib/integrations/whatsapp-bot');
const { createLogger } = require('../lib/utils/logger');

const logger = createLogger('ProcessClient');

async function processClient(clientId, options = {}) {
  try {
    logger.info(`Starting client processing workflow`, { clientId });

    // Step 1: Load client data
    logger.info('Step 1: Loading client data');
    const clientData = await fileManager.loadClientInfo(clientId);

    logger.info('Client data loaded', {
      businessName: clientData.info.businessName,
      contactName: clientData.info.contactName,
    });

    // Step 2: Execute MCP Creative
    logger.info('Step 2: Executing MCP Creative workflow');
    const updatedData = await mcpCreative.execute(clientData);

    // Step 3: Sync to Airtable
    logger.info('Step 3: Syncing to Airtable CRM');
    const airtableRecordId = await airtableCRM.syncClient(updatedData);
    updatedData.airtableRecordId = airtableRecordId;
    await fileManager.updateClientInfo(clientId, updatedData);

    // Step 4: Sync to Coda
    logger.info('Step 4: Syncing to Coda Project Management');
    const codaRowId = await codaPM.syncClient(updatedData);
    updatedData.codaRowId = codaRowId;
    await fileManager.updateClientInfo(clientId, updatedData);

    // Step 5: Generate payment template
    logger.info('Step 5: Generating payment template');
    const paymentTemplatePath = await mcpOperative.createPaymentTemplate(
      updatedData,
      updatedData.payment.amount
    );

    logger.info('Payment template generated', { path: paymentTemplatePath });

    // Step 6: Check payment status
    if (updatedData.payment.status === 'completed' || options.skipPayment) {
      logger.info('Payment confirmed, proceeding with deployment');

      // Step 7: Execute MCP Operative
      logger.info('Step 6: Executing MCP Operative workflow');

      // Generate website files (placeholder - in production you'd have a website generator)
      const websiteDir = `./data/${clientId}/exports/website`;

      const finalData = await mcpOperative.execute(updatedData, websiteDir, {
        skipPayment: options.skipPayment,
        domain: options.domain,
      });

      // Step 8: Update Airtable and Coda with final status
      logger.info('Step 7: Updating CRM with final status');
      await airtableCRM.syncClient(finalData);
      await codaPM.syncClient(finalData);

      // Step 9: Notify client via WhatsApp
      if (!options.skipNotification) {
        logger.info('Step 8: Notifying client via WhatsApp');
        await whatsappBot.notifyClientWebsiteReady(finalData);
      }

      logger.success('✅ Client processing completed successfully!', {
        clientId,
        businessName: finalData.info.businessName,
        websiteUrl: finalData.deployment.hosting?.url,
        githubRepo: finalData.deployment.github?.repoUrl,
      });

      return finalData;
    } else {
      logger.warn('⏳ Payment pending. Complete payment to proceed with deployment.', {
        clientId,
        paymentStatus: updatedData.payment.status,
        amount: updatedData.payment.amount,
      });

      return updatedData;
    }
  } catch (error) {
    logger.error('❌ Client processing failed', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node scripts/process-client.js <clientId> [options]

Options:
  --skip-payment      Skip payment verification
  --skip-notification Skip WhatsApp notification
  --domain=<domain>   Set custom domain

Example:
  node scripts/process-client.js abc123-def456
  node scripts/process-client.js abc123-def456 --skip-payment --domain=example.com
    `);
    process.exit(1);
  }

  const clientId = args[0];
  const options = {
    skipPayment: args.includes('--skip-payment'),
    skipNotification: args.includes('--skip-notification'),
    domain: args.find(arg => arg.startsWith('--domain='))?.split('=')[1],
  };

  processClient(clientId, options)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { processClient };
