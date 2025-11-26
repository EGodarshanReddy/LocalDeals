const getServerUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For Vercel deployments, use the VERCEL_URL
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
    console.log('Using protocol:',protocol);
    console.log('Using VERCEL_URL for Swagger server URL:', process.env.VERCEL_URL);
    return `${protocol}://${process.env.VERCEL_URL}`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

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
      url: getServerUrl(),
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
    'src/app/api/**/*.ts',
    'src/app/api/**/route.ts',
  ],
};

