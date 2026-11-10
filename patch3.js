const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}

// 1) inimigos + HUD (substitui stoneSeg/drawWorm antigos)
{const a=s.indexOf('function stoneSeg('),b=s.indexOf('function draw(){');if(a<0||b<0)throw new Error('markers');
 s=s.slice(0,a)+fs.readFileSync('extra.js','utf8')+'\n'+s.slice(b);}

// 2) armas novas
rep("const style=cls==='knight'?'sword':cls==='mage'?'orb':'leek';","const style=weaponStyle(c);");
rep("  if(style==='sword'){ // espada de aco com guarda dourada",
`  if(style==='club'){ // clava de madeira
    ctx.strokeStyle=OUT;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len,0);ctx.stroke();
    ctx.strokeStyle='#b9803f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-4,0);ctx.stroke();
    ctx.fillStyle='#b9803f';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(len-6,0,12,7.5,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#8a5a2b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(len-12,-4);ctx.lineTo(len-2,-4);ctx.moveTo(len-12,4);ctx.lineTo(len-2,4);ctx.stroke();
  }else if(style==='axe'){ // machado
    ctx.strokeStyle=OUT;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-4,0);ctx.stroke();
    ctx.strokeStyle='#8a5a2b';ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-4,0);ctx.stroke();
    const g2=ctx.createLinearGradient(0,-14,0,14);g2.addColorStop(0,'#f4f8ff');g2.addColorStop(1,'#8f9db3');
    ctx.fillStyle=g2;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(len-16,-3);ctx.lineTo(len-12,-15);ctx.quadraticCurveTo(len+8,-10,len+8,0);ctx.quadraticCurveTo(len+8,10,len-12,15);ctx.lineTo(len-16,3);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(style==='mace'){ // maca com espinhos
    ctx.strokeStyle=OUT;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-6,0);ctx.stroke();
    ctx.strokeStyle='#6b6f7a';ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-6,0);ctx.stroke();
    ctx.fillStyle='#8d9bb0';ctx.strokeStyle=OUT;ctx.lineWidth=2;
    for(let a=0;a<8;a++){const an=a*0.785;ctx.save();ctx.translate(len,0);ctx.rotate(an);ctx.beginPath();ctx.moveTo(6,-3);ctx.lineTo(15,0);ctx.lineTo(6,3);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    const g3=ctx.createRadialGradient(len-3,-3,1,len,0,9);g3.addColorStop(0,'#fff');g3.addColorStop(1,'#7c8aa0');ctx.fillStyle=g3;ctx.beginPath();ctx.arc(len,0,8,0,6.28);ctx.fill();ctx.stroke();
  }else if(style==='greatsword'){ // espadao dourado
    ctx.strokeStyle=OUT;ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(len+4,0);ctx.stroke();
    const g4=ctx.createLinearGradient(0,-6,0,6);g4.addColorStop(0,'#fffbe0');g4.addColorStop(1,'#e9c24a');
    ctx.strokeStyle=g4;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(len,0);ctx.stroke();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,-1);ctx.lineTo(len-4,-1);ctx.stroke();
    ctx.strokeStyle='#d03a3a';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(16,-11);ctx.lineTo(16,11);ctx.stroke();
  }else if(style==='crystal'){ // cajado de cristal
    ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-10,0);ctx.stroke();
    ctx.strokeStyle='#c9b8ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-10,0);ctx.stroke();
    const g5=ctx.createRadialGradient(len,0,1,len,0,18);g5.addColorStop(0,'rgba(120,255,255,.9)');g5.addColorStop(1,'rgba(180,80,255,0)');ctx.fillStyle=g5;ctx.beginPath();ctx.arc(len,0,18,0,6.28);ctx.fill();
    const g6=ctx.createLinearGradient(len-8,-9,len+10,9);g6.addColorStop(0,'#aef6ff');g6.addColorStop(1,'#ff9be8');ctx.fillStyle=g6;ctx.strokeStyle=OUT;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(len+11,0);ctx.lineTo(len,-9);ctx.lineTo(len-9,0);ctx.lineTo(len,9);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(style==='sword'){ // espada de aco com guarda dourada`);
rep("  ctx.restore();\n  // selo de nivel","  if(lvl>=8){ctx.strokeStyle='#ffe066';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,cls==='mage'?-50:-31,12,4,0,0,6.28);ctx.stroke();}\n  ctx.restore();\n  // selo de nivel");

// 3) logica: ondas, tipos de inimigo, armadura, vidas, potes raros
rep(`function startWave(){
  wave++;
  const n=7+wave*2,segs=[];
  for(let i=0;i<n;i++){const hp=1+Math.floor(wave/2)+(Math.random()<0.2?2:0);segs.push({hp,max:hp,head:false,flash:0,last:{}});}
  const hh=18+wave*14;segs.unshift({hp:hh,max:hh,head:true,flash:0,last:{}});
  worm={segs,d:-10,speed:15+wave*1.2,gap:21};state='fight';
}`,
`function startWave(){
  wave++;
  const et=ENEMY_TYPES[(wave-1)%4],armor=Math.floor((wave-1)/4),boss=et.k==='dragon';
  const mult=(1+0.5*armor)*(boss?1.5:1); // armadura e chefe aumentam a vida
  const n=7+wave*2+(boss?4:0),segs=[];
  for(let i=0;i<n;i++){const hp=Math.max(1,Math.round((1+Math.floor(wave/2)+(Math.random()<0.2?2:0))*mult));segs.push({hp,max:hp,head:false,flash:0,last:{}});}
  const hh=Math.round((18+wave*14)*mult);segs.unshift({hp:hh,max:hh,head:true,flash:0,last:{}});
  const total=segs.reduce((a,x)=>a+x.hp,0);
  worm={segs,d:-10,speed:Math.min(40,(15+wave*1.2)*(boss?0.85:1)),gap:21,type:et.k,name:et.name,armor,boss,total};state='fight';
  texts.push({x:W/2,y:210,s:et.name+(armor?' blindado!':''),life:2.6,big:true});
}`);
rep("let choice=null;","let choice=null,lives=3,selected=null,paused=false;");
rep("jarTimer=3;wave=0;saved=0;","jarTimer=9;wave=0;saved=0;lives=3;selected=null;");
rep("  if(choice)return; // jogo pausado na escolha de classe","  if(choice||paused)return; // pausado (escolha de classe ou botao)");
rep("jarTimer-=dt;if(jarTimer<=0){spawnJar();jarTimer=5.5;}","jarTimer-=dt;if(jarTimer<=0){if(jars.length<2)spawnJar();jarTimer=16;}");
rep("if(worm.d>PLEN+10)state='over';}","if(worm.d>PLEN+10){lives--;shake=12;texts.push({x:W/2,y:300,s:'Vida perdida!',life:2,big:true});worm=null;state=lives<=0?'over':'between';timer=4;}}");

// 4) selecao de gato
rep("if(c){drag={cat:c,x:p.x,y:p.y};cv.setPointerCapture(e.pointerId);}","if(c){drag={cat:c,x:p.x,y:p.y,sx:p.x,sy:p.y};cv.setPointerCapture(e.pointerId);}else selected=null;");
rep("const c=drag.cat,x=drag.x,y=drag.y;drag=null;","const c=drag.cat,x=drag.x,y=drag.y,moved=Math.hypot(x-drag.sx,y-drag.sy)>8;drag=null;if(!moved){selected=c;return;}");
rep("if(other.lvl===5&&!other.cls)choice=other;}","if(other.lvl===5&&!other.cls)choice=other;selected=other;}");

// 5) botao pausar
rep('<button id="speed">⏩ x1</button>','<div style="display:flex;gap:10px"><button id="pause">⏸ Pausar</button><button id="speed">⏩ x1</button></div>');
rep("spd.onclick=()=>{gameSpeed=gameSpeed===1?2:gameSpeed===2?3:1;spd.textContent='⏩ x'+gameSpeed;};",
"spd.onclick=()=>{gameSpeed=gameSpeed===1?2:gameSpeed===2?3:1;spd.textContent='⏩ x'+gameSpeed;};\ndocument.getElementById('pause').onclick=function(){paused=!paused;this.textContent=paused?'▶ Continuar':'⏸ Pausar';};");

// 6) HUD no draw (troca barra antiga)
{const a=s.indexOf("  ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,H-34,W,34);"),b=s.indexOf("  if(state==='over'){\n    ctx.fillStyle='rgba(0,0,0,.65)'");
 if(a<0||b<0)throw new Error('hud markers');s=s.slice(0,a)+"  drawHUD();\n"+s.slice(b);}
rep("Você chegou à onda '+wave","Você chegou à onda '+wave");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
