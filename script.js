/* ── script.js – TEAM BELLAS ARTES BOTS ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Floating particles in hero (reducidas a 30 para rendimiento) ── */
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    const fragment = document.createDocumentFragment(); // batch insert
    for (let i = 0; i < 30; i++) {
      const span = document.createElement('span');
      span.style.cssText = `
        left:${Math.random() * 100}%;
        animation-delay:${(Math.random() * 8).toFixed(2)}s;
        animation-duration:${(6 + Math.random() * 6).toFixed(2)}s;
        width:${(1 + Math.random() * 2.5).toFixed(1)}px;
        height:${(1 + Math.random() * 2.5).toFixed(1)}px;
        background:${Math.random() > 0.5 ? 'rgba(255,215,0,0.55)' : 'rgba(0,123,255,0.45)'};
        border-radius:50%;
        position:absolute;
      `;
      fragment.appendChild(span);
    }
    particlesContainer.appendChild(fragment);
  }

  /* ── Header scroll effect ── */
  const header = document.getElementById('main-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
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
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ── Reveal on scroll — all variants ── */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observerReveal.observe(el));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 8 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Animate stat numbers ── */
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/([+$]?)(\d+)(.*)/);
        if (match) {
          const prefix   = match[1];
          const num      = parseInt(match[2]);
          const suffix   = match[3];
          const duration = 1600;
          const start    = performance.now();
          const animate  = (now) => {
            const p    = Math.min((now - start) / duration, 1);
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

  /* ── 3D Tilt on cards — throttled via rAF ── */
  document.querySelectorAll('.level-card, .staff-card, .about-card, .inv-card').forEach(card => {
    let rafId = null;
    let lastX = 0, lastY = 0;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      lastX = (e.clientX - rect.left) / rect.width;
      lastY = (e.clientY - rect.top)  / rect.height;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const tiltX = (lastY - 0.5) * -8;
          const tiltY = (lastX - 0.5) *  8;
          card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
          card.style.setProperty('--gx', (lastX * 100) + '%');
          card.style.setProperty('--gy', (lastY * 100) + '%');
          rafId = null;
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      card.style.transform = '';
    });
  });

  /* ── Typewriter effect on hero slogan ── */
  const slogan = document.querySelector('.hero-slogan');
  if (slogan) {
    const text = slogan.textContent.trim();
    slogan.textContent = '';
    slogan.style.borderRight = '2px solid rgba(255,255,255,0.6)';
    slogan.style.paddingRight = '4px';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        slogan.textContent += text[i++];
        setTimeout(type, 38);
      } else {
        setTimeout(() => { slogan.style.borderRight = 'none'; }, 1200);
      }
    };
    setTimeout(type, 1200);
  }

  /* ── Gallery lightbox ── */
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
