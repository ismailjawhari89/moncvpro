import { authMiddleware } from '../authMiddleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('../lib/logger');

describe('authMiddleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockReq = {
            cookies: {},
            headers: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (nextFunction as jest.Mock).mockClear();
        jest.clearAllMocks();
    });

    it('should call next() if a valid token is provided in cookies', () => {
        mockReq.cookies.auth_token = 'valid-token';
        (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user-1' });

        authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect((mockReq as any).userId).toBe('user-1');
    });

    it('should call next() if a valid token is provided in Authorization header', () => {
        mockReq.headers.authorization = 'Bearer valid-token';
        (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user-1' });

        authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if no token is provided', () => {
        authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
        mockReq.cookies.auth_token = 'invalid-token';
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
