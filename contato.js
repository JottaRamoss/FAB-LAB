// JavaScript específico para página Contato

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todas as funcionalidades
    function init() {
        initFormValidation();
        initFAQAccordion();
        initContactMethodAnimations();
        initScrollAnimations();
        initFormSubmission();
        initMapInteraction();
        addCustomStyles();
        
        console.log('📞 Contato - JavaScript carregado com sucesso!');
    }

    // Validação do formulário
    function initFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const fields = {
            nome: {
                element: document.getElementById('nome'),
                rules: ['required', 'minLength:2'],
                messages: {
                    required: 'Nome é obrigatório',
                    minLength: 'Nome deve ter pelo menos 2 caracteres'
                }
            },
            email: {
                element: document.getElementById('email'),
                rules: ['required', 'email'],
                messages: {
                    required: 'E-mail é obrigatório',
                    email: 'E-mail deve ter um formato válido'
                }
            },
            telefone: {
                element: document.getElementById('telefone'),
                rules: ['phone'],
                messages: {
                    phone: 'Telefone deve ter um formato válido'
                }
            },
            assunto: {
                element: document.getElementById('assunto'),
                rules: ['required'],
                messages: {
                    required: 'Selecione um assunto'
                }
            },
            mensagem: {
                element: document.getElementById('mensagem'),
                rules: ['required', 'minLength:10'],
                messages: {
                    required: 'Mensagem é obrigatória',
                    minLength: 'Mensagem deve ter pelo menos 10 caracteres'
                }
            },
            termos: {
                element: document.getElementById('termos'),
                rules: ['required'],
                messages: {
                    required: 'Você deve aceitar os termos de uso'
                }
            }
        };

        // Validação em tempo real
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field.element) {
                field.element.addEventListener('blur', () => validateField(fieldName, field));
                field.element.addEventListener('input', () => clearFieldError(fieldName));
            }
        });

        // Máscara para telefone
        const telefoneField = document.getElementById('telefone');
        if (telefoneField) {
            telefoneField.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                    if (value.length < 14) {
                        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                    }
                }
                e.target.value = value;
            });
        }

        // Validação de campo individual
        function validateField(fieldName, field) {
            const value = field.element.value.trim();
            const rules = field.rules;
            
            for (let rule of rules) {
                if (rule === 'required' && !value) {
                    showFieldError(fieldName, field.messages.required);
                    return false;
                }
                
                if (rule === 'email' && value && !isValidEmail(value)) {
                    showFieldError(fieldName, field.messages.email);
                    return false;
                }
                
                if (rule.startsWith('minLength:')) {
                    const minLength = parseInt(rule.split(':')[1]);
                    if (value && value.length < minLength) {
                        showFieldError(fieldName, field.messages.minLength);
                        return false;
                    }
                }
                
                if (rule === 'phone' && value && !isValidPhone(value)) {
                    showFieldError(fieldName, field.messages.phone);
                    return false;
                }
                
                if (rule === 'required' && field.element.type === 'checkbox' && !field.element.checked) {
                    showFieldError(fieldName, field.messages.required);
                    return false;
                }
            }
            
            clearFieldError(fieldName);
            return true;
        }

        // Mostrar erro no campo
        function showFieldError(fieldName, message) {
            const field = fields[fieldName];
            const formGroup = field.element.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        // Limpar erro do campo
        function clearFieldError(fieldName) {
            const field = fields[fieldName];
            const formGroup = field.element.closest('.form-group');
            formGroup.classList.remove('error');
        }

        // Validar formulário completo
        function validateForm() {
            let isValid = true;
            Object.keys(fields).forEach(fieldName => {
                if (!validateField(fieldName, fields[fieldName])) {
                    isValid = false;
                }
            });
            return isValid;
        }

        // Utilitários de validação
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            return phoneRegex.test(phone);
        }

        // Expor função de validação
        window.validateContactForm = validateForm;
    }

    // Submissão do formulário
    function initFormSubmission() {
        const form = document.getElementById('contact-form');
        const submitBtn = form?.querySelector('.btn-submit');
        
        if (!form || !submitBtn) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar formulário
            if (!window.validateContactForm()) {
                showNotification('Por favor, corrija os erros no formulário.', 'error');
                return;
            }

            // Mostrar loading
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Simular envio (substituir por API real)
                await simulateFormSubmission();
                
                // Mostrar sucesso
                showFormSuccess();
                form.reset();
                
                // Analytics (se disponível)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Contact Form'
                    });
                }
                
            } catch (error) {
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
                console.error('Erro no envio:', error);
            } finally {
                // Remover loading
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });

        // Simular envio do formulário
        async function simulateFormSubmission() {
            return new Promise((resolve) => {
                setTimeout(resolve, 2000); // Simular delay de rede
            });
        }

        // Mostrar formulário de sucesso
        function showFormSuccess() {
            const formContainer = document.querySelector('.contact-form');
            const successContainer = document.getElementById('form-success');
            
            if (formContainer && successContainer) {
                formContainer.style.display = 'none';
                successContainer.style.display = 'block';
                
                // Voltar ao formulário após 5 segundos
                setTimeout(() => {
                    formContainer.style.display = 'block';
                    successContainer.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Botão de fechar
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
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };
        return colors[type] || colors.info;
    }

    // Accordion FAQ
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Fechar todos os outros
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                       otherItem.classList.remove('active');
                    }
                });
                
                // Abrir/fechar o atual
                item.classList.toggle('active');
            });
        });
    }

    // Animações dos métodos de contato
    function initContactMethodAnimations() {
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach((method, index) => {
            // Animação de entrada
            method.style.opacity = '0';
            method.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                method.style.transition = 'all 0.6s ease';
                method.style.opacity = '1';
                method.style.transform = 'translateY(0)';
            }, index * 100);
            
            // Efeito de hover melhorado
            method.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            });
            
            method.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });
    }

    // Animações de scroll
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            return; // Não executa se o browser não suportar
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Para a animação não repetir
                }
            });
        }, observerOptions);

        // Observar elementos
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // Interação com mapa (removido, mas a função pode ser mantida vazia ou removida)
    function initMapInteraction() {
        // A seção do mapa foi removida, então esta função não faz mais nada.
        // Pode ser deletada se preferir.
    }

    // Adicionar estilos customizados para animações e notificações
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            [data-aos] {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            [data-aos].animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
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
    init();
});

// Funções globais (opcional)
window.ContatoJS = {
    showNotification: (message, type) => showNotification(message, type),
    validateForm: () => window.validateContactForm(),
    init: () => console.log('Contato JS inicializado!')
};
