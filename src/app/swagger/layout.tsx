import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShopPulse API Documentation',
  description: 'Interactive API documentation for ShopPulse',
};

export default function SwaggerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

