/* ── diagnose.js ── */

let modelBase64 = null;
let modelMediaType = null;

function modelHandleDrop(e) {
  e.preventDefault();
  document.getElementById('model-drop-zone').classList.remove('drag');

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    modelLoadFile(file);
  }
}

function modelHandleFile(e) {
  const file = e.target.files[0];
  if (file) {
    modelLoadFile(file);
  }
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
  modelBase64 = null;
  modelMediaType = null;

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

    if (!el) continue;

    el.classList.remove('active', 'done');

    if (i < active) {
      el.classList.add('done');
    } else if (i === active) {
      el.classList.add('active');
    }
  }
}

const modelMsgs = [
  'Loading paddy leaf image…',
  'Extracting disease features…',
  'Running CNN disease model…',
  'Calculating confidence…',
  'Preparing treatment plan…',
  'Generating report…'
];

async function runModel() {
  if (!modelBase64) return;

  const btn = document.getElementById('model-run-btn');
  btn.disabled = true;

  const pbox = document.getElementById('model-progress-box');
  pbox.style.display = 'block';

  document.getElementById('model-results').style.display = 'none';

  setModelStep(2);

  let step = 0;
  let prog = 0;

  const iv = setInterval(() => {
    step = Math.min(step + 1, modelMsgs.length - 1);
    prog = Math.min(prog + 15, 92);

    document.getElementById('model-progress-label').textContent = modelMsgs[step];
    document.getElementById('model-progress-bar').style.width = prog + '%';
    document.getElementById('model-progress-pct').textContent = prog + '%';

    if (step >= 2) setModelStep(3);
    if (step >= 4) setModelStep(4);
  }, 650);

  try {
    const resp = await fetch(`${PADDYAI_API}/predict/disease`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: modelBase64
      })
    });

    clearInterval(iv);

    if (!resp.ok) {
      throw new Error(`API error ${resp.status}`);
    }

    const d = await resp.json();

    document.getElementById('model-progress-bar').style.width = '100%';
    document.getElementById('model-progress-pct').textContent = '100%';
    document.getElementById('model-progress-label').textContent = 'Diagnosis complete!';
    setModelStep(5);

    await new Promise(r => setTimeout(r, 700));
    pbox.style.display = 'none';

    const severityColor =
      d.severity === 'High'
        ? '#ef4444'
        : d.severity === 'Medium'
        ? '#f59e0b'
        : '#22c55e';

    const predictionsHTML = (d.predictions || [])
      .map(pred => `
        <div style="margin-bottom:1rem">
          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:.4rem;
            font-size:.9rem;
            font-weight:700;
            color:#1f2937;">
            <span>${pred.name}</span>
            <span>${Number(pred.confidence).toFixed(1)}%</span>
          </div>

          <div style="
            width:100%;
            height:10px;
            background:#edf2f7;
            border-radius:999px;
            overflow:hidden;">
            <div style="
              width:${pred.confidence}%;
              height:100%;
              background:${pred.color || '#5aad5a'};
              border-radius:999px;">
            </div>
          </div>
        </div>
      `)
      .join('');

    document.getElementById('model-results').innerHTML = `
      <div class="overall-score-card">
        <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
          <div style="
            width:90px;
            height:90px;
            border-radius:50%;
            background:${severityColor};
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:1.7rem;
            font-weight:900;">
            ${Number(d.confidence || 0).toFixed(0)}%
          </div>

          <div>
            <div style="
              font-size:.8rem;
              text-transform:uppercase;
              letter-spacing:.08em;
              color:rgba(255,255,255,.6);
              margin-bottom:.35rem;">
              Primary Diagnosis
            </div>

            <h2 style="
              color:#fff;
              margin-bottom:.45rem;
              font-size:2rem;">
              ${d.disease}
            </h2>

            <div style="display:flex;gap:.7rem;flex-wrap:wrap;">
              <span style="
                background:rgba(255,255,255,.12);
                color:white;
                padding:.38rem .9rem;
                border-radius:999px;
                font-size:.85rem;
                font-weight:700;">
                Severity: ${d.severity || 'Low'}
              </span>

              <span style="
                background:rgba(255,255,255,.12);
                color:white;
                padding:.38rem .9rem;
                border-radius:999px;
                font-size:.85rem;
                font-weight:700;">
                Confidence: ${Number(d.confidence || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="result-grid">
        <div class="r-card danger">
          <div class="r-label">🦠 Disease Detected</div>
          <div class="r-val">${d.disease}</div>
          <div class="r-sub">
            The uploaded leaf image most closely matches this disease.
          </div>
        </div>

        <div class="r-card blue">
          <div class="r-label">💊 Recommended Medicine</div>
          <div class="r-val" style="font-size:.95rem">
            ${d.medicine || 'No medicine available'}
          </div>
        </div>

        <div class="r-card purple">
          <div class="r-label">🐛 Suggested Pesticide</div>
          <div class="r-val" style="font-size:.95rem">
            ${d.pesticide || 'No pesticide available'}
          </div>
        </div>

        <div class="r-card gold">
          <div class="r-label">⚠️ Severity</div>
          <div class="r-val">${d.severity || 'Low'}</div>
          <div class="r-sub">
            Treat immediately if severity is High.
          </div>
        </div>
      </div>

      <div class="full-card">
        <h4>🏥 Recovery & Treatment Plan</h4>
        <div class="prose">
          ${d.recovery || 'No recovery advice available.'}
        </div>
      </div>

      <div class="full-card">
        <h4>📊 Confidence Breakdown</h4>
        ${
          predictionsHTML ||
          '<div class="prose">No confidence data available.</div>'
        }
      </div>

      <button class="btn-new" onclick="clearModelImage()">
        + Diagnose Another Image
      </button>
    `;

    document.getElementById('model-results').style.display = 'block';
    document.getElementById('model-results').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  } catch (err) {
    clearInterval(iv);

    pbox.style.display = 'none';

    document.getElementById('model-results').innerHTML = `
      <div style="
        background:#fff3f3;
        border:1.5px solid rgba(239,68,68,.25);
        border-radius:14px;
        padding:1.5rem;
        color:#b91c1c;
        line-height:1.8;">
        ⚠️ Unable to connect to PaddyAI backend.<br><br>
        Please wait 20–30 seconds and try again.<br><br>

        <small style="color:#7f1d1d">
          Error: ${err.message}
        </small>
      </div>
    `;

    document.getElementById('model-results').style.display = 'block';
  }

  btn.disabled = false;
}