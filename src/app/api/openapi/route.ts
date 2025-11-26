import { NextRequest, NextResponse } from 'next/server';
import { getSwaggerSpec } from '@/lib/swagger';

export async function GET(req: NextRequest) {
  try {
    const spec = getSwaggerSpec();
    
    // Check if client wants YAML
    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('application/yaml') || acceptHeader.includes('text/yaml')) {
      // For YAML, we'd need to convert, but for now return JSON
      // The /openapi.yaml route will handle YAML separately if needed
      return NextResponse.json(spec, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}

