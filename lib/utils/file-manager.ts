import fs from 'fs/promises';
import path from 'path';
import { ClientData } from '../types/client';

export class FileManager {
  private dataDir: string;

  constructor(baseDir: string = './data') {
    this.dataDir = baseDir;
  }

  /**
   * Create client directory structure
   */
  async createClientDirectory(clientId: string): Promise<string> {
    const clientPath = path.join(this.dataDir, clientId);

    await fs.mkdir(clientPath, { recursive: true });
    await fs.mkdir(path.join(clientPath, 'assets'), { recursive: true });
    await fs.mkdir(path.join(clientPath, 'wireframes'), { recursive: true });
    await fs.mkdir(path.join(clientPath, 'images'), { recursive: true });
    await fs.mkdir(path.join(clientPath, 'exports'), { recursive: true });

    return clientPath;
  }

  /**
   * Save client info to JSON file
   */
  async saveClientInfo(clientId: string, data: ClientData): Promise<string> {
    const clientPath = path.join(this.dataDir, clientId);
    const infoPath = path.join(clientPath, 'info.json');

    await fs.writeFile(infoPath, JSON.stringify(data, null, 2), 'utf-8');

    return infoPath;
  }

  /**
   * Load client info from JSON file
   */
  async loadClientInfo(clientId: string): Promise<ClientData> {
    const infoPath = path.join(this.dataDir, clientId, 'info.json');
    const content = await fs.readFile(infoPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Update client info
   */
  async updateClientInfo(
    clientId: string,
    updates: Partial<ClientData>
  ): Promise<ClientData> {
    const currentData = await this.loadClientInfo(clientId);
    const updatedData = {
      ...currentData,
      ...updates,
      info: {
        ...currentData.info,
        updatedAt: new Date().toISOString()
      }
    };

    await this.saveClientInfo(clientId, updatedData);
    return updatedData;
  }

  /**
   * Get all client IDs
   */
  async getAllClientIds(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.dataDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Save asset file
   */
  async saveAsset(
    clientId: string,
    assetType: 'wireframes' | 'images' | 'exports',
    fileName: string,
    content: Buffer | string
  ): Promise<string> {
    const assetPath = path.join(this.dataDir, clientId, assetType, fileName);
    await fs.writeFile(assetPath, content);
    return assetPath;
  }

  /**
   * Create logs
   */
  async logAction(
    clientId: string,
    action: string,
    details: any
  ): Promise<void> {
    const logPath = path.join(this.dataDir, clientId, 'logs.json');

    let logs = [];
    try {
      const content = await fs.readFile(logPath, 'utf-8');
      logs = JSON.parse(content);
    } catch (error) {
      // File doesn't exist yet
    }

    logs.push({
      timestamp: new Date().toISOString(),
      action,
      details
    });

    await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');
  }
}

export const fileManager = new FileManager();
