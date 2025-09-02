// ===== MISSÃO E VISÃO - JAVASCRIPT MELHORADO =====

/**
 * Configuração e dados da aplicação aprimorados
 */
const CONFIG = {
    // Configurações de animação
    animation: {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        staggerDelay: 200,
        observerThreshold: 0.1,
        observerRootMargin: '0px 0px -50px 0px'
    },
    
    // Configurações de tema
    theme: {
        storageKey: 'fab-lab-theme',
        default: 'light',
        transitionDuration: 300
    },
    
    // Configurações de performance
    performance: {
        debounceDelay: 250,
        throttleDelay: 16,
        lazyLoadOffset: 100
    },
    
    // Configurações de scroll
    scroll: {
        smoothBehavior: true,
        backToTopThreshold: 300,
        headerScrollThreshold: 100
    }
};

/**
 * Dados estruturados da missão, visão e valores aprimorados
 */
const DATA = {
    mission: {
        title: "Nossa Missão",
        description: "Democratizar o acesso à fabricação digital e promover a cultura de inovação no Brasil, capacitando pessoas e organizações para criar soluções transformadoras através de tecnologias emergentes, educação de qualidade e pesquisa aplicada.",
        features: [
            {
                icon: "fas fa-users",
                text: "Capacitar pessoas com conhecimento em fabricação digital",
                color: "#4da6ff"
            },
            {
                icon: "fas fa-lightbulb", 
                text: "Fomentar a inovação e criatividade tecnológica",
                color: "#00d4ff"
            },
            {
                icon: "fas fa-network-wired",
                text: "Conectar makers, empreendedores e instituições",
                color: "#003cff"
            },
            {
                icon: "fas fa-graduation-cap",
                text: "Promover educação tecnológica de qualidade",
                color: "#2f71ff"
            }
        ],
        stats: {
            projects: 1000,
            people: 500,
            years: 10
        }
    },
    
    vision: {
        title: "Nossa Visão",
        description: "Ser reconhecido como o principal centro de referência em fabricação digital e inovação da América Latina, liderando a transformação da indústria brasileira através da educação, pesquisa e desenvolvimento de tecnologias que moldam o futuro.",
        goals: [
            {
                icon: "fas fa-trophy",
                title: "Liderança Regional",
                description: "Referência em fabricação digital na América Latina",
                progress: 85
            },
            {
                icon: "fas fa-leaf",
                title: "Sustentabilidade", 
                description: "Práticas eco-friendly e economia circular",
                progress: 70
            },
            {
                icon: "fas fa-globe",
                title: "Impacto Global",
                description: "Soluções que transformam comunidades",
                progress: 90
            },
            {
                icon: "fas fa-rocket",
                title: "Inovação Contínua",
                description: "Sempre na vanguarda tecnológica",
                progress: 95
            }
        ]
    },
    
    values: [
        {
            icon: "fas fa-heart",
            title: "Paixão pela Inovação",
            description: "Acreditamos que a paixão é o combustível da inovação. Cada projeto é uma oportunidade de criar algo extraordinário.",
            examples: ["Criatividade", "Experimentação", "Ousadia"],
            color: "#e74c3c"
        },
        {
            icon: "fas fa-handshake",
            title: "Colaboração",
            description: "Valorizamos o trabalho em equipe e a troca de conhecimentos. Juntos, somos mais fortes e criativos.",
            examples: ["Trabalho em Equipe", "Compartilhamento", "Networking"],
            color: "#3498db"
        },
        {
            icon: "fas fa-star",
            title: "Excelência",
            description: "Buscamos a excelência em tudo que fazemos, desde o atendimento até a qualidade dos nossos projetos e serviços.",
            examples: ["Qualidade", "Precisão", "Melhoria Contínua"],
            color: "#f39c12"
        },
        {
            icon: "fas fa-shield-alt",
            title: "Integridade",
            description: "Agimos com transparência, honestidade e ética em todas as nossas relações e decisões empresariais.",
            examples: ["Transparência", "Honestidade", "Responsabilidade"],
            color: "#2ecc71"
        },
        {
            icon: "fas fa-seedling",
            title: "Sustentabilidade",
            description: "Comprometidos com práticas sustentáveis que preservem o meio ambiente para as futuras gerações.",
            examples: ["Eco-friendly", "Reciclagem", "Energia Limpa"],
            color: "#27ae60"
        },
        {
            icon: "fas fa-universal-access",
            title: "Inclusão",
            description: "Acreditamos que a tecnologia deve ser acessível a todos, independentemente de origem, gênero ou condição social.",
            examples: ["Diversidade", "Acessibilidade", "Igualdade"],
            color: "#9b59b6"
        }
    ]
};

/**
 * Classe principal da aplicação melhorada
 */
class MissionVisionApp {
    constructor() {
        this.observers = new Map();
        this.isInitialized = false;
        this.currentTheme = localStorage.getItem(CONFIG.theme.storageKey) || CONFIG.theme.default;
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.animationFrameId = null;
        
        // Bind methods
        this.handleScroll = this.throttle(this.handleScroll.bind(this), CONFIG.performance.throttleDelay);
        this.handleResize = this.debounce(this.handleResize.bind(this), CONFIG.performance.debounceDelay);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleThemeToggle = this.handleThemeToggle.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    
    /**
     * Inicialização da aplicação
     */
    async init() {
        try {
            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Aplicar tema inicial
            this.applyTheme(this.currentTheme);
            
            // Inicializar componentes
            await this.initializeComponents();
            
            this.isInitialized = true;
            
            console.log('🎯 Fab Lab Brasil - Missão e Visão carregado com sucesso!');
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
        }
    }
    
    /**
     * Inicializar todos os componentes
     */
    async initializeComponents() {
        const tasks = [
            () => this.renderContent(),
            () => this.initScrollAnimations(),
            () => this.initInteractiveElements(),
            () => this.initThemeSystem(),
            () => this.initAccessibility(),
            () => this.initPerformanceOptimizations(),
            () => this.initEventListeners(),
            () => this.initParticleEffects(),
            () => this.initCounterAnimations(),
            () => this.initLazyLoading()
        ];
        
        // Executar tarefas em paralelo quando possível
        await Promise.all(tasks.map(task => {
            try {
                return Promise.resolve(task());
            } catch (error) {
                console.warn('Erro em componente:', error);
                return Promise.resolve();
            }
        }));
    }
    
    /**
     * Renderizar conteúdo dinâmico
     */
    renderContent() {
        this.renderMissionSection();
        this.renderVisionSection();
        this.renderValuesSection();
    }
    
    /**
     * Renderizar seção de missão aprimorada
     */
    renderMissionSection() {
        const container = document.querySelector('.mission-content');
        if (!container) return;
        
        const { mission } = DATA;
        
        container.innerHTML = `
            <div class="mission-text">
                <div class="mission-icon" aria-hidden="true">
                    <i class="fas fa-bullseye"></i>
                </div>
                <h2 id="mission-heading" class="mission-title">${mission.title}</h2>
                <p class="mission-description">${mission.description}</p>
                <div class="mission-features">
                    ${mission.features.map((feature, index) => `
                        <div class="mission-feature" style="animation-delay: ${index * 0.1}s" data-color="${feature.color}">
                            <div class="mission-feature-icon" aria-hidden="true" style="background: linear-gradient(135deg, ${feature.color}, ${this.lightenColor(feature.color, 20)})">
                                <i class="${feature.icon}"></i>
                            </div>
                            <span class="mission-feature-text">${feature.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="mission-progress">
                    <div class="progress-item">
                        <span class="progress-label">Impacto Social</span>
                        <div class="progress-bar">
                            <div class="progress-fill" data-progress="90"></div>
                        </div>
                        <span class="progress-value">90%</span>
                    </div>
                </div>
            </div>
            <div class="mission-visual">
                <div class="mission-graphic" tabindex="0" role="button" aria-label="Gráfico interativo da missão">
                    <div class="mission-graphic-content">
                        <div class="mission-graphic-icon" aria-hidden="true">
                            <i class="fas fa-compass"></i>
                        </div>
                        <div class="mission-graphic-text">Guiando o Futuro</div>
                        <div class="mission-graphic-stats">
                            <div class="stat-mini">
                                <span class="stat-number" data-target="${mission.stats.projects}">0</span>
                                <span class="stat-label">Projetos</span>
                            </div>
                        </div>
                    </div>
                    <div class="graphic-particles"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizar seção de visão aprimorada
     */
    renderVisionSection() {
        const container = document.querySelector('.vision-content');
        if (!container) return;
        
        const { vision } = DATA;
        
        container.innerHTML = `
            <div class="vision-visual">
                <div class="vision-graphic" tabindex="0" role="button" aria-label="Gráfico interativo da visão">
                    <div class="vision-graphic-content">
                        <div class="vision-graphic-icon" aria-hidden="true">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="vision-graphic-text">Visão de Futuro</div>
                        <div class="vision-progress-ring">
                            <svg class="progress-ring" width="120" height="120">
                                <circle class="progress-ring-circle" stroke="#4da6ff" stroke-width="4" fill="transparent" r="52" cx="60" cy="60"/>
                            </svg>
                            <div class="progress-text">2030</div>
                        </div>
                    </div>
                    <div class="graphic-particles"></div>
                </div>
            </div>
            <div class="vision-text">
                <div class="vision-icon" aria-hidden="true">
                    <i class="fas fa-telescope"></i>
                </div>
                <h2 id="vision-heading" class="vision-title">${vision.title}</h2>
                <p class="vision-description">${vision.description}</p>
                <div class="vision-goals">
                    ${vision.goals.map((goal, index) => `
                        <div class="vision-goal" style="animation-delay: ${index * 0.1}s" data-progress="${goal.progress}">
                            <div class="vision-goal-icon" aria-hidden="true">
                                <i class="${goal.icon}"></i>
                            </div>
                            <h4 class="vision-goal-title">${goal.title}</h4>
                            <p class="vision-goal-description">${goal.description}</p>
                            <div class="goal-progress">
                                <div class="goal-progress-bar">
                                    <div class="goal-progress-fill" data-progress="${goal.progress}"></div>
                                </div>
                                <span class="goal-progress-text">${goal.progress}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizar seção de valores aprimorada
     */
    renderValuesSection() {
        const container = document.querySelector('.values-grid');
        if (!container) return;
        
        const { values } = DATA;
        
        container.innerHTML = values.map((value, index) => `
            <article class="value-card" style="animation-delay: ${index * 0.1}s" tabindex="0" data-color="${value.color}">
                <div class="value-icon" aria-hidden="true" style="background: linear-gradient(135deg, ${value.color}, ${this.lightenColor(value.color, 20)})">
                    <i class="${value.icon}"></i>
                </div>
                <h3 class="value-title">${value.title}</h3>
                <p class="value-description">${value.description}</p>
                <div class="value-examples" role="list" aria-label="Exemplos de ${value.title}">
                    ${value.examples.map(example => `
                        <span class="value-example" role="listitem">${example}</span>
                    `).join('')}
                </div>
                <div class="value-interaction">
                    <button class="value-learn-more" aria-label="Saiba mais sobre ${value.title}">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
        `).join('');
    }
    
    /**
     * Inicializar animações de scroll aprimoradas
     */
    initScrollAnimations() {
        // Intersection Observer para animações
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Adicionar classe de animação
                    element.classList.add('animate-in');
                    
                    // Animar contadores
                    this.animateCounters(element);
                    
                    // Animar barras de progresso
                    this.animateProgressBars(element);
                    
                    // Animar círculo de progresso
                    this.animateProgressRing(element);
                    
                    // Parar de observar após animação
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: CONFIG.animation.observerThreshold,
            rootMargin: CONFIG.animation.observerRootMargin
        });
        
        // Observar elementos animáveis
        const animatableElements = document.querySelectorAll(`
            .hero-content,
            .mission-content,
            .vision-content,
            .section-header,
            .values-grid,
            .values-stats,
            .timeline-item,
            .cta-content
        `);
        
        animatableElements.forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('scroll', observer);
    }
    
    /**
     * Animar contadores numericos
     */
    animateCounters(container) {
        const counters = container.querySelectorAll('[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    /**
     * Animar barras de progresso
     */
    animateProgressBars(container) {
        const progressBars = container.querySelectorAll('.progress-fill, .goal-progress-fill');
        
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress;
            if (progress) {
                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, 500);
            }
        });
    }
    
    /**
     * Animar círculo de progresso
     */
    animateProgressRing(container) {
        const progressRing = container.querySelector('.progress-ring-circle');
        if (progressRing) {
            const circumference = 2 * Math.PI * 52;
            const progress = 75; // 75% de progresso
            const offset = circumference - (progress / 100) * circumference;
            
            setTimeout(() => {
                progressRing.style.strokeDashoffset = offset;
            }, 500);
        }
    }
    
    /**
     * Inicializar elementos interativos
     */
    initInteractiveElements() {
        // Hero pillars
        const heroPillars = document.querySelectorAll('.hero-pillar');
        heroPillars.forEach(pillar => {
            pillar.addEventListener('click', () => {
                const pillarType = pillar.dataset.pillar;
                this.scrollToSection(pillarType);
            });
            
            pillar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const pillarType = pillar.dataset.pillar;
                    this.scrollToSection(pillarType);
                }
            });
        });
        
        // Value cards
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.highlightValueCard(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetValueCard(card);
            });
            
            card.addEventListener('focus', () => {
                this.highlightValueCard(card);
            });
            
            card.addEventListener('blur', () => {
                this.resetValueCard(card);
            });
        });
        
        // Learn more buttons
        const learnMoreButtons = document.querySelectorAll('.value-learn-more');
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.value-card');
                const title = card.querySelector('.value-title').textContent;
                this.showValueDetails(title);
            });
        });
        
        // Graphics interativos
        const graphics = document.querySelectorAll('.mission-graphic, .vision-graphic');
        graphics.forEach(graphic => {
            graphic.addEventListener('click', () => {
                this.animateGraphic(graphic);
            });
            
            graphic.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.animateGraphic(graphic);
                }
            });
        });
    }
    
    /**
     * Scroll suave para seção
     */
    scrollToSection(sectionType) {
        const sectionMap = {
            mission: '.section-mission',
            vision: '.section-vision',
            values: '.section-values'
        };
        
        const targetSection = document.querySelector(sectionMap[sectionType]);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    /**
     * Destacar card de valor
     */
    highlightValueCard(card) {
        const color = card.dataset.color;
        if (color) {
            card.style.borderColor = color;
            card.style.boxShadow = `0 12px 40px ${color}20`;
        }
    }
    
    /**
     * Resetar card de valor
     */
    resetValueCard(card) {
        card.style.borderColor = '';
        card.style.boxShadow = '';
    }
    
    /**
     * Mostrar detalhes do valor
     */
    showValueDetails(title) {
        console.log(`Mostrando detalhes para: ${title}`);
        // Implementar modal ou expansão de detalhes
    }
    
    /**
     * Animar gráfico
     */
    animateGraphic(graphic) {
        graphic.style.transform = 'scale(1.1) rotate(10deg)';
        setTimeout(() => {
            graphic.style.transform = '';
        }, 300);
    }
    
    /**
     * Inicializar sistema de tema
     */
    initThemeSystem() {
        // Aplicar tema salvo
        this.applyTheme(this.currentTheme);
        
        // Detectar preferência do sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(CONFIG.theme.storageKey)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    /**
     * Aplicar tema
     */
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem(CONFIG.theme.storageKey, theme);
    }
    
    /**
     * Alternar tema
     */
    handleThemeToggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    /**
     * Inicializar acessibilidade
     */
    initAccessibility() {
        // Skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Anúncios para leitores de tela
        this.createAriaLiveRegion();
        
        // Melhorar navegação por teclado
        this.enhanceKeyboardNavigation();
        
        // Gerenciar foco
        this.manageFocus();
    }
    
    /**
     * Criar região de anúncios ARIA
     */
    createAriaLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'aria-live-region';
        document.body.appendChild(liveRegion);
    }
    
    /**
     * Melhorar navegação por teclado
     */
    enhanceKeyboardNavigation() {
        // Adicionar indicadores de foco visíveis
        const focusableElements = document.querySelectorAll(`
            a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `);
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('keyboard-focus');
            });
        });
    }
    
    /**
     * Gerenciar foco
     */
    manageFocus() {
        // Trap focus em modais (quando implementados)
        // Restaurar foco após ações
        // Gerenciar foco em elementos dinâmicos
    }
    
    /**
     * Inicializar otimizações de performance
     */
    initPerformanceOptimizations() {
        // Lazy loading de imagens
        this.initLazyLoading();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Otimizar animações
        this.optimizeAnimations();
        
        // Monitorar performance
        this.monitorPerformance();
    }
    
    /**
     * Inicializar lazy loading
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    /**
     * Preload recursos críticos
     */
    preloadCriticalResources() {
        // Preload fonts
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Otimizar animações
     */
    optimizeAnimations() {
        // Pausar animações quando não visíveis
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
    
    /**
     * Monitorar performance
     */
    monitorPerformance() {
        // Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    /**
     * Inicializar event listeners
     */
    initEventListeners() {
        // Scroll
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Resize
        window.addEventListener('resize', this.handleResize);
        
        // Keyboard
        document.addEventListener('keydown', this.handleKeydown);
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Navigation
        this.initNavigation();
        
        // Search
        this.initSearch();
        
        // Back to top
        this.initBackToTop();
    }
    
    /**
     * Handle scroll
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        const header = document.getElementById('header');
        if (header) {
            if (scrollTop > CONFIG.scroll.headerScrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top visibility
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (scrollTop > CONFIG.scroll.backToTopThreshold) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
        
        // Parallax effects
        this.updateParallax(scrollTop);
        
        this.scrollPosition = scrollTop;
    }
    
    /**
     * Handle resize
     */
    handleResize() {
        // Recalcular dimensões
        this.updateDimensions();
        
        // Reposicionar elementos
        this.repositionElements();
        
        // Atualizar animações
        this.updateAnimations();
    }
    
    /**
     * Handle keydown
     */
    handleKeydown(e) {
        // Esc para fechar modais/popups
        if (e.key === 'Escape') {
            this.closeAllPopups();
        }
        
        // Atalhos de teclado
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.toggleSearch();
                    break;
                case 'd':
                    e.preventDefault();
                    this.handleThemeToggle();
                    break;
            }
        }
    }
    
    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pausar animações quando tab não está ativo
            this.pauseAnimations();
        } else {
            // Retomar animações
            this.resumeAnimations();
        }
    }
    
    /**
     * Inicializar navegação
     */
    initNavigation() {
        // Mobile menu
        const btnMenu = document.querySelector('.btn-menu');
        const menu = document.querySelector('.menu');
        
        if (btnMenu && menu) {
            btnMenu.addEventListener('click', () => {
                const isOpen = btnMenu.getAttribute('aria-expanded') === 'true';
                btnMenu.setAttribute('aria-expanded', !isOpen);
                menu.classList.toggle('show');
                document.body.classList.toggle('menu-open');
            });
        }
        
        // Submenu
        const menuItems = document.querySelectorAll('.menu-item-has-children');
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.sub-menu');
            
            if (link && submenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isOpen = link.getAttribute('aria-expanded') === 'true';
                    link.setAttribute('aria-expanded', !isOpen);
                    submenu.classList.toggle('show');
                });
            }
        });
    }
    
    /**
     * Inicializar busca
     */
    initSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchPopup = document.querySelector('.search-popup');
        const searchClose = document.querySelector('.btn-close');
        const searchInput = document.querySelector('#search-input');
        
        if (searchToggle && searchPopup) {
            searchToggle.addEventListener('click', () => {
                this.toggleSearch();
            });
        }
        
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                this.closeSearch();
            });
        }
        
        if (searchPopup) {
            searchPopup.addEventListener('click', (e) => {
                if (e.target === searchPopup) {
                    this.closeSearch();
                }
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
    }
    
    /**
     * Toggle search
     */
    toggleSearch() {
        const searchPopup = document.querySelector('.search-popup');
        const searchInput = document.querySelector('#search-input');
        
        if (searchPopup) {
            const isOpen = searchPopup.classList.contains('show');
            
            if (isOpen) {
                this.closeSearch();
            } else {
                searchPopup.classList.add('show');
                searchPopup.setAttribute('aria-hidden', 'false');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
    }
    
    /**
     * Close search
     */
    closeSearch() {
        const searchPopup = document.querySelector('.search-popup');
        
        if (searchPopup) {
            searchPopup.classList.remove('show');
            searchPopup.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Handle search
     */
    handleSearch(query) {
        if (query.length < 2) return;
        
        console.log('Searching for:', query);
        // Implementar lógica de busca
    }
    
    /**
     * Inicializar back to top
     */
    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    /**
     * Inicializar efeitos de partículas
     */
    initParticleEffects() {
        // Implementar efeitos de partículas se necessário
        console.log('Particle effects initialized');
    }
    
    /**
     * Update parallax
     */
    updateParallax(scrollTop) {
        const parallaxElements = document.querySelectorAll('[data-speed]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    /**
     * Update dimensions
     */
    updateDimensions() {
        // Atualizar variáveis CSS com novas dimensões
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * Reposition elements
     */
    repositionElements() {
        // Reposicionar elementos que dependem do tamanho da tela
    }
    
    /**
     * Update animations
     */
    updateAnimations() {
        // Atualizar animações baseadas no tamanho da tela
    }
    
    /**
     * Close all popups
     */
    closeAllPopups() {
        this.closeSearch();
        // Fechar outros popups/modais quando implementados
    }
    
    /**
     * Pause animations
     */
    pauseAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }
    
    /**
     * Resume animations
     */
    resumeAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
    
    /**
     * Utility: Debounce
     */
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
    }
    
    /**
     * Utility: Throttle
     */
    throttle(func, limit) {
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
     * Utility: Lighten color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    /**
     * Cleanup
     */
    destroy() {
        // Remover event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Desconectar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        // Cancelar animation frames
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        console.log('MissionVisionApp destroyed');
    }
}

/**
 * Inicialização da aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new MissionVisionApp();
    app.init();
    
    // Expor app globalmente para debug
    window.MissionVisionApp = app;
});

/**
 * Service Worker para cache (opcional)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

