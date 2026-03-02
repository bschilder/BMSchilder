import type { CVData } from '../types/cv-data';

export function initTools(data: CVData): void {
  const section = document.getElementById('tools')!;
  const tools = data.tools;

  const languages = [...new Set(tools.map((t) => t.Language).filter(Boolean))].sort();
  const allFilters = ['All', ...languages];
  let activeFilter = 'All';
  let cardSize = 30;

  function getColsAndCompact(): { cols: number; compact: boolean } {
    if (cardSize <= 20) return { cols: 6, compact: true };
    if (cardSize <= 40) return { cols: 4, compact: true };
    if (cardSize <= 60) return { cols: 3, compact: false };
    if (cardSize <= 80) return { cols: 2, compact: false };
    return { cols: 1, compact: false };
  }

  function render() {
    const filtered = activeFilter === 'All'
      ? tools
      : tools.filter((t) => t.Language === activeFilter);

    const { cols, compact } = getColsAndCompact();

    section.innerHTML = `
      <h2 class="section__title">Software Tools</h2>
      <div class="tools__filters">
        ${allFilters.map((f) => `
          <button class="tools__filter ${f === activeFilter ? 'tools__filter--active' : ''}" data-filter="${f}">
            ${f}${f !== 'All' ? ` (${tools.filter(t => t.Language === f).length})` : ` (${tools.length})`}
          </button>
        `).join('')}
      </div>
      <div class="tools__size-control">
        <label class="tools__size-label" for="tool-size-slider">Card Size</label>
        <input type="range" id="tool-size-slider" class="tools__size-slider" min="0" max="100" value="${cardSize}" />
      </div>
      <div class="tools__grid ${compact ? 'tools__grid--compact' : ''}" style="--grid-cols: ${cols};">
        ${filtered.map((t) => `
          <div class="tool-card">
            <div class="tool-card__name">${t.Name}</div>
            <div class="tool-card__desc">${t.Title || ''}</div>
            <div class="tool-card__row">
              <div class="tool-card__badges">
                ${t.Language ? `<span class="tool-card__badge tool-card__badge--lang">${t.Language}</span>` : ''}
                ${t.Distribution ? `<span class="tool-card__badge tool-card__badge--dist">${t.Distribution}</span>` : ''}
                ${t.Type ? `<span class="tool-card__badge tool-card__badge--lang">${t.Type}</span>` : ''}
              </div>
              <div class="tool-card__icons">
                ${t.Link ? `<a href="${t.Link}" class="tool-card__icon-link" target="_blank" rel="noopener noreferrer" title="Docs"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ''}
                ${t.PaperLink ? `<a href="${t.PaperLink}" class="tool-card__icon-link" target="_blank" rel="noopener noreferrer" title="Paper"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></a>` : ''}
                ${t.GitHub ? `<a href="${t.GitHub}" class="tool-card__icon-link tool-card__icon-link--github" target="_blank" rel="noopener noreferrer" title="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>` : ''}
              </div>
            </div>
            <div class="tool-card__links">
              ${t.Link ? `<a href="${t.Link}" class="tool-card__link" target="_blank" rel="noopener noreferrer">Docs</a>` : ''}
              ${t.PaperLink ? `<a href="${t.PaperLink}" class="tool-card__link" target="_blank" rel="noopener noreferrer">Paper</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bindHandlers();
  }

  function bindHandlers() {
    section.querySelectorAll('.tools__filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = (btn as HTMLElement).dataset.filter || 'All';
        render();
      });
    });

    const slider = section.querySelector('#tool-size-slider') as HTMLInputElement;
    slider?.addEventListener('input', () => {
      cardSize = Number(slider.value);
      // Smooth update: only change grid style + class, no re-render
      const grid = section.querySelector('.tools__grid') as HTMLElement;
      if (grid) {
        const { cols, compact } = getColsAndCompact();
        grid.style.setProperty('--grid-cols', String(cols));
        grid.classList.toggle('tools__grid--compact', compact);
      }
    });
  }

  render();
}
