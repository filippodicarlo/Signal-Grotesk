/**
 * SIGNAL GROTESK - VARIABLE FONT CONTROLLER
 * Axes: Weight (300-700), x-height (400-600)
 */

const WGHT_MIN = 300;
const WGHT_MAX = 700;
const XHGT_MIN = 400;
const XHGT_MAX = 600;

// Elementi DOM
const hero       = document.getElementById('hero');
const heroTitle  = document.getElementById('heroTitle');
const wghtVal    = document.getElementById('wghtVal');
const xhgtVal    = document.getElementById('xhgtVal');
const navEl      = document.querySelector('.nav');
const navLinks   = document.querySelectorAll('.nav-link');

// Stato assi (Default: Regular 400, 450)
let currentWght = 400;
let currentXhgt = 450;
let targetWght  = 400;
let targetXhgt  = 450;
let animating   = false;

/**
 * LOGICA DI MOVIMENTO (Mouse & Touch)
 */
function handleInteraction(clientX, clientY) {
  const rect = hero.getBoundingClientRect();

  // Calcolo ratio (0 a 1) con clamp per evitare valori fuori range
  const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const yRatio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

  // Mappa i ratio agli assi del font
  targetWght = Math.round(WGHT_MIN + xRatio * (WGHT_MAX - WGHT_MIN));
  targetXhgt = Math.round(XHGT_MAX - yRatio * (XHGT_MAX - XHGT_MIN));

  // Aggiorna variabili CSS per la croce (solo desktop)
  hero.style.setProperty('--mx', (clientX - rect.left) + 'px');
  hero.style.setProperty('--my', (clientY - rect.top) + 'px');

  if (!animating) {
    animating = true;
    requestAnimationFrame(smoothUpdate);
  }
}

function smoothUpdate() {
  const lerpFactor = 0.12;

  // Fluidità del movimento (Lerp)
  currentWght += (targetWght - currentWght) * lerpFactor;
  currentXhgt += (targetXhgt - currentXhgt) * lerpFactor;

  const wght = Math.round(currentWght);
  const xhgt = Math.round(currentXhgt);

  // Applica al font e ai counter
  heroTitle.style.fontVariationSettings = `'wght' ${wght}, 'XHGT' ${xhgt}`;
  wghtVal.textContent = wght;
  xhgtVal.textContent = xhgt;

  const delta = Math.abs(targetWght - currentWght) + Math.abs(targetXhgt - currentXhgt);

  if (delta > 0.1) {
    requestAnimationFrame(smoothUpdate);
  } else {
    animating = false;
  }
}

function resetToDefault() {
  targetWght = 400;
  targetXhgt = 450;
  if (!animating) {
    animating = true;
    requestAnimationFrame(smoothUpdate);
  }
}

// Event Listeners Desktop
hero.addEventListener('mousemove', (e) => handleInteraction(e.clientX, e.clientY));
hero.addEventListener('mouseleave', resetToDefault);

// Event Listeners Mobile (Touch)
hero.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    // Impedisce lo scroll mentre si interagisce con la Hero
    if (e.cancelable) e.preventDefault(); 
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

hero.addEventListener('touchend', resetToDefault);


/**
 * INTERSECTION OBSERVER (Nav color & Reveals)
 */

// Cambio colore Nav quando esce dalla Hero
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Se la hero NON è visibile, la nav diventa scura (testo bianco su bg nero)
    if (!entry.isIntersecting) {
      navEl.style.backgroundColor = 'var(--black)';
      navEl.style.borderBottomColor = 'var(--muted)';
      navLinks.forEach(l => l.style.color = 'var(--white)');
      document.querySelector('.nav-center').style.color = 'var(--white)';
      document.querySelector('.nav-right').style.color = 'var(--white)';
      document.querySelector('.nav-logo-img').style.filter = 'brightness(1) invert(1)';
    } else {
      // Setup originale (chiaro)
      navEl.style.backgroundColor = '#f8f4ed33';
      navEl.style.borderBottomColor = 'var(--red)';
      navLinks.forEach(l => l.style.color = 'var(--black)');
      document.querySelector('.nav-center').style.color = 'var(--black)';
      document.querySelector('.nav-right').style.color = 'var(--black)';
      document.querySelector('.nav-logo-img').style.filter = 'brightness(0)';
    }
  });
}, { threshold: 0.1 });

heroObserver.observe(hero);

// Reveal delle sezioni allo scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-text, .character-section, .weights-section, .sample-section, .feature-section, .download-section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.8s ease-out';
  revealObserver.observe(el);
});