// Shared across all pages: scroll-reveal init, back-to-top, service worker registration.
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60 });
  }

  const topBtn = document.getElementById('backToTop');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('show', window.scrollY > 500);
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Deliberately not an <a> tag — looks and behaves like plain footer text
  // (no underline, no pointer cursor, no visible href) unless you click it.
  const legalMark = document.getElementById('pp-legal-mark');
  if (legalMark) {
    legalMark.addEventListener('click', () => {
      window.location.href = '/portal';
    });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
