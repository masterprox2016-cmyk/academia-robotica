/* ── script.js – TEAM BELLAS ARTES BOTS ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Floating particles in hero ── */
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const span = document.createElement('span');
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDelay = Math.random() * 8 + 's';
      span.style.animationDuration = (6 + Math.random() * 6) + 's';
      span.style.width = (1 + Math.random() * 3) + 'px';
      span.style.height = span.style.width;
      span.style.opacity = Math.random() * 0.6 + 0.2;
      particlesContainer.appendChild(span);
    }
  }

  /* ── Header scroll effect ── */
  const header = document.getElementById('main-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    scrollTopBtn.classList.toggle('visible', y > 400);
  });

  /* ── Scroll To Top ── */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Active nav on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observerNav.observe(s));

  /* ── Hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on nav link click
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observerReveal.observe(el));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 8;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Animate stat numbers ── */
  function animateNumber(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const isNumeric = !isNaN(parseInt(target));

    if (!isNumeric) return; // skip non-numeric like "WRO"

    const end = parseInt(target);
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * end) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        // e.g. "+4", "$50", "3", "WRO"
        const match = raw.match(/([+$]?)(\d+)(.*)/);
        if (match) {
          const prefix = match[1];
          const num    = parseInt(match[2]);
          const suffix = match[3];
          let count = 0;
          const duration = 1600;
          const start = performance.now();
          const animate = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.floor(ease * num) + suffix;
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => statObserver.observe(n));

  /* ── Card hover glow ── */
  document.querySelectorAll('.level-card, .staff-card, .about-card, .inv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });

  /* ── Gallery lightbox (simple) ── */
  document.querySelectorAll('.gallery-3 img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,20,50,0.95);z-index:9999;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        animation:fadeInDown 0.3s ease;
      `;
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.alt = img.alt;
      bigImg.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.6);';
      overlay.appendChild(bigImg);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  console.log('🤖 Team Bellas Artes Bots – Página cargada correctamente.');
});
