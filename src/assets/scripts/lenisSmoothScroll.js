import '@styles/lenis.css';
import Lenis from 'lenis';

// Create Lenis instance with configuration
const lenis = new Lenis({
  // Enable smooth scrolling
  smoothWheel: true,
  // Disable smooth scrolling for elements with this attribute
  wheelMultiplier: 1,
  // Configure which elements should maintain native scrolling behavior
  autoResize: true,
  // Add the sidebar as a stopped element
  gestureOrientation: 'vertical',
});

// Find the sidebar element
const sidebar = document.querySelector('#starlight__sidebar');

// If sidebar exists, mark it to prevent Lenis from handling its scroll
if (sidebar) {
  sidebar.setAttribute('data-lenis-prevent', '');
}

// RAF loop for Lenis
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

// Start the animation loop
requestAnimationFrame(raf);

// Optional: Stop Lenis scrolling when hovering over the sidebar
if (sidebar) {
  sidebar.addEventListener('mouseenter', () => {
    lenis.stop();
  });

  sidebar.addEventListener('mouseleave', () => {
    lenis.start();
  });
}
