'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading API documentation...</p>
      </div>
    )
  }
);

export default function SwaggerPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/openapi')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch OpenAPI spec');
        }
        return res.json();
      })
      .then((data) => {
        setSpec(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load OpenAPI spec:', err);
        setError(err.message || 'Failed to load API documentation');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading API documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#f93e3e' }}>Error: {error}</p>
      </div>
    );
  }

  if (!spec) {
    return null;
  }

  return (
    <SwaggerUI
      spec={spec}
      deepLinking={true}
      displayOperationId={false}
      defaultModelsExpandDepth={1}
      defaultModelExpandDepth={1}
      docExpansion="list"
      supportedSubmitMethods={['get', 'post', 'put', 'patch', 'delete']}
      tryItOutEnabled={true}
      requestSnippetsEnabled={true}
      requestSnippets={{
        generators: {
          curl_bash: {
            title: 'cURL (bash)',
          },
          curl_powershell: {
            title: 'cURL (PowerShell)',
          },
          javascript_fetch: {
            title: 'JavaScript (fetch)',
          },
        },
        defaultExpanded: true,
      }}
    />
  );
}

