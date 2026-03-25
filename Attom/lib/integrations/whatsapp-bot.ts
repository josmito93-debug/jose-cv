import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { v4 as uuidv4 } from 'uuid';
import { ClientData, ClientInfoSchema, BrandingSchema, ProductServiceSchema } from '../types/client';
import { createLogger } from '../utils/logger';
import { fileManager } from '../utils/file-manager';

const logger = createLogger('WhatsAppBot');

interface ConversationState {
  clientId: string;
  step: string;
  data: Partial<ClientData>;
}

export class WhatsAppBot {
  private client: Client;
  private conversations: Map<string, ConversationState> = new Map();

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.setupHandlers();
  }

  /**
   * Initialize WhatsApp bot
   */
  async initialize(): Promise<void> {
    logger.info('Initializing WhatsApp bot');

    this.client.on('qr', (qr) => {
      logger.info('Scan QR code to authenticate');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      logger.success('WhatsApp bot is ready!');
    });

    this.client.on('authenticated', () => {
      logger.success('WhatsApp authenticated');
    });

    await this.client.initialize();
  }

  /**
   * Setup message handlers
   */
  private setupHandlers(): void {
    this.client.on('message', async (message) => {
      try {
        const from = message.from;
        const text = message.body.trim();

        // Ignore group messages
        if (message.from.includes('@g.us')) {
          return;
        }

        logger.info('Received message', { from, text: text.substring(0, 50) });

        // Handle commands
        if (text.toLowerCase() === '/start' || text.toLowerCase() === 'hola') {
          await this.startConversation(from, message);
        } else if (text.toLowerCase() === '/cancel') {
          await this.cancelConversation(from, message);
        } else {
          await this.handleConversation(from, text, message);
        }
      } catch (error) {
        logger.error('Error handling message', error);
      }
    });
  }

  /**
   * Start new client conversation
   */
  private async startConversation(from: string, message: any): Promise<void> {
    const clientId = uuidv4();

    this.conversations.set(from, {
      clientId,
      step: 'business_name',
      data: {
        info: {
          clientId,
          businessName: '',
          contactName: '',
          phone: from,
          businessType: 'other',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        branding: {
          colors: {
            primary: '#000000',
          },
        },
        payment: {
          method: 'pago_movil',
          status: 'pending',
          amount: 0,
          currency: 'USD',
        },
        deployment: {
          status: 'not_started',
        },
      } as Partial<ClientData>,
    });

    await message.reply(
      `¡Hola! 👋 Soy Attom, tu asistente para crear páginas web.\n\n` +
      `Voy a recolectar información sobre tu negocio para crear tu sitio web personalizado.\n\n` +
      `**Pregunta 1 de 8:**\n` +
      `¿Cuál es el nombre de tu negocio? 🏢`
    );

    logger.info('Started new conversation', { from, clientId });
  }

  /**
   * Handle conversation flow
   */
  private async handleConversation(from: string, text: string, message: any): Promise<void> {
    const state = this.conversations.get(from);

    if (!state) {
      await message.reply(
        'No tengo una conversación activa contigo. Envía /start para comenzar. 🚀'
      );
      return;
    }

    const { step, data, clientId } = state;

    switch (step) {
      case 'business_name':
        data.info!.businessName = text;
        state.step = 'contact_name';
        await message.reply(
          `Perfecto, "${text}" es un gran nombre! ✨\n\n` +
          `**Pregunta 2 de 8:**\n` +
          `¿Cuál es tu nombre completo? 👤`
        );
        break;

      case 'contact_name':
        data.info!.contactName = text;
        state.step = 'email';
        await message.reply(
          `Mucho gusto, ${text}! 😊\n\n` +
          `**Pregunta 3 de 8:**\n` +
          `¿Cuál es tu email? 📧`
        );
        break;

      case 'email':
        data.info!.email = text;
        state.step = 'business_type';
        await message.reply(
          `Excelente! 👍\n\n` +
          `**Pregunta 4 de 8:**\n` +
          `¿Qué tipo de negocio tienes?\n\n` +
          `1️⃣ Restaurante\n` +
          `2️⃣ Tienda Online (E-commerce)\n` +
          `3️⃣ Portafolio Personal\n` +
          `4️⃣ Blog\n` +
          `5️⃣ Empresa Corporativa\n` +
          `6️⃣ Landing Page\n` +
          `7️⃣ Otro\n\n` +
          `Responde con el número (1-7) 🔢`
        );
        break;

      case 'business_type':
        const typeMap: Record<string, string> = {
          '1': 'restaurant',
          '2': 'ecommerce',
          '3': 'portfolio',
          '4': 'blog',
          '5': 'corporate',
          '6': 'landing',
          '7': 'other',
        };
        data.info!.businessType = typeMap[text] || 'other';
        state.step = 'primary_color';
        await message.reply(
          `Genial! 🎯\n\n` +
          `**Pregunta 5 de 8:**\n` +
          `¿Cuál es el color principal de tu marca?\n` +
          `Ejemplo: #FF5733 o "rojo" 🎨`
        );
        break;

      case 'primary_color':
        data.branding!.colors.primary = text.startsWith('#') ? text : `#${text}`;
        state.step = 'preferences';
        await message.reply(
          `Me encanta ese color! 🌈\n\n` +
          `**Pregunta 6 de 8:**\n` +
          `¿Tienes alguna preferencia de diseño? (moderno, minimalista, elegante, etc.)\n` +
          `O escribe "ninguna" para continuar. ✨`
        );
        break;

      case 'preferences':
        if (text.toLowerCase() !== 'ninguna') {
          data.branding!.preferences = text;
        }
        state.step = 'products';
        await message.reply(
          `Perfecto! 👌\n\n` +
          `**Pregunta 7 de 8:**\n` +
          `¿Cuáles son tus productos o servicios principales?\n` +
          `Escríbelos separados por comas.\n` +
          `Ejemplo: Pizza, Pasta, Ensaladas 🍕`
        );
        break;

      case 'products':
        if (text.toLowerCase() !== 'ninguno') {
          const products = text.split(',').map(p => ({
            name: p.trim(),
            description: '',
          }));
          data.products = products;
        }
        state.step = 'payment_amount';
        await message.reply(
          `Excelente! 🎉\n\n` +
          `**Pregunta 8 de 8:**\n` +
          `¿Cuál es el presupuesto para tu página web (en USD)?\n` +
          `Ejemplo: 500 💰`
        );
        break;

      case 'payment_amount':
        const amount = parseFloat(text);
        if (isNaN(amount)) {
          await message.reply('Por favor ingresa un número válido. Ejemplo: 500');
          return;
        }
        data.payment!.amount = amount;

        // Save client data
        await this.saveClientData(clientId, data as ClientData);

        await message.reply(
          `¡Listo! ✅ Hemos recolectado toda la información.\n\n` +
          `**Resumen:**\n` +
          `🏢 Negocio: ${data.info!.businessName}\n` +
          `👤 Contacto: ${data.info!.contactName}\n` +
          `📧 Email: ${data.info!.email}\n` +
          `🎨 Color: ${data.branding!.colors.primary}\n` +
          `💰 Presupuesto: $${amount} USD\n\n` +
          `Ahora voy a:\n` +
          `1️⃣ Generar wireframes de tu sitio\n` +
          `2️⃣ Crear imágenes personalizadas\n` +
          `3️⃣ Optimizar SEO\n` +
          `4️⃣ Subir todo a Google Drive\n` +
          `5️⃣ Preparar tu página de pago\n\n` +
          `Te notificaré cuando todo esté listo! 🚀`
        );

        // Clear conversation
        this.conversations.delete(from);

        logger.success('Conversation completed', { clientId });
        break;
    }
  }

  /**
   * Cancel conversation
   */
  private async cancelConversation(from: string, message: any): Promise<void> {
    this.conversations.delete(from);
    await message.reply(
      'Conversación cancelada. Envía /start cuando quieras comenzar de nuevo. 👋'
    );
  }

  /**
   * Save client data
   */
  private async saveClientData(clientId: string, data: ClientData): Promise<void> {
    try {
      await fileManager.createClientDirectory(clientId);
      await fileManager.saveClientInfo(clientId, data);

      await fileManager.logAction(clientId, 'client-info-collected', {
        source: 'whatsapp',
        businessName: data.info.businessName,
      });

      logger.success('Client data saved', { clientId });
    } catch (error) {
      logger.error('Failed to save client data', error);
      throw error;
    }
  }

  /**
   * Send message to client
   */
  async sendMessage(phone: string, message: string): Promise<void> {
    try {
      const chatId = phone.includes('@') ? phone : `${phone}@c.us`;
      await this.client.sendMessage(chatId, message);
      logger.success('Message sent', { phone });
    } catch (error) {
      logger.error('Failed to send message', error);
      throw error;
    }
  }

  /**
   * Notify client when website is ready
   */
  async notifyClientWebsiteReady(clientData: ClientData): Promise<void> {
    try {
      const message =
        `🎉 ¡Tu página web está lista!\n\n` +
        `**${clientData.info.businessName}**\n\n` +
        `🌐 URL: ${clientData.deployment.hosting?.url}\n` +
        `📂 GitHub: ${clientData.deployment.github?.repoUrl}\n\n` +
        `Puedes ver todos los assets y hacer cambios desde tu dashboard.\n\n` +
        `¡Gracias por confiar en Attom! 🚀`;

      await this.sendMessage(clientData.info.phone, message);

      logger.success('Client notified', { clientId: clientData.info.clientId });
    } catch (error) {
      logger.error('Failed to notify client', error);
      throw error;
    }
  }
}

export const whatsappBot = new WhatsAppBot();
