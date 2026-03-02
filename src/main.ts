import './style.css';
import { applyPalette } from './palette';
import { loadAllData } from './data/csv-loader';
import { initNav } from './components/nav';
import { initHero } from './components/hero';
import { initAbout } from './components/about';
import { initSkills } from './components/skills';
import { initTimeline } from './components/timeline';
import { initPublications } from './components/publications';
import { initTools } from './components/tools';
import { initGrants } from './components/grants';
import { initArtwork } from './components/artwork';
import { initBrainViewer } from './components/brain-viewer';
import { initContact } from './components/contact';
import { initFooter } from './components/footer';
import { setupScrollAnimations } from './utils/intersection-observer';
import { setupSmoothScroll } from './utils/smooth-scroll';

async function init() {
  // Apply color palette (change in src/palette.ts)
  applyPalette();

  // Init non-data-dependent components immediately
  initNav();
  initHero();
  initFooter();

  // Load CSV data
  try {
    const data = await loadAllData();

    // Init data-dependent components
    initAbout(data);
    initSkills(data);
    initTimeline(data);
    initPublications(data);
    initTools(data);
    initGrants(data);
    initArtwork(data);
    initContact(data);
  } catch (err) {
    console.error('Failed to load CV data:', err);
  }

  // Init brain viewer (lazy-loaded)
  initBrainViewer();

  // Setup utilities
  setupScrollAnimations();
  setupSmoothScroll();
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
