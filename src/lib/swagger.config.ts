const getServerUrl = (): string => {
  // Priority 1: Explicitly set public API URL (works at runtime)
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('[Swagger] Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Priority 2: Vercel URL (only available at build time)
  if (process.env.VERCEL_URL) {
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
    const url = `${protocol}://${process.env.VERCEL_URL}`;
    console.log('[Swagger] Using VERCEL_URL:', url);
    return url;
  }
  
  // Priority 3: Try to detect from window location (client-side only)
  if (typeof window !== 'undefined') {
    const url = window.location.origin;
    console.log('[Swagger] Using window.location.origin:', url);
    return url;
  }
  
  // Priority 4: Default to localhost for development
  console.log('[Swagger] Using default localhost URL');
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

