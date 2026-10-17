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
  // Points directly at Director Hub's own origin, not a same-domain /portal
  // path — the vercel.json rewrite proxy that used to sit in front of it was
  // retired (Phase 2 Stage 1: hosting-level isolation between the public site
  // and the admin app). Update this again once a branded subdomain exists.
  const legalMark = document.getElementById('pp-legal-mark');
  if (legalMark) {
    legalMark.addEventListener('click', () => {
      window.location.href = 'https://director-hub-eight.vercel.app/portal';
    });
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
