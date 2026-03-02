import type { CVData } from '../types/cv-data';
import { highlightName } from '../utils/format';

const PUB_FILTERS = ['All', 'publication', 'preprint', 'poster'];
const PUB_LABELS: Record<string, string> = {
  'All': 'All',
  'publication': 'Publications',
  'preprint': 'Preprints',
  'poster': 'Posters',
};

export function initPublications(data: CVData): void {
  const section = document.getElementById('publications')!;

  const allowedTypes = new Set(['publication', 'preprint', 'poster']);
  const pubs = [...data.publications].filter(p => allowedTypes.has(p.Type)).sort((a, b) => b.Year - a.Year);

  const journals = ['All', ...new Set(pubs.map((p) => p.Journal).filter(Boolean))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
  });

  let activeFilter = 'All';
  let activeJournal = 'All';
  let searchQuery = '';
  let cardSize = 40; // default compact-ish

  function getColsAndCompact(): { cols: number; compact: boolean } {
    if (cardSize <= 25) return { cols: 4, compact: true };
    if (cardSize <= 50) return { cols: 3, compact: true };
    if (cardSize <= 75) return { cols: 2, compact: false };
    return { cols: 1, compact: false };
  }

  function getFiltered() {
    return pubs
      .filter((p) => activeFilter === 'All' || p.Type === activeFilter)
      .filter((p) => activeJournal === 'All' || p.Journal === activeJournal)
      .filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          (p.Title || '').toLowerCase().includes(q) ||
          (p.Authors || '').toLowerCase().includes(q) ||
          (p.Journal || '').toLowerCase().includes(q)
        );
      });
  }

  function render() {
    const filtered = getFiltered();
    const { cols, compact } = getColsAndCompact();

    section.innerHTML = `
      <h2 class="section__title">Publications</h2>
      <div class="publications__controls">
        <div class="publications__filters">
          ${PUB_FILTERS.map((f) => `
            <button class="publications__filter ${f === activeFilter ? 'publications__filter--active' : ''}" data-filter="${f}">
              ${PUB_LABELS[f] || f} ${f !== 'All' ? `(${pubs.filter(p => p.Type === f).length})` : `(${pubs.length})`}
            </button>
          `).join('')}
        </div>
        <div class="publications__tools-row">
          <select class="publications__journal-select" aria-label="Filter by journal">
            ${journals.map((j) => `<option value="${j}" ${j === activeJournal ? 'selected' : ''}>${j === 'All' ? 'All Journals' : j}</option>`).join('')}
          </select>
          <input type="search" class="publications__search" placeholder="Search..." value="${searchQuery}" aria-label="Search publications" />
          <div class="publications__size-control">
            <input type="range" class="publications__size-slider" min="0" max="100" value="${cardSize}" aria-label="Card size" />
          </div>
        </div>
        <div class="publications__count">Showing ${filtered.length} of ${pubs.length}</div>
      </div>
      <div class="publications__grid ${compact ? 'publications__grid--compact' : ''}" style="--pub-cols: ${cols};">
        ${filtered.map((p) => renderCard(p)).join('')}
      </div>
    `;

    bindHandlers();
  }

  function bindHandlers() {
    section.querySelectorAll('.publications__filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = (btn as HTMLElement).dataset.filter || 'All';
        render();
      });
    });

    const journalSelect = section.querySelector('.publications__journal-select') as HTMLSelectElement;
    journalSelect?.addEventListener('change', () => {
      activeJournal = journalSelect.value;
      render();
    });

    const searchInput = section.querySelector('.publications__search') as HTMLInputElement;
    searchInput?.addEventListener('input', () => {
      searchQuery = searchInput.value;
      render();
    });

    const slider = section.querySelector('.publications__size-slider') as HTMLInputElement;
    slider?.addEventListener('input', () => {
      cardSize = Number(slider.value);
      const grid = section.querySelector('.publications__grid') as HTMLElement;
      if (grid) {
        const { cols, compact } = getColsAndCompact();
        grid.style.setProperty('--pub-cols', String(cols));
        grid.classList.toggle('publications__grid--compact', compact);
      }
    });
  }

  render();
}

const PUB_ICONS: Record<string, string> = {
  publication: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  preprint: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  poster: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
};

function renderCard(p: { Type: string; Title: string; Link: string; Journal: string; Volume: string; Pages: string; Authors: string; Year: number }): string {
  const icon = PUB_ICONS[p.Type] || '';
  return `
    <div class="pub-card">
      <div class="pub-card__type">${icon} ${p.Type}</div>
      <div class="pub-card__title">
        ${p.Link ? `<a href="${p.Link}" target="_blank" rel="noopener noreferrer">${p.Title}</a>` : p.Title}
      </div>
      ${p.Journal ? `<div class="pub-card__journal">${p.Journal}${p.Volume ? `, ${p.Volume}` : ''}${p.Pages ? `, ${p.Pages}` : ''}</div>` : ''}
      <div class="pub-card__authors">${highlightName(p.Authors)}</div>
      <div class="pub-card__year">${p.Year}</div>
    </div>
  `;
}
