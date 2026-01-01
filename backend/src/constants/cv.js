/**
 * CV-related constants
 */

export const CV_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const EXPORT_FORMAT = {
  PDF: 'pdf',
  DOCX: 'docx',
  PNG: 'png',
  JSON: 'json'
};

export const EXPORT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const TEMPLATE_CATEGORY = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  ELEGANT: 'elegant',
  CREATIVE: 'creative',
  PROFESSIONAL: 'professional'
};

export const TEMPLATE_LAYOUT = {
  ONE_COLUMN: '1col',
  TWO_COLUMN: '2col',
  THREE_COLUMN: '3col'
};

export const LANGUAGE_PROFICIENCY = {
  NATIVE: 'native',
  FLUENT: 'fluent',
  ADVANCED: 'advanced',
  INTERMEDIATE: 'intermediate',
  BASIC: 'basic'
};

export const ATS_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  POOR: 40
};

export const getATSScoreRating = (score) => {
  if (score >= ATS_SCORE_THRESHOLDS.EXCELLENT) return 'excellent';
  if (score >= ATS_SCORE_THRESHOLDS.GOOD) return 'good';
  if (score >= ATS_SCORE_THRESHOLDS.AVERAGE) return 'average';
  if (score >= ATS_SCORE_THRESHOLDS.POOR) return 'poor';
  return 'needs-improvement';
};

export const MAX_CV_TITLE_LENGTH = 100;
export const MAX_CV_DESCRIPTION_LENGTH = 500;
export const MAX_CUSTOM_SECTIONS = 5;
export const MAX_EXPERIENCES = 20;
export const MAX_EDUCATION_ENTRIES = 10;
export const MAX_SKILLS = 50;
export const MAX_LANGUAGES = 10;
