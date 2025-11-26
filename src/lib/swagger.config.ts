export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ShopPulse API',
    version: '1.0.0',
    description: 'API documentation for ShopPulse - A shopping and rewards platform',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.shoppulse.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          statusCode: {
            type: 'number',
            example: 200,
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          data: {
            type: 'object',
            nullable: true,
          },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Consumer',
      description: 'Consumer/Buyer endpoints',
    },
    {
      name: 'Partner',
      description: 'Partner/Seller endpoints',
    },
    {
      name: 'Public',
      description: 'Public endpoints',
    },
  ],
};

export const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    process.cwd() + '/src/app/api/**/*.ts',
    process.cwd() + '/src/app/api/**/route.ts',
  ],
};

