/**
 * main.js - Navigation, Global initialization, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMobile = document.getElementById('navbarMobile');

  // FIX 2 — NAVBAR MUST FLOAT OVER THE HERO
  // Toggle scrolled class on scroll (passive for performance)
  window.addEventListener('scroll', () => {
    const navbarEl = document.querySelector('.navbar');
    if (navbarEl) {
      navbarEl.classList.toggle('scrolled', window.scrollY > 80);
    }
  }, { passive: true });

  // Legacy: Also toggle navbar--scrolled for backwards compatibility
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when scrolling down
    if (currentScroll > 100) {
      navbar.classList.add('navbar--scrolled');
    } else {
      // Only remove if we're on the homepage
      if (!window.location.pathname.includes('bikes') &&
        !window.location.pathname.includes('services') &&
        !window.location.pathname.includes('contact') &&
        !window.location.pathname.includes('detail')) {
        navbar.classList.remove('navbar--scrolled');
      }
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navbarToggle && navbarMobile) {
    navbarToggle.addEventListener('click', () => {
      navbarToggle.classList.toggle('active');
      navbarMobile.classList.toggle('active');
      navbar.classList.toggle('menu-open');
      document.body.style.overflow = navbarMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    const mobileLinks = navbarMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarToggle.classList.remove('active');
        navbarMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
  // Intersection Observer for reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with reveal classes
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('img-loaded');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading on DOM ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);
