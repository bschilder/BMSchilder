import type { CVData } from '../types/cv-data';
import { formatYearRange, highlightName, cleanDescription } from '../utils/format';

interface TimelineItem {
  id: string;
  year: number;
  endYear?: string | number | null;
  type: 'education' | 'research' | 'teaching' | 'publication' | 'talk';
  title: string;
  subtitle: string;
  link: string;
  meta: string;
  bullets: string[];
}

const FILTERS = ['All', 'Education', 'Research', 'Teaching', 'Publications', 'Talks'];

const TYPE_LABELS: Record<string, string> = {
  education: 'Education',
  research: 'Research',
  teaching: 'Teaching',
  publication: 'Publication',
  talk: 'Talk',
};

const TYPE_COLORS: Record<string, string> = {
  education: 'var(--vapor-gold)',
  research: 'var(--vapor-teal)',
  teaching: 'var(--vapor-mint)',
  publication: 'var(--vapor-pink)',
  talk: 'var(--vapor-lavender)',
};

const TYPE_ICONS: Record<string, string> = {
  education: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/></svg>',
  research: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
  teaching: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  publication: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  talk: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>',
};

export function initTimeline(data: CVData): void {
  const section = document.getElementById('timeline')!;
  const allItems = buildTimelineItems(data);

  let activeFilter = 'All';
  let viewMode: 'visual' | 'compact' = 'visual';

  function render() {
    const filtered = activeFilter === 'All'
      ? allItems
      : allItems.filter((i) => matchFilter(i.type, activeFilter));

    const years = [...new Set(filtered.map((i) => i.year))].sort((a, b) => b - a);
    const minYear = Math.min(...filtered.map((i) => i.year));
    const maxYear = Math.max(...filtered.map((i) => i.year));

    section.innerHTML = `
      <h2 class="section__title">Timeline</h2>
      <div class="timeline__top-row">
        <div class="timeline__filters">
          ${FILTERS.map((f) => `
            <button class="timeline__filter ${f === activeFilter ? 'timeline__filter--active' : ''}" data-filter="${f}">
              ${f}
            </button>
          `).join('')}
        </div>
        <button class="timeline__view-toggle" aria-label="Toggle view" title="${viewMode === 'visual' ? 'Switch to compact view' : 'Switch to visual timeline'}">
          ${viewMode === 'visual' ? '☰' : '◉'}
        </button>
      </div>
      ${viewMode === 'visual'
        ? renderVisualTimeline(years, filtered, minYear, maxYear)
        : renderCompactTimeline(years, filtered)
      }
      <div class="timeline__legend">
        ${Object.entries(TYPE_LABELS).map(([type, label]) => `
          <span class="timeline__legend-item">
            <span class="timeline__legend-dot" style="background:${TYPE_COLORS[type]}"></span> ${label}
          </span>
        `).join('')}
      </div>
    `;

    // Filter handlers
    section.querySelectorAll('.timeline__filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = (btn as HTMLElement).dataset.filter || 'All';
        render();
      });
    });

    // View toggle
    section.querySelector('.timeline__view-toggle')?.addEventListener('click', () => {
      viewMode = viewMode === 'visual' ? 'compact' : 'visual';
      render();
    });

    if (viewMode === 'visual') {
      bindVisualHandlers(section, minYear, maxYear);
    } else {
      bindCompactHandlers(section);
    }
  }

  render();
}

/* ── Visual timeline with fisheye navigator ── */
function renderVisualTimeline(
  years: number[], filtered: TimelineItem[],
  minYear: number, maxYear: number,
): string {
  const defaultFocus = maxYear;

  let html = `
    <div class="tl-explorer">
      <div class="tl-navigator">
        <div class="tl-navigator__hint">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
        </div>
        <span class="tl-navigator__label">${maxYear}</span>
        <div class="tl-navigator__track">
          <input type="range" class="tl-navigator__slider"
            min="${minYear}" max="${maxYear}" value="${defaultFocus}" step="1"
            orient="vertical" aria-label="Timeline navigator" />
        </div>
        <span class="tl-navigator__label">${minYear}</span>
        <div class="tl-navigator__hint">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="tl-navigator__year-display">${defaultFocus}</div>
        <div class="tl-navigator__caption">drag to explore</div>
      </div>
      <div class="tl-stream">
  `;

  for (const year of years) {
    const yearItems = filtered.filter((i) => i.year === year);
    const dist = Math.abs(year - defaultFocus);
    const proximity = dist === 0 ? 'focus' : dist <= 1 ? 'near' : dist <= 3 ? 'mid' : 'far';

    // Year marker
    html += `<div class="tl-year tl-year--${proximity}" data-year="${year}"><span class="tl-year__badge">${year}</span></div>`;

    for (const item of yearItems) {
      const color = TYPE_COLORS[item.type] || 'var(--vapor-teal)';
      const icon = TYPE_ICONS[item.type] || '';

      html += `
        <div class="tl-node tl-node--${proximity}" data-id="${item.id}" data-year="${item.year}">
          <div class="tl-node__dot" style="color:${color}">
            <span class="tl-node__icon">${icon}</span>
          </div>
          <div class="tl-node__content">
            <span class="tl-node__type" style="color:${color}">${TYPE_LABELS[item.type]}</span>
            <div class="tl-node__title">
              ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>` : item.title}
            </div>
            <div class="tl-node__detail">
              <div class="tl-node__subtitle">${item.subtitle}</div>
              <div class="tl-node__meta">${item.meta}</div>
              ${item.bullets.length > 0 ? `
                <ul class="tl-node__bullets">
                  ${item.bullets.map((b) => `<li>${cleanDescription(b)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  }

  html += `
      </div>
    </div>
  `;
  return html;
}

function bindVisualHandlers(section: HTMLElement, minYear: number, maxYear: number) {
  const slider = section.querySelector('.tl-navigator__slider') as HTMLInputElement;
  const yearDisplay = section.querySelector('.tl-navigator__year-display') as HTMLElement;
  const stream = section.querySelector('.tl-stream') as HTMLElement;
  const nodes = section.querySelectorAll<HTMLElement>('.tl-node');
  const yearBadges = section.querySelectorAll<HTMLElement>('.tl-year');

  let scrollRaf = 0;

  function updateFocus(focusYear: number) {
    yearDisplay.textContent = String(focusYear);

    // Find nearest year badge that actually exists (for years with no events)
    let scrollTarget: HTMLElement | null = null;
    let nearestDist = Infinity;

    nodes.forEach((node) => {
      const year = Number(node.dataset.year);
      const dist = Math.abs(year - focusYear);
      node.classList.remove('tl-node--focus', 'tl-node--near', 'tl-node--mid', 'tl-node--far');
      if (dist === 0) node.classList.add('tl-node--focus');
      else if (dist <= 1) node.classList.add('tl-node--near');
      else if (dist <= 3) node.classList.add('tl-node--mid');
      else node.classList.add('tl-node--far');
    });

    yearBadges.forEach((badge) => {
      const yr = Number(badge.dataset.year);
      const dist = Math.abs(yr - focusYear);
      badge.classList.remove('tl-year--focus', 'tl-year--near', 'tl-year--mid', 'tl-year--far');
      if (dist === 0) badge.classList.add('tl-year--focus');
      else if (dist <= 1) badge.classList.add('tl-year--near');
      else if (dist <= 3) badge.classList.add('tl-year--mid');
      else badge.classList.add('tl-year--far');

      // Track the nearest year badge for scroll target
      if (dist < nearestDist) {
        nearestDist = dist;
        scrollTarget = badge;
      }
    });

    // Scroll within the .tl-stream container — use rAF so layout settles first
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const target = scrollTarget || section.querySelector('.tl-year--focus') as HTMLElement;
      if (stream && target) {
        const scrollPos = target.offsetTop - stream.clientHeight / 2 + target.clientHeight / 2;
        stream.scrollTo({ top: scrollPos, behavior: 'smooth' });
      }
    });
  }

  slider?.addEventListener('input', () => {
    // Invert: top of slider = max year
    const focusYear = minYear + maxYear - Number(slider.value);
    updateFocus(focusYear);
  });

  // Click item to focus its year
  nodes.forEach((node) => {
    node.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) return;
      const year = Number(node.dataset.year);
      slider.value = String(minYear + maxYear - year);
      updateFocus(year);
    });
  });
}

/* ── Compact table view ── */
function renderCompactTimeline(years: number[], filtered: TimelineItem[]): string {
  let html = '<div class="timeline__container" id="timeline-scroll">';
  for (const year of years) {
    const yearItems = filtered.filter((i) => i.year === year);
    html += `
      <div class="timeline__year-marker" data-year="${year}">
        <span class="timeline__year-badge">${year}</span>
      </div>
      ${yearItems.map((item) => renderCompactNode(item)).join('')}
    `;
  }
  html += '</div>';
  return html;
}

function bindCompactHandlers(section: HTMLElement) {
  let expandedId: string | null = null;
  const nodes = section.querySelectorAll<HTMLElement>('.timeline__node');

  nodes.forEach((node) => {
    node.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) return;
      const id = node.dataset.id || '';
      const wasExpanded = node.classList.contains('timeline__node--expanded');

      // Collapse all
      nodes.forEach((n) => n.classList.remove('timeline__node--expanded'));

      // Toggle clicked
      if (!wasExpanded) {
        node.classList.add('timeline__node--expanded');
        expandedId = id;
      } else {
        expandedId = null;
      }
    });
  });
}

function renderCompactNode(item: TimelineItem): string {
  const color = TYPE_COLORS[item.type] || 'var(--vapor-teal)';
  return `
    <div class="timeline__node" data-id="${item.id}">
      <span class="timeline__node-dot timeline__node-dot--${item.type}"></span>
      <span class="timeline__node-title">${truncate(item.title, 80)}</span>
      <span class="timeline__node-type">${TYPE_LABELS[item.type] || item.type}</span>
      <div class="timeline__node-detail">
        <span class="timeline__node-type-exp" style="color: ${color}">${TYPE_LABELS[item.type]}</span>
        <div class="timeline__card-title">
          ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>` : item.title}
        </div>
        <div class="timeline__card-subtitle">${item.subtitle}</div>
        <div class="timeline__card-meta">${item.meta}</div>
        ${item.bullets.length > 0 ? `
          <ul class="timeline__card-bullets">
            ${item.bullets.map((b) => `<li>${cleanDescription(b)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    </div>
  `;
}

function buildTimelineItems(data: CVData): TimelineItem[] {
  const items: TimelineItem[] = [];
  let idx = 0;

  data.education.forEach((edu) => {
    items.push({
      id: `tl-${idx++}`,
      year: edu.StartYear,
      endYear: edu.EndYear,
      type: 'education',
      title: `${edu.Degree} — ${edu.Program?.trim() || ''}`,
      subtitle: edu.Institution,
      link: '',
      meta: `${formatYearRange(edu.StartYear, edu.EndYear)} | ${edu.Department || ''} | ${edu.City || ''}${edu.State ? ', ' + edu.State : ''}, ${edu.Country || ''}`,
      bullets: [
        edu.Thesis ? `<strong>Thesis:</strong> ${edu.Thesis}` : '',
        ...(edu.bullets || []),
      ].filter(Boolean),
    });
  });

  data.experience
    .filter((e) => e.Type === 'research' || e.Type === 'teaching')
    .forEach((exp) => {
      items.push({
        id: `tl-${idx++}`,
        year: exp.StartYear,
        endYear: exp.EndYear,
        type: exp.Type as 'research' | 'teaching',
        title: `${exp.Position}${exp.Title ? ' — ' + exp.Title : ''}`,
        subtitle: exp.Institution,
        link: exp.Link || '',
        meta: `${formatYearRange(exp.StartYear, exp.EndYear)}${exp.Department ? ' | ' + exp.Department : ''}`,
        bullets: exp.bullets || [],
      });
    });

  const pubTypes = new Set(['publication', 'preprint', 'poster']);
  data.publications.filter(pub => pubTypes.has(pub.Type)).forEach((pub) => {
    items.push({
      id: `tl-${idx++}`,
      year: pub.Year,
      type: 'publication',
      title: pub.Title,
      subtitle: pub.Journal || pub.Publisher || '',
      link: pub.Link || '',
      meta: `${pub.Year} | ${pub.Type}`,
      bullets: [pub.Authors ? highlightName(pub.Authors) : ''],
    });
  });

  data.talks.forEach((talk) => {
    items.push({
      id: `tl-${idx++}`,
      year: talk.Year,
      type: 'talk',
      title: talk.Title,
      subtitle: talk.Institution || '',
      link: talk.Link || '',
      meta: `${talk.Year} | ${talk.Event || ''} | ${talk.Type}`,
      bullets: [],
    });
  });

  items.sort((a, b) => b.year - a.year);
  return items;
}

function matchFilter(type: string, filter: string): boolean {
  const map: Record<string, string[]> = {
    'Education': ['education'],
    'Research': ['research'],
    'Teaching': ['teaching'],
    'Publications': ['publication'],
    'Talks': ['talk'],
  };
  return (map[filter] || []).includes(type);
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text || '';
  return text.slice(0, max) + '...';
}
