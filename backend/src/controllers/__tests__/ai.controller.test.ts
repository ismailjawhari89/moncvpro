import { AIController } from '../ai.controller';
import { callAIService } from '../../services/ai.service';
import { Request, Response } from 'express';

jest.mock('../../services/ai.service');
jest.mock('../../services/audit.service');
jest.mock('../../lib/logger');

describe('AIController', () => {
    let aiController: AIController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonFn: jest.Mock;
    let statusFn: jest.Mock;

    beforeEach(() => {
        aiController = new AIController();
        jsonFn = jest.fn();
        statusFn = jest.fn().mockReturnValue({ json: jsonFn });
        mockReq = {
            userId: 'user-123',
            body: { cvId: 'cv-123', section: 'summary', prompt: 'write me a summary' },
            ip: '127.0.0.1',
            headers: {}
        } as any;
        mockRes = {
            status: statusFn,
            json: jsonFn,
        };
        jest.clearAllMocks();
    });

    describe('getSuggestions', () => {
        it('should return suggestions from AI service', async () => {
            const mockSuggestions = ['Suggestion 1', 'Suggestion 2'];
            (callAIService as jest.Mock).mockResolvedValue(mockSuggestions);

            await aiController.getSuggestions(mockReq as Request, mockRes as Response);

            expect(callAIService).toHaveBeenCalledWith(expect.objectContaining({
                cvId: 'cv-123',
                section: 'summary'
            }));
            expect(jsonFn).toHaveBeenCalledWith({
                success: true,
                data: mockSuggestions
            });
        });

        it('should return error if AI service fails', async () => {
            (callAIService as jest.Mock).mockRejectedValue(new Error('AI fail'));

            await aiController.getSuggestions(mockReq as Request, mockRes as Response);

            expect(statusFn).toHaveBeenCalledWith(500);
            expect(jsonFn).toHaveBeenCalledWith({ error: 'AI fail' });
        });
    });
});
