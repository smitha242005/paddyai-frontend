/* ══════════════════════════════════
   MODEL PAGE JAVASCRIPT
══════════════════════════════════ */
let modelBase64 = null;
let modelMediaType = null;

/* ══════════════════════════════════
   REAL ML BACKEND URL
══════════════════════════════════ */
const PADDYAI_API = 'https://paddyai-backend.onrender.com';

function modelHandleDrop(e) {
  e.preventDefault();
  document.getElementById('model-drop-zone').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) modelLoadFile(file);
}
function modelHandleFile(e) {
  const file = e.target.files[0];
  if (file) modelLoadFile(file);
}
function modelLoadFile(file) {
  modelMediaType = file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    modelBase64 = e.target.result.split(',')[1];
    const prev = document.getElementById('model-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
    document.getElementById('model-drop-zone').style.display = 'none';
    document.getElementById('model-img-actions').style.display = 'flex';
    document.getElementById('model-results').style.display = 'none';
    document.getElementById('model-results').innerHTML = '';
    document.getElementById('model-progress-box').style.display = 'none';
    setModelStep(1);
  };
  reader.readAsDataURL(file);
}
function clearModelImage() {
  modelBase64 = null; modelMediaType = null;
  document.getElementById('model-preview').style.display = 'none';
  document.getElementById('model-preview').src = '';
  document.getElementById('model-drop-zone').style.display = 'block';
  document.getElementById('model-img-actions').style.display = 'none';
  document.getElementById('model-results').style.display = 'none';
  document.getElementById('model-results').innerHTML = '';
  document.getElementById('model-progress-box').style.display = 'none';
  document.getElementById('model-file-input').value = '';
  setModelStep(1);
}
function setModelStep(active) {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('ms' + i);
    el.classList.remove('active','done');
    if (i < active) el.classList.add('done');
    else if (i === active) el.classList.add('active');
  }
}

const modelMsgs = [
  'Loading image into model…',
  'Extracting crop features…',
  'Running disease classification…',
  'Detecting blast, blight & pest damage…',
  'Computing confidence scores…',
  'Running yield prediction algorithm…',
  'Calculating harvest probability…',
  'Generating full report…',
];

async function runModel() {
  if (!modelBase64) return;
  const btn = document.getElementById('model-run-btn');
  btn.disabled = true;
  setModelStep(2);

  const pbox = document.getElementById('model-progress-box');
  pbox.style.display = 'block';
  document.getElementById('model-results').style.display = 'none';

  let step = 0, prog = 0;
  const iv = setInterval(() => {
    step = Math.min(step + 1, modelMsgs.length - 1);
    prog = Math.min(prog + 12, 92);
    document.getElementById('model-progress-label').textContent = modelMsgs[step];
    document.getElementById('model-progress-bar').style.width = prog + '%';
    document.getElementById('model-progress-pct').textContent = prog + '%';
    if (step === 2) setModelStep(3);
    if (step === 5) setModelStep(4);
  }, 650);

  try {
    const resp = await fetch(`${PADDYAI_API}/predict/disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: modelBase64,
        media_type: modelMediaType
      })
    });

    clearInterval(iv);
    if (!resp.ok) throw new Error(`API error ${resp.status}`);

    document.getElementById('model-progress-bar').style.width = '100%';
    document.getElementById('model-progress-pct').textContent = '100%';
    document.getElementById('model-progress-label').textContent = 'Model complete!';
    setModelStep(5);
    await new Promise(r => setTimeout(r, 700));
    pbox.style.display = 'none';

    const parsed = await resp.json();
    renderModelResults(parsed);

  } catch (err) {
    clearInterval(iv);
    pbox.style.display = 'none';
    document.getElementById('model-results').style.display = 'block';
    document.getElementById('model-results').innerHTML = `
      <div style="background:#fff3f3;border:1.5px solid rgba(239,68,68,.25);
                  border-radius:12px;padding:1.5rem;color:#b91c1c;line-height:1.8">
        ⚠️ Cannot reach backend API. Backend may be starting up — wait 30 seconds and try again.<br><br>
        <small style="color:#aaa">Error: ${err.message}</small>
      </div>`;
  }
  btn.disabled = false;
}

function buildModelFallback() {
  return {
    cropVariety: 'Paddy — Oryza sativa (IR64)',
    overallHealthScore: 78,
    overallVerdict: 'Good',
    verdictSummary: 'Crop appears healthy with good growth potential. Minor preventive care recommended.',
    diseaseDetection: {
      primaryDisease: 'Healthy',
      confidence: 78,
      classes: [
        {name:'Healthy', confidence:78, color:'#4caf50'},
        {name:'Rice Blast', confidence:10, color:'#f44336'},
        {name:'Bacterial Blight', confidence:7, color:'#ff9800'},
        {name:'Brown Planthopper', confidence:3, color:'#9c27b0'},
        {name:'Sheath Blight', confidence:2, color:'#2196f3'},
      ]
    },
    yieldPrediction: {
      predictedYield: '4.5–5.5 t/ha', yieldConfidence: 80,
      yieldCategory: 'High', soilType: 'Clayey loam',
      waterRequirement: '5–6 L/day', season: 'Kharif (Jun–Nov)',
      harvestMonth: 'October–November', fertilizer: 'NPK 120:60:60 kg/ha',
      growthStage: 'Tillering'
    },
    recommendations: [
      {type:'success', icon:'✅', text:'Crop is in healthy condition. Continue current irrigation schedule.'},
      {type:'warning', icon:'💧', text:'Maintain 3–5 cm standing water during tillering stage for best yield.'},
      {type:'success', icon:'🧪', text:'Apply second split of urea (40 kg/ha) at tillering stage.'},
      {type:'warning', icon:'🐛', text:'Scout for stem borer weekly. Install light traps as preventive measure.'},
    ]
  };
}

function renderModelResults(d) {
  const dis = d.diseaseDetection;
  const yld = d.yieldPrediction;
  const score = d.overallHealthScore || 78;
  const scoreColor = score >= 75 ? '#5aad5a' : score >= 50 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (score / 100) * circumference;

  const diseaseRows = dis.classes.map(c => {
    const barColor = c.color || '#5aad5a';
    const isTop = c.name === dis.primaryDisease;
    return `
      <div class="disease-row">
        <div class="disease-name">
          <span>${isTop ? '🎯' : '▸'}</span>
          ${c.name}
        </div>
        <div class="disease-bar-wrap">
          <div class="disease-bar-fill" style="width:0%;background:${barColor}" data-width="${c.confidence}%"></div>
        </div>
        <div class="disease-pct" style="color:${barColor}">${c.confidence}%</div>
      </div>`;
  }).join('');

  const verdictColor = d.overallVerdict === 'Good' ? 'green' : d.overallVerdict === 'Fair' ? 'gold' : 'red';

  const recos = (d.recommendations || []).map(r => `
    <li class="reco-item ${r.type === 'warning' ? 'warn' : r.type === 'danger' ? 'danger' : ''}">
      <span class="reco-icon">${r.icon}</span>
      ${r.text}
    </li>`).join('');

  const html = `
    <div class="overall-score-card">
      <div class="score-donut">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="10"/>
          <circle cx="55" cy="55" r="44" fill="none" stroke="${scoreColor}" stroke-width="10"
            stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}"
            stroke-linecap="round"/>
        </svg>
        <div class="score-donut-center">
          <div class="score-donut-num">${score}</div>
          <div class="score-donut-label">/ 100</div>
        </div>
      </div>
      <div class="overall-score-info">
        <h3>Overall Crop Health Score</h3>
        <p>${d.verdictSummary}</p>
        <div class="verdict-chips">
          <span class="vchip ${verdictColor}">📊 ${d.overallVerdict}</span>
          <span class="vchip blue">🌾 ${d.cropVariety}</span>
          <span class="vchip gold">📍 ${yld.growthStage} Stage</span>
          <span class="vchip green">🎯 ${dis.confidence}% Confidence</span>
        </div>
      </div>
    </div>

    <div class="disease-detection-card">
      <div class="model-card-title"><span class="mct-icon">🔬</span> Diagnose — Disease Detection Results</div>
      <div style="background:var(--cream);border-radius:12px;padding:1rem 1.2rem;margin-bottom:1.2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <div>
          <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-light)">Primary Detection</div>
          <div style="font-size:1.2rem;font-weight:900;color:var(--green-deep);margin-top:.2rem">${dis.primaryDisease}</div>
        </div>
        <div style="margin-left:auto">
          <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-light)">Confidence</div>
          <div style="font-size:1.4rem;font-weight:900;font-family:'DM Mono',monospace;color:var(--green-mid)">${dis.confidence}%</div>
        </div>
      </div>
      <div class="disease-list" id="disease-bars">${diseaseRows}</div>
      <p style="font-size:.76rem;color:var(--text-light);margin-top:1rem">
        * Confidence scores based on CNN model trained on Kaggle Rice Disease Dataset.
      </p>
    </div>

    <div class="yield-pred-card">
      <div class="model-card-title"><span class="mct-icon">🌾</span> Yield Prediction Results</div>
      <div class="yield-metrics-grid">
        <div class="ym-box">
          <div class="ym-icon">📦</div>
          <div class="ym-label">Predicted Yield</div>
          <div class="ym-val">${yld.predictedYield}</div>
          <div class="ym-sub">Tonnes / hectare</div>
        </div>
        <div class="ym-box">
          <div class="ym-icon">🏆</div>
          <div class="ym-label">Yield Category</div>
          <div class="ym-val">${yld.yieldCategory}</div>
          <div class="ym-sub">Performance level</div>
        </div>
        <div class="ym-box">
          <div class="ym-icon">📅</div>
          <div class="ym-label">Harvest Window</div>
          <div class="ym-val" style="font-size:1rem">${yld.harvestMonth}</div>
          <div class="ym-sub">${yld.season}</div>
        </div>
        <div class="ym-box">
          <div class="ym-icon">💧</div>
          <div class="ym-label">Water / Day</div>
          <div class="ym-val" style="font-size:1rem">${yld.waterRequirement}</div>
          <div class="ym-sub">${yld.soilType}</div>
        </div>
        <div class="ym-box">
          <div class="ym-icon">🧪</div>
          <div class="ym-label">Fertilizer</div>
          <div class="ym-val" style="font-size:.9rem">${yld.fertilizer}</div>
          <div class="ym-sub">Recommended dose</div>
        </div>
        <div class="ym-box">
          <div class="ym-icon">🌱</div>
          <div class="ym-label">Growth Stage</div>
          <div class="ym-val" style="font-size:1rem">${yld.growthStage}</div>
          <div class="ym-sub">Current stage</div>
        </div>
      </div>
      <div class="confidence-meter">
        <div class="cm-top">
          <div class="cm-label">🎯 Yield Prediction Confidence</div>
          <div class="cm-pct">${yld.yieldConfidence}%</div>
        </div>
        <div class="cm-bar-wrap">
          <div class="cm-bar" data-width="${yld.yieldConfidence}%" style="width:0%"></div>
        </div>
      </div>
    </div>

    <div class="model-card">
      <div class="model-card-title"><span class="mct-icon">💡</span> Model Recommendations</div>
      <ul class="reco-list">${recos}</ul>
    </div>

    <button class="btn-model-new" onclick="clearModelImage()">+ Run Diagnose on Another Image</button>
  `;

  const container = document.getElementById('model-results');
  container.innerHTML = html;
  container.style.display = 'block';
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    container.querySelectorAll('.disease-bar-fill[data-width]').forEach(el => {
      el.style.width = el.getAttribute('data-width');
    });
    container.querySelectorAll('.cm-bar[data-width]').forEach(el => {
      el.style.width = el.getAttribute('data-width');
    });
  }, 100);
}