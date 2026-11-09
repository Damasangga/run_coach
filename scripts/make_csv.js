const vm=require("vm"),fs=require("fs"),c={console};c.window=c;vm.createContext(c);
vm.runInContext(fs.readFileSync("data.js","utf8")+fs.readFileSync("plan.js","utf8")+`;globalThis.OUT=P.map(s=>{const r=D.runs.filter(x=>x.d==s.date),k=r.reduce((a,x)=>a+x.km,0);
return [s.w,s.ph,s.date,s.time,s.t,s.km,status(s,D.runs,D.others||[],today),k?k.toFixed(2):"",r[0]?fp(r[0].pace):"",r[0]&&r[0].hr||""].join(",")})`,c);
fs.writeFileSync("timeline.csv","week,phase,date,time,session,planned_km,status,actual_km,avg_pace,avg_hr\n"+c.OUT.join("\n")+"\n");
