import type { CVData } from '../types/cv-data';
import { formatYearRange, cleanDescription } from '../utils/format';

export function initGrants(data: CVData): void {
  const section = document.getElementById('grants')!;
  const grants = data.grants.filter((g) => g.Type === 'grant').sort((a, b) => b.StartYear - a.StartYear);
  const awards = data.grants.filter((g) => g.Type === 'award').sort((a, b) => b.StartYear - a.StartYear);

  let cardSize = 20;

  function getColsAndCompact(): { cols: number; compact: boolean } {
    if (cardSize <= 25) return { cols: 4, compact: true };
    if (cardSize <= 50) return { cols: 3, compact: true };
    if (cardSize <= 75) return { cols: 2, compact: false };
    return { cols: 1, compact: false };
  }

  function render() {
    const { cols, compact } = getColsAndCompact();

    section.innerHTML = `
      <h2 class="section__title">Grants & Awards</h2>
      <div class="grants__size-control">
        <label class="grants__size-label" for="grant-size-slider">Card Size</label>
        <input type="range" id="grant-size-slider" class="grants__size-slider" min="0" max="100" value="${cardSize}" />
      </div>
      ${grants.length > 0 ? `
        <h3 class="grants__subsection-title">Grants</h3>
        <div class="grants__grid ${compact ? 'grants__grid--compact' : ''}" style="--grant-cols: ${cols};" data-grid="grants">
          ${grants.map((g) => `
            <div class="grant-card ${g.Status === 'Active' ? 'grant-card--active' : ''}">
              <span class="grant-card__status ${g.Status === 'Active' ? 'grant-card__status--active' : 'grant-card__status--completed'}">
                ${g.Status || 'Completed'}
              </span>
              <div class="grant-card__project">${g.Project || g.GrantName || ''}</div>
              <div class="grant-card__source">${g.Source || ''}</div>
              <div class="grant-card__meta">
                ${formatYearRange(g.StartYear, g.EndYear)}
                ${g.Role ? ` | ${g.Role}` : ''}
                ${g.PI ? ` | PI: ${g.PI}` : ''}
              </div>
              ${g.Amount ? `<div class="grant-card__amount">${g.Amount}</div>` : ''}
              ${g.Comments ? `<div class="grant-card__comments">${cleanDescription(g.Comments)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${awards.length > 0 ? `
        <h3 class="grants__subsection-title">Awards</h3>
        <div class="grants__grid ${compact ? 'grants__grid--compact' : ''}" style="--grant-cols: ${cols};" data-grid="awards">
          ${awards.map((a) => `
            <div class="grant-card grant-card--award">
              <div class="grant-card__project">${a.Project || a.GrantName || ''}</div>
              <div class="grant-card__source">${a.Source || ''}</div>
              <div class="grant-card__meta">${a.StartYear}${a.Role ? ` | ${a.Role}` : ''}</div>
              ${a.Amount ? `<div class="grant-card__amount grant-card__amount--award">${a.Amount}</div>` : ''}
              ${a.Comments ? `<div class="grant-card__comments">${cleanDescription(a.Comments)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    const slider = section.querySelector('#grant-size-slider') as HTMLInputElement;
    slider?.addEventListener('input', () => {
      cardSize = Number(slider.value);
      const grids = section.querySelectorAll<HTMLElement>('.grants__grid');
      const { cols, compact } = getColsAndCompact();
      grids.forEach((grid) => {
        grid.style.setProperty('--grant-cols', String(cols));
        grid.classList.toggle('grants__grid--compact', compact);
      });
    });
  }

  render();
}
