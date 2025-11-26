import { NextRequest, NextResponse } from 'next/server';
import { getSwaggerSpec } from '@/lib/swagger';

export async function GET(req: NextRequest) {
  try {
    const spec = getSwaggerSpec();
    
    // Ensure we have a valid spec with paths
    if (!spec || !spec.paths || Object.keys(spec.paths).length === 0) {
      console.warn('[OpenAPI] No endpoints found in swagger spec');
    }
    
    // Check if client wants YAML
    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('application/yaml') || acceptHeader.includes('text/yaml')) {
      // For YAML, we'd need to convert, but for now return JSON
      // The /openapi.yaml route will handle YAML separately if needed
      return NextResponse.json(spec, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[OpenAPI] Error generating OpenAPI spec:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate API documentation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

