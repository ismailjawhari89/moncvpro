/**
 * Template Registry
 * Central registry for all CV templates
 */

import modernProTemplate from './modernPro.json';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  settings: {
    showPhoto: boolean;
    photoShape: string;
    showSummary: boolean;
    showContactIcons: boolean;
    columnLayout: string;
    atsCompatible: boolean;
  };
  design: {
    colors: {
      primary: string;
      background: string;
      text: string;
      mutedText: string;
      borders: string;
    };
    typography: any;
    spacing: any;
    photo?: any;
  };
  layout: any;
  blocks: any;
  rtl?: any;
  export?: any;
  metadata: {
    author: string;
    createdAt: string;
    tags: string[];
    previewImage: string;
    isPremium: boolean;
  };
}

/**
 * All available templates
 */
export const templates: Record<string, TemplateDefinition> = {
  modernPro: modernProTemplate as TemplateDefinition,
  // Add more templates here as they are created:
  // modern: modernTemplate,
  // classic: classicTemplate,
  // creative: creativeTemplate,
};

/**
 * Get a template by ID
 */
export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates[id];
}

/**
 * Get all templates
 */
export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(templates);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return Object.values(templates).filter(
    (template) => template.category === category
  );
}

/**
 * Get template categories
 */
export function getTemplateCategories(): string[] {
  const categories = new Set(
    Object.values(templates).map((template) => template.category)
  );
  return Array.from(categories);
}

/**
 * Check if template supports RTL
 */
export function isRTLSupported(templateId: string): boolean {
  const template = getTemplate(templateId);
  return template?.rtl?.supported ?? false;
}

/**
 * Export all
 */
export default templates;
