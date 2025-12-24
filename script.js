/* ============================================
   PHANTOM — Fantasy Analytics
   JavaScript Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Main Tab Navigation
  initMainTabs();

  // Mobile Menu
  initMobileMenu();

  // Cursor Glow Effect
  initCursorGlow();

  // Counter Animation
  initCounters();

  // Scroll Animations
  initScrollAnimations();

  // Smooth scroll for anchor links
  initSmoothScroll();
});

/* ============================================
   Main Tab Navigation
   ============================================ */

function initMainTabs() {
  const tabs = document.querySelectorAll('.main-tab');
  const mobileTabs = document.querySelectorAll('.mobile-tab');
  const sections = document.querySelectorAll('[data-tab]');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!tabs.length || !sections.length) return;

  // Show initial tab (home)
  showTab('home');

  // Add click handlers for desktop tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      activateTab(targetTab);
    });
  });

  // Add click handlers for mobile tabs
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      activateTab(targetTab);

      // Close mobile menu
      if (menuBtn && mobileMenu) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  function activateTab(tabName) {
    // Update active tab (desktop)
    tabs.forEach(t => t.classList.remove('active'));
    tabs.forEach(t => {
      if (t.dataset.tab === tabName) t.classList.add('active');
    });

    // Show matching sections
    showTab(tabName);

    // Scroll to top of content
    const mainTabs = document.getElementById('mainTabs');
    if (mainTabs) {
      const offset = mainTabs.offsetTop + mainTabs.offsetHeight;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }

  function showTab(tabName) {
    sections.forEach(section => {
      if (section.dataset.tab === tabName) {
        section.classList.add('tab-visible');
      } else {
        section.classList.remove('tab-visible');
      }
    });
  }
}

/* ============================================
   Mobile Menu
   ============================================ */

function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !mobileMenu) return;

  // Set index for stagger animation
  mobileLinks.forEach((link, i) => {
    link.style.setProperty('--index', i);
  });

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   Cursor Glow Effect
   ============================================ */

function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');

  if (!cursorGlow) return;

  // Only on devices with hover capability
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smooth follow with easing
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   Counter Animation
   ============================================ */

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  function update() {
    current += step;

    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  update();
}

/* ============================================
   Scroll Animations
   ============================================ */

function initScrollAnimations() {
  // Add fade-in class to sections
  const animatedElements = document.querySelectorAll(
    '.feature-card, .pricing-card, .section-header, .stats-dashboard, .accuracy-showcase'
  );

  animatedElements.forEach(el => el.classList.add('fade-in'));

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // Parallax effect for hero stat cards
  const statCards = document.querySelectorAll('.hero-visual .stat-card');

  if (statCards.length && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;

      statCards.forEach((card, index) => {
        const depth = (index + 1) * 0.5;
        card.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
      });
    });
  }
}

/* ============================================
   Smooth Scroll
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================
   Live Data Simulation (Demo)
   ============================================ */

// Simulate live updates for demo purposes
setInterval(() => {
  const updateTime = document.querySelector('.update-time');
  if (updateTime) {
    const seconds = Math.floor(Math.random() * 10) + 1;
    updateTime.textContent = `Updated ${seconds}s ago`;
  }

  // Randomly update a projection
  const projections = document.querySelectorAll('.player-row:not(.header) .proj');
  if (projections.length) {
    const randomProj = projections[Math.floor(Math.random() * projections.length)];
    const currentVal = parseFloat(randomProj.textContent);
    const change = (Math.random() - 0.5) * 0.4;
    const newVal = (currentVal + change).toFixed(1);

    randomProj.textContent = newVal;
    randomProj.style.color = change > 0 ? '#4ade80' : '#f87171';

    setTimeout(() => {
      randomProj.style.color = '';
    }, 500);
  }
}, 3000);
