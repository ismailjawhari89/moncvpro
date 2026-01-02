/**
 * Subscription Plans and Limits Configuration
 */

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium'
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
  TRIALING: 'trialing'
};

/**
 * Plan Limits Configuration
 * -1 means unlimited
 */
export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    cvLimit: 1,
    templateLimit: 0,
    exportLimit: 3,
    aiUsageLimit: 5,
    features: [
      '1 CV',
      'Basic templates',
      '3 exports per month',
      '5 AI enhancements per month',
      'Basic ATS analysis'
    ]
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    cvLimit: 5,
    templateLimit: 3,
    exportLimit: 50,
    aiUsageLimit: 100,
    features: [
      '5 CVs',
      'All templates',
      '50 exports per month',
      '100 AI enhancements per month',
      'Advanced ATS analysis',
      'Custom templates',
      'Priority support',
      'Version history'
    ]
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    cvLimit: -1, // Unlimited
    templateLimit: -1, // Unlimited
    exportLimit: -1, // Unlimited
    aiUsageLimit: -1, // Unlimited
    features: [
      'Unlimited CVs',
      'All premium templates',
      'Unlimited exports',
      'Unlimited AI enhancements',
      'Advanced ATS analysis',
      'Unlimited custom templates',
      'Priority support 24/7',
      'Version history',
      'Job matching AI',
      'Cover letter generator',
      'LinkedIn optimization'
    ]
  }
};

/**
 * Plan Pricing (in cents for Stripe)
 */
export const PLAN_PRICING = {
  [SUBSCRIPTION_PLANS.FREE]: {
    monthly: 0,
    yearly: 0
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    monthly: 999, // $9.99
    yearly: 9990, // $99.90 (2 months free)
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    monthly: 1999, // $19.99
    yearly: 19990, // $199.90 (2 months free)
  }
};

/**
 * Get plan limits for a given plan
 */
export const getPlanLimits = (plan) => {
  return PLAN_LIMITS[plan] || PLAN_LIMITS[SUBSCRIPTION_PLANS.FREE];
};

/**
 * Check if a plan has a specific feature
 */
export const hasPlanFeature = (plan, currentUsage, limitType) => {
  const limits = getPlanLimits(plan);
  const limit = limits[limitType];
  
  if (limit === -1) return true; // Unlimited
  if (limit === 0) return false; // Not available
  
  return currentUsage < limit;
};

/**
 * Calculate remaining usage for a plan
 */
export const getRemainingUsage = (plan, currentUsage, limitType) => {
  const limits = getPlanLimits(plan);
  const limit = limits[limitType];
  
  if (limit === -1) return -1; // Unlimited
  if (limit === 0) return 0; // Not available
  
  return Math.max(0, limit - currentUsage);
};
