import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authController } from '../../src/controllers/auth.controller';
import { authService } from '../../src/services/auth.service';

// Mock the service to avoid needing a real DB for now, 
// as setting up a full test DB environment in this turn might be too much.
// In a real project, we would use a test DB.
jest.mock('../../src/services/auth.service');
jest.mock('../../src/lib/logger');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Define routes for testing
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));

describe('Auth Integration Tests (Mocked Service)', () => {
    it('POST /api/auth/register - success', async () => {
        (authService.register as jest.Mock).mockResolvedValue({ userId: '1', message: 'Success' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
                firstName: 'John',
                lastName: 'Doe'
            });

        expect(res.status).toBe(201);
        expect(res.body.userId).toBe('1');
    });

    it('POST /api/auth/login - success', async () => {
        (authService.login as jest.Mock).mockResolvedValue({
            user: { id: '1', email: 'test@example.com' },
            accessToken: 'token',
            refreshToken: 'refresh'
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBe('token');
        expect(res.header['set-cookie']).toBeDefined();
    });
});
