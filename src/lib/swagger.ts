import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.config';

let cachedSpec: any = null;

export function getSwaggerSpec() {
  if (cachedSpec && process.env.NODE_ENV === 'production') {
    return cachedSpec;
  }

  try {
    const spec: any = swaggerJsdoc(swaggerOptions);
    
    // Ensure paths object exists
    if (!spec.paths) {
      spec.paths = {};
    }
    
    // Log the number of endpoints found for debugging
    const pathCount = Object.keys(spec.paths).length;
    console.log(`[Swagger] Found ${pathCount} API endpoints`);
    
    cachedSpec = spec;
    return spec;
  } catch (error) {
    console.error('[Swagger] Error generating OpenAPI spec:', error);
    // Return a minimal valid spec if generation fails
    return {
      openapi: '3.0.0',
      info: {
        title: 'ShopPulse API',
        version: '1.0.0',
      },
      paths: {},
    };
  }
}

export function getSwaggerSpecAsYaml(): string {
  const spec = getSwaggerSpec();
  // Convert to YAML - we'll use js-yaml if needed, or return JSON stringified
  // For now, return JSON as YAML is mostly compatible
  return JSON.stringify(spec, null, 2);
}

