// ===== PESQUISAS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeAnimations();
    initializeFilters();
    initializeSearch();
    
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

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.area-card, .project-card, .publication-item, .researcher-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize research area filters
function initializeFilters() {
    // Create filter buttons for research areas
    const filtersContainer = createAreaFiltersContainer();
    if (filtersContainer) {
        const researchSection = document.querySelector('.research-areas .container');
        researchSection.insertBefore(filtersContainer, researchSection.querySelector('h2').nextSibling);
    }
    
    // Create filter buttons for projects
    const projectFiltersContainer = createProjectFiltersContainer();
    if (projectFiltersContainer) {
        const projectsSection = document.querySelector('.current-projects .container');
        projectsSection.insertBefore(projectFiltersContainer, projectsSection.querySelector('h2').nextSibling);
    }
}

// Create research area filters
function createAreaFiltersContainer() {
    const container = document.createElement('div');
    container.className = 'filters-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
    `;

    const areas = ['Todas', 'Fabricação Digital', 'IoT', 'Inteligência Artificial', 'Robótica', 'Sustentabilidade', 'VR/AR'];
    
    areas.forEach((area, index) => {
        const button = document.createElement('button');
        button.textContent = area;
        button.className = 'filter-btn';
        button.dataset.area = area.toLowerCase();
        
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
            font-size: 0.875rem;
        `;
        
        button.addEventListener('click', function() {
            filterByArea(area.toLowerCase());
            updateActiveFilter(this, '.filters-container .filter-btn');
        });
        
        addHoverEffects(button);
        container.appendChild(button);
    });

    return container;
}

// Create project filters
function createProjectFiltersContainer() {
    const container = document.createElement('div');
    container.className = 'project-filters-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
    `;

    const categories = ['Todos', 'IoT & Indústria 4.0', 'Sustentabilidade', 'Inteligência Artificial'];
    
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = 'project-filter-btn';
        button.dataset.category = category.toLowerCase();
        
        if (index === 0) button.classList.add('active');
        
        button.style.cssText = `
            padding: 0.5rem 1.5rem;
            border: 2px solid var(--secondary-color);
            background: transparent;
            color: var(--secondary-color);
            border-radius: 2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 0.875rem;
        `;
        
        button.addEventListener('click', function() {
            filterByProjectCategory(category.toLowerCase());
            updateActiveFilter(this, '.project-filters-container .project-filter-btn');
        });
        
        addHoverEffects(button, '--secondary-color');
        container.appendChild(button);
    });

    return container;
}

// Add hover effects to buttons
function addHoverEffects(button, colorVar = '--primary-color') {
    button.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
            this.style.background = `var(${colorVar})`;
            this.style.color = 'white';
        }
    });
    
    button.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
            this.style.background = 'transparent';
            this.style.color = `var(${colorVar})`;
        }
    });
}

// Filter research areas
function filterByArea(area) {
    const areaCards = document.querySelectorAll('.area-card');
    
    areaCards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        
        if (area === 'todas' || cardTitle.includes(area) || 
            (area === 'vr/ar' && cardTitle.includes('realidade'))) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Filter projects by category
function filterByProjectCategory(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const cardCategory = card.querySelector('.project-category').textContent.toLowerCase();
        
        if (category === 'todos' || cardCategory.includes(category)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Update active filter button
function updateActiveFilter(activeButton, selector) {
    const filterButtons = document.querySelectorAll(selector);
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const colorVar = btn.classList.contains('project-filter-btn') ? '--secondary-color' : '--primary-color';
        btn.style.background = 'transparent';
        btn.style.color = `var(${colorVar})`;
    });
    
    activeButton.classList.add('active');
    const colorVar = activeButton.classList.contains('project-filter-btn') ? '--secondary-color' : '--primary-color';
    activeButton.style.background = `var(${colorVar})`;
    activeButton.style.color = 'white';
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-form input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchContent(searchTerm);
    });
}

// Search through all content
function searchContent(searchTerm) {
    // Search in research areas
    const areaCards = document.querySelectorAll('.area-card');
    areaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        card.style.display = matches || searchTerm === '' ? 'block' : 'none';
    });
    
    // Search in projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.project-category').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       category.includes(searchTerm);
        card.style.display = matches || searchTerm === '' ? 'block' : 'none';
    });
    
    // Search in publications
    const publicationItems = document.querySelectorAll('.publication-item');
    publicationItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const authors = item.querySelector('.authors').textContent.toLowerCase();
        const journal = item.querySelector('.journal').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       authors.includes(searchTerm) || 
                       journal.includes(searchTerm);
        item.style.display = matches || searchTerm === '' ? 'block' : 'none';
    });
    
    // Search in team
    const researcherCards = document.querySelectorAll('.researcher-card');
    researcherCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const position = card.querySelector('.position').textContent.toLowerCase();
        const specialization = card.querySelector('.specialization').textContent.toLowerCase();
        
        const matches = name.includes(searchTerm) || 
                       position.includes(searchTerm) || 
                       specialization.includes(searchTerm);
        card.style.display = matches || searchTerm === '' ? 'block' : 'none';
    });
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
    
    // Show notification
    showNotification(`Idioma alterado para: ${lang.toUpperCase()}`);
}

// Show notification
function showNotification(message) {
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
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

