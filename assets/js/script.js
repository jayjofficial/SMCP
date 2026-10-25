document.addEventListener('DOMContentLoaded', () => {
  // Update footer year dynamically
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Mobile navigation toggler support for robust offline & mobile responsiveness
  const toggler = document.querySelector('.mobile-toggler');
  const mainNav = document.getElementById('mainNav');

  if (toggler && mainNav) {
    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mainNav.classList.contains('show');
      if (isExpanded) {
        mainNav.classList.remove('show');
        toggler.setAttribute('aria-expanded', 'false');
      } else {
        mainNav.classList.add('show');
        toggler.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !toggler.contains(e.target) && mainNav.classList.contains('show')) {
        mainNav.classList.remove('show');
        toggler.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile nav when clicking a nav link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('show')) {
          mainNav.classList.remove('show');
          toggler.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});
