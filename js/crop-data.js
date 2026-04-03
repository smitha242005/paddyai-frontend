/* ── CROP TYPES DATA ── */
const CROP_DATA = [
  {
    cat: 'Food Crops', icon: '🌾', cls: 'icon-food',
    desc: 'Crops grown primarily for direct human consumption',
    crops: [
      { name:'Rice (Paddy)', emoji:'🌾', desc:'Staple food crop grown in waterlogged fields', season:'Kharif (Jun–Nov)', water:'High', temp:'20–35°C', soil:'Clayey loam', yield:'4–6 t/ha' },
      { name:'Wheat', emoji:'🌿', desc:'Major rabi cereal crop grown in cooler climates', season:'Rabi (Nov–Apr)', water:'Moderate', temp:'10–25°C', soil:'Loamy', yield:'3–5 t/ha' },
      { name:'Maize (Corn)', emoji:'🌽', desc:'Versatile cereal for food, feed, and biofuel', season:'Kharif & Rabi', water:'Moderate', temp:'18–27°C', soil:'Sandy loam', yield:'5–8 t/ha' },
      { name:'Sorghum (Jowar)', emoji:'🌱', desc:'Drought-resistant staple grain crop', season:'Kharif', water:'Low', temp:'25–35°C', soil:'Black cotton soil', yield:'2–4 t/ha' },
      { name:'Barley', emoji:'🌾', desc:'Used for food, livestock feed, and brewing', season:'Rabi', water:'Low–Moderate', temp:'12–25°C', soil:'Sandy loam', yield:'2–4 t/ha' },
    ]
  },
  {
    cat: 'Cash Crops', icon: '💰', cls: 'icon-cash',
    desc: 'Crops grown primarily for commercial sale and export',
    crops: [
      { name:'Cotton', emoji:'🌺', desc:'Natural fiber crop vital to textile industry', season:'Kharif (Jun–Nov)', water:'Moderate', temp:'21–35°C', soil:'Black cotton soil', yield:'1.5–2.5 t/ha' },
      { name:'Sugarcane', emoji:'🎋', desc:'Primary source of sugar, jaggery, and ethanol', season:'Year-round', water:'Very High', temp:'20–35°C', soil:'Deep alluvial loam', yield:'60–80 t/ha' },
      { name:'Tobacco', emoji:'🍃', desc:'Cultivated for processed tobacco products', season:'Rabi', water:'Moderate', temp:'20–30°C', soil:'Sandy loam', yield:'1.2–2 t/ha' },
      { name:'Jute', emoji:'🌿', desc:'Natural bast fiber for sacks and textiles', season:'Kharif', water:'High', temp:'24–37°C', soil:'Sandy loam / Alluvial', yield:'2–3 t/ha' },
      { name:'Groundnut', emoji:'🥜', desc:'Oil seed and protein-rich cash crop', season:'Kharif', water:'Moderate', temp:'25–30°C', soil:'Well-drained sandy loam', yield:'1–2.5 t/ha' },
    ]
  },
  {
    cat: 'Plantation Crops', icon: '🌳', cls: 'icon-plantation',
    desc: 'Long-duration perennial crops grown on large estates',
    crops: [
      { name:'Tea', emoji:'🍵', desc:'Evergreen shrub grown in humid highlands', season:'Perennial', water:'High', temp:'15–30°C', soil:'Acidic loam (pH 4.5–5.5)', yield:'2–3 t/ha dry' },
      { name:'Coffee', emoji:'☕', desc:'Tropical tree crop for beverage production', season:'Perennial', water:'Moderate–High', temp:'15–28°C', soil:'Red laterite loam', yield:'1–2 t/ha' },
      { name:'Rubber', emoji:'🌲', desc:'Latex-producing Hevea tree crop', season:'Perennial', water:'High', temp:'25–35°C', soil:'Deep laterite', yield:'1–2 t/ha latex' },
      { name:'Coconut', emoji:'🥥', desc:'Multi-purpose palm crop — food, oil, fiber', season:'Perennial', water:'Moderate', temp:'20–32°C', soil:'Sandy loam / Coastal', yield:'80–100 nuts/tree' },
      { name:'Banana', emoji:'🍌', desc:'Perennial fruit crop in tropical regions', season:'Year-round', water:'High', temp:'20–35°C', soil:'Deep fertile loam', yield:'25–35 t/ha' },
    ]
  },
  {
    cat: 'Horticulture Crops', icon: '🥦', cls: 'icon-horticulture',
    desc: 'Fruits, vegetables, and ornamental plants',
    crops: [
      { name:'Mango', emoji:'🥭', desc:'King of fruits — tropical drupe', season:'Summer (Mar–Jun)', water:'Moderate', temp:'24–30°C', soil:'Deep well-drained loam', yield:'10–15 t/ha' },
      { name:'Banana', emoji:'🍌', desc:'High-yield tropical fruit staple', season:'Year-round', water:'High', temp:'20–35°C', soil:'Rich loamy', yield:'25–40 t/ha' },
      { name:'Tomato', emoji:'🍅', desc:'Most widely grown vegetable worldwide', season:'Rabi', water:'Moderate', temp:'20–27°C', soil:'Sandy loam', yield:'25–35 t/ha' },
      { name:'Potato', emoji:'🥔', desc:'Underground tuber vegetable crop', season:'Rabi', water:'Moderate', temp:'15–25°C', soil:'Loamy with high organic matter', yield:'25–40 t/ha' },
      { name:'Onion', emoji:'🧅', desc:'Widely consumed bulb vegetable', season:'Rabi', water:'Moderate', temp:'13–24°C', soil:'Well-drained loam', yield:'20–30 t/ha' },
      { name:'Chili Pepper', emoji:'🌶️', desc:'Spice crop with high export demand', season:'Kharif', water:'Moderate', temp:'20–30°C', soil:'Sandy clay loam', yield:'2–3 t/ha dry' },
    ]
  },
  {
    cat: 'Millets & Minor Cereals', icon: '🌾', cls: 'icon-millets',
    desc: 'Drought-tolerant, nutritious small-seeded grains for sustainable farming',
    crops: [
      { name:'Pearl Millet (Bajra)', emoji:'🌾', desc:'Drought-tolerant staple in arid regions', season:'Kharif', water:'Very Low', temp:'25–35°C', soil:'Sandy / Light loam', yield:'2–3 t/ha' },
      { name:'Finger Millet (Ragi)', emoji:'🌿', desc:'Calcium and iron-rich nutritious millet', season:'Kharif', water:'Low', temp:'20–30°C', soil:'Red sandy loam', yield:'2–3 t/ha' },
      { name:'Foxtail Millet', emoji:'🌱', desc:'Fast-growing millet ready in 60–70 days', season:'Kharif', water:'Very Low', temp:'25–35°C', soil:'Light sandy loam', yield:'1.5–2 t/ha' },
      { name:'Kodo Millet', emoji:'🌾', desc:'Traditional millet with high nutritional value', season:'Kharif', water:'Very Low', temp:'27–30°C', soil:'Heavy clay to sandy loam', yield:'1–1.5 t/ha' },
      { name:'Barnyard Millet', emoji:'🌿', desc:'Fastest-growing millet — 45 day crop', season:'Kharif', water:'Low', temp:'27–35°C', soil:'Well-drained sandy loam', yield:'2–2.5 t/ha' },
      { name:'Little Millet (Kutki)', emoji:'🌱', desc:'Versatile millet for food security', season:'Kharif', water:'Low', temp:'25–30°C', soil:'Sandy to clay loam', yield:'1–1.5 t/ha' },
    ]
  }
];

function renderCropTypes() {
  const container = document.getElementById('crops-container');
  container.innerHTML = CROP_DATA.map((cat, ci) => `
    <div class="crop-category-block">
      <div class="crop-cat-header" onclick="toggleCat(${ci})">
        <div class="crop-cat-icon-wrap ${cat.cls}">${cat.icon}</div>
        <div class="crop-cat-info">
          <h3>${cat.cat}</h3>
          <p>${cat.desc}</p>
        </div>
        <div class="crop-cat-toggle" id="cat-toggle-${ci}">▼</div>
      </div>
      <div class="crop-items-grid" id="cat-body-${ci}" style="display:${ci===0?'grid':'none'}">
        ${cat.crops.map((crop, cri) => `
          <div class="crop-item-card" onclick="showCropDetail(${ci},${cri})">
            <span class="crop-item-emoji">${crop.emoji}</span>
            <div class="crop-item-name">${crop.name}</div>
            <div class="crop-item-desc">${crop.desc}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  // open first
  document.getElementById('cat-toggle-0').classList.add('open');
}

function toggleCat(ci) {
  const body = document.getElementById('cat-body-' + ci);
  const toggle = document.getElementById('cat-toggle-' + ci);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'grid';
  toggle.classList.toggle('open', !isOpen);
}

function showCropDetail(ci, cri) {
  const crop = CROP_DATA[ci].crops[cri];
  document.getElementById('crop-modal-emoji').textContent = crop.emoji;
  document.getElementById('crop-modal-name').textContent = crop.name;
  document.getElementById('crop-modal-desc').textContent = crop.desc;

  const details = [
    ['📅 Season', crop.season],
    ['💧 Water Need', crop.water],
    ['🌡️ Temperature', crop.temp],
    ['🧪 Soil Type', crop.soil],
    ['📦 Yield Estimate', crop.yield],
  ].map(([l, v]) => `
    <div class="crop-detail-box">
      <div class="cd-label">${l}</div>
      <div class="cd-val">${v}</div>
    </div>`).join('');

  document.getElementById('crop-modal-details').innerHTML = details;
  document.getElementById('crop-modal').classList.add('open');
}

function closeCropModal(e) {
  if (!e || e.target === document.getElementById('crop-modal')) {
    document.getElementById('crop-modal').classList.remove('open');
  }
}

/* ── GUIDANCE DATA ── */
const GUIDANCE_DATA = [
  {
    icon: '🌱', title: 'Land Preparation for Paddy',
    intro: 'Proper land preparation is the foundation of a good paddy harvest. Plough the field 2–3 times to 15–20 cm depth. Level the field uniformly to ensure consistent water distribution. For transplanted paddy, flood the field one week before transplanting to puddle and soften the soil.',
    tips: [
      'Deep ploughing (15–20 cm) prevents hard pan formation and improves drainage',
      'Add green manure (Sesbania) or farm yard manure (FYM) 10 t/ha before final tillage',
      'Ensure proper bunding (15–20 cm height) to retain flood water uniformly',
      'Conduct soil testing before every season to calibrate fertilizer application',
      'Level the field to ±2 cm accuracy for uniform water distribution',
    ]
  },
  {
    icon: '💧', title: 'Water & Irrigation Management',
    intro: 'Paddy requires 1200–2000 mm of water across its growth cycle. Maintain 2–5 cm standing water during vegetative stage. Drain the field 2 weeks before harvest for easier mechanised harvesting. Avoid water stress during flowering and grain filling stages.',
    tips: [
      'Use SRI (System of Rice Intensification) to save 30–50% water without yield loss',
      'Alternate Wetting and Drying (AWD) reduces water use by 25% and reduces methane emissions',
      'Monitor soil moisture at 5–10 cm depth with tensiometers or feel method',
      'Drain excess water during tillering to encourage deeper root growth',
      'Never let fields go completely dry during panicle initiation stage',
    ]
  },
  {
    icon: '🐛', title: 'Pest & Disease Management (IPM)',
    intro: 'Common paddy pests: stem borer, leaf folder, gall midge, and brown planthopper (BPH). Diseases: blast (Magnaporthe oryzae), bacterial leaf blight (Xanthomonas), and sheath blight (Rhizoctonia). Use Integrated Pest Management (IPM) combining biological, cultural, and chemical strategies.',
    tips: [
      'Scout fields weekly — count pests per hill and compare against economic threshold levels (ETL)',
      'Install light traps (1 per hectare) to monitor and trap stem borer moths',
      'Apply Trichoderma viride (biocontrol) at transplanting to prevent sheath blight',
      'For blast: apply Tricyclazole 75% WP @ 0.6 g/litre at first symptom appearance',
      'For BPH: spray Buprofezin 25% SC @ 1 ml/litre; avoid broad-spectrum insecticides',
      'Rotate paddy with legume crops to break disease cycles',
    ]
  },
  {
    icon: '🧪', title: 'Soil Health & Fertilization',
    intro: 'Paddy grows best in pH 5.5–7.0 soils. Standard recommendation: N:P:K @ 120:60:60 kg/ha. Apply nitrogen in 3 splits — basal (30%), at tillering (40%), and at panicle initiation (30%). Phosphorus and potassium are applied in full as basal dose.',
    tips: [
      'Apply zinc sulfate (ZnSO₄) @ 25 kg/ha to correct widespread zinc deficiency in paddy soils',
      'Use silicon (slag) @ 200–500 kg/ha to improve stem strength and blast resistance',
      'Incorporate crop stubble after harvest to improve soil organic carbon',
      'Avoid urea application during heavy rains — use neem-coated urea for slow release',
      'Leaf Colour Chart (LCC) reading below 3 = apply top-dress nitrogen immediately',
    ]
  },
  {
    icon: '📅', title: 'Paddy Crop Calendar (India)',
    intro: 'Three paddy seasons in India: Kharif (wet season), Rabi (winter), and Zaid (summer). Select variety based on season duration and water availability.',
    tips: [
      'Kharif paddy: Nursery in May–June, transplant July, harvest October–November (120–150 days)',
      'Rabi paddy: Sow November–December, harvest March–April (needs irrigation)',
      'Zaid paddy: Sow February–March, harvest May–June (short-duration varieties)',
      'Choose short-duration varieties (90–100 days) like IR-50, MTU-1010 for multiple cropping',
      'Basmati varieties (Pusa 1121, Taraori) need 140–160 days and do best in Rabi',
      'Harvest when 80–85% of grains are golden yellow for maximum quality and minimum loss',
    ]
  },
  {
    icon: '🌾', title: 'Millet & Dryland Crop Guidance',
    intro: 'Millets are the future of sustainable farming — high nutrition, low water, minimal inputs. Pearl millet (bajra) grows in just 60–90 days. Finger millet (ragi) is rich in calcium (344 mg/100g). Sorghum (jowar) is the backbone of dryland agriculture in peninsular India.',
    tips: [
      'Millets require only 250–500 mm rainfall — ideal for water-scarce regions',
      'Zero or minimal chemical fertilizer needed — millets fix nutrients from soil effectively',
      'Intercrop millets with legumes (cowpea, groundnut) for better income and soil health',
      'Harvest millets at physiological maturity (hard dough stage) to minimise bird damage',
      'Demand for millets is rising — export to health food markets for 3–4× premium price',
    ]
  },
];

function renderGuidance() {
  const container = document.getElementById('guidance-container');
  container.innerHTML = GUIDANCE_DATA.map((g, i) => `
    <div class="guidance-block">
      <div class="guidance-header" onclick="toggleGuide(${i})">
        <span class="guide-icon">${g.icon}</span>
        <span class="guide-title">${g.title}</span>
        <span class="guide-toggle ${i===0?'open':''}" id="guide-toggle-${i}">▼</span>
      </div>
      <div class="guidance-body ${i===0?'open':''}" id="guide-body-${i}">
        <p class="guide-intro">${g.intro}</p>
        <ul class="guide-tips">
          ${g.tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>`).join('');
}

function toggleGuide(i) {
  const body = document.getElementById('guide-body-' + i);
  const toggle = document.getElementById('guide-toggle-' + i);
  body.classList.toggle('open');
  toggle.classList.toggle('open');
}

/* ── INIT ── */
renderCropTypes();
renderGuidance();
