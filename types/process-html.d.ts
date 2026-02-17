/**
 * Types for process-html.mts build script
 */

export interface ProcessResult {
  file: string;
  originalSize?: number;
  newSize?: number;
  savings?: string;
  error?: string;
}

export interface TotalStats {
  originalSize: number;
  newSize: number;
  savings: string;
}
