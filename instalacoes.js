// ===== JAVASCRIPT MELHORADO PARA PÁGINA INSTALAÇÕES =====

// Utilitários
const Utils = {
    // Debounce para performance
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

    // Throttle para eventos de scroll
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

    // Verificar se elemento está na viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animar contadores
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
            element.textContent = Math.floor(current);
        }, 16);
    },

    // Smooth scroll
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// ===== DADOS DOS LABORATÓRIOS =====
const LabsData = {
    laboratories: [
        {
            id: 1,
            name: "Laboratório de Impressão 3D",
            category: "fabricacao",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
            description: "Espaço dedicado à prototipagem rápida e fabricação aditiva com tecnologias de ponta.",
            status: "available",
            specs: {
                area: "120m²",
                capacity: "15 pessoas",
                equipment: 12,
                materials: "PLA, ABS, PETG, Resina"
            },
            features: ["Impressão 3D", "Prototipagem", "Design", "Materiais Diversos"],
            equipment: [
                "Impressoras 3D FDM (Ultimaker S5, Prusa i3)",
                "Impressoras 3D SLA (Formlabs Form 3)",
                "Scanner 3D (Artec Eva)",
                "Estação de pós-processamento"
            ]
        },
        {
            id: 2,
            name: "Laboratório de Eletrônica",
            category: "eletronica",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
            description: "Ambiente completo para desenvolvimento de circuitos e projetos eletrônicos.",
            status: "busy",
            specs: {
                area: "80m²",
                capacity: "12 pessoas",
                equipment: 18,
                voltage: "110V/220V/380V"
            },
            features: ["Eletrônica", "IoT", "Robótica", "Automação"],
            equipment: [
                "Estações de solda (Weller WE1010)",
                "Osciloscópios (Tektronix TBS2000)",
                "Multímetros digitais",
                "Fontes de alimentação variáveis"
            ]
        },
        {
            id: 3,
            name: "Laboratório de Marcenaria Digital",
            category: "marcenaria",
            image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
            description: "Oficina moderna com máquinas CNC e ferramentas tradicionais de marcenaria.",
            status: "available",
            specs: {
                area: "200m²",
                capacity: "10 pessoas",
                equipment: 15,
                materials: "Madeira, MDF, Acrílico"
            },
            features: ["CNC", "Corte a Laser", "Marcenaria", "Design de Móveis"],
            equipment: [
                "Router CNC (ShopBot PRSalpha)",
                "Cortadora a laser (Epilog Fusion Pro)",
                "Serra circular de bancada",
                "Sistema de aspiração"
            ]
        },
        {
            id: 4,
            name: "Laboratório de Robótica",
            category: "robotica",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
            description: "Espaço para desenvolvimento e teste de sistemas robóticos e automação.",
            status: "available",
            specs: {
                area: "150m²",
                capacity: "20 pessoas",
                equipment: 25,
                platforms: "Arduino, Raspberry Pi, ROS"
            },
            features: ["Robótica", "IA", "Sensores", "Automação"],
            equipment: [
                "Braços robóticos (Universal Robots UR5)",
                "Kits Arduino e Raspberry Pi",
                "Sensores diversos (LIDAR, câmeras)",
                "Plataformas móveis"
            ]
        },
        {
            id: 5,
            name: "Laboratório de Realidade Virtual",
            category: "digital",
            image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=400&fit=crop",
            description: "Ambiente imersivo para desenvolvimento e teste de aplicações VR/AR.",
            status: "maintenance",
            specs: {
                area: "100m²",
                capacity: "8 pessoas",
                equipment: 12,
                resolution: "4K por olho"
            },
            features: ["VR/AR", "Simulação", "Gaming", "Visualização"],
            equipment: [
                "Headsets VR (Oculus Quest 2, HTC Vive)",
                "Computadores high-end (RTX 3080)",
                "Sensores de movimento",
                "Projetores 4K"
            ]
        },
        {
            id: 6,
            name: "Laboratório de Biotecnologia",
            category: "biotecnologia",
            image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop",
            description: "Laboratório para pesquisa e desenvolvimento em biotecnologia e biofabricação.",
            status: "available",
            specs: {
                area: "90m²",
                capacity: "6 pessoas",
                equipment: 20,
                biosafety: "Nível 1 e 2"
            },
            features: ["Biotecnologia", "Biofabricação", "Pesquisa", "Análise"],
            equipment: [
                "Microscópios ópticos e eletrônicos",
                "Incubadoras com controle de CO2",
                "Centrífugas refrigeradas",
                "Cabines de segurança biológica"
            ]
        }
    ],

    equipmentData: {
        fabricacao: [
            { name: "Impressora 3D Ultimaker S5", status: "available", location: "Bancada A1" },
            { name: "Impressora 3D Formlabs Form 3", status: "available", location: "Bancada A2" },
            { name: "Scanner 3D Artec Eva", status: "maintenance", location: "Sala de Medição" },
            { name: "Cortadora a Laser Epilog", status: "available", location: "Área de Corte" }
        ],
        eletronica: [
            { name: "Osciloscópio Tektronix TBS2000", status: "available", location: "Bancada 1" },
            { name: "Estação de Solda Weller WE1010", status: "available", location: "Bancada 2" },
            { name: "Fonte de Alimentação Keysight", status: "reserved", location: "Bancada 3" },
            { name: "Analisador de Espectro", status: "available", location: "Rack Central" }
        ],
        marcenaria: [
            { name: "Router CNC ShopBot PRSalpha", status: "available", location: "Área Central" },
            { name: "Serra Circular Dewalt", status: "available", location: "Bancada Principal" },
            { name: "Furadeira de Bancada", status: "maintenance", location: "Área de Furação" },
            { name: "Lixadeira Orbital", status: "available", location: "Bancada de Acabamento" }
        ],
        robotica: [
            { name: "Braço Robótico UR5", status: "available", location: "Célula 1" },
            { name: "Kit Arduino Mega", status: "available", location: "Bancada Eletrônica" },
            { name: "Raspberry Pi 4", status: "available", location: "Rack de Computação" },
            { name: "Sensor LIDAR", status: "reserved", location: "Área de Testes" }
        ],
        digital: [
            { name: "Oculus Quest 2", status: "available", location: "Estação VR 1" },
            { name: "HTC Vive Pro", status: "maintenance", location: "Estação VR 2" },
            { name: "Computador RTX 3080", status: "available", location: "Workstation 1" },
            { name: "Projetor 4K", status: "available", location: "Sala de Projeção" }
        ],
        biotecnologia: [
            { name: "Microscópio Zeiss", status: "available", location: "Bancada de Microscopia" },
            { name: "Incubadora CO2", status: "available", location: "Área de Cultivo" },
            { name: "Centrífuga Refrigerada", status: "available", location: "Bancada Central" },
            { name: "Espectrofotômetro UV-Vis", status: "reserved", location: "Sala de Análise" }
        ]
    },

    getStatusText(status) {
        const statusMap = {
            'available': 'Disponível',
            'busy': 'Em Uso',
            'maintenance': 'Manutenção',
            'reserved': 'Reservado'
        };
        return statusMap[status] || status;
    },

    getStatusClass(status) {
        return status;
    }
};

// ===== GERENCIADOR DE LABORATÓRIOS =====
class LabsManager {
    constructor() {
        this.laboratories = LabsData.laboratories;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderLabs();
        this.initFilters();
        this.renderEquipment();
    }

    renderLabs() {
        const labsGrid = document.getElementById('labs-grid');
        if (!labsGrid) return;

        labsGrid.innerHTML = this.laboratories
            .filter(lab => this.currentFilter === 'all' || lab.category === this.currentFilter)
            .map(lab => this.createLabCard(lab))
            .join('');

        this.addLabEventListeners();
    }

    createLabCard(lab) {
        return `
            <div class="lab-card" data-category="${lab.category}" data-aos="fade-up">
                <div class="lab-image">
                    <img src="${lab.image}" alt="${lab.name}" loading="lazy">
                    <div class="lab-overlay">
                        <button class="btn btn-primary" onclick="labsManager.showLabDetails(${lab.id})">
                            <i class="fas fa-eye"></i>
                            Explorar
                        </button>
                    </div>
                    <div class="lab-status ${lab.status}">
                        ${LabsData.getStatusText(lab.status)}
                    </div>
                </div>
                <div class="lab-info">
                    <h3 class="lab-title">${lab.name}</h3>
                    <p class="lab-description">${lab.description}</p>
                    <div class="lab-specs">
                        <div class="spec-item">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>${lab.specs.area}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-users"></i>
                            <span>${lab.specs.capacity}</span>
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-tools"></i>
                            <span>${lab.specs.equipment} equipamentos</span>
                        </div>
                    </div>
                    <div class="lab-features">
                        ${lab.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current filter
                this.currentFilter = e.target.dataset.filter;
                
                // Re-render labs
                this.renderLabs();
            });
        });
    }

    renderEquipment() {
        const equipmentContainer = document.getElementById('equipment-categories');
        if (!equipmentContainer) return;

        const categories = [
            { id: 'fabricacao', name: 'Fabricação', icon: 'fas fa-cube' },
            { id: 'eletronica', name: 'Eletrônica', icon: 'fas fa-microchip' },
            { id: 'marcenaria', name: 'Marcenaria', icon: 'fas fa-hammer' },
            { id: 'robotica', name: 'Robótica', icon: 'fas fa-robot' },
            { id: 'digital', name: 'Digital', icon: 'fas fa-vr-cardboard' },
            { id: 'biotecnologia', name: 'Biotecnologia', icon: 'fas fa-dna' }
        ];

        equipmentContainer.innerHTML = categories.map(category => {
            const equipment = LabsData.equipmentData[category.id] || [];
            return `
                <div class="equipment-category" data-aos="fade-up">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <h3 class="category-title">${category.name}</h3>
                    </div>
                    <ul class="equipment-list">
                        ${equipment.map(item => `
                            <li class="equipment-item">
                                <span class="equipment-name">${item.name}</span>
                                <span class="equipment-status ${item.status}">
                                    ${LabsData.getStatusText(item.status)}
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }).join('');
    }

    addLabEventListeners() {
        const labCards = document.querySelectorAll('.lab-card');
        labCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const labId = card.querySelector('[onclick]')?.onclick.toString().match(/\d+/)?.[0];
                    if (labId) {
                        this.showLabDetails(parseInt(labId));
                    }
                }
            });
        });
    }

    showLabDetails(labId) {
        const lab = this.laboratories.find(l => l.id === labId);
        if (!lab) return;

        // Criar modal simples
        const modal = document.createElement('div');
        modal.className = 'lab-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.lab-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <img src="${lab.image}" alt="${lab.name}" class="modal-image">
                    <div class="modal-info">
                        <h2>${lab.name}</h2>
                        <p>${lab.description}</p>
                        <div class="lab-status ${lab.status}">
                            ${LabsData.getStatusText(lab.status)}
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h3>Especificações</h3>
                        <div class="specs-grid">
                            ${Object.entries(lab.specs).map(([key, value]) => `
                                <div class="spec-item">
                                    <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                    <span>${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-section">
                        <h3>Equipamentos Principais</h3>
                        <ul class="equipment-list">
                            ${lab.equipment.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Adicionar estilos do modal
        if (!document.querySelector('#modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .lab-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    position: relative;
                    background: var(--bg-card);
                    border-radius: var(--border-radius-lg);
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-xl);
                }
                .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 1;
                    transition: var(--transition-fast);
                }
                .modal-close:hover {
                    background: rgba(0, 0, 0, 0.7);
                }
                .modal-header {
                    position: relative;
                    height: 300px;
                    overflow: hidden;
                    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
                }
                .modal-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .modal-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                    color: white;
                    padding: 40px 30px 30px;
                }
                .modal-info h2 {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                .modal-body {
                    padding: 30px;
                }
                .modal-section {
                    margin-bottom: 30px;
                }
                .modal-section h3 {
                    color: var(--text-primary);
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                }
                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }
                .modal-section .spec-item {
                    background: var(--bg-tertiary);
                    padding: 15px;
                    border-radius: var(--border-radius-md);
                    border: 1px solid var(--border-color);
                }
                .modal-section .spec-item strong {
                    color: var(--primary-color);
                    display: block;
                    margin-bottom: 5px;
                }
                .modal-section .equipment-list {
                    list-style: none;
                    padding: 0;
                }
                .modal-section .equipment-list li {
                    padding: 10px 0;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-secondary);
                }
                .modal-section .equipment-list li:last-child {
                    border-bottom: none;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);
    }
}

// ===== GERENCIADOR DE NAVEGAÇÃO =====
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initSmoothScroll();
        this.initBackToTop();
        this.initMobileMenu();
        this.initHeaderScroll();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        const toggleBackToTop = Utils.throttle(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleBackToTop);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const menu = document.querySelector('.menu');
        
        if (!mobileMenuBtn || !menu) return;

        mobileMenuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        const handleScroll = Utils.throttle(() => {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== GERENCIADOR DE FORMULÁRIOS =====
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.initBookingForm();
    }

    initBookingForm() {
        const bookingForm = document.getElementById('bookingForm');
        if (!bookingForm) return;

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmit(bookingForm);
        });
    }

    handleBookingSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validação básica
        if (!data.name || !data.email || !data.date || !data.interest) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Simular envio
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    border-radius: var(--border-radius-md);
                    box-shadow: var(--shadow-lg);
                    animation: slideInRight 0.3s ease;
                }
                .notification-success {
                    background: var(--status-available);
                    color: white;
                }
                .notification-error {
                    background: var(--status-busy);
                    color: white;
                }
                .notification-info {
                    background: var(--primary-color);
                    color: white;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 20px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    margin-left: auto;
                    opacity: 0.8;
                    transition: var(--transition-fast);
                }
                .notification-close:hover {
                    opacity: 1;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// ===== ANIMAÇÕES E CONTADORES =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.initCounters();
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
    }

    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.textContent);
                    Utils.animateNumber(entry.target, target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }
}

// ===== FUNÇÕES GLOBAIS PARA TOUR VIRTUAL =====
function startVirtualTour() {
    console.log('Iniciando tour virtual...');
    // Implementar tour virtual aqui
    alert('Tour virtual será implementado em breve!');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os gerenciadores
    window.labsManager = new LabsManager();
    window.navigationManager = new NavigationManager();
    window.formManager = new FormManager();
    window.animationManager = new AnimationManager();

    console.log('Página de instalações carregada com sucesso!');
});

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', (e) => {
    console.error('Erro na página:', e.error);
});

// ===== PERFORMANCE =====
window.addEventListener('load', () => {
    // Lazy loading para imagens que não foram carregadas
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});



// ===== RESPONSIVE NAVIGATION =====




// Atualizar inicialização para incluir as novas classes
document.addEventListener("DOMContentLoaded", () => {
    const app = new FabLabApp();
    console.log("Página de instalações carregada com sucesso!");
});




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
        const scrollHandler = Utils.throttle(() => {
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
    this.searchForm = document.querySelector('.search-form form');
    
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
        new ResponsiveNavigation(),
        new SearchPopup(),
        new LabsManager(),
        new NavigationManager(),
        new FormManager(),
        new AnimationManager()
      ];

      // Setup smooth scrolling for anchor links
      this.setupSmoothScrolling();

      console.log('✅ Fab Lab Brasil - Página de Instalações inicializada com sucesso!');
    } catch (error) {
      console.error('❌ Erro na inicialização da página de Instalações:', error);
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
}

// ===== START APPLICATION =====


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


