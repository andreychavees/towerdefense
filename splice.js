const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
const a=s.indexOf('// ---------- Desenho ----------'),b=s.indexOf('function draw(){');
if(a<0||b<0)throw new Error('marcadores nao achados');
s=s.slice(0,a)+fs.readFileSync('art.js','utf8')+'\n'+s.slice(b);
fs.writeFileSync('gatos-vs-minhoca.html',s);
console.log('ok');
