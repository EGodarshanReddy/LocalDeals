declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    url?: string;
    spec?: any;
    layout?: string;
    defaultModelsExpandDepth?: number;
    displayOperationId?: boolean;
    plugins?: Array<any>;
    docExpansion?: 'list' | 'full' | 'none';
    [key: string]: any;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module 'swagger-ui-react/swagger-ui.css' {
  const content: any;
  export default content;
}