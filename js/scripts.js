const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

// header scroll effect
const header = document.querySelector('header.site');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scroll-active');
    } else {
      header.classList.remove('scroll-active');
    }
  }, { passive: true });
}

// mobile nav toggle (animated hamburger)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// scroll reveal, staggered within each container
const revealGroups = new Map();
document.querySelectorAll('[data-reveal]').forEach(el => {
  const parent = el.parentElement;
  if (!revealGroups.has(parent)) revealGroups.set(parent, []);
  const group = revealGroups.get(parent);
  el.style.setProperty('--reveal-delay', `${Math.min(group.length, 5) * 70}ms`);
  group.push(el);
});
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// active section indicator (scrollspy)
const navAnchors = navLinks ? Array.from(navLinks.querySelectorAll('a[href^="#"]')) : [];
if (navAnchors.length && 'IntersectionObserver' in window) {
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = navAnchors.find(a => a.getAttribute('href') === id);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));
}

// hero title reveal: wrap words in spans for a text-reveal-on-load effect
document.querySelectorAll('.hero h1').forEach(h1 => {
  if (prefersReducedMotion) return;
  const nodes = Array.from(h1.childNodes);
  h1.innerHTML = '';
  let delay = 0;
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(' ').forEach((word, i, arr) => {
        if (!word) return;
        const wrap = document.createElement('span');
        wrap.className = 'reveal-word';
        const inner = document.createElement('span');
        inner.textContent = word + (i < arr.length - 1 ? '\u00A0' : '');
        inner.style.animationDelay = `${delay}ms`;
        delay += 60;
        wrap.appendChild(inner);
        h1.appendChild(wrap);
      });
    } else if (node.nodeName === 'BR') {
      h1.appendChild(node.cloneNode());
    } else {
      const span = document.createElement('span');
      span.className = 'reveal-word';
      const inner = document.createElement('span');
      inner.textContent = node.textContent;
      inner.style.animationDelay = `${delay}ms`;
      delay += 60;
      span.appendChild(inner);
      h1.appendChild(span);
    }
  });
});

// custom cursor + magnetic buttons + subtle mouse-follow on hero
if (isFinePointer && !prefersReducedMotion) {
  document.documentElement.classList.add('has-cursor');
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const outline = document.createElement('div');
  outline.className = 'cursor-outline';
  document.body.append(dot, outline);

  let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });
  (function loop() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .skill-block').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('is-active'));
    el.addEventListener('mouseleave', () => outline.classList.remove('is-active'));
  });

  // magnetic buttons
  document.querySelectorAll('.btn, .link-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // skill card subtle tilt
  document.querySelectorAll('.skill-block').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// same-site page transition (fade out before navigating)
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
  a.addEventListener('click', e => {
    if (prefersReducedMotion) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 260);
  });
});

// gallery lightbox
const lightbox = document.getElementById('project02Lightbox');
const galleryButtons = Array.from(document.querySelectorAll('.gallery-image-button'));
if (lightbox && galleryButtons.length) {
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryImages = galleryButtons.map(button => ({
    src: button.querySelector('img').src,
    caption: button.querySelector('img').alt
  }));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentIndex].src;
    lightboxImage.alt = galleryImages[currentIndex].caption;
    lightboxCaption.textContent = galleryImages[currentIndex].caption;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  galleryButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click', () => openLightbox(currentIndex + 1));
  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (event.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
}
