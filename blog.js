/**
 * JavaScript Melhorado para Página Blog
 * Instituto Fab Lab Brasil
 * 
 * Funcionalidades:
 * - Sistema de busca avançado
 * - Lazy loading de imagens
 * - Animações suaves
 * - Acessibilidade aprimorada
 * - Performance otimizada
 * - Gerenciamento de estado
 */

'use strict';

// ===================================
// Configurações e Constantes
// ===================================
const CONFIG = {
  SEARCH_DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  LAZY_LOADING_THRESHOLD: 0.1,
  SCROLL_THRESHOLD: 100,
  BACK_TO_TOP_THRESHOLD: 300,
  STORAGE_PREFIX: 'fablab_blog_',
  API_ENDPOINTS: {
    search: '/api/search',
    posts: '/api/posts',
    categories: '/api/categories'
  }
};

const SELECTORS = {
  searchInput: '.search-input',
  searchBtn: '.search-btn',
  postCards: '.post-card',
  categoryTags: '.category-tag',
  paginationBtns: '.pagination-btn',
  backToTopBtn: '.back-to-top',
  lazyImages: 'img[loading="lazy"]',
  animatedElements: '[data-aos]',
  menuToggle: '.btn-menu',
  searchToggle: '.search-toggle',
  searchPopup: '.search-popup',
  searchClose: '.btn-close'
};

// ===================================
// Utilitários
// ===================================
class Utils {
  /**
   * Debounce function para otimizar performance
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * Throttle function para eventos de scroll
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Sanitizar string para busca
   */
  static sanitizeString(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .trim();
  }

  /**
   * Criar elemento DOM com atributos
   */
  static createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  }

  /**
   * Verificar se elemento está visível na viewport
   */
  static isElementVisible(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= windowHeight + threshold &&
      rect.right <= windowWidth + threshold
    );
  }

  /**
   * Smooth scroll para elemento
   */
  static smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000);
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = Utils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  /**
   * Easing function para animações suaves
   */
  static easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  /**
   * Gerenciar localStorage com prefixo
   */
  static storage = {
    set(key, value) {
      try {
        localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
      } catch (e) {
        console.warn('Erro ao salvar no localStorage:', e);
      }
    },
    
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Erro ao ler do localStorage:', e);
        return defaultValue;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
      } catch (e) {
        console.warn('Erro ao remover do localStorage:', e);
      }
    }
  };
}

// ===================================
// Gerenciador de Estado
// ===================================
class StateManager {
  constructor() {
    this.state = {
      searchTerm: '',
      currentPage: 1,
      selectedCategory: 'all',
      isSearching: false,
      posts: [],
      filteredPosts: [],
      categories: []
    };
    this.listeners = new Map();
  }

  /**
   * Atualizar estado
   */
  setState(updates) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Notificar listeners
    Object.keys(updates).forEach(key => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).forEach(callback => {
          callback(this.state[key], prevState[key]);
        });
      }
    });
  }

  /**
   * Obter estado atual
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Adicionar listener para mudanças de estado
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    // Retornar função para remover listener
    return () => {
      this.listeners.get(key).delete(callback);
    };
  }
}

// ===================================
// Sistema de Busca Avançado
// ===================================
class SearchSystem {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.searchInput = document.querySelector(SELECTORS.searchInput);
    this.searchBtn = document.querySelector(SELECTORS.searchBtn);
    this.postCards = document.querySelectorAll(SELECTORS.postCards);
    this.noResultsElement = null;
    
    this.init();
  }

  init() {
    if (!this.searchInput) return;

    // Busca em tempo real com debounce
    this.searchInput.addEventListener('input', 
      Utils.debounce(this.handleSearch.bind(this), CONFIG.SEARCH_DEBOUNCE_DELAY)
    );

    // Busca ao clicar no botão
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', this.handleSearchClick.bind(this));
    }

    // Busca ao pressionar Enter
    this.searchInput.addEventListener('keypress', this.handleKeyPress.bind(this));

    // Limpar busca ao pressionar Escape
    this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Restaurar busca anterior
    this.restorePreviousSearch();

    // Listener para mudanças no estado de busca
    this.stateManager.subscribe('searchTerm', this.onSearchTermChange.bind(this));
  }

  /**
   * Manipular evento de busca
   */
  handleSearch(event) {
    const searchTerm = event.target.value.trim();
    this.stateManager.setState({ searchTerm });
    this.performSearch(searchTerm);
  }

  /**
   * Manipular clique no botão de busca
   */
  handleSearchClick(event) {
    event.preventDefault();
    const searchTerm = this.searchInput.value.trim();
    this.stateManager.setState({ searchTerm });
    this.performSearch(searchTerm);
  }

  /**
   * Manipular tecla pressionada
   */
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const searchTerm = this.searchInput.value.trim();
      this.stateManager.setState({ searchTerm });
      this.performSearch(searchTerm);
    }
  }

  /**
   * Manipular teclas especiais
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  /**
   * Realizar busca
   */
  performSearch(term) {
    const sanitizedTerm = Utils.sanitizeString(term);
    
    if (sanitizedTerm.length === 0) {
      this.showAllPosts();
      this.hideNoResults();
      return;
    }

    this.stateManager.setState({ isSearching: true });
    
    // Simular delay de busca para UX
    setTimeout(() => {
      const results = this.searchPosts(sanitizedTerm);
      this.displayResults(results, term);
      this.stateManager.setState({ 
        isSearching: false,
        filteredPosts: results 
      });
      
      // Salvar termo de busca
      Utils.storage.set('lastSearch', term);
      
      // Analytics (se disponível)
      this.trackSearch(term, results.length);
    }, 100);
  }

  /**
   * Buscar posts
   */
  searchPosts(term) {
    const results = [];
    
    this.postCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent || '';
      const content = card.querySelector('p')?.textContent || '';
      const category = card.querySelector(SELECTORS.categoryTags)?.textContent || '';
      const author = card.querySelector('.meta-item:nth-child(2)')?.textContent || '';
      
      const searchableText = Utils.sanitizeString(`${title} ${content} ${category} ${author}`);
      
      if (searchableText.includes(term)) {
        const relevanceScore = this.calculateRelevance(term, title, content, category);
        results.push({ element: card, score: relevanceScore });
      }
    });
    
    // Ordenar por relevância
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Calcular relevância do resultado
   */
  calculateRelevance(term, title, content, category) {
    let score = 0;
    const sanitizedTitle = Utils.sanitizeString(title);
    const sanitizedContent = Utils.sanitizeString(content);
    const sanitizedCategory = Utils.sanitizeString(category);
    
    // Pontuação por localização do termo
    if (sanitizedTitle.includes(term)) score += 10;
    if (sanitizedCategory.includes(term)) score += 8;
    if (sanitizedContent.includes(term)) score += 5;
    
    // Pontuação por posição no título
    const titleIndex = sanitizedTitle.indexOf(term);
    if (titleIndex === 0) score += 5; // Início do título
    else if (titleIndex > 0) score += 2; // Meio do título
    
    return score;
  }

  /**
   * Exibir resultados da busca
   */
  displayResults(results, searchTerm) {
    // Esconder todos os posts primeiro
    this.postCards.forEach(card => {
      card.style.display = 'none';
      card.setAttribute('data-search-match', 'false');
    });

    if (results.length === 0) {
      this.showNoResults(searchTerm);
      return;
    }

    // Mostrar posts encontrados com animação
    results.forEach((result, index) => {
      const card = result.element;
      card.style.display = 'block';
      card.setAttribute('data-search-match', 'true');
      
      // Animação escalonada
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }, index * 50);
    });

    this.hideNoResults();
    this.highlightSearchTerms(searchTerm);
  }

  /**
   * Destacar termos de busca
   */
  highlightSearchTerms(term) {
    if (!term || term.length < 2) return;

    const visibleCards = document.querySelectorAll('.post-card[data-search-match="true"]');
    
    visibleCards.forEach(card => {
      const title = card.querySelector('h3 a');
      const content = card.querySelector('p');
      
      if (title) {
        title.innerHTML = this.highlightText(title.textContent, term);
      }
      
      if (content) {
        content.innerHTML = this.highlightText(content.textContent, term);
      }
    });
  }

  /**
   * Destacar texto
   */
  highlightText(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  /**
   * Mostrar todos os posts
   */
  showAllPosts() {
    this.postCards.forEach(card => {
      card.style.display = 'block';
      card.setAttribute('data-search-match', 'true');
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      
      // Remover highlights
      const highlighted = card.querySelectorAll('.search-highlight');
      highlighted.forEach(mark => {
        mark.outerHTML = mark.innerHTML;
      });
    });
  }

  /**
   * Mostrar mensagem de nenhum resultado
   */
  showNoResults(searchTerm) {
    if (!this.noResultsElement) {
      this.createNoResultsElement();
    }
    
    const searchQuery = this.noResultsElement.querySelector('.search-query');
    if (searchQuery) {
      searchQuery.textContent = searchTerm;
    }
    
    this.noResultsElement.style.display = 'block';
    
    // Animação de entrada
    this.noResultsElement.style.opacity = '0';
    this.noResultsElement.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      this.noResultsElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      this.noResultsElement.style.opacity = '1';
      this.noResultsElement.style.transform = 'translateY(0)';
    });
  }

  /**
   * Esconder mensagem de nenhum resultado
   */
  hideNoResults() {
    if (this.noResultsElement) {
      this.noResultsElement.style.display = 'none';
    }
  }

  /**
   * Criar elemento de nenhum resultado
   */
  createNoResultsElement() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    this.noResultsElement = Utils.createElement('div', {
      className: 'no-results',
      role: 'status',
      'aria-live': 'polite'
    }, `
      <div class="no-results-content">
        <i class="fas fa-search" aria-hidden="true"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não encontramos artigos para "<span class="search-query"></span>"</p>
        <div class="search-suggestions">
          <p>Tente:</p>
          <ul>
            <li>Verificar a ortografia</li>
            <li>Usar palavras-chave diferentes</li>
            <li>Usar termos mais gerais</li>
          </ul>
        </div>
        <button class="btn-clear-search" type="button">
          <i class="fas fa-times"></i>
          Limpar busca
        </button>
      </div>
    `);

    // Adicionar evento para limpar busca
    const clearBtn = this.noResultsElement.querySelector('.btn-clear-search');
    clearBtn.addEventListener('click', this.clearSearch.bind(this));

    postsGrid.appendChild(this.noResultsElement);
  }

  /**
   * Limpar busca
   */
  clearSearch() {
    this.searchInput.value = '';
    this.stateManager.setState({ searchTerm: '' });
    this.showAllPosts();
    this.hideNoResults();
    Utils.storage.remove('lastSearch');
    this.searchInput.focus();
  }

  /**
   * Restaurar busca anterior
   */
  restorePreviousSearch() {
    const lastSearch = Utils.storage.get('lastSearch');
    if (lastSearch) {
      this.searchInput.value = lastSearch;
      this.performSearch(lastSearch);
    }
  }

  /**
   * Listener para mudanças no termo de busca
   */
  onSearchTermChange(newTerm, oldTerm) {
    if (newTerm !== oldTerm) {
      // Atualizar URL sem recarregar página
      const url = new URL(window.location);
      if (newTerm) {
        url.searchParams.set('search', newTerm);
      } else {
        url.searchParams.delete('search');
      }
      history.replaceState(null, '', url);
    }
  }

  /**
   * Rastrear busca para analytics
   */
  trackSearch(term, resultsCount) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: term,
        results_count: resultsCount
      });
    }
    
    // Console para debug
    console.log(`Busca: "${term}" - ${resultsCount} resultados`);
  }
}

// ===================================
// Sistema de Lazy Loading
// ===================================
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll(SELECTORS.lazyImages);
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
      this.observeImages();
    } else {
      // Fallback para navegadores antigos
      this.loadAllImages();
    }
  }

  /**
   * Criar observer para lazy loading
   */
  createObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: CONFIG.LAZY_LOADING_THRESHOLD
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Observar imagens
   */
  observeImages() {
    this.images.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  /**
   * Carregar imagem
   */
  loadImage(img) {
    // Criar nova imagem para preload
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // Aplicar efeito de fade-in
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      // Atualizar src
      img.src = img.dataset.src || img.src;
      
      // Fade-in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
      
      // Remover atributo loading
      img.removeAttribute('loading');
      img.classList.add('loaded');
    };
    
    imageLoader.onerror = () => {
      img.classList.add('error');
      console.warn('Erro ao carregar imagem:', img.src);
    };
    
    // Iniciar carregamento
    imageLoader.src = img.dataset.src || img.src;
  }

  /**
   * Carregar todas as imagens (fallback)
   */
  loadAllImages() {
    this.images.forEach(img => {
      this.loadImage(img);
    });
  }
}

// ===================================
// Sistema de Animações
// ===================================
class AnimationSystem {
  constructor() {
    this.animatedElements = document.querySelectorAll(SELECTORS.animatedElements);
    this.animationObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
      this.observeElements();
    } else {
      // Fallback: animar todos os elementos imediatamente
      this.animateAllElements();
    }
    
    this.initScrollAnimations();
  }

  /**
   * Criar observer para animações
   */
  createObserver() {
    const options = {
      root: null,
      rootMargin: '-10%',
      threshold: 0.1
    };

    this.animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.animationObserver.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Observar elementos para animação
   */
  observeElements() {
    this.animatedElements.forEach(element => {
      this.animationObserver.observe(element);
    });
  }

  /**
   * Animar elemento
   */
  animateElement(element) {
    const animationType = element.dataset.aos || 'fade-up';
    const delay = element.dataset.aosDelay || 0;
    
    setTimeout(() => {
      element.classList.add('aos-animate');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }

  /**
   * Animar todos os elementos (fallback)
   */
  animateAllElements() {
    this.animatedElements.forEach(element => {
      this.animateElement(element);
    });
  }

  /**
   * Inicializar animações de scroll
   */
  initScrollAnimations() {
    // Parallax suave para hero background
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
      window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      }, 16));
    }
  }
}

// ===================================
// Sistema de Navegação
// ===================================
class NavigationSystem {
  constructor() {
    this.menuToggle = document.querySelector(SELECTORS.menuToggle);
    this.searchToggle = document.querySelector(SELECTORS.searchToggle);
    this.searchPopup = document.querySelector(SELECTORS.searchPopup);
    this.searchClose = document.querySelector(SELECTORS.searchClose);
    this.backToTopBtn = document.querySelector(SELECTORS.backToTopBtn);
    
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initSearchPopup();
    this.initBackToTop();
    this.initSmoothScroll();
    this.initKeyboardNavigation();
  }

  /**
   * Inicializar menu mobile
   */
  initMobileMenu() {
    if (!this.menuToggle) return;

    this.menuToggle.addEventListener('click', () => {
      const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
      this.menuToggle.setAttribute('aria-expanded', !isExpanded);
      
      const mainNav = document.querySelector('#main-nav');
      if (mainNav) {
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Foco no primeiro item do menu quando aberto
        if (!isExpanded) {
          setTimeout(() => {
            const firstMenuItem = mainNav.querySelector('a');
            if (firstMenuItem) firstMenuItem.focus();
          }, 100);
        }
      }
    });

    // Fechar menu ao clicar em links
    const menuLinks = document.querySelectorAll('#main-nav a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Fechar menu com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  /**
   * Fechar menu mobile
   */
  closeMenu() {
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      const mainNav = document.querySelector('#main-nav');
      if (mainNav) {
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }
  }

  /**
   * Inicializar popup de busca
   */
  initSearchPopup() {
    if (!this.searchToggle || !this.searchPopup) return;

    this.searchToggle.addEventListener('click', () => {
      this.openSearchPopup();
    });

    if (this.searchClose) {
      this.searchClose.addEventListener('click', () => {
        this.closeSearchPopup();
      });
    }

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchPopup.classList.contains('active')) {
        this.closeSearchPopup();
      }
    });

    // Fechar ao clicar fora
    this.searchPopup.addEventListener('click', (e) => {
      if (e.target === this.searchPopup) {
        this.closeSearchPopup();
      }
    });
  }

  /**
   * Abrir popup de busca
   */
  openSearchPopup() {
    this.searchPopup.classList.add('active');
    this.searchPopup.setAttribute('aria-hidden', 'false');
    this.searchToggle.setAttribute('aria-expanded', 'true');
    
    // Foco no campo de busca
    const searchInput = this.searchPopup.querySelector('input');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fechar popup de busca
   */
  closeSearchPopup() {
    this.searchPopup.classList.remove('active');
    this.searchPopup.setAttribute('aria-hidden', 'true');
    this.searchToggle.setAttribute('aria-expanded', 'false');
    
    // Restaurar scroll do body
    document.body.style.overflow = '';
    
    // Retornar foco para o botão
    this.searchToggle.focus();
  }

  /**
   * Inicializar botão voltar ao topo
   */
  initBackToTop() {
    if (!this.backToTopBtn) return;

    // Mostrar/esconder baseado no scroll
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.pageYOffset > CONFIG.BACK_TO_TOP_THRESHOLD) {
        this.backToTopBtn.classList.add('visible');
      } else {
        this.backToTopBtn.classList.remove('visible');
      }
    }, 100));

    // Scroll suave para o topo
    this.backToTopBtn.addEventListener('click', () => {
      Utils.smoothScrollTo(document.body);
    });
  }

  /**
   * Inicializar scroll suave
   */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
          Utils.smoothScrollTo(targetElement, headerHeight + 20);
          
          // Atualizar URL
          history.pushState(null, null, targetId);
          
          // Foco para acessibilidade
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
          targetElement.removeAttribute('tabindex');
        }
      });
    });
  }

  /**
   * Inicializar navegação por teclado
   */
  initKeyboardNavigation() {
    // Indicador visual de navegação por teclado
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.documentElement.classList.remove('keyboard-nav');
    });

    // Skip to content
    const skipLink = document.querySelector('.skip-to-content');
    const mainContent = document.querySelector('main');
    
    if (skipLink && mainContent) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.removeAttribute('tabindex');
      });
    }
  }
}

// ===================================
// Sistema de Paginação
// ===================================
class PaginationSystem {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.paginationBtns = document.querySelectorAll(SELECTORS.paginationBtns);
    this.init();
  }

  init() {
    this.paginationBtns.forEach(btn => {
      btn.addEventListener('click', this.handlePageChange.bind(this));
    });

    // Listener para mudanças de página
    this.stateManager.subscribe('currentPage', this.onPageChange.bind(this));
  }

  /**
   * Manipular mudança de página
   */
  handlePageChange(event) {
    event.preventDefault();
    
    const btn = event.currentTarget;
    const page = btn.dataset.page || btn.textContent.trim();
    
    if (page === 'prev') {
      const currentPage = this.stateManager.getState().currentPage;
      if (currentPage > 1) {
        this.stateManager.setState({ currentPage: currentPage - 1 });
      }
    } else if (page === 'next') {
      const currentPage = this.stateManager.getState().currentPage;
      this.stateManager.setState({ currentPage: currentPage + 1 });
    } else {
      const pageNumber = parseInt(page);
      if (!isNaN(pageNumber)) {
        this.stateManager.setState({ currentPage: pageNumber });
      }
    }
  }

  /**
   * Listener para mudanças de página
   */
  onPageChange(newPage, oldPage) {
    if (newPage !== oldPage) {
      this.updatePaginationUI(newPage);
      this.loadPageContent(newPage);
      this.scrollToTop();
    }
  }

  /**
   * Atualizar interface da paginação
   */
  updatePaginationUI(currentPage) {
    this.paginationBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
      
      const page = btn.dataset.page || btn.textContent.trim();
      if (page == currentPage) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Carregar conteúdo da página
   */
  loadPageContent(page) {
    // Simular carregamento
    this.showLoadingState();
    
    setTimeout(() => {
      this.hideLoadingState();
      // Aqui seria feita a requisição real para carregar novos posts
      console.log(`Carregando página ${page}`);
    }, 800);
  }

  /**
   * Mostrar estado de carregamento
   */
  showLoadingState() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    const loadingOverlay = Utils.createElement('div', {
      className: 'loading-overlay'
    }, '<div class="loading-spinner"></div>');

    postsGrid.style.position = 'relative';
    postsGrid.appendChild(loadingOverlay);
  }

  /**
   * Esconder estado de carregamento
   */
  hideLoadingState() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }

  /**
   * Scroll para o topo da seção de posts
   */
  scrollToTop() {
    const postsSection = document.querySelector('.section-recent-posts');
    if (postsSection) {
      const headerHeight = document.querySelector('#header')?.offsetHeight || 0;
      Utils.smoothScrollTo(postsSection, headerHeight + 20);
    }
  }
}

// ===================================
// Sistema de Performance
// ===================================
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0
    };
    
    this.init();
  }

  init() {
    // Medir tempo de carregamento
    window.addEventListener('load', () => {
      this.measurePerformance();
    });

    // Observar mudanças de layout
    if ('PerformanceObserver' in window) {
      this.observeLayoutShifts();
    }
  }

  /**
   * Medir métricas de performance
   */
  measurePerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      paint.forEach(entry => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
      
      this.reportMetrics();
    }
  }

  /**
   * Observar mudanças de layout (CLS)
   */
  observeLayoutShifts() {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Reportar CLS ao sair da página
    window.addEventListener('beforeunload', () => {
      this.metrics.cumulativeLayoutShift = clsValue;
      this.reportMetrics();
    });
  }

  /**
   * Reportar métricas
   */
  reportMetrics() {
    console.group('📊 Métricas de Performance');
    console.log('Tempo de carregamento:', this.metrics.loadTime.toFixed(2) + 'ms');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded.toFixed(2) + 'ms');
    console.log('First Paint:', this.metrics.firstPaint.toFixed(2) + 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint.toFixed(2) + 'ms');
    if (this.metrics.cumulativeLayoutShift) {
      console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift.toFixed(4));
    }
    console.groupEnd();

    // Enviar para analytics se disponível
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: 'blog_page_load',
        value: Math.round(this.metrics.loadTime)
      });
    }
  }
}

// ===================================
// Inicialização Principal
// ===================================
class BlogApp {
  constructor() {
    this.stateManager = new StateManager();
    this.systems = {};
    
    this.init();
  }

  async init() {
    try {
      // Aguardar DOM estar pronto
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Inicializar sistemas
      this.systems.search = new SearchSystem(this.stateManager);
      this.systems.lazyLoader = new LazyLoader();
      this.systems.animations = new AnimationSystem();
      this.systems.navigation = new NavigationSystem();
      this.systems.pagination = new PaginationSystem(this.stateManager);
      this.systems.performance = new PerformanceMonitor();

      // Adicionar estilos customizados
      this.addCustomStyles();

      // Inicializar PWA se disponível
      this.initPWA();

      // Log de sucesso
      console.log('🚀 Blog App inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar Blog App:', error);
    }
  }

  /**
   * Adicionar estilos customizados via JavaScript
   */
  addCustomStyles() {
    if (document.getElementById('blog-dynamic-styles')) return;

    const style = document.createElement('style');
    style.id = 'blog-dynamic-styles';
    style.textContent = `
      .search-highlight {
        background: linear-gradient(120deg, #ffeaa7 0%, #fab1a0 100%);
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 600;
      }
      
      .aos-animate {
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .loaded {
        animation: imageLoaded 0.3s ease;
      }
      
      @keyframes imageLoaded {
        from { opacity: 0; transform: scale(1.05); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .error {
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6c757d;
      }
      
      .error::before {
        content: "⚠️ Erro ao carregar imagem";
        font-size: 14px;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Inicializar PWA
   */
  initPWA() {
    // Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registrado:', registration);
          })
          .catch(error => {
            console.log('❌ Falha ao registrar Service Worker:', error);
          });
      });
    }

    // Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Mostrar botão de instalação customizado
      this.showInstallButton(deferredPrompt);
    });
  }

  /**
   * Mostrar botão de instalação PWA
   */
  showInstallButton(deferredPrompt) {
    const installBtn = document.createElement('button');
    installBtn.className = 'install-app-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
    installBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: var(--primary-gradient);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transition: transform 0.3s ease;
    `;

    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ PWA instalado');
        }
        deferredPrompt = null;
        installBtn.remove();
      });
    });

    document.body.appendChild(installBtn);

    // Remover após 10 segundos se não usado
    setTimeout(() => {
      if (installBtn.parentNode) {
        installBtn.remove();
      }
    }, 10000);
  }

  /**
   * Obter instância do sistema
   */
  getSystem(name) {
    return this.systems[name];
  }

  /**
   * Obter estado atual
   */
  getState() {
    return this.stateManager.getState();
  }
}

// ===================================
// Inicialização Global
// ===================================

// Criar instância global da aplicação
window.BlogApp = new BlogApp();

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BlogApp, Utils };
}

