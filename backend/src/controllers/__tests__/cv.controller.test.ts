import { CVController } from '../cv.controller';
import prisma from '../../lib/prisma';
import { Request, Response } from 'express';
import { auditService } from '../../services/audit.service';

// Mock prisma and auditService
jest.mock('../../lib/prisma', () => ({
    cV: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    experience: { deleteMany: jest.fn() },
    education: { deleteMany: jest.fn() },
    skill: { deleteMany: jest.fn() },
    $transaction: jest.fn((callback) => callback(prisma)),
}));
jest.mock('../../services/audit.service');
jest.mock('../../lib/logger');

describe('CVController', () => {
    let cvController: CVController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonFn: jest.Mock;
    let statusFn: jest.Mock;

    beforeEach(() => {
        cvController = new CVController();
        jsonFn = jest.fn();
        statusFn = jest.fn().mockReturnValue({ json: jsonFn });
        mockReq = {
            userId: 'user-123',
            params: {},
            body: {},
            ip: '127.0.0.1',
            headers: {}
        } as any;
        mockRes = {
            status: statusFn,
            json: jsonFn,
        };
        jest.clearAllMocks();
    });

    describe('listCVs', () => {
        it('should return list of CVs for the user', async () => {
            const mockCVs = [{ id: 'cv-1', title: 'Resume 1' }];
            (prisma.cV.findMany as jest.Mock).mockResolvedValue(mockCVs);

            await cvController.listCVs(mockReq as Request, mockRes as Response);

            expect(prisma.cV.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { userId: 'user-123', deletedAt: null }
            }));
            expect(jsonFn).toHaveBeenCalledWith(mockCVs);
        });
    });

    describe('createCV', () => {
        it('should create a new CV and return 201', async () => {
            mockReq.body = { title: 'New CV', template: 'modern' };
            const mockCV = { id: 'cv-new', ...mockReq.body };
            (prisma.cV.create as jest.Mock).mockResolvedValue(mockCV);

            await cvController.createCV(mockReq as Request, mockRes as Response);

            expect(prisma.cV.create).toHaveBeenCalled();
            expect(statusFn).toHaveBeenCalledWith(201);
            expect(jsonFn).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockCV
            }));
        });
    });
});
