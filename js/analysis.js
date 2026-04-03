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

/* ── ANALYSIS ── */
const progressMsgs = [
  'Scanning paddy image…',
  'Detecting crop variety…',
  'Analysing plant health…',
  'Checking for disease & pests…',
  'Computing soil requirements…',
  'Calculating water schedule…',
  'Building growth calendar…',
  'Estimating harvest window…',
  'Compiling recommendations…',
];
let progressInterval = null;

async function analyzeImage() {
  if (!uploadedBase64) return;
  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;

  const pbox = document.getElementById('progress-box');
  pbox.style.display = 'block';
  document.getElementById('results-area').style.display = 'none';

  let step = 0;
  let prog = 0;
  progressInterval = setInterval(() => {
    step = Math.min(step + 1, progressMsgs.length - 1);
    prog = Math.min(prog + 11, 92);
    document.getElementById('progress-label').textContent = progressMsgs[step];
    document.getElementById('progress-fill').style.width = prog + '%';
    document.getElementById('progress-pct').textContent = prog + '%';
  }, 600);

  try {
    // ── Call Render Backend ──
    const resp = await fetch(`${PADDYAI_API}/predict/disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: uploadedBase64,
        media_type: uploadedMediaType
      })
    });

    clearInterval(progressInterval);
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-pct').textContent = '100%';
    document.getElementById('progress-label').textContent = 'Analysis complete!';

    await new Promise(r => setTimeout(r, 600));
    pbox.style.display = 'none';

    if (!resp.ok) throw new Error(`API error ${resp.status}`);

    const d = await resp.json();

    // Map backend response to analysis format
    const parsed = {
      cropType: d.cropVariety || 'Paddy — Oryza sativa',
      healthStatus: d.overallVerdict === 'Good' ? 'Healthy' : 'Damaged',
      damageType: d.diseaseDetection?.primaryDisease !== 'Healthy' ? d.diseaseDetection?.primaryDisease : null,
      soilType: d.yieldPrediction?.soilType || 'Clayey loam',
      soilPH: '6.0 – 7.0',
      fertilizer: d.yieldPrediction?.fertilizer || 'NPK 120:60:60 kg/ha',
      pesticide: d.diseaseDetection?.primaryDisease !== 'Healthy'
        ? 'Tricyclazole 75% WP @ 0.6g/litre'
        : 'Not required – crop is healthy',
      waterPerDay: d.yieldPrediction?.waterRequirement || '5–6 litres per plant per day',
      irrigationMethod: 'Flood irrigation (2–5 cm standing water)',
      growthMonth: 'June (sowing) → October (maturity)',
      harvestMonth: d.yieldPrediction?.harvestMonth || 'October – November',
      estimatedYield: d.yieldPrediction?.predictedYield || '4.5–5.5 t/ha',
      treatmentPlan: d.diseaseDetection?.primaryDisease !== 'Healthy'
        ? `1. Apply recommended fungicide immediately.\n2. Remove infected leaves carefully.\n3. Improve drainage and air circulation.\n4. Monitor field every 3 days.\n5. Re-apply treatment after 7 days if needed.`
        : null,
      medicine: d.diseaseDetection?.primaryDisease !== 'Healthy'
        ? 'Tricyclazole + Mancozeb combination'
        : null,
      generalTips: d.recommendations?.map(r => r.text).join(' ') ||
        'Maintain 5 cm standing water during tillering. Apply urea in 3 splits. Use certified seeds for best yield.'
    };

    renderResults(parsed);
    saveToHistory(parsed);

  } catch (err) {
    clearInterval(progressInterval);
    pbox.style.display = 'none';
    document.getElementById('results-area').style.display = 'block';
    document.getElementById('results-area').innerHTML = `
      <div style="background:#fff3f3;border:1.5px solid rgba(239,68,68,.25);border-radius:12px;padding:1.5rem;color:#b91c1c;font-size:.93rem">
        ⚠️ <strong>Analysis failed.</strong> Backend may be starting up — please wait 30 seconds and try again.
        <br><small style="color:#aaa">Error: ${err.message}</small>
      </div>`;
  }

  btn.disabled = false;
}

function renderResults(d) {
  const isDamaged = d.healthStatus !== 'Healthy';
  const healthCls = d.healthStatus === 'Healthy' ? 'healthy' : d.healthStatus === 'Damaged' ? 'damaged' : 'partial';
  const healthEmoji = d.healthStatus === 'Healthy' ? '✅' : d.healthStatus === 'Damaged' ? '❌' : '⚠️';

  let html = `
    <div class="result-grid">
      <div class="r-card">
        <div class="r-label">🌾 Crop Detected</div>
        <div class="r-val">${d.cropType}</div>
        <span class="health-badge ${healthCls}">${healthEmoji} ${d.healthStatus}</span>
        ${d.damageType ? `<div class="r-sub" style="margin-top:.5rem;color:#b91c1c">Damage: ${d.damageType}</div>` : ''}
      </div>
      <div class="r-card blue">
        <div class="r-label">🧪 Soil Recommendation</div>
        <div class="r-val">${d.soilType}</div>
        <div class="r-sub">Optimal pH: ${d.soilPH}</div>
      </div>
      <div class="r-card">
        <div class="r-label">💧 Water Requirement</div>
        <div class="r-val">${d.waterPerDay}</div>
        <div class="r-sub">${d.irrigationMethod}</div>
      </div>
      <div class="r-card gold">
        <div class="r-label">📅 Growth Period</div>
        <div class="r-val">${d.growthMonth}</div>
        <div class="r-sub">Harvest: <strong>${d.harvestMonth}</strong></div>
      </div>
      <div class="r-card blue">
        <div class="r-label">🌿 Fertilizer</div>
        <div class="r-val" style="font-size:.95rem">${d.fertilizer}</div>
      </div>
      <div class="r-card purple">
        <div class="r-label">📦 Estimated Yield</div>
        <div class="r-val">${d.estimatedYield}</div>
      </div>
      <div class="r-card ${isDamaged ? 'danger' : ''}">
        <div class="r-label">🐛 Pesticide</div>
        <div class="r-val" style="font-size:.9rem">${d.pesticide}</div>
      </div>`;

  if (d.damageType) {
    html += `
      <div class="r-card danger">
        <div class="r-label">🦠 Disease / Pest</div>
        <div class="r-val">${d.damageType}</div>
      </div>`;
  }
  html += `</div>`;

  if (isDamaged && d.treatmentPlan) {
    html += `
      <div class="full-card" style="border-left:4px solid #ef4444">
        <h4>🏥 Treatment & Recovery Plan</h4>
        ${d.medicine ? `<div style="background:#fff3f3;border-radius:8px;padding:.8rem 1rem;margin-bottom:1rem;font-size:.88rem"><strong style="color:#b91c1c">💊 Medicine: </strong>${d.medicine}</div>` : ''}
        <div class="prose">${d.treatmentPlan}</div>
      </div>`;
  }

  html += `
    <div class="full-card">
      <h4>💡 Cultivation Tips</h4>
      <div class="prose">${d.generalTips}</div>
    </div>
    <button class="btn-new" onclick="clearImage()">+ Analyse Another Image</button>`;

  const ra = document.getElementById('results-area');
  ra.innerHTML = html;
  ra.style.display = 'block';
  ra.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveToHistory(d) {
  const entry = {
    date: new Date().toLocaleDateString('en-IN'),
    crop: d.cropType,
    status: d.healthStatus === 'Healthy' ? 'healthy' : d.healthStatus === 'Damaged' ? 'damaged' : 'partial',
    soil: d.soilType,
    water: d.waterPerDay,
    harvest: d.harvestMonth,
    yield: d.estimatedYield
  };
  analysisHistory.unshift(entry);
}

/* ── SUMMARY ── */
function renderSummary() {
  const total = analysisHistory.length;
  const healthy = analysisHistory.filter(h => h.status === 'healthy').length;
  const damaged = analysisHistory.filter(h => h.status === 'damaged').length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-healthy').textContent = healthy;
  document.getElementById('stat-damaged').textContent = damaged;
  document.getElementById('stat-yield').textContent = total ? '4.8 t/ha' : '—';

  const tbody = document.getElementById('history-tbody');
  if (!total) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-history"><span>🌱</span>No analyses yet. Upload a paddy image to get started!</div></td></tr>';
    return;
  }
  tbody.innerHTML = analysisHistory.map(h => `
    <tr>
      <td>${h.date}</td>
      <td><strong>${h.crop}</strong></td>
      <td><span class="htag ${h.status}">${h.status === 'healthy' ? '✅ Healthy' : h.status === 'damaged' ? '❌ Damaged' : '⚠️ Partial'}</span></td>
      <td>${h.soil}</td>
      <td>${h.water}</td>
      <td>${h.harvest}</td>
      <td>${h.yield}</td>
    </tr>`).join('');
}