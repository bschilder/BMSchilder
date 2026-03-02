export function formatYearRange(start: number, end: string | number | null): string {
  const endStr = !end || end === '\\-' ? 'Present' : String(end);
  return `${start} – ${endStr}`;
}

export function highlightName(authors: string, name = 'BM Schilder'): string {
  if (!authors) return '';
  return authors.replace(
    new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    `<strong class="highlight-name">${name}</strong>`
  );
}

export function stripMarkdownLinks(text: string): string {
  if (!text) return '';
  // Convert markdown links [text](url) to HTML links
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}

const FILE_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>';

export function cleanDescription(text: string): string {
  if (!text) return '';
  // Convert icon-link patterns like [ @[file-text] ](url) to clickable icon links
  let cleaned = text.replace(
    /\[\s*@\[[^\]]+\]\s*\]\(([^)]+)\)/g,
    `<a href="$1" target="_blank" rel="noopener noreferrer" class="icon-link" title="$1">${FILE_ICON_SVG}</a>`
  );
  // Remove any remaining standalone icon references like [@[icon-name]]
  cleaned = cleaned.replace(/\s*\[@\[[^\]]+\]\]\s*/g, ' ');
  // Convert markdown links
  cleaned = stripMarkdownLinks(cleaned);
  return cleaned.trim();
}

export function formatAmount(amount: string | null): string {
  if (!amount) return '';
  return amount.trim();
}
