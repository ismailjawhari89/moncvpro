import { authController } from '../auth.controller';
import { authService } from '../../services/auth.service';
import { Request, Response } from 'express';

// Mock authService
jest.mock('../../services/auth.service');
jest.mock('../../lib/logger');

describe('AuthController', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonFn: jest.Mock;
    let statusFn: jest.Mock;

    beforeEach(() => {
        jsonFn = jest.fn();
        statusFn = jest.fn().mockReturnValue({ json: jsonFn });
        mockReq = {
            body: {},
            ip: '127.0.0.1',
            headers: {}
        };
        mockRes = {
            status: statusFn,
            json: jsonFn,
            cookie: jest.fn(),
            clearCookie: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should return 201 and user data on successful registration', async () => {
            mockReq.body = {
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            const serviceResult = { userId: 'user-123', message: 'Success' };
            (authService.register as jest.Mock).mockResolvedValue(serviceResult);

            await authController.register(mockReq as Request, mockRes as Response);

            expect(statusFn).toHaveBeenCalledWith(201);
            expect(jsonFn).toHaveBeenCalledWith(serviceResult);
        });

        it('should return 400 if service throws error', async () => {
            mockReq.body = { email: 'invalid' };
            (authService.register as jest.Mock).mockRejectedValue(new Error('Invalid data'));

            await authController.register(mockReq as Request, mockRes as Response);

            expect(statusFn).toHaveBeenCalledWith(400);
            expect(jsonFn).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('login', () => {
        it('should return 200 and set cookies on successful login', async () => {
            mockReq.body = { email: 'test@example.com', password: 'password' };
            const successResult = {
                user: { id: '1', email: 'test@example.com' },
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            };
            (authService.login as jest.Mock).mockResolvedValue(successResult);

            await authController.login(mockReq as Request, mockRes as Response);

            expect(mockRes.cookie).toHaveBeenCalled();
            expect(jsonFn).toHaveBeenCalledWith(expect.objectContaining({
                user: successResult.user,
                accessToken: successResult.accessToken
            }));
        });
    });
});
