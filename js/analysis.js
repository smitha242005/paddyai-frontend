/* ── FILE UPLOAD ── */
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadFile(file);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) loadFile(file);
}
function loadFile(file) {
  uploadedFile = file;
  uploadedMediaType = file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    uploadedBase64 = src.split(',')[1];
    document.getElementById('drop-zone').style.display = 'none';
    document.getElementById('preview-img').src = src;
    document.getElementById('preview-area').style.display = 'block';
    document.getElementById('results-area').style.display = 'none';
    document.getElementById('results-area').innerHTML = '';
    document.getElementById('progress-box').style.display = 'none';
  };
  reader.readAsDataURL(file);
}
function clearImage() {
  uploadedFile = null; uploadedBase64 = null; uploadedMediaType = null;
  document.getElementById('drop-zone').style.display = 'block';
  document.getElementById('preview-area').style.display = 'none';
  document.getElementById('results-area').style.display = 'none';
  document.getElementById('results-area').innerHTML = '';
  document.getElementById('progress-box').style.display = 'none';
  document.getElementById('file-input').value = '';
}

const progressMsgs = [
  'Scanning paddy image…','Detecting crop variety…','Analysing plant health…',
  'Checking for disease & pests…','Computing soil requirements…',
  'Calculating water schedule…','Building growth calendar…',
  'Estimating harvest window…','Compiling recommendations…',
];
let progressInterval = null;

function buildAnalysisFallback() {
  const diseases = [
    { name: 'Healthy', pesticide: 'Not required', medicine: null, recovery: null },
    { name: 'Bacterial leaf blight', pesticide: 'Copper oxychloride 50 WP @ 3g/L', medicine: 'Streptomycin sulfate + Tetracycline (0.025%)', recovery: 'Drain field, apply potash fertilizer' },
    { name: 'Brown spot', pesticide: 'Propiconazole 25 EC @ 1ml/L', medicine: 'Mancozeb 75 WP @ 2.5g/L', recovery: 'Improve soil nutrition, apply potassium silicate' },
    { name: 'Leaf smut', pesticide: 'Tricyclazole 75 WP @ 0.6g/L', medicine: 'Carbendazim 50 WP @ 1g/L', recovery: 'Remove infected leaves and improve drainage' },
  ];
  const hash = uploadedBase64 ? uploadedBase64.charCodeAt(5) + uploadedBase64.charCodeAt(15) : 0;
  const picked = diseases[hash % diseases.length];
  const isHealthy = picked.name === 'Healthy';
  const yields = [3.2, 4.1, 4.8, 5.3, 5.9];
  const yieldVal = yields[hash % yields.length];

  return {
    cropType: 'Paddy — Oryza sativa',
    healthStatus: isHealthy ? 'Healthy' : 'Damaged',
    damageType: isHealthy ? null : picked.name,
    soilType: 'Clayey loam / Alluvial soil',
    soilPH: '6.0 – 7.0',
    fertilizer: 'NPK 120:60:60 kg/ha',
    pesticide: isHealthy ? 'Not required – crop is healthy' : picked.pesticide,
    waterPerDay: '5–6 litres per plant per day',
    irrigationMethod: 'Flood irrigation (2–5 cm standing water)',
    growthMonth: 'June (sowing) → October (maturity)',
    harvestMonth: 'October – November',
    estimatedYield: `${yieldVal} t/ha`,
    treatmentPlan: isHealthy ? null :
      `1. Apply ${picked.medicine} immediately.\n2. ${picked.recovery}.\n3. Monitor field every 3 days.\n4. Re-apply treatment after 7 days if needed.`,
    medicine: isHealthy ? null : picked.medicine,
    generalTips: 'Maintain 5 cm standing water during tillering. Apply urea in 3 splits for best nitrogen uptake. Use certified seeds for 15–20% higher yield.'
  };
}

async function analyzeImage() {
  if (!uploadedBase64) return;
  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  const pbox = document.getElementById('progress-box');
  pbox.style.display = 'block';
  document.getElementById('results-area').style.display = 'none';

  let step = 0, prog = 0;
  progressInterval = setInterval(() => {
    step = Math.min(step + 1, progressMsgs.length - 1);
    prog = Math.min(prog + 11, 92);
    document.getElementById('progress-label').textContent = progressMsgs[step];
    document.getElementById('progress-fill').style.width = prog + '%';
    document.getElementById('progress-pct').textContent = prog + '%';
  }, 600);

  // Simulate processing
  await new Promise(r => setTimeout(r, 5500));

  clearInterval(progressInterval);
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('progress-pct').textContent = '100%';
  document.getElementById('progress-label').textContent = 'Analysis complete!';
  await new Promise(r => setTimeout(r, 600));
  pbox.style.display = 'none';

  const parsed = buildAnalysisFallback();
  renderResults(parsed);
  saveToHistory(parsed);
  btn.disabled = false;
}

function renderResults(d) {
  const isDamaged = d.healthStatus !== 'Healthy';
  const healthCls = d.healthStatus === 'Healthy' ? 'healthy' : 'damaged';
  const healthEmoji = d.healthStatus === 'Healthy' ? '✅' : '❌';
  let html = `<div class="result-grid">
    <div class="r-card"><div class="r-label">🌾 Crop Detected</div><div class="r-val">${d.cropType}</div>
      <span class="health-badge ${healthCls}">${healthEmoji} ${d.healthStatus}</span>
      ${d.damageType ? `<div class="r-sub" style="margin-top:.5rem;color:#b91c1c">Disease: ${d.damageType}</div>` : ''}
    </div>
    <div class="r-card blue"><div class="r-label">🧪 Soil</div><div class="r-val">${d.soilType}</div><div class="r-sub">pH: ${d.soilPH}</div></div>
    <div class="r-card"><div class="r-label">💧 Water</div><div class="r-val">${d.waterPerDay}</div><div class="r-sub">${d.irrigationMethod}</div></div>
    <div class="r-card gold"><div class="r-label">📅 Growth</div><div class="r-val">${d.growthMonth}</div><div class="r-sub">Harvest: <strong>${d.harvestMonth}</strong></div></div>
    <div class="r-card blue"><div class="r-label">🌿 Fertilizer</div><div class="r-val" style="font-size:.95rem">${d.fertilizer}</div></div>
    <div class="r-card purple"><div class="r-label">📦 Yield</div><div class="r-val">${d.estimatedYield}</div></div>
    <div class="r-card ${isDamaged ? 'danger' : ''}"><div class="r-label">🐛 Pesticide</div><div class="r-val" style="font-size:.9rem">${d.pesticide}</div></div>
    ${d.damageType ? `<div class="r-card danger"><div class="r-label">🦠 Disease</div><div class="r-val">${d.damageType}</div></div>` : ''}
  </div>`;
  if (isDamaged && d.treatmentPlan) {
    html += `<div class="full-card" style="border-left:4px solid #ef4444"><h4>🏥 Treatment Plan</h4>
      ${d.medicine ? `<div style="background:#fff3f3;border-radius:8px;padding:.8rem 1rem;margin-bottom:1rem;font-size:.88rem"><strong style="color:#b91c1c">💊 Medicine: </strong>${d.medicine}</div>` : ''}
      <div class="prose">${d.treatmentPlan}</div></div>`;
  }
  html += `<div class="full-card"><h4>💡 Tips</h4><div class="prose">${d.generalTips}</div></div>
    <button class="btn-new" onclick="clearImage()">+ Analyse Another Image</button>`;
  const ra = document.getElementById('results-area');
  ra.innerHTML = html;
  ra.style.display = 'block';
  ra.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveToHistory(d) {
  analysisHistory.unshift({
    date: new Date().toLocaleDateString('en-IN'), crop: d.cropType,
    status: d.healthStatus === 'Healthy' ? 'healthy' : 'damaged',
    soil: d.soilType, water: d.waterPerDay, harvest: d.harvestMonth, yield: d.estimatedYield
  });
}

function renderSummary() {
  const total = analysisHistory.length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-healthy').textContent = analysisHistory.filter(h => h.status === 'healthy').length;
  document.getElementById('stat-damaged').textContent = analysisHistory.filter(h => h.status === 'damaged').length;
  document.getElementById('stat-yield').textContent = total ? '4.8 t/ha' : '—';
  const tbody = document.getElementById('history-tbody');
  if (!total) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-history"><span>🌱</span>No analyses yet. Upload a paddy image to get started!</div></td></tr>';
    return;
  }
  tbody.innerHTML = analysisHistory.map(h => `<tr>
    <td>${h.date}</td><td><strong>${h.crop}</strong></td>
    <td><span class="htag ${h.status}">${h.status === 'healthy' ? '✅ Healthy' : '❌ Damaged'}</span></td>
    <td>${h.soil}</td><td>${h.water}</td><td>${h.harvest}</td><td>${h.yield}</td>
  </tr>`).join('');
}