/* ---------- Formulario → WhatsApp ---------- */
const thesisForm = document.getElementById('thesisForm');
const nameField = document.getElementById('fname');

nameField.addEventListener('input', () => nameField.setCustomValidity(''));

thesisForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = nameField.value.trim();
  if (!name) {
    nameField.setCustomValidity('Escribe tu nombre para continuar.');
    nameField.reportValidity();
    return;
  }

  const level = document.getElementById('flevel').value.toLocaleLowerCase('es');
  const area = document.getElementById('farea').value.trim();
  const topic = document.getElementById('fmsg').value.trim();
  const subject = area ? ` en el área de ${area}` : '';
  const message = `Hola Ale, soy ${name}. Busco asesoría para mi tesis de ${level}${subject}.`;
  const destination = new URL(thesisForm.action);
  destination.searchParams.set('text', [message, topic].filter(Boolean).join('\n\n'));
  window.location.assign(destination.href);
});

/* ---------- Navegación: borde al hacer scroll + menú móvil ---------- */
const nav = document.getElementById('nav');
const navToggle = nav.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const waFloat = document.querySelector('.wa-float');
const hero = document.getElementById('inicio');

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
  navMenu.classList.toggle('is-open', open);
}

navToggle.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navMenu.addEventListener("click", (event) => { if (event.target.closest("a")) { setMenu(false); onScroll(); } });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    setMenu(false);
    onScroll();
    navToggle.focus();
  }
});

/* Transparente sobre el hero; sólida al bajar o con el menú móvil abierto */
const onScroll = () => {
  const solid = navMenu.classList.contains('is-open') || window.scrollY > hero.offsetHeight - nav.offsetHeight;
  nav.classList.toggle('is-scrolled', solid);
  nav.classList.toggle('on-hero', !solid);
  nav.classList.toggle('is-dim', !solid && window.scrollY > 24);
};
navToggle.addEventListener('click', () => onScroll());
onScroll();
window.addEventListener('scroll', onScroll, {passive: true});

/* El botón flotante aparece al salir del hero y se oculta en la sección de contacto */
const contact = document.getElementById('contacto');
let heroVisible = true;
let contactVisible = false;
const updateFloat = () => waFloat.classList.toggle('is-visible', !heroVisible && !contactVisible);
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; updateFloat(); }).observe(hero);
new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; updateFloat(); }).observe(contact);

/* Resalta el enlace de la sección activa */
const navLinks = [...navMenu.querySelectorAll('nav a')];
const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, {rootMargin: '-45% 0px -50% 0px'});
sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Carrusel de logos: duplica la lista para un bucle continuo ---------- */
const track = document.querySelector('.training-list');
[...track.children].forEach((item) => {
  const clone = item.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
});

/* ---------- Animaciones ligadas al scroll ---------- */
const motion = document.documentElement.classList.contains('motion');

/* Índices fijos para grupos y pasos (escalonado por posición) */
document.querySelectorAll('.reveal-group').forEach((group) => {
  [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
});
document.querySelectorAll('.reveal-steps > li').forEach((li, i) => li.style.setProperty('--i', i));

const revealTargets = document.querySelectorAll('.reveal, .reveal-group, .reveal-img, .reveal-steps');
if (motion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    /* Los elementos que entran juntos se escalonan entre sí */
    entries.filter((entry) => entry.isIntersecting).forEach((entry, batchIndex) => {
      const el = entry.target;
      if (el.classList.contains('reveal') && !el.closest('.reveal-steps')) {
        el.style.setProperty('--i', Math.min(batchIndex, 6));
      }
      el.classList.add('is-in');
      revealObserver.unobserve(el);
    });
  }, {rootMargin: '0px 0px -10% 0px', threshold: 0.12});
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-in'));
}

/* Parallax del hero, de la foto "Sobre mí" y barra de progreso */
const progressBar = document.querySelector('.progress');
const heroImage = hero.querySelector('.hero-image');
const heroCopy = hero.querySelector('.hero-copy');
const aboutFigure = document.querySelector('.about-media');
let ticking = false;

function renderScroll() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

  if (!motion) return;

  const heroH = hero.offsetHeight;
  if (y <= heroH) {
    heroImage.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(1.08)`;
    heroCopy.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
    heroCopy.style.opacity = Math.max(0, 1 - y / (heroH * 0.5)).toFixed(3);
  }

  const rect = aboutFigure.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < vh) {
    const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
    aboutFigure.style.setProperty('--py', `${(Math.max(-1, Math.min(1, offset)) * -28).toFixed(1)}px`);
  }
}

function requestRender() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(renderScroll);
  }
}
window.addEventListener('scroll', requestRender, {passive: true});
window.addEventListener('resize', requestRender);
renderScroll();
