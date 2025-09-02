// ===== EVENTOS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeAnimations();
    initializeFilters();
    initializeNewsletter();
    
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
    const animatedElements = document.querySelectorAll('.category-card, .event-card, .past-event-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize event filters
function initializeFilters() {
    // Create filter buttons for event types
    const filtersContainer = createEventFiltersContainer();
    if (filtersContainer) {
        const upcomingSection = document.querySelector('.upcoming-events .container');
        upcomingSection.insertBefore(filtersContainer, upcomingSection.querySelector('h2').nextSibling);
    }
}

// Create event type filters
function createEventFiltersContainer() {
    const container = document.createElement('div');
    container.className = 'event-filters-container';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
    `;

    const eventTypes = ['Todos', 'Workshop', 'Hackathon', 'Capacitação', 'Conferência'];
    
    eventTypes.forEach((type, index) => {
        const button = document.createElement('button');
        button.textContent = type;
        button.className = 'event-filter-btn';
        button.dataset.type = type.toLowerCase();
        
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
            filterEventsByType(type.toLowerCase());
            updateActiveFilter(this);
        });
        
        addHoverEffects(button);
        container.appendChild(button);
    });

    return container;
}

// Add hover effects to buttons
function addHoverEffects(button) {
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
}

// Filter events by type
function filterEventsByType(type) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const eventType = card.querySelector('.event-type').textContent.toLowerCase();
        
        if (type === 'todos' || eventType.includes(type)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Update active filter button
function updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('.event-filter-btn');
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary-color)';
    });
    
    activeButton.classList.add('active');
    activeButton.style.background = 'var(--primary-color)';
    activeButton.style.color = 'white';
}

// Initialize newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNewsletterSubmission(this);
    });
}

// Handle newsletter form submission
function handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    // Disable button and show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Inscrevendo...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset form
        emailInput.value = '';
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showNotification('Inscrição realizada com sucesso! Verifique seu e-mail.', 'success');
    }, 2000);
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
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'success' ? 'var(--success-color)' : 
                   type === 'error' ? 'var(--danger-color)' : 
                   'var(--primary-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
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

// Event registration functionality
function initializeEventRegistration() {
    const registrationButtons = document.querySelectorAll('.event-card .btn-outline, .featured-info .btn-primary');
    
    registrationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleEventRegistration(this);
        });
    });
}

// Handle event registration
function handleEventRegistration(button) {
    const eventCard = button.closest('.event-card') || button.closest('.featured-info');
    const eventTitle = eventCard.querySelector('h3, h2').textContent;
    
    // Simulate registration process
    const originalText = button.textContent;
    button.textContent = 'Processando...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        showNotification(`Inscrição para "${eventTitle}" realizada com sucesso!`, 'success');
    }, 2000);
}

// Initialize event registration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventRegistration();
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

// Add countdown timer for featured event
function initializeCountdown() {
    const featuredEvent = document.querySelector('.featured-event');
    if (!featuredEvent) return;

    // Set target date (May 15, 2025)
    const targetDate = new Date('2025-05-15T09:00:00').getTime();
    
    // Create countdown element
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown-timer';
    countdownElement.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        padding: 1.5rem;
        margin-top: 2rem;
        text-align: center;
        color: white;
    `;
    
    // Insert countdown after event details
    const eventDetails = featuredEvent.querySelector('.event-details');
    if (eventDetails) {
        eventDetails.parentNode.insertBefore(countdownElement, eventDetails.nextSibling);
    }
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = '<h3>Evento em Andamento!</h3>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: white;">Faltam:</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${days}</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Dias</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${hours}</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Horas</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${minutes}</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Minutos</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${seconds}</div>
                    <div style="font-size: 0.875rem; opacity: 0.8;">Segundos</div>
                </div>
            </div>
        `;
    }, 1000);
}

// Initialize countdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCountdown();
});

