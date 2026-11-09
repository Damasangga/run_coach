const D=window.DATA,$=s=>document.querySelector(s),Z2=[124,153];
const START=new Date("2026-11-16T00:00"),RACE="2027-06-13";
const LONG=[12,13,14,10,15,16,17,12,17,18,19,20,21,15,22,23,24,16,25,26,26,18,28,22,30,24,26,16,12,0];
const phase=w=>w<=10?"BASE":w<=22?"BUILD":w<=27?"PEAK":"TAPER";
const pad=n=>String(n).padStart(2,"0"),iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fp=s=>Math.floor(s/60)+":"+pad(Math.round(s%60));
const WU="Pemanasan 8 mnt: jalan cepat 3 mnt, jogging sangat pelan 5 mnt, drill ringan (leg swing, high knees).";
const CD="Pendinginan 6 mnt: jalan santai sampai HR <110, lalu peregangan betis, paha, pinggul.";
const FUEL={BASE:"Fueling: pisang + roti 45-60 mnt sebelum, air 300 ml. Setelah lari: telur/tempe + nasi.",BUILD:"Fueling: 60 g karbo 90 mnt sebelum; >75 mnt bawa gel 1 per 40 mnt + elektrolit. Setelah: 25 g protein + karbo.",PEAK:"Fueling: latih menu race, 50-60 g karbo/jam, minum tiap 15-20 mnt.",TAPER:"Fueling: tidur cukup, carbo-loading 3 hari sebelum race."};
const STR="Strength 35 mnt: goblet squat 3x10, RDL 3x10, split squat 3x8/kaki, step-up 3x10, calf raise 3x15, glute bridge 3x12, plank 3x40 dtk. Minggu recovery: 2 set.";
let ADJ=1;
function plan(){const s=[];
LONG.forEach((l,i)=>{const w=i+1,ph=phase(w),f=w>currentWeek()?ADJ:1,ds=addD(START,i*7);
const L=Math.round(l*f),e=Math.max(5,Math.round(l*.42*f)),sat=Math.max(4,Math.round(l*.28*f)),q=(ph=="BUILD"||ph=="PEAK");
const easy=(day,km,t)=>({date:iso(addD(ds,day)),w,ph,type:"run",t:t||"Easy Run Zona 2",km,time:"05:00",
steps:[WU,`Inti: ${km} km santai, HR ${Z2[0]}-${Z2[1]} bpm, pace 6:30-7:00/km`,CD],fuel:FUEL[ph]});
if(w<=28)s.push({date:iso(ds),w,ph,type:"str",t:"Strength",km:0,time:"19:30",steps:[STR],fuel:"Makan malam karbo + protein 1,5-2 jam sebelum."});
s.push(easy(1,e));
if(w<=28)s.push({date:iso(addD(ds,2)),w,ph,type:"str",t:"Strength",km:0,time:"19:30",steps:[STR],fuel:"Makan malam karbo + protein."});
const th=easy(3,e,q?"Tempo Ringan":"Easy + Strides");th.steps[1]=q?`Inti: ${e} km, 2x10 mnt di HR 154-168 (nyaman-keras), jeda jogging 3 mnt`:`Inti: ${e} km santai + 4x20 dtk strides`;s.push(th);
s.push(easy(5,sat));
if(w==30)s.push({date:RACE,w,ph,type:"race",t:"MARATHON 42,2 km",km:42.2,time:"05:00",steps:["Mulai pace 6:25-6:40/km, jangan terlalu cepat","Gel 50-60 g karbo/jam, minum tiap pos"],fuel:FUEL.TAPER});
else s.push({date:iso(addD(ds,6)),w,ph,type:"run",t:"Long Run",km:L,time:"05:00",
steps:[WU,`Inti: ${L} km, pace 6:40-7:10/km, HR ${Z2[0]}-${Z2[1]} bpm`,CD],fuel:FUEL[ph]})});
return s}
function currentWeek(){return Math.min(30,Math.max(0,Math.floor((new Date()-START)/6048e5)+1))}
function wkKm(runs){const m={};runs.forEach(r=>{const d=new Date(r.d+"T00:00");d.setDate(d.getDate()-((d.getDay()+6)%7));const k=iso(d);m[k]=(m[k]||0)+r.km});return m}
const runs=[...D.runs].sort((a,b)=>b.d.localeCompare(a.d));
const wk=wkKm(runs);
function adj(){const cw=currentWeek();const prev=iso(addD(START,(cw-2)*7));
const p=plan().filter(s=>s.w==cw-1&&s.type=="run").reduce((a,s)=>a+s.km,0),a=wk[prev]||0;
if(cw<2||!p)return 1;const r=a/p;return r<.7?.9:r>1.15?.95:1}
function coachMsg(){const cw=currentWeek(),m=[];
const hrs=runs.filter(r=>r.hr).slice(0,3);
if(hrs.length&&hrs.some(r=>r.hr>Z2[1]))m.push("HR beberapa lari terakhir di atas Zona 2 (153 bpm). Pelankan pace easy run — HR yang menentukan, bukan pace.");
if(cw==0)m.push("Program mulai 16 Nov 2026. Minggu ini: lari santai 2-3x, 5 km, tanpa dorong.");
if(ADJ<1)m.push("Volume minggu lalu di bawah rencana, jadi minggu-minggu ke depan diturunkan ±10% agar tubuh beradaptasi.");
if(!m.length)m.push("Konsisten dan terkontrol. Pertahankan ritme, jangan menambah jarak di luar rencana.");
return m}
ADJ=adj();
const P=plan(),today=iso(new Date());
const prs=t=>t.split(":").reduce((a,x)=>a*60+ +x,0);
function status(s,runs,others,today){if(s.type=="str")return others.some(x=>x.d==s.date)?"done":s.date<today?"miss":"todo";
const r=runs.filter(x=>x.d==s.date).reduce((a,x)=>a+x.km,0);return r>=s.km*.7?"done":r>0?"part":s.date<today?"miss":"todo"}
