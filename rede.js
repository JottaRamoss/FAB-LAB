// ===== REDE PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeAnimations();
    initializeSearch();
    initializeFilters();
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Language selector functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
});

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all lab cards
    const labCards = document.querySelectorAll('.lab-card');
    labCards.forEach(card => {
        observer.observe(card);
    });

    // Observe stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-form input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterLabs(searchTerm);
    });
}

// Filter labs based on search term
function filterLabs(searchTerm) {
    const labCards = document.querySelectorAll('.lab-card');
    
    labCards.forEach(card => {
        const labName = card.querySelector('h4').textContent.toLowerCase();
        const labLocation = card.querySelector('p').textContent.toLowerCase();
        const labDescription = card.querySelectorAll('p')[1].textContent.toLowerCase();
        
        const matches = labName.includes(searchTerm) || 
                       labLocation.includes(searchTerm) || 
                       labDescription.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Initialize region filters
function initializeFilters() {
    // Create filter buttons dynamically
    const filtersContainer = createFiltersContainer();
    if (filtersContainer) {
        const labsSection = document.querySelector('.labs-section .container');
        labsSection.insertBefore(filtersContainer, labsSection.querySelector('h2').nextSibling);
    }
}

// Create filters container
function createFiltersContainer() {
    const container = document.createElement('div');
    container.className = 'filters-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
    `;

    const regions = ['Todos', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste'];
    
    regions.forEach((region, index) => {
        const button = document.createElement('button');
        button.textContent = region;
        button.className = 'filter-btn';
        button.dataset.region = region.toLowerCase();
        
        if (index === 0) button.classList.add('active');
        
        button.style.cssText = `
            padding: 0.5rem 1.5rem;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        button.addEventListener('click', function() {
            filterByRegion(region.toLowerCase());
            updateActiveFilter(this);
        });
        
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'var(--primary-color)';
                this.style.color = 'white';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'transparent';
                this.style.color = 'var(--primary-color)';
            }
        });
        
        container.appendChild(button);
    });

    return container;
}

// Filter labs by region
function filterByRegion(region) {
    const regionSections = document.querySelectorAll('.region-section');
    
    regionSections.forEach(section => {
        const sectionTitle = section.querySelector('h3').textContent.toLowerCase();
        
        if (region === 'todos') {
            section.style.display = 'block';
        } else {
            if (sectionTitle.includes(region)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
}

// Update active filter button
function updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary-color)';
    });
    
    activeButton.classList.add('active');
    activeButton.style.background = 'var(--primary-color)';
    activeButton.style.color = 'white';
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Language switching functionality
function switchLanguage(lang) {
    // Update active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Store language preference
    localStorage.setItem('language', lang);
    
    // Here you would implement actual language switching
    // For now, we'll just show a notification
    showNotification(`Idioma alterado para: ${lang.toUpperCase()}`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style);

// Mobile menu functionality
const menuBtn = document.querySelector('.btn-menu');
const menu = document.querySelector('.menu');

if (menuBtn && menu) {
    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('active');
        this.classList.toggle('active');
        
        // Toggle aria-expanded
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on links
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 1023) {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 1023) {
        menu.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Initialize theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeIcon = document.querySelector('.theme-toggle i');
if (themeIcon) {
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize language on page load
const savedLanguage = localStorage.getItem('language') || 'pt';
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === savedLanguage) {
        btn.classList.add('active');
    }
});


// ===== MAPA INTERATIVO DOS FAB LABS =====

let map;
let markers = [];
let filteredLabs = [...fabLabsData];

// Cores por região
const regionColors = {
    'Sudeste': '#e74c3c',
    'Sul': '#3498db',
    'Nordeste': '#f39c12',
    'Centro-Oeste': '#27ae60'
};

// Inicializar o mapa quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes existentes
    initializeAnimations();
    initializeSearch();
    initializeFilters();
    
    // Inicializar mapa se existir
    if (document.getElementById('map')) {
        initializeMap();
        populateLabList();
        setupMapEventListeners();
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Language selector functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
});

// Inicializar o mapa Leaflet
function initializeMap() {
    // Criar o mapa centrado no Brasil
    map = L.map('map').setView([-15.7939869, -47.8828], 4);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Adicionar marcadores para todos os Fab Labs
    addMarkersToMap(fabLabsData);
}

// Adicionar marcadores ao mapa
function addMarkersToMap(labs) {
    // Limpar marcadores existentes
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    labs.forEach((lab, index) => {
        if (lab.latitude && lab.longitude) {
            // Criar ícone personalizado baseado na região
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    background-color: ${regionColors[lab.region] || '#666'};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            // Criar marcador
            const marker = L.marker([lab.latitude, lab.longitude], { icon })
                .addTo(map)
                .bindPopup(`
                    <div class="popup-content">
                        <div class="popup-title">${lab.name}</div>
                        <div class="popup-location"><i class="fas fa-map-marker-alt"></i> ${lab.location}</div>
                        <div class="popup-description">${lab.description}</div>
                    </div>
                `);

            // Adicionar evento de clique no marcador
            marker.on('click', function() {
                selectLabInList(index);
            });

            markers.push(marker);
        }
    });
}

// Preencher a lista de labs na sidebar
function populateLabList() {
    const labList = document.getElementById('lab-list');
    if (!labList) return;
    
    labList.innerHTML = '';

    filteredLabs.forEach((lab, index) => {
        const labItem = document.createElement('div');
        labItem.className = 'lab-item';
        labItem.dataset.index = index;
        
        labItem.innerHTML = `
            <div class="lab-name">${lab.name}</div>
            <div class="lab-location"><i class="fas fa-map-marker-alt"></i> ${lab.location}</div>
            <div class="lab-description">${lab.description}</div>
        `;

        // Adicionar evento de clique
        labItem.addEventListener('click', function() {
            const originalIndex = fabLabsData.findIndex(l => l.name === lab.name);
            selectLabInList(originalIndex);
            
            // Centralizar o mapa no lab selecionado
            if (lab.latitude && lab.longitude) {
                map.setView([lab.latitude, lab.longitude], 10);
                
                // Abrir popup do marcador correspondente
                const marker = markers.find(m => 
                    m.getLatLng().lat === lab.latitude && 
                    m.getLatLng().lng === lab.longitude
                );
                if (marker) {
                    marker.openPopup();
                }
            }
        });

        labList.appendChild(labItem);
    });
}

// Selecionar lab na lista
function selectLabInList(index) {
    // Remover seleção anterior
    document.querySelectorAll('.lab-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Adicionar seleção ao item clicado
    const labItems = document.querySelectorAll('.lab-item');
    if (labItems[index]) {
        labItems[index].classList.add('selected');
        labItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Configurar event listeners do mapa
function setupMapEventListeners() {
    // Filtros por região
    const regionButtons = document.querySelectorAll('[data-region]');
    regionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Atualizar botões ativos
            regionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtrar labs
            const region = this.dataset.region;
            if (region === 'all') {
                filteredLabs = [...fabLabsData];
            } else {
                filteredLabs = fabLabsData.filter(lab => lab.region === region);
            }

            // Atualizar mapa e lista
            addMarkersToMap(filteredLabs);
            populateLabList();
            
            // Ajustar zoom do mapa para mostrar todos os labs filtrados
            if (filteredLabs.length > 0) {
                const group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        });
    });

    // Busca por texto
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Obter região ativa
            const activeRegionBtn = document.querySelector('[data-region].active');
            const activeRegion = activeRegionBtn ? activeRegionBtn.dataset.region : 'all';
            let baseData = activeRegion === 'all' ? fabLabsData : fabLabsData.filter(lab => lab.region === activeRegion);
            
            // Filtrar por termo de busca
            if (searchTerm) {
                filteredLabs = baseData.filter(lab => 
                    lab.name.toLowerCase().includes(searchTerm) ||
                    lab.location.toLowerCase().includes(searchTerm) ||
                    lab.description.toLowerCase().includes(searchTerm)
                );
            } else {
                filteredLabs = [...baseData];
            }

            // Atualizar mapa e lista
            addMarkersToMap(filteredLabs);
            populateLabList();
        });
    }
}

// Função para redimensionar o mapa quando necessário
function resizeMap() {
    if (map) {
        map.invalidateSize();
    }
}

// Redimensionar mapa quando a janela for redimensionada
window.addEventListener('resize', resizeMap);

// Exportar funções para uso global se necessário
window.fabLabMap = {
    resizeMap,
    selectLabInList,
    filteredLabs: () => filteredLabs
};

