// process-html.mjs
import fs from 'node:fs/promises';
import { globby } from 'globby';
import path from 'node:path';
import type { ProcessResult, TotalStats } from './types/process-html';

// html-minifier-terser is a CJS module without proper ESM types
// Using dynamic import with type assertion
// @ts-expect-error: Package has incorrect type exports
const htmlMinifier = await import('html-minifier-terser');
const minify = htmlMinifier.minify as (
  text: string,
  options?: Record<string, unknown>
) => Promise<string>;

const CLIENT_DIR = './dist';

const minifyOptions: Record<string, unknown> = {
  removeComments: true,
  preserveLineBreaks: false, // Remove line breaks for better compression
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  sortClassName: true,
  sortAttributes: true,
  // Additional optimizations
  collapseBooleanAttributes: true,
  decodeEntities: true,
  minifyURLs: 'https://docs.4mina.app',
  removeAttributeQuotes: false,
  removeOptionalTags: false,
  removeEmptyElements: false, // Keep false for Astro components
};

async function checkDirectory(dir: string): Promise<boolean> {
  try {
    await fs.access(dir);
    return true;
  } catch {
    console.warn(`Directory ${dir} not found.`);
    return false;
  }
}

async function processHTML(): Promise<void> {
  try {
    // Check if build directory exists
    const clientExists = await checkDirectory(CLIENT_DIR);

    if (!clientExists) {
      console.error('Client directory not found. Run astro build first.');
      process.exit(1);
    }

    console.log('🔍 Finding HTML files...');

    // Get HTML files from the client directory
    const files = await globby([`${CLIENT_DIR}/**/*.html`]);

    if (files.length === 0) {
      console.warn('No HTML files found to process');
      return;
    }

    console.log(`📝 Processing ${files.length} HTML files...`);

    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = path.relative(process.cwd(), file);
          const html = await fs.readFile(file, 'utf-8');
          const originalSize = Buffer.from(html).length;

          const minified = await minify(html, minifyOptions);
          await fs.writeFile(file, minified);

          const newSize = Buffer.from(minified).length;
          const savings =
            originalSize === 0
              ? '0.0'
              : (((originalSize - newSize) / originalSize) * 100).toFixed(1);

          return {
            file: filePath,
            originalSize,
            newSize,
            savings,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(`Error processing ${file}:`, errorMessage);
          return { file, error: errorMessage };
        }
      })
    );

    // Log results
    console.log('\n📊 Processing Results:');

    // Log client files results
    if (results.length > 0) {
      console.log('\n📱 Client files:');
      results.forEach(logResult);
    }

    // Calculate and log total statistics
    const totalStats = calculateTotalStats(results);
    console.log('\n📈 Total Results:');
    console.log(
      `   ${(totalStats.originalSize / 1024).toFixed(1)}KB → ${(totalStats.newSize / 1024).toFixed(1)}KB`
    );
    console.log(`   ${totalStats.savings}% total size reduction`);
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  }
}

function logResult({
  file,
  originalSize,
  newSize,
  savings,
  error,
}: ProcessResult): void {
  if (error) {
    console.error(`❌ ${file}: ${error}`);
  } else if (originalSize !== undefined && newSize !== undefined && savings) {
    console.log(`✅ ${file}`);
    console.log(
      `   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% saved)`
    );
  }
}

function calculateTotalStats(results: ProcessResult[]): TotalStats {
  const totalOriginal = results.reduce(
    (sum, r) => sum + (r.originalSize || 0),
    0
  );
  const totalNew = results.reduce((sum, r) => sum + (r.newSize || 0), 0);
  const totalSavings =
    totalOriginal === 0
      ? '0.0'
      : (((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1);

  return {
    originalSize: totalOriginal,
    newSize: totalNew,
    savings: totalSavings,
  };
}

processHTML().catch((error) => {
  console.error(
    '❌ Fatal error:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
