const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediAssist API',
      version: '1.0.0',
      description: 'Comprehensive Healthcare Management System API',
      contact: {
        name: 'MediAssist Support',
        email: 'support@mediassist.com'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            name: {
              type: 'object',
              properties: {
                first: { type: 'string', example: 'John' },
                last: { type: 'string', example: 'Doe' }
              }
            },
            role: { 
              type: 'string', 
              enum: ['patient', 'doctor', 'chemist', 'admin'],
              example: 'patient'
            },
            isVerified: { type: 'boolean', example: false }
          }
        },
        Prescription: {
          type: 'object',
          properties: {
            patient: { type: 'string', example: '507f1f77bcf86cd799439011' },
            doctor: { type: 'string', example: '507f1f77bcf86cd799439012' },
            meds: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Paracetamol' },
                  strength: { type: 'string', example: '500mg' },
                  dose: { type: 'string', example: '1 tablet' },
                  frequency: { type: 'string', example: 'Every 6 hours' },
                  duration: { type: 'string', example: '5 days' }
                }
              }
            },
            notes: { type: 'string', example: 'Take after meals' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            details: { type: 'string', example: 'Additional error details' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js'] 
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "MediAssist API Documentation"
  }));
};