// ===== EQUIPE PAGE JAVASCRIPT =====

// Team data
const teamData = [
  {
    id: 1,
    name: "Dr. Carlos Silva",
    role: "Diretor Executivo",
    department: "lideranca",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "PhD em Engenharia Mecânica com mais de 15 anos de experiência em fabricação digital e inovação tecnológica.",
    fullBio: "Dr. Carlos Silva é um líder visionário na área de fabricação digital, com PhD em Engenharia Mecânica pela UFRJ e mais de 15 anos de experiência em inovação tecnológica. Ele tem sido fundamental na democratização do acesso às tecnologias de fabricação digital no Brasil.",
    skills: ["Liderança", "Inovação", "Estratégia", "Fabricação Digital"],
    achievements: [
      "PhD em Engenharia Mecânica - UFRJ",
      "15+ anos de experiência em inovação",
      "Fundador de 3 startups de tecnologia",
      "Palestrante em 50+ eventos internacionais"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "carlos.silva@fablabbrasil.org"
    }
  },
  {
    id: 2,
    name: "Ana Costa",
    role: "Coordenadora de Educação",
    department: "educacao",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Educadora apaixonada por tecnologia e metodologias ativas de aprendizagem.",
    fullBio: "Ana Costa é uma educadora inovadora com mestrado em Educação Tecnológica. Ela desenvolve programas educacionais que integram tecnologia e criatividade, preparando estudantes para os desafios do futuro.",
    skills: ["Educação", "STEAM", "Metodologias Ativas", "Design Thinking"],
    achievements: [
      "Mestrado em Educação Tecnológica",
      "Criadora de 10+ programas educacionais",
      "Formou mais de 1000 estudantes",
      "Prêmio Educador Inovador 2023"
    ],
    social: {
      linkedin: "#",
      instagram: "#",
      email: "ana.costa@fablabbrasil.org"
    }
  },
  {
    id: 3,
    name: "Roberto Santos",
    role: "Especialista em Robótica",
    department: "tecnologia",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Engenheiro especializado em robótica e automação industrial.",
    fullBio: "Roberto Santos é um engenheiro mecatrônico com especialização em robótica e automação. Ele lidera projetos de desenvolvimento de soluções robóticas para indústria e educação.",
    skills: ["Robótica", "Automação", "IoT", "Machine Learning"],
    achievements: [
      "Engenheiro Mecatrônico - UFMG",
      "Especialização em Robótica Industrial",
      "20+ projetos de automação entregues",
      "Certificação em Machine Learning"
    ],
    social: {
      linkedin: "#",
      github: "#",
      email: "roberto.santos@fablabbrasil.org"
    }
  },
  {
    id: 4,
    name: "Marina Oliveira",
    role: "Designer de Produto",
    department: "design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Designer especializada em prototipagem rápida e design centrado no usuário.",
    fullBio: "Marina Oliveira combina criatividade e tecnologia para desenvolver produtos inovadores. Especialista em design thinking e prototipagem rápida, ela transforma ideias em soluções tangíveis.",
    skills: ["Design de Produto", "Prototipagem", "UX/UI", "Impressão 3D"],
    achievements: [
      "Graduada em Design - PUC-Rio",
      "100+ protótipos criados",
      "5+ prêmios de design",
      "Especialização em Design Thinking"
    ],
    social: {
      linkedin: "#",
      behance: "#",
      email: "marina.oliveira@fablabbrasil.org"
    }
  },
  {
    id: 5,
    name: "João Pereira",
    role: "Desenvolvedor de Software",
    department: "tecnologia",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Desenvolvedor full-stack especializado em IoT e aplicações web.",
    fullBio: "João Pereira é um desenvolvedor experiente que cria soluções digitais inovadoras. Especialista em tecnologias web modernas e IoT, ele conecta o mundo físico ao digital.",
    skills: ["JavaScript", "Python", "IoT", "Web Development"],
    achievements: [
      "Bacharel em Ciência da Computação",
      "50+ aplicações desenvolvidas",
      "Especialista em IoT",
      "Contribuidor open source"
    ],
    social: {
      linkedin: "#",
      github: "#",
      email: "joao.pereira@fablabbrasil.org"
    }
  },
  {
    id: 6,
    name: "Lucia Fernandes",
    role: "Coordenadora de Projetos",
    department: "gestao",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    bio: "Gestora de projetos com foco em inovação e sustentabilidade.",
    fullBio: "Lucia Fernandes é uma gestora experiente que coordena projetos complexos de inovação. Com foco em sustentabilidade e impacto social, ela garante que os projetos sejam entregues com excelência.",
    skills: ["Gestão de Projetos", "Sustentabilidade", "Inovação", "Agile"],
    achievements: [
      "MBA em Gestão de Projetos",
      "PMP Certified",
      "100+ projetos entregues",
      "Especialista em metodologias ágeis"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "lucia.fernandes@fablabbrasil.org"
    }
  }
];

// Filter categories
const filterCategories = [
  { id: 'todos', label: 'Todos', count: teamData.length },
  { id: 'lideranca', label: 'Liderança', count: teamData.filter(m => m.department === 'lideranca').length },
  { id: 'educacao', label: 'Educação', count: teamData.filter(m => m.department === 'educacao').length },
  { id: 'pesquisa', label: 'Pesquisa', count: teamData.filter(m => m.department === 'pesquisa').length },
  { id: 'design', label: 'Design', count: teamData.filter(m => m.department === 'design').length },
  { id: 'tecnologia', label: 'Tecnologia', count: teamData.filter(m => m.department === 'tecnologia').length },
  { id: 'gestao', label: 'Gestão', count: teamData.filter(m => m.department === 'gestao').length }
];

// ===== TEAM PAGE CLASS =====
class TeamPage {
  constructor() {
    this.currentFilter = 'todos';
    this.searchTerm = '';
    this.modal = null;
    this.testimonialSlider = null;
    
    this.init();
  }

  init() {
    this.renderFilters();
    this.renderTeamGrid();
    this.setupEventListeners();
    this.initTestimonialSlider();
    this.animateStats();
    
  
  }

  // Render filter buttons
  renderFilters() {
    const filtersContainer = document.querySelector('.team-filters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = filterCategories.map(category => `
      <button class="filter-btn ${category.id === this.currentFilter ? 'active' : ''}" 
              data-filter="${category.id}">
        ${category.label}
      </button>
    `).join('');
  }

  // Render team grid
  renderTeamGrid() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;

    const filteredTeam = this.getFilteredTeam();
    
    teamGrid.innerHTML = filteredTeam.map(member => `
      <div class="team-member" data-department="${member.department}" data-aos="fade-up">
        <div class="member-card">
          <div class="member-image">
            <img src="${member.image}" alt="${member.name}" loading="lazy">
            <div class="member-overlay">
              <div class="social-links">
                ${this.renderSocialLinks(member.social, member.name)}
              </div>
              <button class="btn-view-profile" data-member-id="${member.id}">Ver Perfil</button>
            </div>
          </div>
          <div class="member-info">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p class="member-bio">${member.bio}</p>
            <div class="member-skills">
              ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Render social links
  renderSocialLinks(social, memberName) {
    const socialIcons = {
      linkedin: 'fab fa-linkedin',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram',
      github: 'fab fa-github',
      behance: 'fab fa-behance',
      email: 'fas fa-envelope'
    };

    return Object.entries(social).map(([platform, url]) => `
      <a href="${url}" aria-label="${platform} de ${memberName}" class="social-link">
        <i class="${socialIcons[platform] || 'fas fa-link'}"></i>
      </a>
    `).join('');
  }

  // Get filtered team members
  getFilteredTeam() {
    let filtered = teamData;

    // Apply department filter
    if (this.currentFilter !== 'todos') {
      filtered = filtered.filter(member => member.department === this.currentFilter);
    }

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.bio.toLowerCase().includes(searchLower) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }

  // Setup event listeners
  setupEventListeners() {
    // Filter buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        this.handleFilterClick(e.target);
      }
      
      if (e.target.classList.contains('btn-view-profile')) {
        const memberId = parseInt(e.target.dataset.memberId);
        this.openMemberModal(memberId);
      }
    });

    // Search input
    const searchInput = document.querySelector('.team-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', utils.debounce((e) => {
        this.searchTerm = e.target.value;
        this.renderTeamGrid();
      }, 300));
    }

    // Modal close events
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || 
          e.target.classList.contains('modal-close')) {
        this.closeMemberModal();
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal) {
        this.closeMemberModal();
      }
    });
  }

  // Handle filter button click
  handleFilterClick(button) {
    // Update active state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update current filter
    this.currentFilter = button.dataset.filter;
    
    // Re-render team grid
    this.renderTeamGrid();
    
    // Show notification
    const filterLabel = filterCategories.find(cat => cat.id === this.currentFilter)?.label || 'Todos';
    this.showNotification(`Filtro "${filterLabel}" aplicado`, 'info');
  }

  // Open member modal
  openMemberModal(memberId) {
    const member = teamData.find(m => m.id === memberId);
    if (!member) return;

    // Create modal HTML
    const modalHTML = `
      <div class="modal-overlay active">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-profile">
              <img src="${member.image}" alt="${member.name}" class="modal-avatar">
              <div class="modal-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
              </div>
            </div>
            <button class="modal-close" aria-label="Fechar modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-section">
              <h4>Sobre</h4>
              <p>${member.fullBio}</p>
            </div>
            <div class="modal-section">
              <h4>Conquistas</h4>
              <ul>
                ${member.achievements.map(achievement => `
                  <li><i class="fas fa-check"></i> ${achievement}</li>
                `).join('')}
              </ul>
            </div>
            <div class="modal-section">
              <h4>Habilidades</h4>
              <div class="modal-skills">
                ${member.skills.map(skill => `<span class="modal-skill">${skill}</span>`).join('')}
              </div>
            </div>
            <div class="modal-section">
              <h4>Contato</h4>
              <div class="modal-contact">
                ${this.renderContactButtons(member.social)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.querySelector('.modal-overlay');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Render contact buttons for modal
  renderContactButtons(social) {
    const contactLabels = {
      linkedin: 'LinkedIn',
      twitter: 'Twitter',
      instagram: 'Instagram',
      github: 'GitHub',
      behance: 'Behance',
      email: 'Email'
    };

    const contactIcons = {
      linkedin: 'fab fa-linkedin',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram',
      github: 'fab fa-github',
      behance: 'fab fa-behance',
      email: 'fas fa-envelope'
    };

    return Object.entries(social).map(([platform, url]) => `
      <a href="${url}" class="contact-btn" target="_blank" rel="noopener">
        <i class="${contactIcons[platform]}"></i>
        ${contactLabels[platform]}
      </a>
    `).join('');
  }

  // Close member modal
  closeMemberModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
      document.body.style.overflow = '';
    }
  }

  // Initialize testimonial slider
  initTestimonialSlider() {
    this.testimonialSlider = new TestimonialSlider();
  }

  // Animate statistics
  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateOnScroll = () => {
      statNumbers.forEach(stat => {
        if (utils.isInViewport(stat) && !stat.classList.contains('animated')) {
          stat.classList.add('animated');
          const target = parseInt(stat.dataset.target);
          utils.animateNumber(stat, target);
        }
      });
    };

    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', utils.throttle(animateOnScroll, 100));
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    } else {
      // Fallback notification
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }
}

// ===== TESTIMONIAL SLIDER CLASS =====
class TestimonialSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.testimonial-item');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.testimonial-btn.prev');
    this.nextBtn = document.querySelector('.testimonial-btn.next');
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.setupEventListeners();
    this.startAutoPlay();
  }

  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause auto-play on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoPlay());
      slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  goToSlide(index) {
    // Remove active class from current slide and dot
    this.slides[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');
    
    // Update current slide
    this.currentSlide = index;
    
    // Add active class to new slide and dot
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Clear any existing interval
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }

  // Initialize team page
  new TeamPage();
  
  // Page loaded notification
  setTimeout(() => {
    if (typeof window.showToast === 'function') {
      window.showToast('Página carregada com sucesso!', 'success');
    }
  }, 1000);
});

// ===== UTILITY FUNCTIONS =====
// Extend the global utils object if it exists
if (typeof utils !== 'undefined') {
  // Add team-specific utilities
  utils.filterTeamMembers = function(members, filter, searchTerm) {
    let filtered = members;
    
    if (filter !== 'todos') {
      filtered = filtered.filter(member => member.department === filter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.bio.toLowerCase().includes(searchLower) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  };
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TeamPage, TestimonialSlider, teamData };
}

