/* ============================================================
   SCEVE ENGENHARIA — main.js
   Inicialização global: componentes, scroll, animações
   ============================================================ */

'use strict';

/* ── Carrega componentes HTML via fetch ─────────────────────── */

async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
    // Dispara evento para que outros scripts saibam que o componente foi carregado
    el.dispatchEvent(new CustomEvent('component:loaded', { bubbles: true }));
  } catch (e) {
    console.warn(`[Sceve] Não foi possível carregar ${url}:`, e.message);
  }
}

/* ── Resolve caminhos relativos com base na profundidade da página ── */

function resolveComponentPath(filename) {
  const depth = location.pathname.split('/').filter(Boolean).length;
  // Se estiver em pages/servicos/ a profundidade é 2 → ../../
  const prefix = depth <= 1 ? './' : '../'.repeat(depth - 1);
  return `${prefix}components/${filename}`;
}

/* ── Header: scroll behavior e menu mobile ──────────────────── */

function initHeader() {
  const header   = document.getElementById('site-header');
  const hamburger = document.getElementById('header-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileServicosToggle    = document.getElementById('mobile-servicos-toggle');
  const mobileServicosSub       = document.getElementById('mobile-servicos-sub');
  const mobileTreinamentosToggle = document.getElementById('mobile-treinamentos-toggle');
  const mobileTreinamentosSub    = document.getElementById('mobile-treinamentos-sub');

  if (!header) return;

  /* Scroll: adiciona classe --scrolled */
  const isHome = document.body.classList.contains('page-home');

  function onScroll() {
    const scrolled = window.scrollY > 60;
    if (isHome) {
      header.classList.toggle('site-header--scrolled', scrolled);
      header.classList.toggle('site-header--transparent', !scrolled);
    } else {
      header.classList.add('site-header--scrolled');
      header.classList.remove('site-header--solid', 'site-header--transparent');
    }
  }

  if (isHome) {
    header.classList.add('site-header--transparent');
    header.classList.remove('site-header--solid');
  } else {
    header.classList.remove('site-header--transparent');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger / menu mobile */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha ao clicar fora
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });

    // Fecha com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('is-active');
    mobileMenu?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Sub-menu mobile de serviços */
  if (mobileServicosToggle && mobileServicosSub) {
    mobileServicosToggle.addEventListener('click', () => {
      const isOpen = mobileServicosSub.classList.toggle('is-open');
      mobileServicosToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* Sub-menu mobile de treinamentos */
  if (mobileTreinamentosToggle && mobileTreinamentosSub) {
    mobileTreinamentosToggle.addEventListener('click', () => {
      const isOpen = mobileTreinamentosSub.classList.toggle('is-open');
      mobileTreinamentosToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* Marca o link ativo no nav */
  const currentPath = location.pathname;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const nav = link.dataset.nav;
    const active =
      (nav === 'home'    && (currentPath === '/' || currentPath.endsWith('index.html') && !currentPath.includes('/pages/'))) ||
      (nav === 'sobre'   && currentPath.includes('sobre')) ||
      (nav === 'blog'    && currentPath.includes('blog')) ||
      (nav === 'contato' && currentPath.includes('contato'));
    if (active) link.classList.add('nav__link--active', 'mobile-nav__link--active');
  });
}

/* ── Footer: ano dinâmico ───────────────────────────────────── */

function initFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── Cookie Banner ──────────────────────────────────────────── */

function initCookieBanner() {
  const banner  = document.getElementById('cookie-banner');
  const accept  = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');

  if (!banner) return;

  const consent = localStorage.getItem('sceve_cookie_consent');
  if (!consent) {
    setTimeout(() => banner.classList.add('is-visible'), 1200);
  }

  function closeBanner(value) {
    banner.classList.remove('is-visible');
    localStorage.setItem('sceve_cookie_consent', value);
  }

  accept?.addEventListener('click',  () => closeBanner('all'));
  decline?.addEventListener('click', () => closeBanner('necessary'));
}

/* ── Scroll animations (IntersectionObserver) ───────────────── */

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll(
    '.service-card, .benefit-card, .testimonial-card, .blog-card, .blog-list-card, .diff-stat-card, .service-overview-card, .contact-card, .faq-item'
  );

  // Elements already visible at page load should not animate (avoids opacity-0 flash).
  // The flag is set after two animation frames, by which point the initial viewport
  // callbacks have already fired and been discarded without adding the animation class.
  let pageSettled = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { pageSettled = true; }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        if (pageSettled) {
          entry.target.style.animationDelay = `${i * 60}ms`;
          entry.target.classList.add('animate-fadeInUp');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── FAQ Accordion ──────────────────────────────────────────── */

function initFaq() {
  document.querySelectorAll('.faq-item__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Fecha todos
      document.querySelectorAll('.faq-item.is-open').forEach(open => {
        open.classList.remove('is-open');
        open.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado (se não estava aberto)
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Dropdown desktop ───────────────────────────────────────── */

function initDropdowns() {
  document.querySelectorAll('.nav__item--dropdown').forEach(item => {
    const btn = item.querySelector('button.nav__link');
    const dropdown = item.querySelector('.nav__dropdown');
    if (!btn || !dropdown) return;

    // Teclado
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', item.classList.contains('is-open'));
      }
    });

    // Fechar ao sair
    item.addEventListener('mouseleave', () => {
      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Smooth scroll para âncoras ─────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length < 2) return; // ignora placeholders "#" sem alvo real
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Contador animado de números ────────────────────────────── */

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString('pt-BR');
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Inicialização ──────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  // Carrega componentes (header e footer são incluídos diretamente nas páginas)
  initHeader();
  initFooter();
  initCookieBanner();
  initScrollAnimations();
  initFaq();
  initDropdowns();
  initSmoothScroll();
  initCounters();
});

// Re-inicializa após carregamento de componentes dinâmicos
document.addEventListener('component:loaded', () => {
  initHeader();
  initFooter();
  initCookieBanner();
});
