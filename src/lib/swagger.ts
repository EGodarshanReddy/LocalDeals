import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger.config';

let cachedSpec: any = null;

export function getSwaggerSpec() {
  if (cachedSpec && process.env.NODE_ENV === 'production') {
    return cachedSpec;
  }

  const spec = swaggerJsdoc(swaggerOptions);
  cachedSpec = spec;
  return spec;
}

export function getSwaggerSpecAsYaml(): string {
  const spec = getSwaggerSpec();
  // Convert to YAML - we'll use js-yaml if needed, or return JSON stringified
  // For now, return JSON as YAML is mostly compatible
  return JSON.stringify(spec, null, 2);
}

