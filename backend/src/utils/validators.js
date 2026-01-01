/**
 * Validation helpers for Prisma models
 */

import {
  CV_STATUS,
  EXPORT_FORMAT,
  TEMPLATE_CATEGORY,
  TEMPLATE_LAYOUT,
  LANGUAGE_PROFICIENCY,
  MAX_CV_TITLE_LENGTH,
  MAX_CV_DESCRIPTION_LENGTH,
  MAX_CUSTOM_SECTIONS,
  MAX_EXPERIENCES,
  MAX_EDUCATION_ENTRIES,
  MAX_SKILLS,
  MAX_LANGUAGES
} from '../constants/cv.js';

import {
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS
} from '../constants/subscription.js';

/**
 * Validate CV personal info structure
 */
export const validatePersonalInfo = (personalInfo) => {
  const errors = [];

  if (!personalInfo.firstName || typeof personalInfo.firstName !== 'string') {
    errors.push('First name is required and must be a string');
  }

  if (!personalInfo.lastName || typeof personalInfo.lastName !== 'string') {
    errors.push('Last name is required and must be a string');
  }

  if (!personalInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    errors.push('Valid email is required');
  }

  if (personalInfo.phone && typeof personalInfo.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (personalInfo.location && typeof personalInfo.location !== 'string') {
    errors.push('Location must be a string');
  }

  if (personalInfo.summary && typeof personalInfo.summary !== 'string') {
    errors.push('Summary must be a string');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate CV experience entry
 */
export const validateExperience = (experience) => {
  const errors = [];

  if (!Array.isArray(experience)) {
    return { isValid: false, errors: ['Experience must be an array'] };
  }

  if (experience.length > MAX_EXPERIENCES) {
    errors.push(`Maximum ${MAX_EXPERIENCES} experience entries allowed`);
  }

  experience.forEach((exp, index) => {
    if (!exp.company || typeof exp.company !== 'string') {
      errors.push(`Experience ${index + 1}: Company is required`);
    }

    if (!exp.position || typeof exp.position !== 'string') {
      errors.push(`Experience ${index + 1}: Position is required`);
    }

    if (!exp.startDate || typeof exp.startDate !== 'string') {
      errors.push(`Experience ${index + 1}: Start date is required`);
    }

    if (!exp.description || typeof exp.description !== 'string') {
      errors.push(`Experience ${index + 1}: Description is required`);
    }

    if (exp.achievements && !Array.isArray(exp.achievements)) {
      errors.push(`Experience ${index + 1}: Achievements must be an array`);
    }

    if (exp.technologies && !Array.isArray(exp.technologies)) {
      errors.push(`Experience ${index + 1}: Technologies must be an array`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate CV education entry
 */
export const validateEducation = (education) => {
  const errors = [];

  if (!Array.isArray(education)) {
    return { isValid: false, errors: ['Education must be an array'] };
  }

  if (education.length > MAX_EDUCATION_ENTRIES) {
    errors.push(`Maximum ${MAX_EDUCATION_ENTRIES} education entries allowed`);
  }

  education.forEach((edu, index) => {
    if (!edu.institution || typeof edu.institution !== 'string') {
      errors.push(`Education ${index + 1}: Institution is required`);
    }

    if (!edu.degree || typeof edu.degree !== 'string') {
      errors.push(`Education ${index + 1}: Degree is required`);
    }

    if (!edu.field || typeof edu.field !== 'string') {
      errors.push(`Education ${index + 1}: Field is required`);
    }

    if (!edu.startDate || typeof edu.startDate !== 'string') {
      errors.push(`Education ${index + 1}: Start date is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate CV skills
 */
export const validateSkills = (skills) => {
  const errors = [];

  if (!skills || typeof skills !== 'object') {
    return { isValid: false, errors: ['Skills must be an object'] };
  }

  if (!Array.isArray(skills.technical)) {
    errors.push('Technical skills must be an array');
  } else if (skills.technical.length > MAX_SKILLS) {
    errors.push(`Maximum ${MAX_SKILLS} technical skills allowed`);
  }

  if (!Array.isArray(skills.soft)) {
    errors.push('Soft skills must be an array');
  } else if (skills.soft.length > MAX_SKILLS) {
    errors.push(`Maximum ${MAX_SKILLS} soft skills allowed`);
  }

  if (skills.tools && !Array.isArray(skills.tools)) {
    errors.push('Tools must be an array');
  }

  if (skills.certifications && !Array.isArray(skills.certifications)) {
    errors.push('Certifications must be an array');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate CV languages
 */
export const validateLanguages = (languages) => {
  const errors = [];

  if (!Array.isArray(languages)) {
    return { isValid: false, errors: ['Languages must be an array'] };
  }

  if (languages.length > MAX_LANGUAGES) {
    errors.push(`Maximum ${MAX_LANGUAGES} languages allowed`);
  }

  const validProficiencies = Object.values(LANGUAGE_PROFICIENCY);

  languages.forEach((lang, index) => {
    if (!lang.language || typeof lang.language !== 'string') {
      errors.push(`Language ${index + 1}: Language name is required`);
    }

    if (!lang.proficiency || !validProficiencies.includes(lang.proficiency)) {
      errors.push(`Language ${index + 1}: Valid proficiency level is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate CV custom sections
 */
export const validateCustomSections = (customSections) => {
  const errors = [];

  if (!customSections) {
    return { isValid: true, errors: [] }; // Optional field
  }

  if (!Array.isArray(customSections)) {
    return { isValid: false, errors: ['Custom sections must be an array'] };
  }

  if (customSections.length > MAX_CUSTOM_SECTIONS) {
    errors.push(`Maximum ${MAX_CUSTOM_SECTIONS} custom sections allowed`);
  }

  customSections.forEach((section, index) => {
    if (!section.id || typeof section.id !== 'string') {
      errors.push(`Section ${index + 1}: ID is required`);
    }

    if (!section.title || typeof section.title !== 'string') {
      errors.push(`Section ${index + 1}: Title is required`);
    }

    if (!section.type || !['text', 'list', 'timeline'].includes(section.type)) {
      errors.push(`Section ${index + 1}: Type must be 'text', 'list', or 'timeline'`);
    }

    if (section.content === undefined) {
      errors.push(`Section ${index + 1}: Content is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate complete CV data
 */
export const validateCVData = (cvData) => {
  const errors = [];

  // Title validation
  if (!cvData.title || typeof cvData.title !== 'string') {
    errors.push('CV title is required');
  } else if (cvData.title.length > MAX_CV_TITLE_LENGTH) {
    errors.push(`CV title must not exceed ${MAX_CV_TITLE_LENGTH} characters`);
  }

  // Description validation (optional)
  if (cvData.description && cvData.description.length > MAX_CV_DESCRIPTION_LENGTH) {
    errors.push(`CV description must not exceed ${MAX_CV_DESCRIPTION_LENGTH} characters`);
  }

  // Status validation
  if (cvData.status && !Object.values(CV_STATUS).includes(cvData.status)) {
    errors.push('Invalid CV status');
  }

  // Personal info validation
  const personalInfoResult = validatePersonalInfo(cvData.personalInfo || {});
  if (!personalInfoResult.isValid) {
    errors.push(...personalInfoResult.errors);
  }

  // Experience validation
  const experienceResult = validateExperience(cvData.experience || []);
  if (!experienceResult.isValid) {
    errors.push(...experienceResult.errors);
  }

  // Education validation
  const educationResult = validateEducation(cvData.education || []);
  if (!educationResult.isValid) {
    errors.push(...educationResult.errors);
  }

  // Skills validation
  const skillsResult = validateSkills(cvData.skills || {});
  if (!skillsResult.isValid) {
    errors.push(...skillsResult.errors);
  }

  // Languages validation
  const languagesResult = validateLanguages(cvData.languages || []);
  if (!languagesResult.isValid) {
    errors.push(...languagesResult.errors);
  }

  // Custom sections validation (optional)
  if (cvData.customSections) {
    const customSectionsResult = validateCustomSections(cvData.customSections);
    if (!customSectionsResult.isValid) {
      errors.push(...customSectionsResult.errors);
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate template data
 */
export const validateTemplateData = (templateData) => {
  const errors = [];

  if (!templateData.name || typeof templateData.name !== 'string') {
    errors.push('Template name is required');
  }

  if (!templateData.category || !Object.values(TEMPLATE_CATEGORY).includes(templateData.category)) {
    errors.push('Valid template category is required');
  }

  if (!templateData.layout || !Object.values(TEMPLATE_LAYOUT).includes(templateData.layout)) {
    errors.push('Valid template layout is required');
  }

  if (!templateData.colors || typeof templateData.colors !== 'object') {
    errors.push('Template colors are required');
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'text', 'background'];
    requiredColors.forEach(color => {
      if (!templateData.colors[color]) {
        errors.push(`Template color '${color}' is required`);
      }
    });
  }

  if (!templateData.fonts || typeof templateData.fonts !== 'object') {
    errors.push('Template fonts are required');
  } else {
    if (!templateData.fonts.heading || !templateData.fonts.body) {
      errors.push('Template heading and body fonts are required');
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate subscription data
 */
export const validateSubscriptionData = (subscriptionData) => {
  const errors = [];

  if (!subscriptionData.plan || !Object.values(SUBSCRIPTION_PLANS).includes(subscriptionData.plan)) {
    errors.push('Valid subscription plan is required');
  }

  if (!subscriptionData.status || !Object.values(SUBSCRIPTION_STATUS).includes(subscriptionData.status)) {
    errors.push('Valid subscription status is required');
  }

  if (typeof subscriptionData.cvLimit !== 'number') {
    errors.push('CV limit must be a number');
  }

  if (typeof subscriptionData.templateLimit !== 'number') {
    errors.push('Template limit must be a number');
  }

  if (typeof subscriptionData.exportLimit !== 'number') {
    errors.push('Export limit must be a number');
  }

  if (typeof subscriptionData.aiUsageLimit !== 'number') {
    errors.push('AI usage limit must be a number');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate export format
 */
export const validateExportFormat = (format) => {
  return Object.values(EXPORT_FORMAT).includes(format);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate date format (YYYY-MM or YYYY-MM-DD)
 */
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}(-\d{2})?$/;
  return dateRegex.test(date);
};
