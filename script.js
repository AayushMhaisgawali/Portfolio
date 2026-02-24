// ============================================================
//  AAYUSH MHAISGAWALI — PORTFOLIO SCRIPT
// ============================================================

// ===== PARTICLE CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.vx = randomBetween(-0.3, 0.3);
      this.vy = randomBetween(-0.3, 0.3);
      this.r = randomBetween(1, 2.5);
      this.alpha = randomBetween(0.3, 0.8);
      const colors = ['#6c63ff', '#00d4ff', '#ff6584', '#00ff88'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += (dx / dist) * 1.5;
          this.y += (dy / dist) * 1.5;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
})();


// ===== TYPEWRITER EFFECT =====
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Embedded Engineer',
    'IoT Developer',
    'Full-Stack Dev',
    'ML Enthusiast',
    'Research Intern',
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const TYPING_SPEED = 90, DELETING_SPEED = 50, PAUSE = 2000;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, PAUSE);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }
  setTimeout(type, 800);
})();


// ===== NAVBAR =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });

  // Active link highlight on scroll
  const sections = ['about', 'skills', 'experience', 'projects', 'education', 'contact'];
  const navEls = {};
  sections.forEach(id => {
    navEls[id] = document.getElementById('nav-' + id);
  });

  const sectionEls = sections.map(id => document.getElementById(id)).filter(Boolean);

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sectionEls.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    sections.forEach(id => {
      if (navEls[id]) {
        navEls[id].classList.toggle('active', id === current);
      }
    });
  }, { passive: true });
})();


// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ===== CONTACT FORM =====
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      // Simple shake animation for empty fields
      [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')].forEach(el => {
        if (!el.value.trim()) { el.style.borderColor = '#ff6584'; el.style.boxShadow = '0 0 0 3px rgba(255,101,132,0.2)'; }
      });
      return;
    }

    const mailtoLink = `mailto:ayushmhaisgawali@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;

    successMsg.style.display = 'block';
    form.reset();
    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  });

  // Reset error styles on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  });
})();


// ===== CURSOR GLOW EFFECT =====
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    pointer-events: none;
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();


// ===== COUNTER ANIMATION =====
(function initCounters() {
  const statValues = document.querySelectorAll('.stat-value');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text);
      if (isNaN(num)) return;

      const suffix = text.replace(/[\d.]/g, '');
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (num * eased).toFixed(num % 1 !== 0 ? 2 : 0);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => observer.observe(el));
})();
