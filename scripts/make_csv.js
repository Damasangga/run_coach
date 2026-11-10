const vm=require("vm"),fs=require("fs"),c={console};c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync("data.js","utf8")+fs.readFileSync("plan.js","utf8")+`;globalThis.OUT=P.map(s=>{
const sameDay=D.runs.filter(x=>x.d==s.date),actual=sameDay.reduce((a,x)=>a+x.km,0);
const pace=actual?Math.round(sameDay.reduce((a,x)=>a+x.pace*x.km,0)/actual):"";
const hrs=sameDay.filter(x=>x.hr).map(x=>x.hr),hr=hrs.length?Math.round(hrs.reduce((a,x)=>a+x,0)/hrs.length):"";
const phases={BASE:"🔵 BASE",BUILD:"🟣 BUILD",PEAK:"🔴 PEAK",TAPER:"🟡 TAPER"};
const types={str:"💪",run:"🏃",race:"🏁"};
const statuses={done:"✅ Selesai",part:"🟡 Parsial",miss:"❌ Terlewat",todo:"⏳ Akan datang"};
const date=s.date.split("-").reverse().join("/");
return [s.w,phases[s.ph]||s.ph,"📅 "+date,"🕒 "+s.time,types[s.type]+" "+s.t,s.type,s.km,statuses[status(s,D.runs,D.others||[],today)],actual?actual.toFixed(2):"",pace?fp(pace)+"/km":"",hr,s.steps.join(" | "),s.fuel]
})`,c);
const csv=value=>'"'+String(value??"").replace(/"/g,'""')+'"';
const header=["Minggu","Fase","Tanggal (dd/mm/yyyy)","Jam","Sesi","Jenis","Rencana (km)","Status","Aktual (km)","Pace aktual","HR rata-rata (bpm)","Rincian latihan","Fueling"];
fs.writeFileSync("timeline.csv",[header,...c.OUT].map(row=>row.map(csv).join(",")).join("\n")+"\n");
