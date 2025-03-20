const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catalog Service API',
      version,
      description: 'API documentation for the Catalog microservice',
      contact: {
        name: 'Support Team',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8082}/api/v1`,
        description: 'Development server',
      },
      {
        url: '/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Catalog',
        description: 'Catalog endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, { explorer: true }),
}; 