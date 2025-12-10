// @root/types/manifest.d.ts

import type { ImageMetadata } from 'astro';

/**
 * Manifest and PWA related types
 */

export interface Favicon {
  purpose: 'any' | 'maskable' | 'monochrome';
  src: ImageMetadata;
  sizes: number[];
}

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

export interface WebAppManifest {
  short_name: string;
  name: string;
  icons: ManifestIcon[];
  display: string;
  start_url?: string;
  theme_color?: string;
  background_color?: string;
}
