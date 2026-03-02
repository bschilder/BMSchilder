import type { CVData } from '../types/cv-data';
import { cleanDescription } from '../utils/format';

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp)$/i;

/** Extract local artwork image paths from Link and bullet fields in the CSV */
function findAllImages(link: string, bullets: string[]): string[] {
  const found: string[] = [];
  const allText = [link, ...bullets].join(' ');

  // Match filenames from URLs pointing to images/artwork/
  const urlPattern = /images\/artwork\/([^\s)"',]+)/g;
  let match: RegExpExecArray | null;
  while ((match = urlPattern.exec(allText)) !== null) {
    const filename = match[1];
    if (IMAGE_EXTS.test(filename)) {
      const path = `images/artwork/${filename}`;
      if (!found.includes(path)) found.push(path);
    }
  }

  return found;
}

interface ArtworkSlide {
  title: string;
  description: string;
  link: string;
  year: number;
  bullets: string[];
  imagePath: string | null;
}

export function initArtwork(data: CVData): void {
  const section = document.getElementById('artwork')!;
  const base = import.meta.env.BASE_URL;

  const artworks = data.experience
    .filter((e) => e.Type === 'data visualisation')
    .sort((a, b) => b.StartYear - a.StartYear);

  if (artworks.length === 0) {
    section.innerHTML = '';
    return;
  }

  // Build slides: one per image found, plus text slides for entries without images
  const slides: ArtworkSlide[] = [];

  for (const a of artworks) {
    const images = findAllImages(a.Link || '', a.bullets || []);
    if (images.length > 0) {
      // Create a slide for each image
      for (let i = 0; i < images.length; i++) {
        slides.push({
          title: a.Position || a.Title || '',
          description: i === 0 ? (a.bullets?.[0] || '') : '',
          link: a.Link || '',
          year: a.StartYear,
          bullets: i === 0 ? (a.bullets || []) : [],
          imagePath: images[i],
        });
      }
    } else {
      slides.push({
        title: a.Position || a.Title || '',
        description: a.bullets?.[0] || '',
        link: a.Link || '',
        year: a.StartYear,
        bullets: a.bullets || [],
        imagePath: null,
      });
    }
  }

  // Sort: image slides first (award winners at very top), then text slides by year
  slides.sort((a, b) => {
    if (a.imagePath && !b.imagePath) return -1;
    if (!a.imagePath && b.imagePath) return 1;
    // Prioritize wildfire (award-winning) images
    if (a.imagePath?.includes('wildfire') && !b.imagePath?.includes('wildfire')) return -1;
    if (!a.imagePath?.includes('wildfire') && b.imagePath?.includes('wildfire')) return 1;
    return b.year - a.year;
  });

  section.innerHTML = `
    <h2 class="section__title">Data Visualisation & Artwork</h2>
    <div class="artwork__carousel fade-in">
      <div class="artwork__track">
        ${slides.map((s) => s.imagePath ? renderImageSlide(s, base) : renderTextSlide(s)).join('')}
      </div>
      <button class="artwork__nav-btn artwork__nav-btn--prev" aria-label="Previous artwork">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="artwork__nav-btn artwork__nav-btn--next" aria-label="Next artwork">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="artwork__dots">
      ${slides.map((_, i) => `<button class="artwork__dot ${i === 0 ? 'artwork__dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('')}
    </div>
  `;

  // Carousel logic
  const track = section.querySelector('.artwork__track') as HTMLElement;
  const dots = section.querySelectorAll<HTMLButtonElement>('.artwork__dot');
  let current = 0;

  function goTo(index: number) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    const slide = track.children[current] as HTMLElement;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('artwork__dot--active', i === current));
  }

  section.querySelector('.artwork__nav-btn--prev')?.addEventListener('click', () => goTo(current - 1));
  section.querySelector('.artwork__nav-btn--next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const slideWidth = (track.children[0] as HTMLElement)?.offsetWidth || 1;
    const idx = Math.round(scrollLeft / slideWidth);
    if (idx !== current) {
      current = idx;
      dots.forEach((d, i) => d.classList.toggle('artwork__dot--active', i === current));
    }
  }, { passive: true });
}

function renderImageSlide(s: ArtworkSlide, base: string): string {
  return `
    <div class="artwork__slide">
      <div class="artwork__image-wrap">
        <img
          src="${base}${s.imagePath}"
          alt="${s.title}"
          class="artwork__image"
          loading="lazy"
        />
        <div class="artwork__caption">
          <h3 class="artwork__caption-title">
            ${s.link ? `<a href="${s.link}" target="_blank" rel="noopener noreferrer">${s.title}</a>` : s.title}
          </h3>
          ${s.description ? `<p class="artwork__caption-desc">${cleanDescription(s.description)}</p>` : ''}
          <span class="artwork__caption-year">${s.year}</span>
        </div>
      </div>
    </div>
  `;
}

function renderTextSlide(s: ArtworkSlide): string {
  return `
    <div class="artwork__slide">
      <div class="artwork__text-wrap">
        <h3 class="artwork__text-title">
          ${s.link ? `<a href="${s.link}" target="_blank" rel="noopener noreferrer">${s.title}</a>` : s.title}
        </h3>
        <p class="artwork__text-desc">${cleanDescription(s.description)}</p>
        ${s.bullets.slice(1).map(b => `<p class="artwork__text-bullet">${cleanDescription(b)}</p>`).join('')}
        <span class="artwork__text-year">${s.year}</span>
      </div>
    </div>
  `;
}
