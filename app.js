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
const nextS=P.find(s=>s.date>=today&&s.type!="str")||P[P.length-1];
function bars(el,obj,max,unit){const k=Object.keys(obj).sort().slice(-12),W=560,H=170,bw=W/k.length;
el.innerHTML=`<svg viewBox="0 0 ${W} ${H+24}" role="img" aria-label="Mileage mingguan">`+k.map((x,i)=>{const h=obj[x]/max*H;return `<rect x="${i*bw+6}" y="${H-h}" width="${bw-12}" height="${h}" rx="5" fill="var(--ac)"/><text x="${i*bw+bw/2}" y="${H-h-5}" text-anchor="middle" font-size="11" fill="var(--tx)">${obj[x].toFixed(0)}</text><text x="${i*bw+bw/2}" y="${H+16}" text-anchor="middle" font-size="10" fill="var(--mu)">${x.slice(5)}</text>`}).join("")+"</svg>"}
function hrChart(el){const r=runs.filter(x=>x.hr).reverse(),W=560,H=150,lo=120,hi=175,y=v=>H-(v-lo)/(hi-lo)*H;
el.innerHTML=`<svg viewBox="0 0 ${W} ${H+24}"><rect x="0" y="${y(153)}" width="${W}" height="${y(124)-y(153)}" fill="var(--ok)" opacity=".18"/><text x="4" y="${y(153)+13}" font-size="10" fill="var(--mu)">Zona 2 (124-153)</text>`+r.map((x,i)=>{const cx=40+i*(W-80)/Math.max(1,r.length-1);return `<circle cx="${cx}" cy="${y(x.hr)}" r="6" fill="${x.hr>153?"var(--wa)":"var(--ac)"}"/><text x="${cx}" y="${y(x.hr)-10}" text-anchor="middle" font-size="11" fill="var(--tx)">${x.hr}</text><text x="${cx}" y="${H+16}" text-anchor="middle" font-size="10" fill="var(--mu)">${x.d.slice(5)}</text>`}).join("")+"</svg>"}
const sd=s=>new Date(s.date+"T"+s.time);
const fmtD=s=>new Date(s+"T00:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"short"});
function card(s){return `<div class="card"><b>${s.t}</b> · ${fmtD(s.date)} ${s.time}${s.km?" · "+s.km+" km":""}<ol>${s.steps.map(x=>`<li>${x}</li>`).join("")}</ol><p class="mu">${s.fuel}</p><button onclick="cp('${s.date}','${s.type}')">Salin untuk Huawei</button></div>`}
window.cp=(d,t)=>{const s=P.find(x=>x.date==d&&x.type==t);navigator.clipboard.writeText(`${s.t} ${s.km||""}km\n`+s.steps.map((x,i)=>(i+1)+". "+x).join("\n"));alert("Tersalin. Buat Kursus Lari kustom di Huawei Health dan tempel langkahnya.")};
function dash(){const l=runs[0],tot=runs.reduce((a,r)=>a+r.km,0);
$("#dash").innerHTML=`<div class="g"><div class="card"><h3>Aktivitas terakhir</h3><b>${l.n}</b><p>${fmtD(l.d)}<br>${l.km} km · ${fp(l.pace)}/km${l.hr?" · HR "+l.hr:""}</p></div>
<div class="card"><h3>Aktivitas berikutnya</h3>${nextS?`<b>${nextS.t}</b><p>${fmtD(nextS.date)} ${nextS.time}<br>${nextS.km} km · alarm 04:00</p>`:""}</div></div>
<div class="card"><h3>Pesan Coach AI</h3>${coachMsg().map(m=>"<p>"+m+"</p>").join("")}</div>
<div class="card"><h3>Mileage mingguan (km)</h3><div id="b"></div></div><div class="card"><h3>Heart rate rata-rata per lari</h3><div id="h"></div><p class="mu">Biru = Zona 2. Oranye = di atas zona, pelankan.</p></div>`;
bars($("#b"),wk,Math.max(...Object.values(wk)),"km");hrChart($("#h"))}
function tl(){const cw=currentWeek();let h=`<div class="card"><h3>Target marathon ${RACE}: 4:30 (rentang 4:20-4:40)</h3><p>Riegel dari half marathon 2:05:25 memberi ±4:21, lalu saya tambah margin karena long run terpanjang baru 15 km. Metode: MAF/Zona 2 sebagai basis, tempo ringan di fase Build, 4 hari lari + 2 strength per minggu, minggu recovery tiap 4 minggu.</p><button onclick="ics()">Unduh jadwal (.ics, alarm 04:00 & 19:00)</button></div>`;
for(let w=1;w<=30;w++){const ss=P.filter(s=>s.w==w);h+=`<details ${w==Math.max(1,cw)?"open":""}><summary>Minggu ${w} · ${phase(w)} · ${ss.filter(s=>s.type!="str").reduce((a,s)=>a+s.km,0).toFixed(0)} km</summary>${ss.map(card).join("")}</details>`}$("#tl").innerHTML=h}
window.ics=()=>{const f=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+"T"+pad(d.getHours())+pad(d.getMinutes())+"00";
let o="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//run-coach//ID\r\n";
P.forEach((s,i)=>{const a=sd(s),b=new Date(a.getTime()+(s.type=="str"?45:s.type=="race"?330:s.km>15?210:70)*6e4);
o+=`BEGIN:VEVENT\r\nUID:rc${i}@run-coach\r\nDTSTAMP:20261109T000000Z\r\nDTSTART;TZID=Asia/Jakarta:${f(a)}\r\nDTEND;TZID=Asia/Jakarta:${f(b)}\r\nSUMMARY:${s.t}${s.km?" "+s.km+" km":""}\r\nDESCRIPTION:${s.steps.join(" | ").replace(/[,;]/g," ")}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${s.t}\r\nTRIGGER:-PT${s.type=="str"?30:60}M\r\nEND:VALARM\r\nEND:VEVENT\r\n`});
const u=URL.createObjectURL(new Blob([o+"END:VCALENDAR"],{type:"text/calendar"})),a=document.createElement("a");a.href=u;a.download="training.ics";a.click()};
function ach(){const ks=Object.keys(wk).sort().reverse();let streak=0;for(let i=0;i<ks.length;i++){if(i==0||(new Date(ks[i-1])-new Date(ks[i]))==6048e5)streak++;else break}
const tot=runs.reduce((a,r)=>a+r.km,0),lg=Math.max(...runs.map(r=>r.km));
const L=[["🥇","Half Marathon finisher","2:05:25 — selesai",1,1],["⚡","PR 5K","25:22",1,1],["📏","Long run 15 km","terpanjang "+lg+" km",Math.min(lg,15),15],["🚀","Long run 20 km","menuju 20 km",Math.min(lg,20),20],["🏔️","Long run 30 km","tantangan puncak",Math.min(lg,30),30],["🔥","Lari 4 minggu berturut","streak "+streak+" minggu",Math.min(streak,4),4],["📅","100 km tercatat","total di dashboard "+tot.toFixed(0)+" km",Math.min(tot,100),100],["🏅","MARATHON FINISHER","13 Jun 2027",0,1]];
$("#ach").innerHTML=`<div class="g">`+L.map(([i,t,s,v,m])=>`<div class="card ${v>=m?"":"lock"}"><div class="ic">${i}</div><b>${t}</b><p class="mu">${s}</p><div class="pb"><i style="width:${v/m*100}%"></i></div></div>`).join("")+"</div>"}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("section").forEach(s=>s.hidden=s.id!=b.dataset.t);document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("on",x==b))});
dash();tl();ach();
