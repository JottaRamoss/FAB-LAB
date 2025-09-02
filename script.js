// ===== MODERN JAVASCRIPT FOR FAB LAB BRASIL =====

// Utility functions
const utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Animate number counting
  animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + (target >= 1000 ? '+' : '');
    }, 16);
  }
};

// ===== LOADING SCREEN =====
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.init();
  }

  init() {
    if (!this.loadingScreen) return;

    // Simulate loading progress
    const progressBar = this.loadingScreen.querySelector('.loading-progress');
    let progress = 0;

    const loadingInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        setTimeout(() => this.hide(), 500);
      }
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }, 100);

    // Hide loading screen when page is fully loaded
    window.addEventListener('load', () => {
      clearInterval(loadingInterval);
      setTimeout(() => this.hide(), 1000);
    });
  }

  hide() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 350);
    }
  }
}

// ===== ADVANCED SLIDESHOW =====
class AdvancedSlideshow {
  constructor() {
    this.slideshow = document.querySelector('.slideshow');
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.slide-prev');
    this.nextBtn = document.querySelector('.slide-next');
    this.currentSlide = 0;
    this.slideInterval = null;
    this.isAutoPlaying = true;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.setupSlideBackgrounds();
    this.bindEvents();
    this.startAutoPlay();
    this.addTouchSupport();
    this.addKeyboardSupport();
  }

  setupSlideBackgrounds() {
    this.slides.forEach(slide => {
      const bgUrl = slide.dataset.bg;
      const bgElement = slide.querySelector('.slide-bg');
      if (bgUrl && bgElement) {
        bgElement.style.backgroundImage = `url(${bgUrl})`;
      }
    });
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause on hover
    this.slideshow?.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.slideshow?.addEventListener('mouseleave', () => this.resumeAutoPlay());

    // Intersection Observer for performance
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.resumeAutoPlay();
          } else {
            this.pauseAutoPlay();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(this.slideshow);
    }
  }

  goToSlide(index) {
    // Remove active classes
    this.slides[this.currentSlide]?.classList.remove('active');
    this.indicators[this.currentSlide]?.classList.remove('active');

    // Update current slide
    this.currentSlide = index;

    // Add active classes
    this.slides[this.currentSlide]?.classList.add('active');
    this.indicators[this.currentSlide]?.classList.add('active');

    // Trigger custom event
    this.slideshow?.dispatchEvent(new CustomEvent('slideChange', {
      detail: { currentSlide: this.currentSlide }
    }));
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    if (!this.isAutoPlaying) return;
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  pauseAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  resumeAutoPlay() {
    if (this.isAutoPlaying && !this.slideInterval) {
      this.startAutoPlay();
    }
  }

  addTouchSupport() {
    if (!this.slideshow) return;

    this.slideshow.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.slideshow.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      if (!this.slideshow || !utils.isInViewport(this.slideshow)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.isAutoPlaying ? this.pauseAutoPlay() : this.resumeAutoPlay();
          break;
      }
    });
  }
}

// ===== RESPONSIVE NAVIGATION =====
class ResponsiveNavigation {
  constructor() {
    this.header = document.getElementById('header');
    this.menuBtn = document.querySelector('.btn-menu');
    this.menu = document.querySelector('.menu');
    this.menuItems = document.querySelectorAll('.menu-item-has-children');
    this.isOpen = false;
    this.lastScrollY = window.scrollY;
    
    this.init();
  }

  init() {
    if (!this.header) return;

    this.bindEvents();
    this.setupScrollBehavior();
    this.setupSubmenuBehavior();
  }

  bindEvents() {
    // Mobile menu toggle
    this.menuBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menu?.contains(e.target) && !this.menuBtn?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking on menu links
    this.menu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1023) {
          this.closeMenu();
        }
      });
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menu?.classList.add('active');
    this.menuBtn?.classList.add('active');
    this.menuBtn?.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.menu?.classList.remove('active');
    this.menuBtn?.classList.remove('active');
    this.menuBtn?.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  setupScrollBehavior() {
    const scrollHandler = utils.throttle(() => {
      const currentScrollY = window.scrollY;

      // Add scrolled class
      if (currentScrollY > 100) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }

      this.lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  setupSubmenuBehavior() {
    this.menuItems.forEach(item => {
      const link = item.querySelector('a');
      const submenu = item.querySelector('.sub-menu');

      if (link && submenu) {
        // Desktop hover behavior
        if (window.innerWidth > 1023) {
          item.addEventListener('mouseenter', () => {
            link.setAttribute('aria-expanded', 'true');
          });

          item.addEventListener('mouseleave', () => {
            link.setAttribute('aria-expanded', 'false');
          });
        }

        // Mobile click behavior
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 1023) {
            e.preventDefault();
            const isExpanded = link.getAttribute('aria-expanded') === 'true';
            link.setAttribute('aria-expanded', !isExpanded);
            submenu.style.display = isExpanded ? 'none' : 'block';
          }
        });
      }
    });
  }
}

class SearchPopup {
  constructor() {
    this.searchToggle = document.querySelector('.search-toggle');
    this.searchPopup = document.querySelector('.search-popup');
    this.closeBtn = document.querySelector('.btn-close');
    this.searchInput = document.querySelector('.search-form input');
    this.searchForm = document.querySelector('.search-form');
    
    this.init();
  }

  init() {
    if (!this.searchToggle || !this.searchPopup) return;

    this.bindEvents();
  }

  bindEvents() {
    // Open search
    this.searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    // Close search
    this.closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.close();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });

    // Close when clicking outside
    this.searchPopup.addEventListener('click', (e) => {
      if (e.target === this.searchPopup) {
        this.close();
      }
    });

    // Handle search form submission
    this.searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch();
    });
  }

  open() {
    this.searchPopup.classList.add('active');
    this.searchPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus input after animation
    setTimeout(() => {
      this.searchInput?.focus();
    }, 100);
  }

  close() {
    this.searchPopup.classList.remove('active');
    this.searchPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  performSearch() {
    const query = this.searchInput?.value.trim();
    if (query) {
      // Here you would implement actual search functionality
      console.log('Searching for:', query);
      // For demo purposes, just close the popup
      this.close();
    }
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-aos]');
    this.stats = document.querySelectorAll('.stat-number');
    this.statsAnimated = false;
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupStatsAnimation();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation attributes
    document.querySelectorAll('.program-card, .stat, .partner-logo, .section-header').forEach(el => {
      observer.observe(el);
    });
  }

  setupStatsAnimation() {
    if (!('IntersectionObserver' in window)) return;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.animateStats();
          this.statsAnimated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.intro-stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  animateStats() {
    this.stats.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      utils.animateNumber(stat, target);
    });
  }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
  constructor() {
    this.button = document.querySelector('.back-to-top');
    this.init();
  }

  init() {
    if (!this.button) return;

    this.bindEvents();
    this.setupScrollBehavior();
  }

  bindEvents() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupScrollBehavior() {
    const scrollHandler = utils.throttle(() => {
      if (window.scrollY > 300) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    }, 100);

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }
}

// ===== FORM ENHANCEMENTS =====
class FormEnhancements {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => this.enhanceForm(form));
  }

  enhanceForm(form) {
    // Add real-time validation
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
        this.showFormError('Por favor, corrija os erros antes de enviar.');
      }
    });
  }

  validateInput(input) {
    const isValid = input.checkValidity();
    
    if (!isValid) {
      input.classList.add('error');
      this.showInputError(input, input.validationMessage);
    } else {
      input.classList.remove('error');
      this.clearInputError(input);
    }

    return isValid;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showInputError(input, message) {
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearInputError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  clearErrors(input) {
    input.classList.remove('error');
    this.clearInputError(input);
  }

  showFormError(message) {
    // You could implement a toast notification here
    console.error(message);
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.logPageLoadTime();
    this.setupPerformanceObserver();
  }

  logPageLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`🚀 Página carregada em ${Math.round(loadTime)}ms`);
    });
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor Long Tasks
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`);
            }
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }
    }
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }

  setupFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupKeyboardNavigation() {
    // Add keyboard support for custom interactive elements
    document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  setupScreenReaderSupport() {
    // Announce dynamic content changes
    this.createLiveRegion();
  }

  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
}

// ===== INITIALIZATION =====
class FabLabApp {
  constructor() {
    this.components = [];
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components = [
        new LoadingScreen(),
        new AdvancedSlideshow(),
        new ResponsiveNavigation(),
        new SearchPopup(),
        new ScrollAnimations(),
        new BackToTop(),
        new FormEnhancements(),
        new PerformanceMonitor(),
        new AccessibilityEnhancements()
      ];

      // Setup smooth scrolling for anchor links
      this.setupSmoothScrolling();

      // Setup news ticker pause on hover
      this.setupNewsTicker();

      console.log('✅ Fab Lab Brasil - Todos os componentes inicializados com sucesso!');
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.getElementById('header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupNewsTicker() {
    const newsList = document.querySelector('.news-list');
    if (newsList) {
      newsList.addEventListener('mouseenter', () => {
        newsList.style.animationPlayState = 'paused';
      });

      newsList.addEventListener('mouseleave', () => {
        newsList.style.animationPlayState = 'running';
      });
    }
  }
}

// ===== START APPLICATION =====
const app = new FabLabApp();

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }
});