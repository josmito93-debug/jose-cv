import { ClientData } from '../types/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('N8NArchitect');

export interface Blueprint {
  nodes: any[];
  connections: any;
}

export class N8NArchitect {
  
  /**
   * Conduct an audit of a client's readiness for automation
   */
  async auditClient(client: ClientData): Promise<{
    score: number;
    missing: string[];
    isReady: boolean;
  }> {
    const missing: string[] = [];
    let score = 0;

    // Check Core Info (25%)
    if (client.info.businessName) score += 10; else missing.push('Nombre del Negocio');
    if (client.info.businessType) score += 15; else missing.push('Tipo de Negocio');

    // Check Context (25%)
    if (client.products && client.products.length > 0) score += 25; 
    else missing.push('Catálogo de Productos/Servicios');

    // Check Branding (10%)
    if (client.branding?.colors?.primary) score += 10;
    else missing.push('Branding (Colores)');

    // Check Automation Specifics (40%)
    const deps = client.dependencies || {};
    
    // 1. Intelligence Dependency (LLM)
    const hasLLM = Object.values(deps).some(d => d.type === 'llm' && d.status === 'verified');
    if (hasLLM) score += 20; 
    else if (client.automation?.llmConfig) score += 10; // Partial score for config without verification
    else missing.push('Configuración LLM (OpenAI/Gemini)');

    // 2. Memory/Data Dependency
    const hasDB = Object.values(deps).some(d => d.type === 'database' && d.status === 'verified');
    if (hasDB) score += 10;
    else missing.push('Base de Datos (Vector DB/Airtable)');

    // 3. Execution Dependency (Webhook/Auth)
    const hasWebhook = Object.values(deps).some(d => d.type === 'webhook' && d.status === 'verified');
    if (hasWebhook) score += 10;

    // 4. Identity logic
    if (client.automation?.masterPrompt) score += 10;
    else missing.push('Master Prompt Personalizado');

    return {
      score: Math.min(score, 100),
      missing,
      isReady: score >= 80
    };
  }

  /**
   * Generates a Master Prompt tailored to the client's business
   */
  generateMasterPrompt(client: ClientData): string {
    const { info, branding, products } = client;
    const services = products?.map(p => `- ${p.name}: ${p.description}`).join('\n') || 'Información no disponible';

    return `Eres el Agente de Inteligencia Artificial oficial de ${info.businessName}.
    
    TONO Y PERSONALIDAD:
    - Eres profesional, servicial y experto en ${info.businessType}.
    - Tu identidad visual está basada en el color ${branding.colors.primary}.
    
    TUS SERVICIOS:
    ${services}
    
    TU MISIÓN:
    1. Atender dudas de clientes con precisión.
    2. Guiar a los usuarios hacia el cierre de citas o ventas.
    3. Mantener siempre la identidad de ${info.businessName}.
    
    REGLAS ESTRICTAS:
    - No inventes precios si no están en el catálogo.
    - Si no sabes algo, escala la conversación a un humano.
    - Sé conciso y directo, optimizado para WhatsApp.`;
  }

  /**
   * The "Perfect" Reasoning Engine: Maps a task to a high-quality n8n blueprint
   */
  async architectTask(taskSnippet: string, client: ClientData): Promise<Blueprint> {
    const task = taskSnippet.toLowerCase();
    const nodes: any[] = [];
    const connections: any = {};

    // 1. WEBHOOK Entry Point
    const webhook = this.createNode('n8n-nodes-base.webhook', 'Incoming Interaction', [100, 300], {
      path: `${client.info.clientId}-webhook`,
      httpMethod: 'POST',
      responseMode: 'onReceived'
    });
    nodes.push(webhook);

    // 2. REASONING PILLAR: Determine what we need
    const needsAI = task.includes('ai') || task.includes('chatbot') || task.includes('inteligencia');
    const needsDB = task.includes('base de datos') || task.includes('guardar') || task.includes('airtable');
    const needsCalendar = task.includes('cita') || task.includes('calendario') || task.includes('agenda');

    let lastNodeName = 'Incoming Interaction';

    if (needsAI) {
      // Add LangChain Agent Node
      const aiNode = this.createNode('n8n-nodes-langchain.agent', 'AI Oracle', [400, 300], {
        promptType: 'define',
        text: '={{$json.body.message}}',
        options: {
          systemMessage: this.generateMasterPrompt(client)
        }
      });
      nodes.push(aiNode);
      this.connectNodes(connections, lastNodeName, 'AI Oracle');
      lastNodeName = 'AI Oracle';
    }

    if (needsDB) {
      // Add Airtable Node
      const dbNode = this.createNode('n8n-nodes-base.airtable', 'Sync to CRM', [700, 300], {
        operation: 'append',
        baseId: '={{$env.AIRTABLE_BASE_ID}}',
        tableName: 'Interactions'
      });
      nodes.push(dbNode);
      this.connectNodes(connections, lastNodeName, 'Sync to CRM');
      lastNodeName = 'Sync to CRM';
    }

    if (needsCalendar) {
      // Add Google Calendar Node
      const calendarNode = this.createNode('n8n-nodes-base.googleCalendar', 'Schedule Appointment', [1000, 300], {
        operation: 'create',
        calendarId: 'primary'
      });
      nodes.push(calendarNode);
      this.connectNodes(connections, lastNodeName, 'Schedule Appointment');
    }

    return { nodes, connections };
  }

  private createNode(type: string, name: string, position: [number, number], parameters: any) {
    return {
      name,
      type,
      typeVersion: 1,
      position,
      parameters
    };
  }

  private connectNodes(connections: any, source: string, target: string) {
    if (!connections[source]) connections[source] = { main: [[]] };
    connections[source].main[0].push({
      node: target,
      type: 'main',
      index: 0
    });
  }

  /**
   * Deploys a blueprint to n8n Cloud
   */
  async deployToN8N(businessName: string, blueprint: Blueprint): Promise<string> {
    const apiToken = process.env.N8N_ACCESS_TOKEN;
    const apiUrl = process.env.N8N_API_URL;

    if (!apiToken || !apiUrl) {
      throw new Error('N8N credentials missing in environment');
    }

    const workflowName = `${businessName} - Autonomous Workflow`;

    try {
      logger.info(`Deploying workflow for ${businessName} to n8n...`);
      
      // 1. Check if workflow exists
      const listRes = await fetch(`${apiUrl}/workflows`, {
        headers: { 'X-N8N-API-KEY': apiToken }
      });
      
      const listData = await listRes.json();
      const existingWorkflow = listData.data?.find((w: any) => w.name === workflowName);

      const workflowPayload = {
        name: workflowName,
        nodes: blueprint.nodes,
        connections: blueprint.connections,
        active: true,
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          errorWorkflow: ''
        },
        staticData: null
      };

      if (existingWorkflow) {
        logger.info(`Updating existing workflow: ${existingWorkflow.id}`);
        // Update
        const updateRes = await fetch(`${apiUrl}/workflows/${existingWorkflow.id}`, {
          method: 'PUT',
          headers: { 
            'X-N8N-API-KEY': apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workflowPayload)
        });
        
        if (!updateRes.ok) {
           const errorData = await updateRes.json();
           throw new Error(`N8N Update Failed: ${errorData.message || updateRes.statusText}`);
        }
        
        logger.success(`Workflow updated successfully: ${existingWorkflow.id}`);
        return existingWorkflow.id;
      } else {
        logger.info(`Creating new workflow in n8n...`);
        // Create
        const createRes = await fetch(`${apiUrl}/workflows`, {
          method: 'POST',
          headers: { 
            'X-N8N-API-KEY': apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workflowPayload)
        });
        
        const createData = await createRes.json();
        if (!createRes.ok) {
           throw new Error(`N8N Creation Failed: ${createData.message || createRes.statusText}`);
        }
        
        logger.success(`Workflow created successfully: ${createData.id}`);
        return createData.id;
      }
    } catch (error) {
      logger.error('N8N Deployment Error:', error);
      throw error;
    }
  }
}

export const n8nArchitect = new N8NArchitect();
