
const WGHT_MIN = 300;
const WGHT_MAX = 700;
const XHGT_MIN = 400;
const XHGT_MAX = 600;

const heroTitle  = document.getElementById('heroTitle');
const wghtVal    = document.getElementById('wghtVal');
const xhgtVal    = document.getElementById('xhgtVal');
const hero       = document.getElementById('hero');

let currentWght = 400;
let currentXhgt = 500;
let targetWght  = 400;
let targetXhgt  = 500;
let animating   = false;


hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();


  const xRatio = (e.clientX - rect.left) / rect.width;
  targetWght = Math.round(WGHT_MIN + xRatio * (WGHT_MAX - WGHT_MIN));


  const yRatio = (e.clientY - rect.top) / rect.height;
  targetXhgt = Math.round(XHGT_MAX - yRatio * (XHGT_MAX - XHGT_MIN));


  hero.style.setProperty('--mx', e.clientX - rect.left + 'px');
  hero.style.setProperty('--my', e.clientY - rect.top + 'px');

  if (!animating) {
    animating = true;
    smoothUpdate();
  }
});


function smoothUpdate() {
  const lerpFactor = 0.12;

  currentWght += (targetWght - currentWght) * lerpFactor;
  currentXhgt += (targetXhgt - currentXhgt) * lerpFactor;

  const wght = Math.round(currentWght);
  const xhgt = Math.round(currentXhgt);

  heroTitle.style.fontVariationSettings = `'wght' ${wght}, 'XHGT' ${xhgt}`;
  wghtVal.textContent = wght;
  xhgtVal.textContent = xhgt;

  const stillMoving = Math.abs(targetWght - currentWght) > 0.5
                   || Math.abs(targetXhgt - currentXhgt) > 0.5;

  if (stillMoving) {
    requestAnimationFrame(smoothUpdate);
  } else {
    animating = false;
  }
}


hero.addEventListener('mouseleave', () => {
  targetWght = 400;
  targetXhgt = 500;
  if (!animating) {
    animating = true;
    smoothUpdate();
  }
});


const navEl = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav ul a');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navEl.style.color = 'var(--fg-light)';
      navLinks.forEach(l => l.style.color = 'var(--fg-light)');
      document.querySelector('.nav-logo').style.color = 'var(--fg-light)';
    } else {
      navEl.style.color = 'var(--fg-dark)';
      navLinks.forEach(l => l.style.color = 'var(--fg-dark)');
      document.querySelector('.nav-logo').style.color = 'var(--fg-dark)';
    }
  });
}, { threshold: 0.3 });

heroObserver.observe(hero);


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.size-row, .weight-row, .use-card, .statement-line, .license-row'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.style.opacity = isActive ? '1' : '';
  });
}, { passive: true });