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

  // Smooth scroll animations for timeline items (alternating left/right entrance)
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length > 0) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      });

      timelineItems.forEach(item => observer.observe(item));
    } else {
      // Fallback if IntersectionObserver unsupported
      timelineItems.forEach(item => item.classList.add('is-visible'));
    }
  }
  // Interactive hover & touch toggle for committee agenda overlays
  const committeeMedias = document.querySelectorAll('.committee-card-media');
  if (committeeMedias.length > 0) {
    committeeMedias.forEach(media => {
      // Tap/click toggles agenda overlay on mobile devices and touchscreens
      media.addEventListener('click', () => {
        const wasActive = media.classList.contains('active');
        committeeMedias.forEach(m => m.classList.remove('active'));
        if (!wasActive) {
          media.classList.add('active');
        }
      });

      // Keyboard accessibility (Enter/Space toggles agenda)
      media.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          media.classList.toggle('active');
        }
      });
    });

    // Close overlay when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.committee-card-media')) {
        committeeMedias.forEach(m => m.classList.remove('active'));
      }
    });
  }
});
