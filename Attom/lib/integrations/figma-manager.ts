export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: Array<{
    type: string;
    color?: { r: number; g: number; b: number; a: number };
    visible?: boolean;
  }>;
  strokes?: Array<{
    type: string;
    color?: { r: number; g: number; b: number; a: number };
    visible?: boolean;
    weight?: number;
  }>;
  effects?: Array<{
    type: string;
    visible?: boolean;
    radius?: number;
    color?: { r: number; g: number; b: number; a: number };
    offset?: { x: number; y: number };
  }>;
  cornerRadius?: number;
  fontSize?: number;
  fontWeight?: number;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  characters?: string;
  lineHeightPercent?: number;
  letterSpacing?: number;
}

export interface FigmaFile {
  name: string;
  document: FigmaNode;
  components?: { [key: string]: FigmaNode };
  styles?: { [key: string]: any };
  schemaVersion: number;
  lastModified: string;
  thumbnailUrl: string;
}

export interface FigmaImage {
  url: string;
  width: number;
  height: number;
}

export interface FigmaComponent {
  id: string;
  name: string;
  description: string;
  node: FigmaNode;
  category: 'layout' | 'ui' | 'icons' | 'images' | 'typography';
  exportable: boolean;
}

export interface FigmaStyle {
  id: string;
  name: string;
  description: string;
  style_type: 'FILL' | 'STROKE' | 'EFFECT' | 'TEXT' | 'GRID';
  value: any;
}

export class FigmaManager {
  private accessToken: string;
  private teamId?: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.FIGMA_ACCESS_TOKEN || '';
    this.teamId = process.env.FIGMA_TEAM_ID;
    
    if (!this.accessToken) {
      throw new Error('Figma access token not configured');
    }
  }

  /**
   * Get file by ID or URL
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    const url = `${this.baseUrl}/files/${fileKey}`;
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma file: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get file images for specified nodes
   */
  async getFileImages(fileKey: string, nodeIds: string[], format: 'png' | 'jpg' | 'svg' = 'png', scale: number = 2): Promise<{ [key: string]: string }> {
    const ids = nodeIds.join(',');
    const url = `${this.baseUrl}/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma images: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Extract design system from Figma file
   */
  async extractDesignSystem(fileKey: string): Promise<{
    colors: Array<{ name: string; value: string; type: string }>;
    typography: Array<{ name: string; fontSize: number; fontWeight: string; fontFamily: string }>;
    components: FigmaComponent[];
    spacing: Array<{ name: string; value: number }>;
    effects: Array<{ name: string; type: string; value: any }>;
  }> {
    const file = await this.getFile(fileKey);
    const document = file.document;

    const colors = this.extractColors(document);
    const typography = this.extractTypography(document);
    const components = this.extractComponents(document);
    const spacing = this.extractSpacing(document);
    const effects = this.extractEffects(document);

    return {
      colors,
      typography,
      components,
      spacing,
      effects,
    };
  }

  /**
   * Extract color palette from Figma document
   */
  private extractColors(node: FigmaNode): Array<{ name: string; value: string; type: string }> {
    const colors: Array<{ name: string; value: string; type: string }> = [];

    const traverse = (node: FigmaNode, parentName: string = '') => {
      if (node.name && node.fills && node.fills.length > 0) {
        node.fills.forEach((fill, index) => {
          if (fill.type === 'SOLID' && fill.visible !== false && fill.color) {
            const r = Math.round(fill.color.r * 255);
            const g = Math.round(fill.color.g * 255);
            const b = Math.round(fill.color.b * 255);
            const a = fill.color.a || 1;
            
            const hex = this.rgbToHex(r, g, b, a);
            const name = node.name.toLowerCase().includes('color') ? node.name : `${parentName}/${node.name}`;
            
            colors.push({
              name: name.replace(/\s+/g, '-').toLowerCase(),
              value: hex,
              type: this.getColorCategory(node.name),
            });
          }
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child, node.name));
      }
    };

    traverse(node);
    return this.deduplicateColors(colors);
  }

  /**
   * Extract typography styles from Figma document
   */
  private extractTypography(node: FigmaNode): Array<{ name: string; fontSize: number; fontWeight: string; fontFamily: string }> {
    const typography: Array<{ name: string; fontSize: number; fontWeight: string; fontFamily: string }> = [];

    const traverse = (node: FigmaNode) => {
      if (node.type === 'TEXT' && node.characters && node.fontSize) {
        typography.push({
          name: node.name.replace(/\s+/g, '-').toLowerCase(),
          fontSize: node.fontSize,
          fontWeight: this.getFontWeight(node.fontWeight || 400),
          fontFamily: 'Inter', // Default font, can be enhanced
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(node);
    return typography;
  }

  /**
   * Extract components from Figma document
   */
  private extractComponents(node: FigmaNode): FigmaComponent[] {
    const components: FigmaComponent[] = [];

    const traverse = (node: FigmaNode) => {
      // Check if node is a component instance or component set
      if (node.name.toLowerCase().includes('component') || 
          node.name.toLowerCase().includes('button') ||
          node.name.toLowerCase().includes('card') ||
          node.name.toLowerCase().includes('header') ||
          node.name.toLowerCase().includes('footer') ||
          node.name.toLowerCase().includes('form') ||
          node.name.toLowerCase().includes('input') ||
          node.name.toLowerCase().includes('modal') ||
          node.name.toLowerCase().includes('nav')) {

        const category = this.getComponentCategory(node.name);
        
        components.push({
          id: node.id,
          name: node.name,
          description: this.generateComponentDescription(node.name, category),
          node,
          category,
          exportable: true,
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(node);
    return components;
  }

  /**
   * Extract spacing values from layouts
   */
  private extractSpacing(node: FigmaNode): Array<{ name: string; value: number }> {
    const spacing: Array<{ name: string; value: number }> = [];
    
    // Default spacing values based on common design systems
    const defaultSpacing = [
      { name: 'space-1', value: 4 },
      { name: 'space-2', value: 8 },
      { name: 'space-3', value: 12 },
      { name: 'space-4', value: 16 },
      { name: 'space-5', value: 20 },
      { name: 'space-6', value: 24 },
      { name: 'space-8', value: 32 },
      { name: 'space-10', value: 40 },
      { name: 'space-12', value: 48 },
      { name: 'space-16', value: 64 },
      { name: 'space-20', value: 80 },
      { name: 'space-24', value: 96 },
    ];

    return defaultSpacing;
  }

  /**
   * Extract effects (shadows, blurs, etc.)
   */
  private extractEffects(node: FigmaNode): Array<{ name: string; type: string; value: any }> {
    const effects: Array<{ name: string; type: string; value: any }> = [];

    const traverse = (node: FigmaNode) => {
      if (node.effects && node.effects.length > 0) {
        node.effects.forEach((effect, index) => {
          if (effect.visible !== false) {
            const name = `${node.name}-${effect.type.toLowerCase()}-${index}`;
            effects.push({
              name: name.replace(/\s+/g, '-').toLowerCase(),
              type: effect.type,
              value: effect,
            });
          }
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(node);
    return effects;
  }

  /**
   * Generate React components from Figma design
   */
  async generateReactComponents(fileKey: string): Promise<Map<string, string>> {
    const file = await this.getFile(fileKey);
    const components = this.extractComponents(file.document);
    const reactComponents = new Map<string, string>();

    for (const component of components) {
      const code = this.componentToReact(component.node, component.name);
      reactComponents.set(component.name, code);
    }

    return reactComponents;
  }

  /**
   * Convert Figma node to React component
   */
  private componentToReact(node: FigmaNode, componentName: string): string {
    const styles = this.nodeToStyles(node);
    const children = this.nodeToChildren(node);

    return `
import React from 'react';

interface ${componentName}Props {
  ${this.generatePropsInterface(node)}
}

export function ${componentName}({ ${this.generatePropsList(node)} }: ${componentName}Props) {
  return (
    <div style={${JSON.stringify(styles, null, 2)}}>
      ${children}
    </div>
  );
}
    `.trim();
  }

  /**
   * Convert Figma node styles to CSS
   */
  private nodeToStyles(node: FigmaNode): any {
    const styles: any = {};

    if (node.absoluteBoundingBox) {
      styles.position = 'absolute';
      styles.left = node.absoluteBoundingBox.x;
      styles.top = node.absoluteBoundingBox.y;
      styles.width = node.absoluteBoundingBox.width;
      styles.height = node.absoluteBoundingBox.height;
    }

    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        styles.backgroundColor = this.rgbaToString(fill.color);
      }
    }

    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.color) {
        styles.borderColor = this.rgbaToString(stroke.color);
      }
      if (stroke.weight) {
        styles.borderWidth = stroke.weight;
        styles.borderStyle = 'solid';
      }
    }

    if (node.cornerRadius && node.cornerRadius > 0) {
      styles.borderRadius = node.cornerRadius;
    }

    if (node.type === 'TEXT') {
      if (node.fontSize) styles.fontSize = node.fontSize;
      if (node.fontWeight) styles.fontWeight = this.getFontWeight(node.fontWeight);
      if (node.textAlignHorizontal) styles.textAlign = node.textAlignHorizontal.toLowerCase();
      if (node.letterSpacing) styles.letterSpacing = node.letterSpacing;
      if (node.lineHeightPercent) styles.lineHeight = node.lineHeightPercent / 100;
    }

    if (node.effects && node.effects.length > 0) {
      const shadow = node.effects.find(e => e.type === 'DROP_SHADOW');
      if (shadow && shadow.color && shadow.offset) {
        styles.boxShadow = `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius || 0}px ${this.rgbaToString(shadow.color)}`;
      }
    }

    return styles;
  }

  /**
   * Generate props interface for React component
   */
  private generatePropsInterface(node: FigmaNode): string {
    if (node.type === 'TEXT') {
      return 'children?: string;';
    }
    return '';
  }

  /**
   * Generate props list for React component
   */
  private generatePropsList(node: FigmaNode): string {
    if (node.type === 'TEXT') {
      return 'children = ""';
    }
    return '';
  }

  /**
   * Convert node children to React children
   */
  private nodeToChildren(node: FigmaNode): string {
    if (node.type === 'TEXT') {
      return node.characters || '';
    }

    if (node.children && node.children.length > 0) {
      return node.children.map(child => {
        const childName = this.toPascalCase(child.name);
        const childCode = this.componentToReact(child, childName);
        return `{/* ${child.name} */}`;
      }).join('\n');
    }

    return '';
  }

  /**
   * Helper methods
   */
  private rgbToHex(r: number, g: number, b: number, a: number): string {
    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private rgbaToString(color: { r: number; g: number; b: number; a?: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = color.a || 1;
    return this.rgbToHex(r, g, b, a);
  }

  private getColorCategory(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('primary')) return 'primary';
    if (lowerName.includes('secondary')) return 'secondary';
    if (lowerName.includes('accent')) return 'accent';
    if (lowerName.includes('success') || lowerName.includes('green')) return 'success';
    if (lowerName.includes('warning') || lowerName.includes('yellow')) return 'warning';
    if (lowerName.includes('error') || lowerName.includes('red')) return 'error';
    if (lowerName.includes('info') || lowerName.includes('blue')) return 'info';
    return 'neutral';
  }

  private getFontWeight(weight: number): string {
    if (weight <= 100) return '100';
    if (weight <= 200) return '200';
    if (weight <= 300) return '300';
    if (weight <= 400) return '400';
    if (weight <= 500) return '500';
    if (weight <= 600) return '600';
    if (weight <= 700) return '700';
    if (weight <= 800) return '800';
    return '900';
  }

  private getComponentCategory(name: string): 'layout' | 'ui' | 'icons' | 'images' | 'typography' {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('header') || lowerName.includes('footer') || lowerName.includes('layout')) return 'layout';
    if (lowerName.includes('button') || lowerName.includes('input') || lowerName.includes('form') || lowerName.includes('card')) return 'ui';
    if (lowerName.includes('icon') || lowerName.includes('symbol')) return 'icons';
    if (lowerName.includes('image') || lowerName.includes('photo') || lowerName.includes('illustration')) return 'images';
    if (lowerName.includes('text') || lowerName.includes('heading') || lowerName.includes('paragraph')) return 'typography';
    return 'ui';
  }

  private generateComponentDescription(name: string, category: string): string {
    return `${category} component: ${name}`;
  }

  private deduplicateColors(colors: Array<{ name: string; value: string; type: string }>): Array<{ name: string; value: string; type: string }> {
    const seen = new Set<string>();
    return colors.filter(color => {
      if (seen.has(color.value)) return false;
      seen.add(color.value);
      return true;
    });
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[\s-_])+(.)/g, (_, char) => char.toUpperCase());
  }

  /**
   * Get all team files
   */
  async getTeamFiles(teamId?: string): Promise<any[]> {
    const targetTeamId = teamId || this.teamId;
    if (!targetTeamId) {
      throw new Error('Team ID not provided');
    }

    const url = `${this.baseUrl}/teams/${targetTeamId}/projects`;
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team files: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create wireframe from template
   */
  async createWireframe(businessType: string, businessName: string, style: 'modern' | 'classic' | 'minimal' = 'modern'): Promise<{
    figmaUrl: string;
    images: { [key: string]: string };
    components: FigmaComponent[];
  }> {
    // This would integrate with Figma's API to create a new file
    // For now, return template structure
    const template = this.getWireframeTemplate(businessType, style);
    
    return {
      figmaUrl: `https://figma.com/file/wireframe-${businessName.replace(/\s+/g, '-')}`,
      images: {},
      components: template.components,
    };
  }

  private getWireframeTemplate(businessType: string, style: string): {
    components: FigmaComponent[];
    layout: any;
  } {
    // Return template structure based on business type and style
    return {
      components: [],
      layout: {},
    };
  }
}