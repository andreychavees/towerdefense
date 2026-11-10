const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("function drawJar(j){",`let JAR_SPR=null;
loadImg('assets/art/pote.webp').then(im=>{if(im)JAR_SPR=sheetToSprites(im,1,1,{maxH:200})[0];});
function drawJar(j){
  if(JAR_SPR){
    const p=posAt(j.d),h=44,w=h*JAR_SPR.w/JAR_SPR.h,safe=j.d>PLEN-JAR_SAFE;
    ctx.save();ctx.translate(p.x,p.y+Math.sin(now*4+j.d*.05)*1);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,h*.4,w*.34,h*.08,0,0,6.28);ctx.fill();
    if(j.flash>0)ctx.filter='brightness(1.8)';
    if(safe)ctx.globalAlpha=.85;
    ctx.drawImage(JAR_SPR.c,-w/2,-h*.55,w,h);ctx.restore();
    ctx.font='900 17px system-ui';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#000';ctx.fillStyle=safe?'#9aa':'#fff';
    const t=safe?'🔒':j.hp;ctx.strokeText(t,p.x,p.y-h*.55-3);ctx.fillText(t,p.x,p.y-h*.55-3);
    return;
  }`);
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
