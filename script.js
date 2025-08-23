// Page navigation with smooth transitions
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const currentPage = document.querySelector('.page.active');

  if (currentPage) {
    currentPage.style.opacity = '0';
    currentPage.style.transform = 'scale(0.95)';

    setTimeout(() => {
      currentPage.classList.remove('active');

      const newPage = document.getElementById(pageId);
      if (!newPage) return;
      newPage.classList.add('active');
      newPage.style.opacity = '0';
      newPage.style.transform = 'scale(0.95)';

      setTimeout(() => {
        newPage.style.transition = 'all 0.5s ease';
        newPage.style.opacity = '1';
        newPage.style.transform = 'scale(1)';
      }, 50);
    }, 250);
  } else {
    document.getElementById(pageId).classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateNavigation(pageId);
}

// Update navigation active state
function updateNavigation(activePageId) {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick')?.includes(activePageId)) {
      link.classList.add('active');
    }
  });
}

// Create floating particles
function createFloatingParticles() {
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';

      document.body.appendChild(particle);

      setTimeout(() => { if (particle.parentNode) particle.parentNode.removeChild(particle); }, 26000);
    }, i * 2000);
  }
}

// Enhanced card hover effects (kept for other blocks)
function initializeCardEffects() {
  const cards = document.querySelectorAll('.diagnostic-method, .treatment-option, .case-study, .research-paper');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function (e) {
      this.style.transform = 'translateY(-8px) rotateX(5deg)';
      this.style.boxShadow = '0 25px 50px rgba(255, 105, 180, 0.3)';
      this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      createRippleEffect(this, e);
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) rotateX(0)';
      this.style.boxShadow = '';
    });
  });
}

// Create ripple effect on hover
function createRippleEffect(element, event) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.className = 'ripple';

  if (!document.querySelector('.ripple-style')) {
    const style = document.createElement('style');
    style.className = 'ripple-style';
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
      }
      @keyframes rippleEffect {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Parallax effect for background ribbons
function initializeParallaxEffect() {
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const ribbons = document.querySelectorAll('.ribbon');

    ribbons.forEach((ribbon, index) => {
      const speed = 0.1 + (index * 0.05);
      const rotation = scrolled * 0.1;
      ribbon.style.transform = `translateY(${scrolled * speed}px) rotate(${rotation}deg)`;
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      const heroOffset = scrolled * 0.3;
      hero.style.transform = `translateY(${heroOffset}px)`;
    }
  });
}

// Scroll animation observer
function initializeScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.diagnostic-method, .treatment-option, .case-study, .research-paper, .stat-item, .video-card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// Enhanced statistics interaction
function initializeStatistics() {
  const statItems = document.querySelectorAll('.stat-item');

  statItems.forEach((stat, index) => {
    stat.addEventListener('click', function () {
      this.style.animation = 'none';
      this.offsetHeight;
      this.style.animation = 'pulse 0.6s ease';

      const originalBg = this.style.background;
      this.style.background = 'linear-gradient(135deg, #ff1493, #dc143c)';

      setTimeout(() => {
        this.style.background = originalBg || 'linear-gradient(135deg, #ff69b4, #ff1493)';
        this.style.animation = '';
      }, 600);
    });

    stat.style.animationDelay = `${index * 0.2}s`;
  });
}

// Typewriter effect for hero text
function typewriterEffect(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  function typeChar() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  }
  typeChar();
}

// Navigation hover polish
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-3px) scale(1.1)';
      this.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.4)';
    });
    link.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(-2px) scale(1.05)';
      this.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.3)';
    });
  });
}

// Page load animations
function initializePageLoadAnimations() {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.opacity = '0';
    logo.style.transform = 'scale(0.5)';
    setTimeout(() => {
      logo.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
    }, 500);
  }

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      link.style.transition = 'all 0.5s ease';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 700 + (index * 100));
  });
}

// Smooth scroll enhancement (for hash links)
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Easter egg: Konami code
function initializeEasterEgg() {
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let userInput = [];
  document.addEventListener('keydown', function (e) {
    userInput.push(e.keyCode);
    if (userInput.length > konamiCode.length) userInput.shift();
    if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
      createSpecialEffect();
      userInput = [];
    }
  });
}

// Special effect for easter egg
function createSpecialEffect() {
  const specialMessage = document.createElement('div');
  specialMessage.innerHTML = '💖 Thank you for your support in the fight against breast cancer! 💖';
  specialMessage.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #ff69b4, #ff1493);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    font-size: 1.2rem;
    text-align: center;
    z-index: 10000;
    box-shadow: 0 20px 40px rgba(255, 105, 180, 0.5);
    animation: specialPulse 2s ease-in-out infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes specialPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(specialMessage);
  setTimeout(() => { specialMessage.remove(); style.remove(); }, 5000);
}

/* ========= Burger Menu ========= */
function initializeBurgerMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-state', 'closed');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => { isOpen() ? closeMenu() : openMenu(); });
  menu.querySelectorAll('a').forEach(a => { a.addEventListener('click', () => closeMenu()); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) { closeMenu(); menu.style.removeProperty('max-height'); } });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('🎀 Breast Cancer Awareness Website Loaded! 🎀');

  initializeBurgerMenu();
  initializeCardEffects();
  initializeParallaxEffect();
  initializeScrollAnimations();
  initializeStatistics();
  initializeNavigation();
  initializePageLoadAnimations();
  initializeSmoothScroll();
  initializeEasterEgg();

  createFloatingParticles();
  setInterval(createFloatingParticles, 30000);

  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => { typewriterEffect(heroTitle, originalText, 80); }, 1500);
  }

  if (window.performance) {
    window.addEventListener('load', function () {
      const t = window.performance.timing;
      const loadTime = t.loadEventEnd - t.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
    });
  }
});

// Handle resize events
window.addEventListener('resize', function () {
  // nothing special needed now that cards are removed from Home
});

// Handle visibility changes (tab switching)
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    document.querySelectorAll('*').forEach(el => { if (el.style.animation) el.style.animationPlayState = 'paused'; });
  } else {
    document.querySelectorAll('*').forEach(el => { if (el.style.animation) el.style.animationPlayState = 'running'; });
  }
});

// Export functions for potential external use
window.breastCancerSite = { showPage, createFloatingParticles, createSpecialEffect };