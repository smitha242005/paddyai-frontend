/* ── MOBILE NAV ── */
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

/* ── NAVIGATION ── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pg-' + name).classList.add('active');
  const nb = document.getElementById('nb-' + name);
  if (nb) nb.classList.add('active');
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (name === 'summary') renderSummary();
}

/* ── LEGACY MODAL AUTH (kept for compatibility) ── */
function openAuth(mode){ /* no-op now */ }
function closeAuth(e){ document.getElementById('auth-modal').classList.remove('open'); }
function toggleAuthMode(){}
function doAuth(){}
