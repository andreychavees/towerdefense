const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
rep("const WOLF_SPR=[null,null,null,null,null];",`const EVO5=[];
loadImg('assets/art/gato_evo.webp').then(im=>{if(!im)return;const cw=im.naturalWidth/5,out=[];
  for(let i=0;i<5;i++){const sp=cropCell(im,Math.round(i*cw),0,Math.round((i+1)*cw),im.naturalHeight);if(!sp)return;const c=shrink(sp.c,190);out.push({c,w:c.width,h:c.height});}
  out.forEach(x=>EVO5.push(x));});
const isSide=c=>c.cls==='wolf'||c.cls==='tiger'||(!c.cls&&EVO5.length===5);
const WOLF_SPR=[null,null,null,null,null];`);
rep("function spriteFor(c){","function spriteFor(c){\n  if(!c.cls&&EVO5.length===5)return EVO5[Math.max(0,Math.min(4,c.lvl-1))];");
rep("if((cls==='wolf'||cls==='tiger')&&w>50){h*=50/w;w=50;}","if(isSide(c)&&w>50){h*=50/w;w=50;}");
rep("if((cls==='wolf'||cls==='tiger')&&Math.cos(c.aim||0)<0)","if(isSide(c)&&Math.cos(c.aim||0)<0)");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
