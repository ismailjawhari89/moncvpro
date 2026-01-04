
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MonCVPro API',
            version: '1.0.0',
            description: 'Professional CV builder API'
        },
        servers: [
            {
                url: 'http://localhost:3001/api/v1',
                description: 'Development'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/**/*.ts']
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('Swagger UI available at http://localhost:3001/api-docs');
}
