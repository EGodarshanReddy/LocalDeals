declare module 'swagger-ui-dist/swagger-ui-bundle.js' {
  interface SwaggerUIConfig {
    url?: string;
    urls?: Array<{ url: string; name: string }>;
    dom_id?: string;
    domNode?: HTMLElement;
    spec?: any;
    layout?: string;
    presets?: Array<any>;
    plugins?: Array<any>;
    deepLinking?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayOperationId?: boolean;
    displayRequestDuration?: boolean;
    filter?: boolean | string;
    maxDisplayedTags?: number;
    operationsSorter?: Function;
    showExtensions?: boolean;
    tagsSorter?: Function;
    onComplete?: Function;
    syntaxHighlight?: {
      activate?: boolean;
      theme?: string;
    };
    tryItOutEnabled?: boolean;
    requestInterceptor?: Function;
    responseInterceptor?: Function;
    showMutatedRequest?: boolean;
    supportedSubmitMethods?: Array<string>;
    validatorUrl?: string | null;
    [key: string]: any;
  }

  interface SwaggerUIConstructor {
    (config: SwaggerUIConfig): any;
    presets: { apis: any };
    plugins: { DownloadUrl: any };
  }

  const SwaggerUIBundle: SwaggerUIConstructor;
  export default SwaggerUIBundle;
}

declare module 'swagger-ui-dist/swagger-ui-standalone-preset.js' {
  const preset: any;
  export default preset;
}