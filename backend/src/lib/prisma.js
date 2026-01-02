import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    errorFormat: 'pretty',
  });
};

/**
 * Global Prisma instance to prevent multiple connections in development
 */
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown handler
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

/**
 * Helper function to handle Prisma errors
 * @param {Error} error - Prisma error
 * @returns {Object} Formatted error response
 */
export const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const target = error.meta?.target || [];
    return {
      status: 409,
      message: `A record with this ${target.join(', ')} already exists`,
      field: target[0]
    };
  }

  if (error.code === 'P2025') {
    // Record not found
    return {
      status: 404,
      message: 'Record not found',
      field: null
    };
  }

  if (error.code === 'P2003') {
    // Foreign key constraint failed
    return {
      status: 400,
      message: 'Invalid reference to related record',
      field: error.meta?.field_name
    };
  }

  if (error.code === 'P2014') {
    // Invalid relation
    return {
      status: 400,
      message: 'Invalid relation in the provided data',
      field: null
    };
  }

  // Default error
  return {
    status: 500,
    message: 'Database operation failed',
    field: null
  };
};

/**
 * Build pagination metadata
 * @param {number} total - Total number of records
 * @param {number} page - Current page
 * @param {number} limit - Records per page
 * @returns {Object} Pagination metadata
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

/**
 * Transaction helper for complex operations
 * @param {Function} callback - Transaction operations
 * @returns {Promise<any>} Transaction result
 */
export const executeTransaction = async (callback) => {
  try {
    return await prisma.$transaction(callback);
  } catch (error) {
    throw handlePrismaError(error);
  }
};

/**
 * Soft delete helper (marks as archived instead of deleting)
 * @param {string} model - Model name
 * @param {string} id - Record ID
 * @returns {Promise<any>} Updated record
 */
export const softDelete = async (model, id) => {
  return await prisma[model].update({
    where: { id },
    data: { status: 'archived' }
  });
};

/**
 * Check if user has reached their plan limit
 * @param {string} userId - User ID
 * @param {string} limitType - Type of limit (cvLimit, exportLimit, etc.)
 * @returns {Promise<boolean>} Whether limit is reached
 */
export const checkPlanLimit = async (userId, limitType) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (!subscription) {
    return false; // No subscription = free plan with default limits
  }

  const limit = subscription[limitType];
  if (limit === -1) {
    return false; // Unlimited
  }

  // Check current usage
  const usageMetric = await prisma.usageMetric.findUnique({
    where: { userId }
  });

  if (!usageMetric) {
    return false; // No usage recorded yet
  }

  // Map limit types to usage fields
  const usageMapping = {
    cvLimit: 'totalCVsCreated',
    exportLimit: 'exportsThisMonth',
    aiUsageLimit: 'aiUsesThisMonth'
  };

  const currentUsage = usageMetric[usageMapping[limitType]] || 0;
  return currentUsage >= limit;
};

/**
 * Increment usage metric
 * @param {string} userId - User ID
 * @param {string} metric - Metric to increment
 * @returns {Promise<any>} Updated usage metric
 */
export const incrementUsageMetric = async (userId, metric) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  return await prisma.usageMetric.upsert({
    where: { userId },
    update: {
      [metric]: { increment: 1 },
      lastActivityAt: new Date(),
      currentMonth
    },
    create: {
      userId,
      currentMonth,
      [metric]: 1,
      lastActivityAt: new Date()
    }
  });
};

/**
 * Create audit log entry
 * @param {Object} data - Audit log data
 * @returns {Promise<any>} Created audit log
 */
export const createAuditLog = async (data) => {
  return await prisma.auditLog.create({
    data: {
      ...data,
      createdAt: new Date()
    }
  });
};
