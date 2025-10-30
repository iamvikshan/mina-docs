// Initialize Preline components
// This script ensures Preline components are properly initialized
// after page loads and after view transitions

import '@preline/collapse/index.js';
import '@preline/dropdown/index.js';
import '@preline/overlay/index.js';
import '@preline/tabs/index.js';
import '@preline/accordion/index.js';

function initPreline() {
  if (typeof window !== 'undefined' && window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initPreline);

// Reinitialize after view transitions (for astro-vtbot)
document.addEventListener('astro:page-load', initPreline);
document.addEventListener('astro:after-swap', initPreline);
