/* ── FLOATING GRAINS ANIMATION ── */
function spawnGrains() {
  const container = document.getElementById('grains-container');
  const grains = ['🌾','🌱','🌿','🍃'];
  for (let i = 0; i < 18; i++) {
    const g = document.createElement('span');
    g.className = 'grain';
    g.textContent = grains[Math.floor(Math.random() * grains.length)];
    g.style.left = Math.random() * 100 + '%';
    g.style.animationDuration = (12 + Math.random() * 18) + 's';
    g.style.animationDelay = (Math.random() * 20) + 's';
    g.style.fontSize = (.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(g);
  }
}
spawnGrains();
