// ===== PROJETOS - TEMA ESCURO - JAVASCRIPT =====

'use strict';

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    ANIMATION_DELAY: 100,
    LOAD_MORE_BATCH: 6,
    STATS_ANIMATION_DURATION: 2000,
    INTERSECTION_THRESHOLD: 0.1
};

// ===== DADOS DOS PROJETOS =====
const PROJECTS_DATA = [
    {
        id: 1,
        title: "EPIs para COVID-19",
        description: "Durante a pandemia, mobilizamos nossa rede para produzir mais de 50.000 equipamentos de proteção individual, incluindo máscaras face shield e suportes para máscaras N95.",
        fullDescription: "Este projeto emergencial foi desenvolvido em resposta à pandemia de COVID-19, quando houve escassez crítica de equipamentos de proteção individual no Brasil. Nossa rede de Fab Labs se mobilizou rapidamente para projetar, testar e produzir em massa diversos tipos de EPIs utilizando impressão 3D e corte a laser.",
        category: ["impressao-3d", "saude"],
        tags: ["Impressão 3D", "Saúde", "Emergência"],
        date: "2020-2021",
        status: "completed",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metrics: {
            volunteers: "200+",
            epis_produced: "50.000+",
            labs_involved: "25"
        }
    },
    {
        id: 2,
        title: "Braço Robótico Educacional",
        description: "Desenvolvimento de um braço robótico de baixo custo para ensino de robótica e automação, utilizado em mais de 50 escolas técnicas do Rio de Janeiro.",
        fullDescription: "Projeto educacional focado no desenvolvimento de um braço robótico acessível para instituições de ensino. O kit inclui todos os componentes necessários, material didático completo e plataforma de programação visual.",
        category: ["robotica", "educacao"],
        tags: ["Robótica", "Educação", "Arduino"],
        date: "2022-2023",
        status: "completed",
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        metrics: {
            schools: "50+",
            students: "2.000+",
            teachers_trained: "150"
        }
    },
    {
        id: 3,
        title: "Sistema de Monitoramento Ambiental",
        description: "Rede de sensores IoT para monitoramento da qualidade do ar e água em tempo real em diferentes pontos da cidade.",
        fullDescription: "Sistema integrado de monitoramento ambiental utilizando sensores IoT distribuídos pela cidade para coleta de dados em tempo real sobre qualidade do ar, água e ruído urbano.",
        category: ["iot", "sustentabilidade"],
        tags: ["IoT", "Sustentabilidade", "Sensores"],
        date: "2023-2024",
        status: "ongoing",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        metrics: {
            sensors: "100+",
            cities: "5",
            data_points: "1M+"
        }
    },
    {
        id: 4,
        title: "Próteses Acessíveis",
        description: "Desenvolvimento de próteses de baixo custo utilizando impressão 3D para pessoas com deficiência.",
        fullDescription: "Projeto social focado no desenvolvimento e produção de próteses funcionais de baixo custo, personalizadas para cada usuário através de tecnologias de fabricação digital.",
        category: ["impressao-3d", "saude"],
        tags: ["Impressão 3D", "Saúde", "Inclusão"],
        date: "2021-2022",
        status: "completed",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        metrics: {
            prosthetics_delivered: "150",
            beneficiaries: "150",
            cost_reduction: "90%"
        }
    },
    {
        id: 5,
        title: "Kit Robótica Educacional",
        description: "Kit completo para ensino de robótica em escolas, com componentes de baixo custo e material didático.",
        fullDescription: "Kit educacional completo desenvolvido especificamente para o ensino de robótica em escolas brasileiras, incluindo componentes, sensores, material didático e plataforma de programação.",
        category: ["robotica", "educacao"],
        tags: ["Robótica", "Educação", "Kit Didático"],
        date: "2022-2023",
        status: "completed",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        metrics: {
            kits_distributed: "500",
            schools: "100",
            students_reached: "5.000"
        }
    },
    {
        id: 6,
        title: "Filamento Reciclado",
        description: "Processo de reciclagem de resíduos plásticos para produção de filamento para impressão 3D.",
        fullDescription: "Projeto de economia circular que transforma resíduos plásticos em filamento de alta qualidade para impressão 3D, reduzindo custos e impacto ambiental.",
        category: ["sustentabilidade", "impressao-3d"],
        tags: ["Sustentabilidade", "Reciclagem", "Economia Circular"],
        date: "2023-2024",
        status: "ongoing",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        metrics: {
            plastic_recycled: "2.5 ton",
            filament_produced: "1.8 ton",
            cost_reduction: "60%"
        }
    }
];

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Animate number
    animateNumber(element, target, duration = CONFIG.STATS_ANIMATION_DURATION) {
        const start = 0;
        const startTime = performance.now();
        const suffix = target >= 1000 ? '+' : '';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// ===== CLASSE PRINCIPAL =====
class ProjectsPage {
    constructor() {
        this.projects = [...PROJECTS_DATA];
        this.filteredProjects = [...PROJECTS_DATA];
        this.currentFilter = 'all';
        this.displayedProjects = 0;
        this.isLoading = false;
        
        // Elementos DOM
        this.elements = {};
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.cacheElements();
        this.setupIntersectionObserver();
        this.bindEvents();
        this.loadInitialProjects();
        this.initializeStats();
        this.initializeHeader();
        
        console.log('✅ Página Projetos (Tema Escuro) inicializada com sucesso!');
    }

    cacheElements() {
        this.elements = {
            // Header elements
            header: document.querySelector('#header'),
            mobileMenuToggle: document.querySelector('#mobile-menu-toggle'),
            menu: document.querySelector('.menu'),
            
            // Filter elements
            filterButtons: document.querySelectorAll('.filter-btn'),
            
            // Projects elements
            projectsGrid: document.querySelector('.projects-grid'),
            loadMoreBtn: document.querySelector('.btn-load-more'),
            
            // Stats elements
            statsNumbers: document.querySelectorAll('.stat-number'),
            
            // Modal elements
            modal: document.querySelector('.modal'),
            modalTitle: document.querySelector('.modal-title'),
            modalImg: document.querySelector('#modal-img'),
            modalTags: document.querySelector('#modal-tags'),
            modalDescription: document.querySelector('#modal-description'),
            modalMeta: document.querySelector('#modal-meta'),
            modalClose: document.querySelector('.modal-close'),
            modalBackdrop: document.querySelector('.modal-backdrop'),
            
            // Other elements
            backToTop: document.querySelector('.back-to-top')
        };
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.INTERSECTION_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    initializeHeader() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (this.elements.header) {
                if (window.scrollY > 100) {
                    this.elements.header.classList.add('scrolled');
                } else {
                    this.elements.header.classList.remove('scrolled');
                }
            }
        });
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.elements.mobileMenuToggle && this.elements.menu) {
            this.elements.mobileMenuToggle.addEventListener('click', () => {
                this.elements.mobileMenuToggle.classList.toggle('active');
                this.elements.menu.classList.toggle('active');
            });
        }

        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Load more button
        if (this.elements.loadMoreBtn) {
            this.elements.loadMoreBtn.addEventListener('click', () => this.loadMoreProjects());
        }

        // Modal events
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => this.closeModal());
        }
        if (this.elements.modalBackdrop) {
            this.elements.modalBackdrop.addEventListener('click', () => this.closeModal());
        }

        // Back to top
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Scroll events
        window.addEventListener('scroll', Utils.debounce(() => {
            this.handleScroll();
        }, 100));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.elements.modal && this.elements.modal.classList.contains('active')) {
                    this.closeModal();
                }
                if (this.elements.menu && this.elements.menu.classList.contains('active')) {
                    this.elements.mobileMenuToggle.classList.remove('active');
                    this.elements.menu.classList.remove('active');
                }
            }
        });

        // Close mobile menu when clicking on links
        const menuLinks = document.querySelectorAll('.menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.elements.menu && this.elements.menu.classList.contains('active')) {
                    this.elements.mobileMenuToggle.classList.remove('active');
                    this.elements.menu.classList.remove('active');
                }
            });
        });
    }

    handleFilter(e) {
        const filter = e.target.getAttribute('data-filter');
        if (filter === this.currentFilter) return;

        // Update active state
        this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Apply filter
        this.currentFilter = filter;
        this.applyFilter(filter);
    }

    applyFilter(filter) {
        this.isLoading = true;
        this.updateLoadMoreButton();

        // Filter projects
        this.filteredProjects = filter === 'all' 
            ? [...this.projects]
            : this.projects.filter(project => project.category.includes(filter));

        // Reset display
        this.displayedProjects = 0;
        this.elements.projectsGrid.innerHTML = '';

        // Load projects with delay for better UX
        setTimeout(() => {
            this.loadMoreProjects();
        }, 300);
    }

    loadInitialProjects() {
        this.loadMoreProjects();
    }

    loadMoreProjects() {
        if (this.isLoading || this.displayedProjects >= this.filteredProjects.length) {
            return;
        }

        this.isLoading = true;
        this.updateLoadMoreButton();

        const startIndex = this.displayedProjects;
        const endIndex = Math.min(
            startIndex + CONFIG.LOAD_MORE_BATCH,
            this.filteredProjects.length
        );

        const projectsToLoad = this.filteredProjects.slice(startIndex, endIndex);

        setTimeout(() => {
            this.renderProjects(projectsToLoad);
            this.displayedProjects = endIndex;
            this.isLoading = false;
            this.updateLoadMoreButton();
        }, 500);
    }

    renderProjects(projects) {
        const fragment = document.createDocumentFragment();

        projects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project);
            
            // Add to intersection observer
            if (this.observer) {
                this.observer.observe(projectElement);
            }

            // Stagger animation
            setTimeout(() => {
                projectElement.style.opacity = '1';
                projectElement.style.transform = 'translateY(0)';
            }, index * CONFIG.ANIMATION_DELAY);

            fragment.appendChild(projectElement);
        });

        this.elements.projectsGrid.appendChild(fragment);
    }

    createProjectElement(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.style.opacity = '0';
        article.style.transform = 'translateY(30px)';
        article.style.transition = 'all 0.6s ease';

        article.innerHTML = `
            <figure class="project-image">
                <img src="${project.image}" 
                     alt="${project.title}" 
                     loading="lazy">
                <div class="project-overlay">
                    <button class="btn-view-project" aria-label="Ver projeto ${project.title}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="project-tags">
                    ${project.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </figure>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-meta">
                    <time class="project-date">${project.date}</time>
                    <span class="project-status status-${project.status}">
                        ${project.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                    </span>
                </div>
            </div>
        `;

        // Bind click event
        article.addEventListener('click', () => this.openModal(project));

        return article;
    }

    updateLoadMoreButton() {
        if (!this.elements.loadMoreBtn) return;

        const hasMore = this.displayedProjects < this.filteredProjects.length;
        
        this.elements.loadMoreBtn.disabled = this.isLoading || !hasMore;
        this.elements.loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';

        const btnText = this.elements.loadMoreBtn.querySelector('.btn-text');
        const btnLoading = this.elements.loadMoreBtn.querySelector('.btn-loading');

        if (btnText && btnLoading) {
            btnText.style.display = this.isLoading ? 'none' : 'inline';
            btnLoading.style.display = this.isLoading ? 'inline-flex' : 'none';
        }
    }

    initializeStats() {
        if (!this.elements.statsNumbers.length) return;

        if (!('IntersectionObserver' in window)) {
            this.animateAllStats();
            return;
        }

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatNumber(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.elements.statsNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateAllStats() {
        this.elements.statsNumbers.forEach(stat => {
            this.animateStatNumber(stat);
        });
    }

    animateStatNumber(element) {
        const target = parseInt(element.getAttribute('data-target')) || 
                      parseInt(element.textContent.replace(/\D/g, '')) || 0;
        
        if (target > 0) {
            Utils.animateNumber(element, target);
        }
    }

    openModal(project) {
        if (!this.elements.modal) return;

        // Populate modal content
        this.elements.modalTitle.textContent = project.title;
        this.elements.modalImg.src = project.image;
        this.elements.modalImg.alt = project.title;
        
        this.elements.modalTags.innerHTML = project.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');
        
        this.elements.modalDescription.textContent = project.fullDescription || project.description;
        
        this.elements.modalMeta.innerHTML = `
            <span><strong>Data:</strong> ${project.date}</span>
            <span><strong>Status:</strong> ${project.status === 'completed' ? 'Concluído' : 'Em Andamento'}</span>
        `;

        // Show modal
        this.elements.modal.classList.add('active');
        this.elements.modal.setAttribute('aria-hidden', 'false');
        
        // Focus management
        this.elements.modalClose.focus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.elements.modal) return;

        this.elements.modal.classList.remove('active');
        this.elements.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Back to top button
        if (this.elements.backToTop) {
            if (scrollTop > 300) {
                this.elements.backToTop.classList.add('visible');
            } else {
                this.elements.backToTop.classList.remove('visible');
            }
        }
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsPage();
});

// ===== NEWSLETTER FORM =====
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            alert(`Obrigado por se inscrever com o e-mail: ${email}`);
            e.target.reset();
        });
    }
});

// ===== SMOOTH SCROLLING PARA LINKS INTERNOS =====
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== LAZY LOADING PARA IMAGENS =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Página carregada em ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}

