/**
 * Custom TypeScript types for Prisma models
 * These types extend the auto-generated Prisma types with additional type safety
 */

import { Prisma } from '@prisma/client';

// ============================================
// CV Content Types (JSON Fields)
// ============================================

export interface CVPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface CVExperience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  achievements?: string[];
  technologies?: string[];
}

export interface CVEducation {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface CVSkills {
  technical: string[];
  soft: string[];
  tools?: string[];
  certifications?: string[];
}

export interface CVLanguage {
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
  certification?: string;
}

export interface CVCustomSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'timeline';
  content: string | string[] | CVTimelineItem[];
  order?: number;
}

export interface CVTimelineItem {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

// ============================================
// Template Configuration Types
// ============================================

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
  sizes: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
  };
}

export interface TemplateConfig {
  showPhoto?: boolean;
  showIcons?: boolean;
  accentColor?: boolean;
  spacing?: 'compact' | 'normal' | 'large';
  headerStyle?: 'classic' | 'modern' | 'bold' | 'elegant';
  sectionSpacing?: string;
  margins?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

// ============================================
// ATS Analysis Types
// ============================================

export interface ATSAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  metrics: {
    keywords: number;
    experience: number;
    education: number;
    skills: number;
    formatting: number;
  };
  industryMatch?: string[];
  missingKeywords?: string[];
}

// ============================================
// Subscription Plan Types
// ============================================

export type SubscriptionPlan = 'free' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing';

export interface SubscriptionLimits {
  cvLimit: number;
  templateLimit: number;
  exportLimit: number;
  aiUsageLimit: number;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionLimits> = {
  free: {
    cvLimit: 1,
    templateLimit: 0,
    exportLimit: 3,
    aiUsageLimit: 5
  },
  pro: {
    cvLimit: 5,
    templateLimit: 3,
    exportLimit: 50,
    aiUsageLimit: 100
  },
  premium: {
    cvLimit: -1, // Unlimited
    templateLimit: -1, // Unlimited
    exportLimit: -1, // Unlimited
    aiUsageLimit: -1 // Unlimited
  }
};

// ============================================
// Export Types
// ============================================

export type ExportFormat = 'pdf' | 'docx' | 'png' | 'json';
export type ExportStatus = 'pending' | 'completed' | 'failed';

// ============================================
// Audit Log Types
// ============================================

export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'ai_enhance'
  | 'subscription_change'
  | 'payment';

export type AuditResourceType = 
  | 'cv'
  | 'user'
  | 'settings'
  | 'template'
  | 'subscription'
  | 'payment';

export interface AuditLogChanges {
  before?: Record<string, any>;
  after?: Record<string, any>;
  fields?: string[];
}

// ============================================
// CV Status Types
// ============================================

export type CVStatus = 'draft' | 'published' | 'archived';

// ============================================
// User Settings Types
// ============================================

export type UserLanguage = 'en' | 'ar' | 'fr';
export type UserTheme = 'light' | 'dark' | 'system';

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = 'succeeded' | 'failed' | 'pending' | 'refunded';

export interface PaymentMetadata {
  plan?: SubscriptionPlan;
  source?: string;
  description?: string;
  [key: string]: any;
}

// ============================================
// Helper Types for Prisma Operations
// ============================================

// Type-safe CV creation
export type CVCreateInput = Omit<
  Prisma.CVCreateInput,
  'personalInfo' | 'experience' | 'education' | 'skills' | 'languages'
> & {
  personalInfo: CVPersonalInfo;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkills;
  languages: CVLanguage[];
  customSections?: CVCustomSection[];
  atsAnalysis?: ATSAnalysis;
};

// Type-safe template creation
export type TemplateCreateInput = Omit<
  Prisma.TemplateCreateInput,
  'colors' | 'fonts' | 'config'
> & {
  colors: TemplateColors;
  fonts: TemplateFonts;
  config?: TemplateConfig;
};

// Type-safe subscription update
export type SubscriptionUpdateInput = Prisma.SubscriptionUpdateInput;

// Type-safe audit log creation
export type AuditLogCreateInput = Omit<
  Prisma.AuditLogCreateInput,
  'changes'
> & {
  changes?: AuditLogChanges;
};

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// Query Options Types
// ============================================

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CVFilters extends PaginationOptions {
  userId?: string;
  status?: CVStatus | CVStatus[];
  templateId?: string;
  search?: string;
}

export interface TemplateFilters extends PaginationOptions {
  category?: string;
  isPremium?: boolean;
  isPublic?: boolean;
}
