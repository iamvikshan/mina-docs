// @root/types/site.d.ts

import type { ImageMetadata } from 'astro';

/**
 * Site configuration and SEO types
 */

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  description_short: string;
  url: string;
  author: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  structuredData: StructuredData;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  inLanguage: string;
  '@id': string;
  url: string;
  name: string;
  description: string;
  isPartOf: StructuredDataPart;
}

export interface StructuredDataPart {
  '@type': string;
  url: string;
  name: string;
  description: string;
}

export interface OpenGraphConfig {
  locale: string;
  type: string;
  url: string;
  title: string;
  description: string;
  image: ImageMetadata | string;
}
