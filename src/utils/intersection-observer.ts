export function setupScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  // Re-observe after dynamic content loads
  const mutationObserver = new MutationObserver(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => observer.observe(el));
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
}
