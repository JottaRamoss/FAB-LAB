/**
 * Nossa História - JavaScript Melhorado
 * Versão otimizada com melhor performance, acessibilidade e manutenibilidade
 */

(function() {
    'use strict';

    // Configurações globais
    const CONFIG = {
        animationDuration: 800,
        scrollOffset: 100,
        counterDuration: 2000,
        parallaxRate: 0.5,
        debounceDelay: 16, // ~60fps
        breakpoints: {
            mobile: 768,
            tablet: 1024
        },
        backToTopThreshold: 300
    };

    // Estado da aplicação
    const state = {
        isInitialized: false,
        observers: new Map(),
        animatedCounters: new Set(),
        scrollPosition: 0,
        isReducedMotion: false,
        activeDropdown: null,
        isMenuOpen: false
    };

    // Utilitários
    const utils = {
        // Debounce para otimizar eventos de scroll
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

        // Throttle para eventos frequentes
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

        // Verificar se elemento está visível
        isElementVisible(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Verificar suporte a Intersection Observer
        supportsIntersectionObserver() {
            return 'IntersectionObserver' in window;
        },

        // Verificar preferência por movimento reduzido
        prefersReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        // Verificar se é dispositivo móvel
        isMobile() {
            return window.innerWidth <= CONFIG.breakpoints.mobile;
        },

        // Função de easing suave
        easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        },

        // Sanitizar entrada do usuário
        sanitizeInput(input) {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        },

        // Validar email
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Gerar ID único
        generateId() {
            return 'id_' + Math.random().toString(36).substr(2, 9);
        }
    };

    // Gerenciador de eventos melhorado
    const eventManager = {
        listeners: new WeakMap(),

        add(element, event, handler, options = {}) {
            if (!element || !event || !handler) return;

            const id = utils.generateId();
            if (!this.listeners.has(element)) {
                this.listeners.set(element, new Map());
            }

            const elementListeners = this.listeners.get(element);
            elementListeners.set(id, { event, handler, options });
            
            element.addEventListener(event, handler, options);
            return id;
        },

        remove(element, id) {
            if (!element || !id || !this.listeners.has(element)) return;

            const elementListeners = this.listeners.get(element);
            if (elementListeners.has(id)) {
                const { event, handler } = elementListeners.get(id);
                element.removeEventListener(event, handler);
                elementListeners.delete(id);
            }
        },

        removeAll(element) {
            if (!element || !this.listeners.has(element)) return;

            const elementListeners = this.listeners.get(element);
            elementListeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
            elementListeners.clear();
        }
    };

    // Animações de scroll
    const scrollAnimations = {
        init() {
            if (!utils.supportsIntersectionObserver()) {
                this.fallbackInit();
                return;
            }

            const observerOptions = {
                threshold: 0.1,
                rootMargin: `0px 0px -${CONFIG.scrollOffset}px 0px`
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observar elementos para animação
            const animatedElements = document.querySelectorAll(
                '.timeline-item, .value-card, .impact-stat, .section-header'
            );

            animatedElements.forEach(element => {
                observer.observe(element);
            });

            state.observers.set('scroll', observer);
        },

        fallbackInit() {
            // Fallback para navegadores sem Intersection Observer
            const handleScroll = utils.throttle(() => {
                const elements = document.querySelectorAll(
                    '.timeline-item:not(.animate-in), .value-card:not(.animate-in), .impact-stat:not(.animate-in)'
                );

                elements.forEach(element => {
                    if (utils.isElementVisible(element)) {
                        this.animateElement(element);
                    }
                });
            }, CONFIG.debounceDelay);

            eventManager.add(window, 'scroll', handleScroll, { passive: true });
        },

        animateElement(element) {
            if (state.isReducedMotion) {
                element.style.opacity = '1';
                element.style.transform = 'none';
                return;
            }

            element.classList.add('animate-in');

            // Animar contadores se existirem
            const counters = element.querySelectorAll('[data-count]');
            counters.forEach(counter => this.animateCounter(counter));
        },

        animateCounter(element) {
            if (state.animatedCounters.has(element)) return;

            const target = parseInt(element.dataset.count) || 0;
            const duration = CONFIG.counterDuration;
            const start = performance.now();
            const startValue = 0;

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = utils.easeOutQuart(progress);
                const current = Math.floor(startValue + (target - startValue) * easedProgress);

                element.textContent = current.toLocaleString('pt-BR');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString('pt-BR');
                    state.animatedCounters.add(element);
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // Interações da timeline
    const timelineInteractions = {
        init() {
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            timelineItems.forEach((item, index) => {
                this.setupItemInteractions(item, index);
            });
        },

        setupItemInteractions(item, index) {
            const marker = item.querySelector('.timeline-marker');
            const content = item.querySelector('.timeline-content');

            if (!marker || !content) return;

            // Adicionar delay baseado no índice para animação escalonada
            item.style.setProperty('--animation-delay', `${index * 0.1}s`);

            // Eventos de hover
            const handleMouseEnter = () => {
                if (state.isReducedMotion) return;
                
                item.classList.add('timeline-item-hover');
                marker.classList.add('timeline-marker-hover');
            };

            const handleMouseLeave = () => {
                item.classList.remove('timeline-item-hover');
                marker.classList.remove('timeline-marker-hover');
            };

            eventManager.add(item, 'mouseenter', handleMouseEnter);
            eventManager.add(item, 'mouseleave', handleMouseLeave);

            // Suporte a touch para dispositivos móveis
            if ('ontouchstart' in window) {
                eventManager.add(item, 'touchstart', handleMouseEnter, { passive: true });
                eventManager.add(item, 'touchend', handleMouseLeave, { passive: true });
            }
        }
    };

    // Efeitos parallax otimizados
    const parallaxEffects = {
        init() {
            if (state.isReducedMotion || utils.isMobile()) return;

            const parallaxElements = document.querySelectorAll('.page-hero, .section-cta');
            if (parallaxElements.length === 0) return;

            const handleScroll = utils.throttle(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const rate = scrolled * CONFIG.parallaxRate;
                    element.style.transform = `translate3d(0, ${rate}px, 0)`;
                });
            }, CONFIG.debounceDelay);

            eventManager.add(window, 'scroll', handleScroll, { passive: true });
        }
    };

    // Navegação e menu melhorado
    const navigation = {
        init() {
            this.setupMobileMenu();
            this.setupSearchPopup();
            this.setupSmoothScrolling();
            this.setupKeyboardNavigation();
            this.setupBackToTop();
        },

        setupMobileMenu() {
            const menuButton = document.querySelector('.btn-menu');
            const menu = document.querySelector('.menu');

            if (!menuButton || !menu) return;

            const toggleMenu = () => {
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                const newState = !isExpanded;
                
                menuButton.setAttribute('aria-expanded', newState);
                menu.classList.toggle('menu-open', newState);
                state.isMenuOpen = newState;
                
                // Prevenir scroll do body quando menu está aberto
                document.body.style.overflow = newState ? 'hidden' : '';
                
                // Gerenciar foco
                if (newState) {
                    const firstMenuItem = menu.querySelector('a');
                    if (firstMenuItem) firstMenuItem.focus();
                } else {
                    menuButton.focus();
                }
            };

            eventManager.add(menuButton, 'click', toggleMenu);

            // Fechar menu ao clicar fora
            eventManager.add(document, 'click', (e) => {
                if (!menuButton.contains(e.target) && !menu.contains(e.target)) {
                    if (state.isMenuOpen) {
                        toggleMenu();
                    }
                }
            });

            // Fechar menu com ESC
            eventManager.add(document, 'keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    toggleMenu();
                }
            });
        },

        setupSearchPopup() {
            const searchToggle = document.querySelector('.search-toggle');
            const searchPopup = document.querySelector('.search-popup');
            const searchClose = document.querySelector('.btn-close');
            const searchInput = document.querySelector('#search-input');
            const searchForm = searchPopup?.querySelector('form');

            if (!searchToggle || !searchPopup || !searchClose) return;

            const openSearch = () => {
                searchPopup.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                // Focar no input após a animação
                setTimeout(() => {
                    if (searchInput) searchInput.focus();
                }, 300);
            };

            const closeSearch = () => {
                searchPopup.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                searchToggle.focus(); // Retornar foco para o botão
            };

            eventManager.add(searchToggle, 'click', openSearch);
            eventManager.add(searchClose, 'click', closeSearch);

            // Fechar com ESC
            eventManager.add(document, 'keydown', (e) => {
                if (e.key === 'Escape' && searchPopup.getAttribute('aria-hidden') === 'false') {
                    closeSearch();
                }
            });

            // Fechar ao clicar no backdrop
            eventManager.add(searchPopup, 'click', (e) => {
                if (e.target === searchPopup) {
                    closeSearch();
                }
            });

            // Gerenciar envio do formulário de busca
            if (searchForm) {
                eventManager.add(searchForm, 'submit', (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        // Aqui você implementaria a lógica de busca
                        notifications.show(`Buscando por: "${query}"`, 'info');
                        closeSearch();
                    }
                });
            }
        },

        setupSmoothScrolling() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                eventManager.add(link, 'click', (e) => {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: state.isReducedMotion ? 'auto' : 'smooth'
                        });
                    }
                });
            });
        },

        setupKeyboardNavigation() {
            // Melhorar navegação por teclado nos menus dropdown
            const menuItems = document.querySelectorAll('.menu-item-has-children');
            
            menuItems.forEach(item => {
                const link = item.querySelector('a');
                const submenu = item.querySelector('.sub-menu');
                const submenuItems = submenu?.querySelectorAll('a');
                
                if (!link || !submenu || !submenuItems) return;

                let isSubmenuOpen = false;

                const openSubmenu = () => {
                    link.setAttribute('aria-expanded', 'true');
                    submenu.style.display = 'block';
                    isSubmenuOpen = true;
                    state.activeDropdown = item;
                };

                const closeSubmenu = () => {
                    link.setAttribute('aria-expanded', 'false');
                    submenu.style.display = 'none';
                    isSubmenuOpen = false;
                    if (state.activeDropdown === item) {
                        state.activeDropdown = null;
                    }
                };

                // Navegação por teclado
                eventManager.add(link, 'keydown', (e) => {
                    switch (e.key) {
                        case 'Enter':
                        case ' ':
                            e.preventDefault();
                            if (isSubmenuOpen) {
                                closeSubmenu();
                            } else {
                                openSubmenu();
                                submenuItems[0]?.focus();
                            }
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            if (!isSubmenuOpen) {
                                openSubmenu();
                            }
                            submenuItems[0]?.focus();
                            break;
                        case 'Escape':
                            if (isSubmenuOpen) {
                                closeSubmenu();
                                link.focus();
                            }
                            break;
                    }
                });

                // Navegação dentro do submenu
                submenuItems.forEach((submenuItem, index) => {
                    eventManager.add(submenuItem, 'keydown', (e) => {
                        switch (e.key) {
                            case 'ArrowDown':
                                e.preventDefault();
                                const nextIndex = (index + 1) % submenuItems.length;
                                submenuItems[nextIndex].focus();
                                break;
                            case 'ArrowUp':
                                e.preventDefault();
                                const prevIndex = index === 0 ? submenuItems.length - 1 : index - 1;
                                submenuItems[prevIndex].focus();
                                break;
                            case 'Escape':
                                closeSubmenu();
                                link.focus();
                                break;
                            case 'Tab':
                                if (e.shiftKey && index === 0) {
                                    closeSubmenu();
                                } else if (!e.shiftKey && index === submenuItems.length - 1) {
                                    closeSubmenu();
                                }
                                break;
                        }
                    });
                });

                // Fechar submenu ao perder foco
                eventManager.add(item, 'focusout', (e) => {
                    setTimeout(() => {
                        if (!item.contains(document.activeElement)) {
                            closeSubmenu();
                        }
                    }, 0);
                });
            });
        },

        setupBackToTop() {
            const backToTopButton = document.querySelector('.back-to-top');
            if (!backToTopButton) return;

            const toggleBackToTop = () => {
                const scrolled = window.pageYOffset;
                if (scrolled > CONFIG.backToTopThreshold) {
                    backToTopButton.classList.add('show');
                } else {
                    backToTopButton.classList.remove('show');
                }
            };

            const scrollToTop = () => {
                window.scrollTo({
                    top: 0,
                    behavior: state.isReducedMotion ? 'auto' : 'smooth'
                });
            };

            eventManager.add(window, 'scroll', utils.throttle(toggleBackToTop, 100), { passive: true });
            eventManager.add(backToTopButton, 'click', scrollToTop);
        }
    };

    // Sistema de notificações melhorado
    const notifications = {
        container: null,

        init() {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-label', 'Notificações');
            document.body.appendChild(this.container);
        },

        show(message, type = 'info', duration = 4000) {
            if (!this.container) this.init();

            const notification = this.create(message, type);
            this.container.appendChild(notification);

            // Animar entrada
            requestAnimationFrame(() => {
                notification.classList.add('notification-show');
            });

            // Auto-remover
            setTimeout(() => {
                this.remove(notification);
            }, duration);

            return notification;
        },

        create(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.setAttribute('role', 'alert');
            
            const content = document.createElement('div');
            content.className = 'notification-content';
            content.textContent = utils.sanitizeInput(message);
            
            const closeButton = document.createElement('button');
            closeButton.className = 'notification-close';
            closeButton.setAttribute('aria-label', 'Fechar notificação');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            
            eventManager.add(closeButton, 'click', () => {
                this.remove(notification);
            });

            notification.appendChild(content);
            notification.appendChild(closeButton);

            return notification;
        },

        remove(notification) {
            if (!notification || !notification.parentNode) return;

            notification.classList.add('notification-hide');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    };

    // Newsletter e formulários
    const forms = {
        init() {
            this.setupNewsletterForm();
        },

        setupNewsletterForm() {
            const form = document.getElementById('newsletterForm');
            const emailInput = document.getElementById('newsletterEmail');
            const errorDiv = document.getElementById('newsletter-error');

            if (!form || !emailInput || !errorDiv) return;

            const showError = (message) => {
                errorDiv.textContent = message;
                errorDiv.classList.add('show');
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.setAttribute('aria-describedby', 'newsletter-error');
            };

            const hideError = () => {
                errorDiv.textContent = '';
                errorDiv.classList.remove('show');
                emailInput.setAttribute('aria-invalid', 'false');
                emailInput.removeAttribute('aria-describedby');
            };

            const validateEmail = () => {
                const email = emailInput.value.trim();
                
                if (!email) {
                    showError('Por favor, insira seu e-mail.');
                    return false;
                }
                
                if (!utils.isValidEmail(email)) {
                    showError('Por favor, insira um e-mail válido.');
                    return false;
                }
                
                hideError();
                return true;
            };

            // Validação em tempo real
            eventManager.add(emailInput, 'blur', validateEmail);
            eventManager.add(emailInput, 'input', () => {
                if (errorDiv.classList.contains('show')) {
                    validateEmail();
                }
            });

            // Envio do formulário
            eventManager.add(form, 'submit', (e) => {
                e.preventDefault();
                
                if (!validateEmail()) {
                    emailInput.focus();
                    return;
                }

                const email = emailInput.value.trim();
                
                // Simular envio (aqui você implementaria a lógica real)
                notifications.show('Obrigado! Você foi inscrito na nossa newsletter.', 'success');
                form.reset();
                hideError();
            });
        }
    };

    // Performance e otimização
    const performance = {
        init() {
            this.setupLazyLoading();
            this.setupImageOptimization();
            this.monitorPerformance();
        },

        setupLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        },

        setupImageOptimization() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                // Adicionar loading="lazy" se não especificado
                if (!img.hasAttribute('loading') && !img.closest('.hero-bg')) {
                    img.setAttribute('loading', 'lazy');
                }

                // Adicionar event listeners para tratamento de erro
                eventManager.add(img, 'error', () => {
                    img.style.display = 'none';
                    console.warn('Falha ao carregar imagem:', img.src);
                });
            });
        },

        monitorPerformance() {
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach(entry => {
                            if (entry.entryType === 'largest-contentful-paint') {
                                // Em produção, você enviaria estes dados para analytics
                                if (process.env.NODE_ENV === 'development') {
                                    console.log('LCP:', entry.startTime);
                                }
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    console.warn('Performance monitoring not supported');
                }
            }
        }
    };

    // Acessibilidade melhorada
    const accessibility = {
        init() {
            this.setupFocusManagement();
            this.setupAriaLabels();
            this.setupReducedMotion();
            this.setupKeyboardShortcuts();
        },

        setupFocusManagement() {
            // Melhorar indicadores de foco
            const focusableElements = document.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );

            focusableElements.forEach(element => {
                eventManager.add(element, 'focus', () => {
                    element.classList.add('focus-visible');
                });

                eventManager.add(element, 'blur', () => {
                    element.classList.remove('focus-visible');
                });
            });

            // Trap focus em modais
            const modals = document.querySelectorAll('[role="dialog"]');
            modals.forEach(modal => {
                this.setupFocusTrap(modal);
            });
        },

        setupFocusTrap(modal) {
            const focusableElements = modal.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            eventManager.add(modal, 'keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        },

        setupAriaLabels() {
            // Adicionar labels ARIA dinâmicos onde necessário
            const counters = document.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const value = counter.dataset.count;
                const label = counter.nextElementSibling?.textContent || 'contador';
                counter.setAttribute('aria-label', `${value} ${label}`);
            });

            // Melhorar labels de formulários
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    const label = input.closest('form')?.querySelector(`label[for="${input.id}"]`);
                    if (!label && input.placeholder) {
                        input.setAttribute('aria-label', input.placeholder);
                    }
                }
            });
        },

        setupReducedMotion() {
            state.isReducedMotion = utils.prefersReducedMotion();
            
            // Escutar mudanças na preferência
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            const handleMotionChange = (e) => {
                state.isReducedMotion = e.matches;
                
                if (state.isReducedMotion) {
                    document.body.classList.add('reduced-motion');
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleMotionChange);
            } else {
                // Fallback para navegadores mais antigos
                mediaQuery.addListener(handleMotionChange);
            }

            if (state.isReducedMotion) {
                document.body.classList.add('reduced-motion');
            }
        },

        setupKeyboardShortcuts() {
            eventManager.add(document, 'keydown', (e) => {
                // Alt + S para abrir busca
                if (e.altKey && e.key === 's') {
                    e.preventDefault();
                    const searchToggle = document.querySelector('.search-toggle');
                    if (searchToggle) searchToggle.click();
                }

                // Alt + M para abrir menu mobile
                if (e.altKey && e.key === 'm' && utils.isMobile()) {
                    e.preventDefault();
                    const menuToggle = document.querySelector('.btn-menu');
                    if (menuToggle) menuToggle.click();
                }

                // Alt + T para voltar ao topo
                if (e.altKey && e.key === 't') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: state.isReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        }
    };

    // Inicialização principal
    const app = {
        init() {
            if (state.isInitialized) return;

            try {
                // Verificar se DOM está pronto
                if (document.readyState === 'loading') {
                    eventManager.add(document, 'DOMContentLoaded', () => this.start());
                } else {
                    this.start();
                }
            } catch (error) {
                console.error('Erro na inicialização:', error);
                this.handleError(error);
            }
        },

        start() {
            console.log('📚 Nossa História - Iniciando aplicação...');

            // Inicializar módulos na ordem correta
            accessibility.init();
            performance.init();
            navigation.init();
            scrollAnimations.init();
            timelineInteractions.init();
            parallaxEffects.init();
            forms.init();
            notifications.init();

            state.isInitialized = true;
            
            console.log('✅ Nossa História - Aplicação inicializada com sucesso!');
            
            // Notificar que a página está pronta
            this.notifyReady();
        },

        notifyReady() {
            // Disparar evento customizado
            const readyEvent = new CustomEvent('historiaReady', {
                detail: { 
                    timestamp: Date.now(),
                    version: '2.1.0'
                }
            });
            document.dispatchEvent(readyEvent);

            // Callback global se existir
            if (typeof window.onHistoriaReady === 'function') {
                window.onHistoriaReady();
            }
        },

        handleError(error) {
            console.error('Erro na aplicação Nossa História:', error);
            
            // Tentar recuperação básica
            try {
                scrollAnimations.fallbackInit();
                notifications.show('Alguns recursos podem não funcionar corretamente.', 'warning');
            } catch (fallbackError) {
                console.error('Erro na recuperação:', fallbackError);
            }
        },

        destroy() {
            // Limpar recursos
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                eventManager.removeAll(element);
            });
            
            state.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            
            state.observers.clear();
            state.animatedCounters.clear();
            state.isInitialized = false;
            
            console.log('🧹 Nossa História - Recursos limpos');
        }
    };

    // API pública
    window.HistoriaJS = {
        init: () => app.init(),
        destroy: () => app.destroy(),
        showNotification: (message, type, duration) => notifications.show(message, type, duration),
        getState: () => ({ ...state }),
        version: '2.1.0'
    };

    // Auto-inicialização
    app.init();

    // Cleanup ao descarregar a página
    eventManager.add(window, 'beforeunload', () => {
        app.destroy();
    });

})();

