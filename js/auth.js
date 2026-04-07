/* ── GLOBAL API URL ── */
const PADDYAI_API = 'https://paddyai-backend.onrender.com';

/* ── STATE ── */
let currentUser = null;
let uploadedFile = null;
let uploadedBase64 = null;
let uploadedMediaType = null;
let analysisHistory = [];

/* ── LANDING AUTH ── */
function switchLandingTab(tab) {
  document.getElementById('ltab-login').classList.toggle('active', tab === 'login');
  document.getElementById('ltab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('lform-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('lform-signup').style.display = tab === 'signup' ? 'block' : 'none';
}

function doLandingAuth(mode) {
  let email, name;
  if (mode === 'login') {
    email = document.getElementById('l-email').value.trim();
    if (!email) { shakeInput('l-email'); return; }
    name = email.split('@')[0];
  } else {
    email = document.getElementById('s-email').value.trim();
    name = document.getElementById('s-name').value.trim();
    if (!email) { shakeInput('s-email'); return; }
    if (!name) { shakeInput('s-name'); return; }
  }
  currentUser = { name, email };
  document.getElementById('nav-username').textContent = name;

  const ls = document.getElementById('landing-screen');
  ls.style.transition = 'opacity .4s ease';
  ls.style.opacity = '0';
  setTimeout(() => { ls.style.display = 'none'; }, 400);
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ef4444';
  el.style.animation = 'shake .3s ease';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 1000);
}

/* ── LOGOUT ── */
function logout() {
  currentUser = null;
  closeMobileNav();
  ['l-email','l-pass','s-email','s-name','s-pass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  switchLandingTab('login');
  const ls = document.getElementById('landing-screen');
  ls.style.display = 'flex';
  ls.style.opacity = '0';
  requestAnimationFrame(() => {
    ls.style.transition = 'opacity .4s ease';
    ls.style.opacity = '1';
  });
}

/* ── LEGACY ── */
function openAuth(mode){}
function closeAuth(e){ document.getElementById('auth-modal').classList.remove('open'); }
function toggleAuthMode(){}
function doAuth(){}