const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Assignment API',
      version: '1.0.0',
      description: 'REST API with JWT auth, RBAC, and task CRUD',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.js', './docs/openapi.yaml'],
};

module.exports = swaggerJSDoc(options);
