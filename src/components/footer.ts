export function initFooter(): void {
  const footer = document.getElementById('footer')!;
  const year = new Date().getFullYear();

  footer.innerHTML = `
    <p class="footer__text">
      Built by Brian M. Schilder &middot; ${year} &middot;
      <a href="https://github.com/bschilder/BMSchilder" target="_blank" rel="noopener noreferrer">Source</a>
    </p>
  `;
}
