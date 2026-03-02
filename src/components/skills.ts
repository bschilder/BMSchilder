import type { CVData, Skill } from '../types/cv-data';
import { cleanDescription } from '../utils/format';

const GROUP_ICONS: Record<string, string> = {
  'Research': '🔬',
  'AI & Machine Learning': '🤖',
  'Project Management': '📋',
  'Soft Skills': '🤝',
};

export function initSkills(data: CVData): void {
  const section = document.getElementById('skills')!;
  const coreSkills = data.skills.filter((s) => s.Type === 'core');
  const fieldSkills = data.skills.filter((s) => s.Type === 'field');

  // Compute dynamic values for descriptions
  const nPubs = data.publications.filter((p) => p.Type === 'publication').length;
  const nPreprints = data.publications.filter((p) => p.Type === 'preprint').length;
  const nGrants = data.grants.filter((g) => g.Type === 'grant').length;
  const nPackages = data.tools.length;
  const nYears = new Date().getFullYear() - Math.min(...data.experience.filter(e => e.Type === 'research').map(e => e.StartYear));
  const nWeb = data.experience.filter(e => e.Type === 'data visualisation').length;
  const nPosters = data.publications.filter(p => p.Type === 'poster').length;

  // Group core skills
  const coreGroups = groupBy(coreSkills, 'Group');
  // Group field skills
  const fieldGroups = groupBy(fieldSkills, 'Group');

  section.innerHTML = `
    <h2 class="section__title">Skills</h2>
    <div class="skills__core fade-in">
      ${Object.entries(coreGroups).map(([group, skills]) => renderCoreCard(group, skills, {
        n_publications: nPubs,
        n_preprints: nPreprints,
        n_grants: nGrants,
        n_packages: nPackages,
        n_years_experience: nYears,
        n_web: nWeb,
        n_posters: nPosters,
      })).join('')}
    </div>
    <h3 class="section__title" style="font-size: var(--text-xl); margin-top: var(--space-8);">Field Expertise</h3>
    <div class="skills__fields fade-in">
      ${Object.entries(fieldGroups).map(([group, skills]) => renderFieldGroup(group, skills)).join('')}
    </div>
  `;

  // Toggle core card items
  section.querySelectorAll('.skill-card__header').forEach((header) => {
    header.addEventListener('click', () => {
      const card = header.closest('.skill-card')!;
      const items = card.querySelector('.skill-card__items')!;
      const toggle = card.querySelector('.skill-card__toggle')!;
      items.classList.toggle('skill-card__items--open');
      toggle.classList.toggle('skill-card__toggle--open');
    });
  });

  // Animate bars on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.skill-bar__fill').forEach((bar) => {
            bar.style.width = bar.dataset.width || '0%';
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  section.querySelectorAll('.skill-group').forEach((g) => observer.observe(g));
}

function interpolateVars(text: string, vars: Record<string, number>): string {
  if (!text) return '';
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return key in vars ? String(vars[key]) : `{${key}}`;
  });
}

function renderCoreCard(group: string, skills: Skill[], vars: Record<string, number>): string {
  const summary = skills.find((s) => s.Title === 'Summary');
  const items = skills.filter((s) => s.Title !== 'Summary');
  const icon = GROUP_ICONS[group] || '💡';

  return `
    <div class="skill-card">
      <div class="skill-card__header" role="button" tabindex="0" aria-expanded="false">
        <div class="skill-card__icon">${icon}</div>
        <span class="skill-card__group">${group}</span>
        <svg class="skill-card__toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      ${summary ? `<p class="skill-card__item-desc" style="margin-bottom: var(--space-3)">${cleanDescription(interpolateVars(summary.Description, vars))}</p>` : ''}
      <div class="skill-card__items">
        ${items.map((s) => `
          <div class="skill-card__item">
            <div class="skill-card__item-title">${s.Title}</div>
            <div class="skill-card__item-desc">${cleanDescription(interpolateVars(s.Description, vars))}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFieldGroup(group: string, skills: Skill[]): string {
  // Sort by level descending (highest expertise first)
  const sorted = [...skills].sort((a, b) => {
    const aLevel = typeof a.Level === 'number' ? a.Level : 0;
    const bLevel = typeof b.Level === 'number' ? b.Level : 0;
    const aMax = typeof a.LevelMax === 'number' ? a.LevelMax : 10;
    const bMax = typeof b.LevelMax === 'number' ? b.LevelMax : 10;
    return (bLevel / (bMax || 1)) - (aLevel / (aMax || 1));
  });
  return `
    <div class="skill-group">
      <h4 class="skill-group__name">${group}</h4>
      ${sorted.map((s) => {
        const level = typeof s.Level === 'number' ? s.Level : 0;
        const max = typeof s.LevelMax === 'number' ? s.LevelMax : 10;
        const pct = max > 0 ? Math.round((level / max) * 100) : 0;
        return `
          <div class="skill-bar">
            <span class="skill-bar__label">${s.Title}</span>
            <div class="skill-bar__track">
              <div class="skill-bar__fill" data-width="${pct}%"></div>
            </div>
            <span class="skill-bar__value">${level}/${max}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    (acc[group] = acc[group] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
