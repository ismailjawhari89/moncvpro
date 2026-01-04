import { PrismaClient } from '@prisma/client';
import { datasources } from '../../prisma/prisma.config.js';

const prisma = new PrismaClient({ datasources });

export default prisma;
