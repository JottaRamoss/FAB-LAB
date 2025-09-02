// JavaScript para Rodapé Aprimorado - Fab Lab Brasil

document.addEventListener('DOMContentLoaded', function() {
    
    function initEnhancedFooter() {
        initNewsletterForm();
        initSocialLinks();
        initContactAnimations();
        initScrollAnimations();
        addFooterInteractions();
        
        console.log('🦶 Rodapé Aprimorado - JavaScript carregado com sucesso!');
    }

    // Sistema de Newsletter
    function initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        const input = document.getElementById('newsletterEmail');
        const btn = document.getElementById('newsletterBtn');
        
        if (!form || !input || !btn) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = input.value.trim();
            
            if (!isValidEmail(email)) {
                showNewsletterFeedback('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Simular envio
            submitNewsletter(email, input, btn);
        });

        // Validação em tempo real
        input.addEventListener('input', function() {
            const email = this.value.trim();
            
            if (email && !isValidEmail(email)) {
                this.classList.add('newsletter-error');
                this.classList.remove('newsletter-success');
            } else if (email && isValidEmail(email)) {
                this.classList.add('newsletter-success');
                this.classList.remove('newsletter-error');
            } else {
                this.classList.remove('newsletter-error', 'newsletter-success');
            }
        });
    }

    // Validar e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Submeter newsletter
    function submitNewsletter(email, input, btn) {
        // Estado de loading
        btn.classList.add('loading');
        btn.innerHTML = '';
        input.disabled = true;
        
        // Simular requisição
        setTimeout(() => {
            // Simular sucesso (90% das vezes)
            const success = Math.random() > 0.1;
            
            if (success) {
                showNewsletterFeedback('✅ Inscrição realizada com sucesso!', 'success');
                input.value = '';
                input.classList.remove('newsletter-success');
                
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        event_category: 'Footer',
                        event_label: 'Newsletter'
                    });
                }
            } else {
                showNewsletterFeedback('❌ Erro ao inscrever. Tente novamente.', 'error');
            }
            
            // Restaurar estado
            btn.classList.remove('loading');
            btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            input.disabled = false;
            
        }, 2000);
    }

    // Feedback da newsletter
    function showNewsletterFeedback(message, type) {
        // Remover feedback anterior
        const existingFeedback = document.querySelector('.newsletter-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.className = `newsletter-feedback newsletter-feedback-${type}`;
        feedback.textContent = message;
        
        feedback.style.cssText = `
            margin-top: 10px;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            background: ${type === 'success' ? '#00d4aa' : '#dc3545'};
            color: white;
            animation: feedbackSlideIn 0.3s ease;
        `;
        
        const form = document.getElementById('newsletterForm');
        form.appendChild(feedback);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.style.animation = 'feedbackSlideOut 0.3s ease';
                setTimeout(() => feedback.remove(), 300);
            }
        }, 5000);
    }

    // Animações dos links sociais
    function initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const platform = this.querySelector('i').className;
                let url = '#';
                let platformName = 'Social';
                
                // Determinar plataforma e URL
                if (platform.includes('facebook')) {
                    url = 'https://facebook.com/fablabbrasil';
                    platformName = 'Facebook';
                } else if (platform.includes('instagram')) {
                    url = 'https://instagram.com/fablabbrasil';
                    platformName = 'Instagram';
                } else if (platform.includes('linkedin')) {
                    url = 'https://linkedin.com/company/fablabbrasil';
                    platformName = 'LinkedIn';
                } else if (platform.includes('youtube')) {
                    url = 'https://youtube.com/@fablabbrasil';
                    platformName = 'YouTube';
                } else if (platform.includes('twitter')) {
                    url = 'https://twitter.com/fablabbrasil';
                    platformName = 'Twitter';
                } else if (platform.includes('github')) {
                    url = 'https://github.com/fablabbrasil';
                    platformName = 'GitHub';
                }
                
                // Efeito de clique
                this.style.transform = 'translateY(-3px) scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-3px) scale(1)';
                }, 150);
                
                // Abrir link (simulado)
                setTimeout(() => {
                    showNotification(`Redirecionando para ${platformName}...`, 'info');
                    // window.open(url, '_blank');
                }, 300);
                
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        event_category: 'Footer',
                        event_label: platformName
                    });
                }
            });
        });
    }

    // Animações de contato
    function initContactAnimations() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // Animações de scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer-animate-in');
                }
            });
        }, observerOptions);

        // Observar seções do rodapé
        document.querySelectorAll('.footer-section, .footer-brand').forEach(el => {
            observer.observe(el);
        });
    }

    // Interações adicionais
    function addFooterInteractions() {
        // Certificações
        const certifications = document.querySelectorAll('.certification-badge');
        certifications.forEach(cert => {
            cert.addEventListener('click', function() {
                const title = this.getAttribute('title');
                showNotification(`Certificação: ${title}`, 'info');
            });
        });

        // Links do rodapé
        const footerLinks = document.querySelectorAll('.footer-section a');
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Se for link interno válido, permitir navegação
                if (href && href !== '#' && !href.startsWith('http')) {
                    return; // Permitir navegação normal
                }
                
                // Para links externos ou placeholders
                if (href === '#') {
                    e.preventDefault();
                    const text = this.textContent.trim();
                    showNotification(`${text} - Em desenvolvimento`, 'info');
                }
            });
        });

        // Logo do rodapé
        const footerLogo = document.querySelector('.footer-logo');
        if (footerLogo) {
            footerLogo.addEventListener('click', function(e) {
                // Permitir navegação normal para index.html
                if (this.getAttribute('href') === 'index.html') {
                    return;
                }
            });
        }
    }

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `footer-notification footer-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: notificationSlideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#00d4aa',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#0066ff'
        };
        return colors[type] || colors.info;
    }

    // Adicionar estilos de animação
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .footer-animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: all 0.8s ease-out;
            }
            
            .footer-section, .footer-brand {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease-out;
            }
            
            @keyframes feedbackSlideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes feedbackSlideOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            @keyframes notificationSlideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes notificationSlideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            
            .notification-close:hover {
                background: rgba(255,255,255,0.2);
            }
        `;
        
        document.head.appendChild(style);
    }

    // Inicializar tudo
    addAnimationStyles();
    initEnhancedFooter();
});

// Funções globais para o rodapé
window.FooterEnhanced = {
    init: () => console.log('Rodapé Aprimorado inicializado!'),
    newsletter: {
        subscribe: (email) => submitNewsletter(email),
        validate: (email) => isValidEmail(email)
    }
};

