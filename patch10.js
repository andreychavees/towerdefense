const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}
// ---- corrige armadura sobre o sprite do dragao ----
rep("  if(armor>0){\n    const mc=ARMOR_COL","  if(armor>0&&!(type==='dragon'&&head&&dragonReady>=20)){\n    const mc=ARMOR_COL");
rep("function drawDragonSprite(r,variant){","function drawDragonSprite(r,variant,armor){");
rep("ctx.save();ctx.filter=DRAGON_FILTER[variant||'fire']||'none';","ctx.save();ctx.filter=(DRAGON_FILTER[variant||'fire']||'none').replace(/^none$/,'')+(armor>0?' drop-shadow(0 0 3px '+ARMOR_COL[Math.min(armor,3)]+') drop-shadow(0 0 2px '+ARMOR_COL[Math.min(armor,3)]+')':'')||'none';");
rep("if(!drawDragonSprite(r,worm&&worm.variant))","if(!drawDragonSprite(r,worm&&worm.variant,worm&&worm.armor))");

// ---- cavaleiro com sprite ----
rep("const DRAGON_IMGS=[];",`const KN_IDLE=[],KN_ATK=[];let knightReady=0;
for(let i=0;i<40;i++){const im=new Image();im.onload=()=>knightReady++;im.src='assets/knight/Knight-Idle_'+String(i).padStart(2,'0')+'.png';KN_IDLE.push(im);}
for(let i=0;i<14;i++){const im=new Image();im.onload=()=>knightReady++;im.src='assets/knight/Knight-Attack_'+String(i).padStart(2,'0')+'.png';KN_ATK.push(im);}
function drawKnight(c,x,y,lifted,preview){
  const lvl=c.lvl,tc=tierCol(c);
  ctx.save();ctx.translate(x,y);
  if(lvl>=3){const R=26+lvl*3,gr=ctx.createRadialGradient(0,0,6,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}
  if(!lifted&&!preview){
    if(selected===c){ctx.fillStyle='rgba(255,255,255,.10)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(0,0,melee(c),0,6.28);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
    const n=leeks(c);
    for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(melee(c)+4,weaponStyle(c));ctx.restore();}
  }
  const sc=1+(c.pop||0)*0.4+(lvl-1)*0.04;ctx.scale(sc,sc);
  if(lifted)ctx.translate(0,-8);
  const pg=ctx.createRadialGradient(0,26,2,0,26,24);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,26,25,9.5,0,0,6.2832);ctx.fill();
  ctx.strokeStyle=tc;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,26,18,6.5,0,0,6.2832);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,26,14,4.6,0,0,6.28);ctx.fill();
  const atk=(c.atk||0)>0,im=atk?KN_ATK[Math.min(13,Math.floor((1-c.atk/0.5)*14))]:KN_IDLE[Math.floor(now*20+c.id*3)%40];
  const w=132,h=w*545/660;
  ctx.drawImage(im,-w*.5,26-h*.86,w,h);
  ctx.restore();
  ctx.fillStyle='#2a63d8';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;const bx=x-23*Math.min(1.4,1+(lvl-1)*0.04);
  ctx.beginPath();ctx.arc(bx,y-22,9,0,6.28);ctx.fill();ctx.stroke();
  ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,bx,y-18);
  if(!preview){ctx.font='bold 10px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText('Cavaleiro',x,y+40);ctx.fillText('Cavaleiro',x,y+40);}
}
const DRAGON_IMGS=[];`);
rep("  const arm=cls||(lvl>=4?'vet'","  if(cls==='knight'&&knightReady>=54)return drawKnight(c,x,y,lifted,preview);\n  const arm=cls||(lvl>=4?'vet'");
rep("t.last[key]=now;dmgObj(t,c.cls==='knight'","t.last[key]=now;if(c.cls==='knight')c.atk=0.5;dmgObj(t,c.cls==='knight'");
rep("    c.pop=Math.max(0,c.pop-dt*4);","    c.pop=Math.max(0,c.pop-dt*4);c.atk=Math.max(0,(c.atk||0)-dt);");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
