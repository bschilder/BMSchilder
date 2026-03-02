const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Research', href: '#publications' },
  { label: 'Software', href: '#tools' },
  { label: 'Artwork', href: '#artwork' },
  { label: 'Contact', href: '#contact' },
];

export function initNav(): void {
  const nav = document.getElementById('main-nav')!;

  nav.innerHTML = `
    <a href="#hero" class="nav__logo">
      <span>B</span><span class="nav__collapse">rian </span><span>M Schilder</span>
    </a>
    <div class="nav__links">
      ${NAV_LINKS.map(
        (l) => `<a href="${l.href}" class="nav__link" data-section="${l.href.slice(1)}">${l.label}</a>`
      ).join('')}
    </div>
    <button class="nav__hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <div class="nav__overlay" aria-hidden="true">
      ${NAV_LINKS.map(
        (l) => `<a href="${l.href}" class="nav__link" data-section="${l.href.slice(1)}">${l.label}</a>`
      ).join('')}
    </div>
  `;

  // Scroll detection
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll-spy
  const sections = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(Boolean) as HTMLElement[];
  const links = nav.querySelectorAll<HTMLAnchorElement>('.nav__link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle('nav__link--active', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: `-${64}px 0px -40% 0px` }
  );

  sections.forEach((s) => spyObserver.observe(s));

  // Mobile menu
  const hamburger = nav.querySelector('.nav__hamburger')!;
  const overlay = nav.querySelector('.nav__overlay')!;

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('nav__overlay--open');
    hamburger.classList.toggle('nav__hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      overlay.classList.remove('nav__overlay--open');
      hamburger.classList.remove('nav__hamburger--open');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}
