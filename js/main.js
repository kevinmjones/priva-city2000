document.addEventListener('DOMContentLoaded', () => {
  const current = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && current.endsWith(href.replace(/\.html$/, ''))) {
      a.classList.add('active');
    }
  });
});
