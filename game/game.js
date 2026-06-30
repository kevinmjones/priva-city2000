/* ============================================================
   PRIVA-CITY 2000  —  governance city builder
   Vanilla canvas. No runtime dependencies. Static / GitHub Pages.
   The city is an enterprise; you are its Chief Privacy / AI
   Governance Officer. Place controls, raise Trust, cut Risk,
   pass the EU AI Act audit.
   ============================================================ */
(() => {
'use strict';

/* ---------------- Config & data ---------------- */
const GRID = 9;                 // 9 x 9 isometric grid
const TILE_W = 64, TILE_H = 32; // base tile footprint
const SAVE_KEY = 'privacity2000.save.v2';
const MAX_PERIOD = 8;
const WIN = { aiact: 80, trust: 60 };

const DISTRICTS = [
  { id:'hr',  name:'HR & Workforce',     rows:[0,2], hue:'#3b78d8', soft:'#284a82' },
  { id:'cust',name:'Customer & Marketing',rows:[3,5], hue:'#1fa99a', soft:'#1b6e66' },
  { id:'ai',  name:'Product & AI / ML',  rows:[6,8], hue:'#8a6bf0', soft:'#5a47a0' },
];
function districtOf(row){ return DISTRICTS.find(d => row>=d.rows[0] && row<=d.rows[1]); }

// Gap type -> control category that resolves it, plus severity ($k) & label
const GAPS = {
  unmapped : { fix:'inventory', sev:35, label:'Unmapped data store' },
  access   : { fix:'access',    sev:45, label:'No access controls' },
  consent  : { fix:'consent',   sev:40, label:'Missing / expired consent' },
  dsar     : { fix:'dsar',      sev:30, label:'No rights-request path' },
  vendor   : { fix:'vendor',    sev:40, label:'Vendor without a DPA' },
  breach   : { fix:'incident',  sev:70, label:'Breach-exposed, no IR plan' },
  dpia     : { fix:'dpia',      sev:55, label:'AI system, no impact assessment' },
  shadowai : { fix:'registry',  sev:60, label:'Shadow / undocumented AI' },
};

// Build palette — control types (>= 6 required; we ship 8)
const CONTROLS = [
  { id:'inventory', name:'Data Inventory & Mapping', icon:'🗺️', cost:12, radius:2, trust:4, fix:'unmapped', fw:['gdpr','ccpa'], color:'#3fb0ff',
    blurb:'Discovers and catalogs data stores. Lights up the map.' },
  { id:'access',    name:'Access Control',           icon:'🔐', cost:14, radius:2, trust:4, fix:'access',   fw:['gdpr'],         color:'#ffd34d',
    blurb:'Least-privilege + auth on systems of record.' },
  { id:'consent',   name:'Consent Manager',          icon:'✅', cost:13, radius:2, trust:4, fix:'consent',  fw:['gdpr','ccpa'], color:'#54d68a',
    blurb:'Captures, honors and expires consent across marketing.' },
  { id:'dsar',      name:'DSAR / Rights Desk',        icon:'📨', cost:13, radius:2, trust:3, fix:'dsar',     fw:['gdpr','ccpa'], color:'#ff9d5c',
    blurb:'Fulfills access / deletion requests on time.' },
  { id:'vendor',    name:'Vendor Risk Office',        icon:'🤝', cost:14, radius:3, trust:3, fix:'vendor',   fw:['gdpr'],         color:'#c0a3ff',
    blurb:'DPAs, assessments and monitoring for third parties.' },
  { id:'dpia',      name:'DPIA / Assessment Center',  icon:'📋', cost:16, radius:2, trust:5, fix:'dpia',     fw:['aiact'],        color:'#7bd0ff',
    blurb:'Impact assessments for high-risk AI systems.' },
  { id:'registry',  name:'AI Model Registry',         icon:'🤖', cost:16, radius:2, trust:5, fix:'shadowai', fw:['aiact'],        color:'#b388ff',
    blurb:'Inventories every model in prod. Kills shadow AI.' },
  { id:'incident',  name:'Incident Response (DPO)',   icon:'🚑', cost:18, radius:3, trust:4, fix:'breach',   fw:['gdpr','aiact'], color:'#ff7a90',
    blurb:'Detect, contain and notify. Blunts breach damage.' },
];
const CONTROL_BY_ID = Object.fromEntries(CONTROLS.map(c=>[c.id,c]));

const FRAMEWORKS = [
  { id:'gdpr',  name:'GDPR',       gaps:['unmapped','access','consent','dsar','vendor','breach'] },
  { id:'ccpa',  name:'CCPA / CPRA',gaps:['unmapped','consent','dsar'] },
  { id:'aiact', name:'EU AI Act',  gaps:['dpia','shadowai','breach'], target:WIN.aiact },
];

// Pre-seeded enterprise: data activities & AI systems, each with a flagged gap
const SEED = [
  // HR & Workforce (rows 0-2)
  {col:1,row:0,name:'Workday HRIS',      gap:'unmapped'},
  {col:3,row:1,name:'Recruiting AI',     gap:'shadowai'},
  {col:0,row:2,name:'Payroll Vendor',    gap:'vendor'},
  {col:2,row:2,name:'Employee Portal',   gap:'dsar'},
  // Customer & Marketing (rows 3-5)
  {col:1,row:3,name:'CRM · Salesforce',  gap:'access'},
  {col:4,row:3,name:'Marketing CDP',     gap:'consent'},
  {col:6,row:4,name:'Ad-tech Pixels',    gap:'consent'},
  {col:2,row:5,name:'Support Desk',      gap:'dsar'},
  {col:5,row:5,name:'Loyalty DB',        gap:'breach'},
  // Product & AI/ML (rows 6-8)
  {col:1,row:6,name:'Recommender',       gap:'dpia'},
  {col:4,row:6,name:'Fraud Model',       gap:'dpia'},
  {col:7,row:6,name:'LLM Chatbot',       gap:'shadowai'},
  {col:2,row:8,name:'Data Lake',         gap:'unmapped'},
  {col:5,row:8,name:'Churn Model',       gap:'dpia'},
  {col:8,row:8,name:'Vendor API',        gap:'vendor'},
];

// Scripted regulatory / incident events keyed by the period they fire on
const EVENTS = {
  2: { kind:'reg',  title:'CCPA enforcement sweep',
       body:'California AG opens a sweep on consent + deletion. Marketing is exposed.',
       apply(){ if(frameworkPct('ccpa')<40){ st.reputation-=4; toast('bad','Trust dip','CCPA gaps cited publicly. Trust −4.'); } else { toast('good','Held up','CCPA posture passed the sweep.'); } } },
  3: { kind:'incident', title:'Phishing → breach attempt · Loyalty DB',
       body:'A credential-phishing run targets the Customer district.',
       apply(){ if(!isResolvedAt('breach')){ st.reputation-=10; st.budget-=25; toast('bad','DATA BREACH','Loyalty DB exfiltrated. Trust −10, −$25k cleanup.'); }
                else { st.reputation+=3; toast('good','Contained','IR plan caught it. Trust +3.'); } } },
  4: { kind:'reg', title:'EU AI Act — high-risk obligations in force',
       body:'High-risk model duties (assessments, registry, oversight) now enforceable.',
       apply(){ st.aiActLive=true; if(frameworkPct('aiact')<50){ st.reputation-=3; toast('reg','Regulator watching','Unassessed models flagged. Trust −3.'); } else { toast('reg','On track','AI governance noted as mature.'); } } },
  5: { kind:'incident', title:'Shadow-AI discovery',
       body:'An undocumented model surfaces in Product without a registry entry.',
       apply(){ if(!isResolvedAll('shadowai')){ st.reputation-=8; st.budget-=15; toast('bad','Shadow AI','Unregistered model in prod. Trust −8, −$15k.'); }
                else { st.reputation+=3; toast('good','Already cataloged','Registry had it covered. Trust +3.'); } } },
  6: { kind:'reg', title:'AI Act audit scheduled',
       body:'The regulator books your conformity audit. Be ready by period 8.',
       apply(){ toast('reg','Audit booked','Reach EU AI Act ≥80% and Trust ≥60 to pass.'); } },
  7: { kind:'reg', title:'Board confidence review',
       body:'The board reviews the program ahead of the audit.',
       apply(){ if(trust()>=60){ st.reputation+=2; toast('good','Board pleased','Confidence up. Trust +2.'); } else { toast('reg','Board nervous','Trust still low going into the audit.'); } } },
};

const TICKER_BASE = [
  '<b>REGWIRE</b> EU AI Act transition deadlines tighten for high-risk systems.',
  '<b>ADVISOR</b> Tip: utilities first — Inventory & Access make every other control count.',
  '<b>REGWIRE</b> State privacy laws multiply; consent + DSAR coverage now table stakes.',
  '<b>ADVISOR</b> Tip: a Vendor Risk Office covers a wide radius — place it centrally.',
  '<b>REGWIRE</b> Regulators reward documented assessments over good intentions.',
];

const TUTORIAL = [
  { t:'Welcome, Chief Privacy Officer', b:'This enterprise has data and AI everywhere — and governance nowhere. Your job: build the privacy & AI governance program before the regulator comes calling.' },
  { t:'Read the city', b:'Each ⚠ building is a flagged gap: shadow AI, unmapped data, missing consent, an un-assessed model. Hover any tile to inspect it. Three districts: HR, Customer & Marketing, and Product & AI/ML.' },
  { t:'Build controls', b:'Pick a control from the palette (right), then click a tile to place it. Controls cover everything in their radius — resolving matching gaps, raising Trust and lowering Risk. Toggle the 🌡️ Heatmap to see coverage.' },
  { t:'Mind the clock', b:'Click ▶ Next Period to advance the fiscal month. Trust earns budget; regulations and incidents fire from the REG WIRE. Under-protected districts get hit.' },
  { t:'Win the audit', b:'Goal: reach EU AI Act ≥ 80% readiness and Trust ≥ 60 by period 8, then click Next Period to pass the audit. Good luck — the customers are watching.' },
];

/* ---------------- State ---------------- */
let st, buildings, placed, coverField, won=false, lost=false;
let sel=null, removeMode=false, hover=null, heatmap=false, tutorialIdx=0;
const view = { scale:1, pan:{x:0,y:0}, origin:{x:0,y:0} };

function freshState(){
  return { period:1, budget:100, reputation:0, aiActLive:false,
           placed:[], firedEvents:[], tutorialDone:false };
}

/* ---------------- DOM ---------------- */
const $ = s => document.querySelector(s);
const canvas = $('#city'), ctx = canvas.getContext('2d');
const elTrust=$('#statTrust'), elRisk=$('#statRisk'), elBudget=$('#statBudget'),
      elPeriod=$('#statPeriod'), elBarTrust=$('#barTrust'), elBarRisk=$('#barRisk'),
      elFrameworks=$('#frameworks'), elGoal=$('#goal'), elInspector=$('#inspector'),
      elPaletteGrid=$('#paletteGrid'), elHint=$('#paletteHint'),
      elToasts=$('#toasts'), elTicker=$('#tickerText');

/* ---------------- Build / placement model ---------------- */
function rebuildBuildings(){
  buildings = SEED.map(s => ({ ...s, g:GAPS[s.gap] }));
}
function keyOf(c,r){ return c+','+r; }
function occupied(c,r){
  return buildings.some(b=>b.col===c&&b.row===r) || placed.some(p=>p.col===c&&p.row===r);
}
function cheb(a,b){ return Math.max(Math.abs(a.col-b.col), Math.abs(a.row-b.row)); }

// is a given gap building resolved by a matching nearby control?
function buildingResolved(b){
  const fixId = b.g.fix;
  return placed.some(p => p.type===fixId && cheb(p,b)<=CONTROL_BY_ID[fixId].radius);
}
// any building with this gap type currently covered? / all of them?
function isResolvedAt(gap){ return buildings.some(b=>b.gap===gap && buildingResolved(b)); }
function isResolvedAll(gap){ const arr=buildings.filter(b=>b.gap===gap); return arr.length>0 && arr.every(buildingResolved); }

/* ---------------- Derived metrics ---------------- */
function coverage(){
  const total = buildings.length;
  const res = buildings.filter(buildingResolved).length;
  return { total, res, frac: total? res/total : 0 };
}
function trust(){
  const c = coverage();
  const v = Math.round(30 + 55*c.frac + st.reputation);
  return Math.max(0, Math.min(100, v));
}
function riskK(){ // $k of exposure from unresolved gaps
  return buildings.filter(b=>!buildingResolved(b)).reduce((s,b)=>s+b.g.sev,0);
}
function initialRiskK(){ return buildings.reduce((s,b)=>s+b.g.sev,0); }
function frameworkPct(id){
  const f = FRAMEWORKS.find(x=>x.id===id);
  const rel = buildings.filter(b=>f.gaps.includes(b.gap));
  if(!rel.length) return 100;
  const r = rel.filter(buildingResolved).length;
  return Math.round(100*r/rel.length);
}
function isReady(){ return frameworkPct('aiact')>=WIN.aiact && trust()>=WIN.trust; }

/* recompute the per-tile heat/coverage field for the overlay */
function computeField(){
  coverField = Array.from({length:GRID},()=>new Array(GRID).fill(0));
  for(const b of buildings){
    const r = buildingResolved(b) ? -1 : 1;       // covered tiles cool, exposed tiles heat
    for(let dc=-2;dc<=2;dc++) for(let dr=-2;dr<=2;dr++){
      const c=b.col+dc, rr=b.row+dr;
      if(c<0||rr<0||c>=GRID||rr>=GRID) continue;
      const d=Math.max(Math.abs(dc),Math.abs(dr));
      coverField[rr][c]+= r * (d===0?2:d===1?1:0.5);
    }
  }
}

/* ---------------- Isometric geometry ---------------- */
function layout(){
  const cw=canvas.clientWidth, ch=canvas.clientHeight;
  const playTop=104, playBot=ch-42;
  view.origin.x = cw/2 + view.pan.x;
  view.origin.y = (playTop+playBot)/2 - (GRID-1)*(TILE_H/2)*view.scale + view.pan.y;
}
function cellToScreen(col,row){
  const s=view.scale;
  return { x: view.origin.x + (col-row)*(TILE_W/2)*s,
           y: view.origin.y + (col+row)*(TILE_H/2)*s };
}
function screenToCell(sx,sy){
  const s=view.scale;
  const A=(sx-view.origin.x)/((TILE_W/2)*s);
  const B=(sy-view.origin.y)/((TILE_H/2)*s);
  return { col:Math.floor((A+B)/2+0.5)|0, row:Math.floor((B-A)/2+0.5)|0,
           colF:(A+B)/2, rowF:(B-A)/2 };
}
function inBounds(c,r){ return c>=0&&r>=0&&c<GRID&&r<GRID; }

/* ---------------- Rendering ---------------- */
function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(canvas.clientWidth*dpr);
  canvas.height=Math.floor(canvas.clientHeight*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  render();
}
function diamond(x,y,s){
  const w=TILE_W/2*s, h=TILE_H/2*s;
  ctx.beginPath();
  ctx.moveTo(x,y-h); ctx.lineTo(x+w,y); ctx.lineTo(x,y+h); ctx.lineTo(x-w,y); ctx.closePath();
}
function shade(hex,amt){
  const n=parseInt(hex.slice(1),16);
  let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.max(0,Math.min(255,r+amt));g=Math.max(0,Math.min(255,g+amt));b=Math.max(0,Math.min(255,b+amt));
  return `rgb(${r|0},${g|0},${b|0})`;
}
function heatColor(v){ // v ~ [-?, +?]
  const t=Math.max(-2,Math.min(2,v))/2; // -1..1
  if(t>0) return `rgba(255,70,90,${0.10+0.4*t})`;
  return `rgba(60,220,150,${0.06+0.34*(-t)})`;
}

function render(){
  if(!st) return;
  layout();
  const cw=canvas.clientWidth, ch=canvas.clientHeight, s=view.scale;
  // sky
  const g=ctx.createLinearGradient(0,0,0,ch);
  g.addColorStop(0,'#0e1b30'); g.addColorStop(1,'#0a1120');
  ctx.fillStyle=g; ctx.fillRect(0,0,cw,ch);

  // soft platform shadow under the city
  const mid=cellToScreen((GRID-1)/2,(GRID-1)/2);
  const rg=ctx.createRadialGradient(mid.x,mid.y,40,mid.x,mid.y,GRID*TILE_W*0.55*s);
  rg.addColorStop(0,'rgba(40,70,120,.35)'); rg.addColorStop(1,'rgba(40,70,120,0)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,cw,ch);

  // ---- ground tiles ----
  for(let r=0;r<GRID;r++) for(let c=0;c<GRID;c++){
    const p=cellToScreen(c,r), d=districtOf(r);
    diamond(p.x,p.y,s);
    const base=(c+r)%2? shade(d.soft,8):d.soft;
    ctx.fillStyle=base; ctx.fill();
    if(heatmap){ diamond(p.x,p.y,s); ctx.fillStyle=heatColor(coverField[r][c]); ctx.fill(); }
    ctx.lineWidth=1; ctx.strokeStyle='rgba(8,16,30,.55)'; ctx.stroke();
  }

  // district labels (back edge)
  ctx.font=`600 ${12*s}px monospace`;
  ctx.textAlign='left'; ctx.textBaseline='middle';
  for(const d of DISTRICTS){
    const p=cellToScreen(-0.1,(d.rows[0]+d.rows[1])/2);
    ctx.fillStyle='rgba(232,238,252,.5)';
    ctx.save(); ctx.translate(p.x-12*s,p.y);
    ctx.fillText(d.name, -ctx.measureText(d.name).width-6, 0);
    ctx.restore();
  }

  // hover ghost ring (placement preview)
  if(sel && hover && inBounds(hover.col,hover.row)){
    const ok=canPlace(hover.col,hover.row);
    drawRing(hover.col,hover.row,sel.radius,ok?'rgba(47,214,196,.9)':'rgba(255,107,129,.9)');
  }

  // coverage rings for placed controls
  for(const p of placed){
    drawRing(p.col,p.row,CONTROL_BY_ID[p.type].radius,'rgba(47,214,196,.28)',true);
  }

  // ---- occupants, painter order ----
  const items=[];
  for(const b of buildings) items.push({col:b.col,row:b.row,kind:'b',ref:b});
  for(const p of placed) items.push({col:p.col,row:p.row,kind:'p',ref:p});
  items.sort((a,b)=>(a.col+a.row)-(b.col+b.row) || a.row-b.row);
  for(const it of items){
    if(it.kind==='b') drawBuilding(it.ref); else drawControl(it.ref);
  }

  // hover tile outline
  if(hover && inBounds(hover.col,hover.row)){
    const p=cellToScreen(hover.col,hover.row);
    diamond(p.x,p.y,s); ctx.lineWidth=2; ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.stroke();
  }
}

function drawRing(col,row,rad,color,thin){
  const p=cellToScreen(col,row), s=view.scale;
  ctx.save();
  ctx.translate(p.x,p.y); ctx.scale(1,TILE_H/TILE_W);
  ctx.beginPath();
  ctx.arc(0,0,(rad+0.5)*TILE_W/2*s,0,Math.PI*2);
  ctx.strokeStyle=color; ctx.lineWidth=(thin?1.5:2)*s;
  if(thin){ ctx.setLineDash([4*s,4*s]); }
  ctx.stroke(); ctx.restore();
}

function box(x,y,wHalf,hHalf,height,top,left,right){
  // isometric box: top face diamond + two side faces of given pixel height
  ctx.beginPath(); // left face
  ctx.moveTo(x-wHalf,y); ctx.lineTo(x,y+hHalf); ctx.lineTo(x,y+hHalf-height); ctx.lineTo(x-wHalf,y-height); ctx.closePath();
  ctx.fillStyle=left; ctx.fill();
  ctx.beginPath(); // right face
  ctx.moveTo(x+wHalf,y); ctx.lineTo(x,y+hHalf); ctx.lineTo(x,y+hHalf-height); ctx.lineTo(x+wHalf,y-height); ctx.closePath();
  ctx.fillStyle=right; ctx.fill();
  ctx.beginPath(); // top face
  ctx.moveTo(x,y-hHalf-height); ctx.lineTo(x+wHalf,y-height); ctx.lineTo(x,y+hHalf-height); ctx.lineTo(x-wHalf,y-height); ctx.closePath();
  ctx.fillStyle=top; ctx.fill();
}

let pulse=0;
function drawBuilding(b){
  const p=cellToScreen(b.col,b.row), s=view.scale;
  const resolved=buildingResolved(b);
  const wHalf=TILE_W/2*0.82*s, hHalf=TILE_H/2*0.82*s, ht=18*s;
  const d=districtOf(b.row);
  const top = resolved? shade(d.hue,30) : shade('#6b7790',10);
  const left= resolved? shade(d.hue,-30): '#3b4458';
  const right= resolved? shade(d.hue,-12): '#525c72';
  box(p.x,p.y,wHalf,hHalf,ht, top, left, right);
  // marker above
  const my=p.y-ht-hHalf-10*s;
  if(resolved){
    ctx.font=`${14*s}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('✅',p.x,my);
  } else {
    const a=0.55+0.45*Math.sin(pulse/16);
    ctx.globalAlpha=a; ctx.font=`${16*s}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('⚠️',p.x,my); ctx.globalAlpha=1;
  }
}

function drawControl(p0){
  const c=CONTROL_BY_ID[p0.type], p=cellToScreen(p0.col,p0.row), s=view.scale;
  const wHalf=TILE_W/2*0.7*s, hHalf=TILE_H/2*0.7*s, ht=26*s;
  box(p.x,p.y,wHalf,hHalf,ht, shade(c.color,28), shade(c.color,-40), shade(c.color,-18));
  ctx.font=`${15*s}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(c.icon,p.x,p.y-ht-2*s);
}

/* ---------------- HUD / UI ---------------- */
function renderPalette(){
  elPaletteGrid.innerHTML='';
  for(const c of CONTROLS){
    const can=st.budget>=c.cost;
    const el=document.createElement('button');
    el.className='pcard'+(sel&&sel.id===c.id?' sel':'')+(can?'':' cant');
    el.innerHTML=`<div class="pcard-ico">${c.icon}</div>
      <div class="pcard-name">${c.name}</div>
      <div class="pcard-cost">$${c.cost}k</div>
      <div class="pcard-tag">r${c.radius}</div>`;
    el.title=c.blurb;
    el.onclick=()=>{ removeMode=false; $('#btnBulldoze').classList.remove('on');
      sel=(sel&&sel.id===c.id)?null:c; renderPalette(); updateHint(); render(); };
    elPaletteGrid.appendChild(el);
  }
}
function updateHint(){
  if(removeMode){ elHint.textContent='Remove mode: click a placed control to refund 60% of its cost.'; return; }
  if(sel){ elHint.innerHTML=`<b style="color:#e8eefc">${sel.name}</b> — ${sel.blurb} Click a tile to place ($${sel.cost}k).`; }
  else elHint.textContent='Pick a control, then click a tile to place it. Toggle 🌡️ Heatmap to see coverage.';
}
function fwTargetMarker(f){
  return f.target? `<span class="fw-target" style="left:${f.target}%"></span>`:'';
}
function renderFrameworks(){
  elFrameworks.innerHTML=FRAMEWORKS.map(f=>{
    const pct=frameworkPct(f.id);
    const ready=f.target? pct>=f.target : pct>=100;
    return `<div class="fw ${ready?'ready':''}">
      <div class="fw-top"><span class="fw-name">${f.name}</span><span class="fw-pct">${pct}%</span></div>
      <div class="bar" style="position:relative"><i style="width:${pct}%"></i>${fwTargetMarker(f)}</div>
    </div>`;
  }).join('');
}
function renderGoal(){
  const ai=frameworkPct('aiact'), tr=trust();
  const aiOk=ai>=WIN.aiact, trOk=tr>=WIN.trust;
  const ready=aiOk&&trOk;
  elGoal.innerHTML=`🎯 <b>EU AI Act audit</b> — by period ${MAX_PERIOD}
    &nbsp;·&nbsp; <span class="goal-prog" style="color:${aiOk?'#54d68a':'#ffb3bf'}">AI Act ${ai}%${aiOk?' ✓':` / ${WIN.aiact}`}</span>
    &nbsp; <span class="goal-prog" style="color:${trOk?'#54d68a':'#ffb3bf'}">Trust ${tr}${trOk?' ✓':` / ${WIN.trust}`}</span>
    ${ready?'&nbsp;— <b style="color:#54d68a">READY · hit Next Period to pass</b>':''}`;
}
function updateHUD(){
  const tr=trust(), rk=riskK(), maxR=initialRiskK();
  elTrust.textContent=tr;
  elBarTrust.style.width=tr+'%';
  elRisk.textContent='$'+(rk>=1000?(rk/1000).toFixed(2)+'M':rk+'k');
  elBarRisk.style.width=Math.round(100*rk/maxR)+'%';
  elBudget.textContent='$'+st.budget+'k';
  elPeriod.textContent=st.period;
  $('#statPeriodMax').textContent=MAX_PERIOD;
  renderFrameworks(); renderGoal(); renderPalette();
}

function toast(kind,title,body){
  const el=document.createElement('div');
  el.className='toast '+(kind||'');
  el.innerHTML=`<h5>${title}</h5><p>${body}</p>`;
  elToasts.appendChild(el);
  while(elToasts.children.length>4) elToasts.removeChild(elToasts.firstChild);
  setTimeout(()=>el.remove(),6200);
}

/* inspector on hover */
function showInspector(c,r){
  if(!inBounds(c,r)){ elInspector.hidden=true; return; }
  const b=buildings.find(x=>x.col===c&&x.row===r);
  const p=placed.find(x=>x.col===c&&x.row===r);
  const d=districtOf(r);
  if(b){
    const res=buildingResolved(b);
    elInspector.hidden=false;
    elInspector.innerHTML=`<div class="insp-kind">${d.name}</div>
      <h4>${b.name}</h4>
      <div class="insp-row"><span>Exposure</span><b>$${b.g.sev}k</b></div>
      <div class="insp-row"><span>Needs</span><b>${CONTROL_BY_ID[b.g.fix].name}</b></div>
      <span class="chip ${res?'ok':'gap'}">${res?'✓ Governed':'⚠ '+b.g.label}</span>`;
  } else if(p){
    const cc=CONTROL_BY_ID[p.type];
    elInspector.hidden=false;
    elInspector.innerHTML=`<div class="insp-kind">Control</div>
      <h4>${cc.icon} ${cc.name}</h4>
      <div class="insp-row"><span>Radius</span><b>${cc.radius} tiles</b></div>
      <div class="insp-row"><span>Frameworks</span><b>${cc.fw.map(x=>x.toUpperCase()).join(', ')}</b></div>
      <span class="chip ok">Right-click / Remove to refund</span>`;
  } else {
    elInspector.hidden=false;
    elInspector.innerHTML=`<div class="insp-kind">${d.name}</div>
      <h4>Open lot</h4>
      <div class="insp-row"><span>District</span><b>${d.name}</b></div>
      <p style="color:#6c809f;font-size:12px;margin:8px 0 0">Place a control here to extend coverage.</p>`;
  }
}

/* ---------------- Placement actions ---------------- */
function canPlace(c,r){
  if(!sel) return false;
  if(!inBounds(c,r)) return false;
  if(occupied(c,r)) return false;
  if(st.budget<sel.cost) return false;
  return true;
}
function place(c,r){
  if(!canPlace(c,r)){
    if(sel && st.budget<sel.cost) toast('bad','Budget too low',`Need $${sel.cost}k for ${sel.name}. Advance a period to earn budget.`);
    else if(sel && occupied(c,r)) toast('bad','Occupied','That lot already has a building or control.');
    return;
  }
  placed.push({col:c,row:r,type:sel.id});
  st.budget-=sel.cost;
  afterChange();
}
function removeAt(c,r){
  const i=placed.findIndex(p=>p.col===c&&p.row===r);
  if(i<0) return false;
  const cc=CONTROL_BY_ID[placed[i].type];
  st.budget+=Math.round(cc.cost*0.6);
  placed.splice(i,1);
  toast('','Removed',`${cc.name} dismantled. Refunded $${Math.round(cc.cost*0.6)}k.`);
  afterChange();
  return true;
}
function afterChange(){
  st.placed=placed.map(p=>({...p}));
  computeField(); updateHUD(); save(); render();
  if(isReady() && !won && !lost) renderGoal();
}

/* ---------------- Period / events engine ---------------- */
function advancePeriod(){
  if(won||lost){ return; }
  // already meets win conditions -> audit early & pass
  if(isReady()){ return endGame(true,'early'); }
  if(st.period>=MAX_PERIOD){ return endGame(false,'timeout'); }

  st.period++;
  const rev=Math.max(0,Math.round(trust()*0.45));
  st.budget+=rev;
  toast('good','New fiscal period',`Period ${st.period}. Trust earned +$${rev}k budget.`);

  const ev=EVENTS[st.period];
  if(ev && !st.firedEvents.includes(st.period)){
    st.firedEvents.push(st.period);
    setTimeout(()=>{
      toast(ev.kind==='incident'?'bad':'reg', ev.title, ev.body);
      ev.apply();
      pushTicker(ev);
      computeField(); updateHUD(); save(); render();
      if(st.budget<0) return endGame(false,'bankrupt');
      if(isReady()) renderGoal();
    },650);
  }
  computeField(); updateHUD(); save(); render();
  if(st.budget<0) endGame(false,'bankrupt');
}

function pushTicker(ev){
  const line = `<span class="${ev.kind==='incident'?'alarm':''}">‹ P${st.period} › ${ev.title}.</span>`;
  elTicker.innerHTML = line + ' &nbsp;•&nbsp; ' + elTicker.innerHTML;
}
function buildTicker(){
  elTicker.innerHTML = TICKER_BASE.join(' &nbsp;•&nbsp; ');
}

/* ---------------- End game ---------------- */
function endGame(win,reason){
  won=win; lost=!win;
  const tr=trust(), ai=frameworkPct('aiact'), gd=frameworkPct('gdpr'), cc=frameworkPct('ccpa');
  const cov=coverage();
  const score = Math.round(tr*4 + ai*2 + gd + cc + Math.max(0,st.budget) - riskK()/10);
  let head, sub;
  if(win){
    head = reason==='early'? 'AUDIT PASSED — ahead of schedule' : 'AUDIT PASSED';
    sub  = `Priva-city's AI Act conformity audit is signed off in period ${st.period}. Customers, board and regulator are aligned. The program holds.`;
  } else if(reason==='bankrupt'){
    head='COMPLIANCE BUDGET EXHAUSTED'; sub='Risk capital ran dry before the program matured. The board pulls funding. Game over.';
  } else {
    head='AUDIT FAILED'; sub=`Period ${MAX_PERIOD} arrived with EU AI Act at ${ai}% and Trust ${tr}. The conformity audit did not pass. Reset and try a tighter build order.`;
  }
  showModal(`<div class="${win?'win':'lose'}">
      <div class="overlay-step">${win?'Victory':'Defeat'}</div>
      <h2>${head}</h2>
      <p>${sub}</p>
      <div class="big-num">Score ${score.toLocaleString()}</div>
      <div class="score-grid">
        <div><div class="k">Trust</div><div class="v">${tr}</div></div>
        <div><div class="k">EU AI Act</div><div class="v">${ai}%</div></div>
        <div><div class="k">Gaps governed</div><div class="v">${cov.res}/${cov.total}</div></div>
        <div><div class="k">Budget left</div><div class="v">$${st.budget}k</div></div>
      </div>
      <div class="overlay-actions"><span></span>
        <div class="right"><button class="hbtn primary" id="mPlay">Play again ↻</button></div>
      </div>
    </div>`);
  $('#mPlay').onclick=()=>{ hideModal(); resetGame(); };
  save();
}

/* ---------------- Modal & menu ---------------- */
function showModal(html){ $('#modalCard').innerHTML=html; $('#modal').hidden=false; }
function hideModal(){ $('#modal').hidden=true; }
function openMenu(){
  showModal(`<div class="overlay-step">Menu</div>
    <h2>Priva-city 2000</h2>
    <p>Build the enterprise privacy &amp; AI governance program. Place controls to govern flagged systems, survive the REG WIRE, and pass the EU AI Act audit by period ${MAX_PERIOD}.</p>
    <ul>
      <li><b>Trust</b> rises as you govern more of the city.</li>
      <li><b>Risk Exposure</b> falls as gaps get covered.</li>
      <li><b>Budget</b> grows each period in proportion to Trust.</li>
      <li><b>🌡️ Heatmap</b> (key <b>H</b>) shows coverage; <b>Space</b> advances a period.</li>
    </ul>
    <div class="overlay-actions">
      <button class="hbtn ghost" id="mReset">↻ New game</button>
      <div class="right">
        <button class="hbtn ghost" id="mTut">Replay tutorial</button>
        <button class="hbtn primary" id="mClose">Resume ▶</button>
      </div>
    </div>`);
  $('#mClose').onclick=hideModal;
  $('#mReset').onclick=()=>{ hideModal(); resetGame(); };
  $('#mTut').onclick=()=>{ hideModal(); tutorialIdx=0; startTutorial(); };
}

/* ---------------- Tutorial ---------------- */
function startTutorial(){
  $('#tutorial').hidden=false; renderTut();
}
function renderTut(){
  const s=TUTORIAL[tutorialIdx];
  $('#tutStep').textContent=`${tutorialIdx+1} / ${TUTORIAL.length}`;
  $('#tutTitle').textContent=s.t; $('#tutBody').textContent=s.b;
  $('#tutNext').textContent= tutorialIdx===TUTORIAL.length-1?'Start building ▶':'Next ▶';
}
function endTutorial(){
  $('#tutorial').hidden=true; st.tutorialDone=true; save();
}

/* ---------------- Persistence ---------------- */
function save(){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      period:st.period, budget:st.budget, reputation:st.reputation,
      aiActLive:st.aiActLive, placed:st.placed, firedEvents:st.firedEvents,
      tutorialDone:st.tutorialDone, won, lost
    }));
  }catch(e){/* storage disabled — game still playable in-session */}
}
function load(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw) return false;
    const d=JSON.parse(raw);
    st=Object.assign(freshState(),d);
    placed=(d.placed||[]).filter(p=>CONTROL_BY_ID[p.type]).map(p=>({col:p.col,row:p.row,type:p.type}));
    st.placed=placed; won=!!d.won; lost=!!d.lost;
    return true;
  }catch(e){ return false; }
}

/* ---------------- Lifecycle ---------------- */
function resetGame(){
  try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
  won=lost=false; sel=null; removeMode=false; heatmap=false;
  $('#btnHeat').classList.remove('on'); $('#btnBulldoze').classList.remove('on');
  st=freshState(); placed=[]; rebuildBuildings(); computeField();
  buildTicker(); updateHUD(); updateHint(); render();
  tutorialIdx=0; startTutorial();
}
let booted=false;
function boot(){
  if(booted) return; booted=true;
  rebuildBuildings();
  const had=load();
  if(!had){ st=freshState(); placed=[]; }
  else { placed=st.placed||[]; }
  computeField();
  // reveal UI
  $('#boot').classList.add('hide');
  setTimeout(()=>{ $('#boot').remove(); },520);
  $('#hud').hidden=false; $('#stage').hidden=false;
  resize(); buildTicker(); updateHUD(); renderPalette(); updateHint();
  if(won||lost){ /* show summary on demand via menu */ }
  if(!st.tutorialDone) startTutorial();
}

/* ---------------- Input ---------------- */
function relPos(e){
  const r=canvas.getBoundingClientRect();
  return { x:(e.touches?e.touches[0].clientX:e.clientX)-r.left,
           y:(e.touches?e.touches[0].clientY:e.clientY)-r.top };
}
let dragging=false, dragMoved=false, last=null;
canvas.addEventListener('mousedown',e=>{ dragging=true; dragMoved=false; last=relPos(e); });
window.addEventListener('mouseup',e=>{
  if(dragging && !dragMoved){ handleClick(relPos(e), e.button); }
  dragging=false;
});
canvas.addEventListener('mousemove',e=>{
  const p=relPos(e);
  if(dragging){
    const dx=p.x-last.x, dy=p.y-last.y;
    if(Math.abs(dx)+Math.abs(dy)>3){ dragMoved=true; view.pan.x+=dx; view.pan.y+=dy; last=p; render(); }
    return;
  }
  const cell=screenToCell(p.x,p.y);
  hover={col:cell.col,row:cell.row};
  showInspector(cell.col,cell.row);
  render();
});
canvas.addEventListener('mouseleave',()=>{ hover=null; elInspector.hidden=true; render(); });
canvas.addEventListener('contextmenu',e=>{ e.preventDefault();
  const p=relPos(e); const cell=screenToCell(p.x,p.y); removeAt(cell.col,cell.row); });
canvas.addEventListener('wheel',e=>{ e.preventDefault();
  const f=e.deltaY<0?1.1:0.9; view.scale=Math.max(0.6,Math.min(1.8,view.scale*f)); render(); },{passive:false});

// touch (basic): tap to place, drag to pan
canvas.addEventListener('touchstart',e=>{ dragging=true; dragMoved=false; last=relPos(e); },{passive:true});
canvas.addEventListener('touchmove',e=>{ const p=relPos(e);
  const dx=p.x-last.x,dy=p.y-last.y;
  if(Math.abs(dx)+Math.abs(dy)>4){ dragMoved=true; view.pan.x+=dx; view.pan.y+=dy; last=p; render(); }
},{passive:true});
canvas.addEventListener('touchend',e=>{ if(!dragMoved && last) handleClick(last,0); dragging=false; });

function handleClick(p,button){
  const cell=screenToCell(p.x,p.y);
  if(!inBounds(cell.col,cell.row)) return;
  if(removeMode || button===1){ removeAt(cell.col,cell.row); return; }
  if(sel){ place(cell.col,cell.row); }
  else { // no tool selected -> if clicking a control, offer remove; else just inspect
    showInspector(cell.col,cell.row);
  }
}

/* buttons */
$('#btnNext').onclick=advancePeriod;
$('#btnHeat').onclick=()=>{ heatmap=!heatmap; $('#btnHeat').classList.toggle('on',heatmap); render(); };
$('#btnMenu').onclick=openMenu;
$('#btnBulldoze').onclick=()=>{ removeMode=!removeMode; sel=null;
  $('#btnBulldoze').classList.toggle('on',removeMode); renderPalette(); updateHint(); render(); };
$('#tutNext').onclick=()=>{ if(tutorialIdx>=TUTORIAL.length-1) endTutorial(); else { tutorialIdx++; renderTut(); } };
$('#tutSkip').onclick=endTutorial;

window.addEventListener('keydown',e=>{
  if(e.key==='h'||e.key==='H'){ $('#btnHeat').click(); }
  else if(e.code==='Space'){ e.preventDefault(); advancePeriod(); }
  else if(e.key==='Escape'){ sel=null; removeMode=false; $('#btnBulldoze').classList.remove('on'); renderPalette(); updateHint(); render(); hideModal(); }
  else if(e.key>='1'&&e.key<='8'){ const c=CONTROLS[+e.key-1]; if(c){ sel=c; removeMode=false; renderPalette(); updateHint(); render(); } }
});
window.addEventListener('resize',resize);

/* animation loop (for pulsing warnings) */
function loop(){ pulse++; if(!(won||lost)) { if(pulse%4===0) render(); } requestAnimationFrame(loop); }

/* go */
function init(){ if(booted) return; boot(); loop(); }
window.addEventListener('DOMContentLoaded',init);
if(document.readyState!=='loading'){ init(); }

})();
