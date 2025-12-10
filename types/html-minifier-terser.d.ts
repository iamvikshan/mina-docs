/**
 * Type declarations for html-minifier-terser
 */

declare module 'html-minifier-terser' {
  export interface MinifyOptions {
    removeComments?: boolean;
    preserveLineBreaks?: boolean;
    collapseWhitespace?: boolean;
    minifyJS?: boolean;
    minifyCSS?: boolean;
    removeRedundantAttributes?: boolean;
    removeScriptTypeAttributes?: boolean;
    removeStyleLinkTypeAttributes?: boolean;
    useShortDoctype?: boolean;
    removeEmptyAttributes?: boolean;
    sortClassName?: boolean;
    sortAttributes?: boolean;
    collapseBooleanAttributes?: boolean;
    decodeEntities?: boolean;
    minifyURLs?: string | boolean;
    removeAttributeQuotes?: boolean;
    removeOptionalTags?: boolean;
    removeEmptyElements?: boolean;
  }

  export function minify(
    text: string,
    options?: MinifyOptions
  ): Promise<string>;
}

// Re-export for barrel consumption
export type { MinifyOptions } from 'html-minifier-terser';
