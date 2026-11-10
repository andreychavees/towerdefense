const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}

// ---- status das novas classes ----
rep("if(c.cls==='mage')r*=1.35;if(c.cls==='knight')r*=0.88;","if(c.cls==='mage')r*=1.35;if(c.cls==='knight')r*=0.88;if(c.cls==='archer')r*=1.55;if(c.cls==='bomber')r*=1.2;");
rep("if(c.cls==='mage')d=Math.round(d*1.1);","if(c.cls==='mage')d=Math.round(d*1.1);if(c.cls==='archer')d=Math.max(1,Math.round(d*0.8));if(c.cls==='bomber')d=Math.round(d*2.2);");
rep("const CLS_INFO={knight:{name:'Cavaleiro'},mage:{name:'Mago'}};","const CLS_INFO={knight:{name:'Cavaleiro'},mage:{name:'Mago'},archer:{name:'Arqueiro'},bomber:{name:'Artilheiro'}};");
rep("function tierCol(c){return c.cls==='knight'?'#6fa8ff':c.cls==='mage'?'#c07bff':","function tierCol(c){return c.cls==='knight'?'#6fa8ff':c.cls==='mage'?'#c07bff':c.cls==='archer'?'#7bd66a':c.cls==='bomber'?'#ffa24a':");
rep("  if(c.cls==='mage')return c.lvl>=7?'crystal':'orb';","  if(c.cls==='mage')return c.lvl>=7?'crystal':'orb';\n  if(c.cls==='archer')return 'bow';\n  if(c.cls==='bomber')return 'cannon';");
rep("const WEAPON_NAME={","const WEAPON_NAME={bow:'Arco Longo',cannon:'Canhão de Mão',");

// ---- logica de ataque a distancia (mago, arqueiro, artilheiro) ----
{const a=s.indexOf('function mageUpdate(c,dt){'),b=s.indexOf('function update(dt){');if(a<0||b<0)throw new Error('markers');
s=s.slice(0,a)+`const RANGED={
  mage:{rate:l=>Math.max(.35,.75-.05*l),speed:300,splash:40,sp:.5,label:'Bola de fogo (área)'},
  archer:{rate:l=>Math.max(.22,.5-.04*l),speed:560,splash:0,sp:0,label:'Flechas (crítico 20%)'},
  bomber:{rate:l=>Math.max(.9,1.6-.06*l),speed:210,splash:62,sp:.6,label:'Bomba (área grande)'}
};
// armadura do inimigo: reduz dano fisico (espada/flecha), bomba perfura
function armorDmg(t,d,k){
  if(!worm||t.kind==='jar'||!worm.armor)return d;
  if(k==='knight'||k==='archer')return Math.max(1,Math.round(d*(1-0.15*worm.armor)));
  if(k==='bomber')return Math.round(d*(1+0.25*worm.armor));
  return d;
}
function mageUpdate(c,dt){
  const P=RANGED[c.cls];
  c.cd-=dt;c.cast=Math.max(0,(c.cast||0)-dt*5);
  const R=range(c);let tgt=null;
  if(worm)for(const t of worm.segs){if(t.hp<=0)continue;const p=targetPos(t);if(!p||p.y<8)continue;if(Math.hypot(p.x-c.x,p.y-c.y)<=R){tgt=t;break;}}
  if(!tgt)for(const j of jars){if(j.hp<=0||j.d>PLEN-JAR_SAFE)continue;const p=targetPos(j);if(p&&Math.hypot(p.x-c.x,p.y-c.y)<=R){tgt=j;break;}}
  if(!tgt)return;
  const tp=targetPos(tgt);c.aim=Math.atan2(tp.y-c.y,tp.x-c.x);
  if(c.cd<=0){c.cd=P.rate(c.lvl);c.cast=1;
    let dmg=catDmg(c),crit=false;if(c.cls==='archer'&&Math.random()<0.2){dmg*=2;crit=true;}
    projs.push({x:c.x+Math.cos(c.aim)*26,y:c.y+Math.sin(c.aim)*26,t:tgt,k:c.cls,dmg,crit,rot:c.aim,big:c.lvl>=7});}
}
function updateProjs(dt){
  for(const p of projs){
    const P=RANGED[p.k];
    const tp=p.t.hp>0?targetPos(p.t):null;
    if(!tp){p.dead=true;continue;}
    const dx=tp.x-p.x,dy=tp.y-p.y,dd=Math.hypot(dx,dy),sp=P.speed*dt;
    p.rot=Math.atan2(dy,dx);
    if(p.k!=='archer')parts.push({x:p.x,y:p.y,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,life:.25,c:p.k==='mage'?(Math.random()<.5?'#ff9a2a':'#ffd23a'):'#8a8f9a'});
    if(dd<=sp+8){
      const real=armorDmg(p.t,p.dmg,p.k);
      dmgObj(p.t,real,tp);if(p.crit)texts.push({x:tp.x,y:tp.y-28,s:'CRÍTICO!',life:.6});
      if(p.t.hp<=0&&p.t.head)shake=6;
      if(p.k==='mage'&&worm&&p.t.kind!=='jar')worm.slow=0.8;
      if(P.splash){
        const rad=P.splash*(p.big?1.3:1),sp2=Math.max(1,Math.ceil(p.dmg*P.sp)),cand=jars.slice();if(worm)cand.push(...worm.segs);
        for(const t of cand){if(t===p.t||t.hp<=0||(t.kind==='jar'&&t.d>PLEN-JAR_SAFE))continue;const q=targetPos(t);if(q&&Math.hypot(q.x-tp.x,q.y-tp.y)<rad)dmgObj(t,armorDmg(t,sp2,p.k),q);}
        burst(tp.x,tp.y,p.k==='bomber'?22:14,p.k==='bomber'?['#444','#ff7a1a','#ffd23a','#888']:['#ff7a1a','#ffd23a','#ff4a1a']);
        if(p.k==='bomber')shake=Math.max(shake,3);
      }else burst(tp.x,tp.y,5,['#e8d9a8','#fff']);
      p.dead=true;
    }else{p.x+=dx/dd*sp;p.y+=dy/dd*sp;}
  }
  projs=projs.filter(p=>!p.dead);
}
`+s.slice(b);}
rep("if(c.cls==='mage'){mageUpdate(c,dt);continue;}","if(RANGED[c.cls]){mageUpdate(c,dt);continue;}");
rep("dmgObj(t,catDmg(c),p);if(c.cls==='mage'&&worm&&t.kind!=='jar')worm.slow=0.8;","dmgObj(t,c.cls==='knight'?armorDmg(t,catDmg(c),'knight'):catDmg(c),p);");

// ---- desenho dos projeteis ----
{const a=s.indexOf("for(const p of projs){const r=(p.big?11:8)"),b=s.indexOf("parts.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*2)");if(a<0||b<0)throw new Error('proj markers');
s=s.slice(0,a)+`for(const p of projs){
    if(p.k==='archer'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.strokeStyle='#3a2614';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(8,0);ctx.stroke();
      ctx.strokeStyle='#d9b57a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(8,0);ctx.stroke();
      ctx.fillStyle=p.crit?'#ffd23a':'#cfd6e0';ctx.strokeStyle='#3a2614';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(6,-4);ctx.lineTo(6,4);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#e8404f';ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-19,-4);ctx.lineTo(-10,-1);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-19,4);ctx.lineTo(-10,1);ctx.closePath();ctx.fill();
      ctx.restore();
    }else if(p.k==='bomber'){
      ctx.fillStyle='#22262e';ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,9,0,6.28);ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(p.x-3,p.y-3,2.5,0,6.28);ctx.fill();
      ctx.strokeStyle='#d9b57a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+3,p.y-8);ctx.lineTo(p.x+7,p.y-13);ctx.stroke();
      ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(p.x+7+Math.sin(now*40),p.y-13,2.6,0,6.28);ctx.fill();
    }else{
      const r=(p.big?11:8)+Math.sin(now*30)*1.2;
      const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,r*2.1);g.addColorStop(0,'rgba(255,250,200,1)');g.addColorStop(.35,'rgba(255,170,40,.95)');g.addColorStop(1,'rgba(255,60,20,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*2.1,0,6.28);ctx.fill();
      ctx.fillStyle='#fff4b0';ctx.beginPath();ctx.arc(p.x,p.y,r*.55,0,6.28);ctx.fill();
    }
  }
  `+s.slice(b);}

// ---- armas novas: arco e canhao ----
rep("  if(style==='club'){ // clava de madeira",
`  if(style==='bow'){ // arco longo com flecha encaixada
    ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(16,-16);ctx.quadraticCurveTo(36,0,16,16);ctx.stroke();
    ctx.strokeStyle='#b9803f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(16,-16);ctx.quadraticCurveTo(36,0,16,16);ctx.stroke();
    ctx.strokeStyle='#fff';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(16,-16);ctx.lineTo(10,0);ctx.lineTo(16,16);ctx.stroke();
    ctx.strokeStyle='#8a5a2b';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len+6,0);ctx.stroke();
    ctx.fillStyle='#cfd6e0';ctx.strokeStyle=OUT;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(len+12,0);ctx.lineTo(len+3,-4);ctx.lineTo(len+3,4);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(style==='cannon'){ // canhao de mao
    ctx.fillStyle='#4a4f5c';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;rr(ctx,10,-8,len-2,16,5);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f2c94c';ctx.fillRect(18,-8,3,16);ctx.fillRect(len-8,-8,3,16);
    ctx.fillStyle='#14171d';ctx.beginPath();ctx.ellipse(len+6,0,3.5,8,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.fillStyle='#6b3a1a';ctx.beginPath();ctx.arc(16,9,5.5,0,6.28);ctx.fill();ctx.stroke();
  }else if(style==='club'){ // clava de madeira`);
rep("if(cls==='mage'&&!lifted){ // cajado apontado","if(RANGED[cls]&&!lifted){ // arma apontada");
rep("leekShape(34,weaponStyle(c));\n    if((c.cast||0)>0)","leekShape(cls==='bomber'?30:34,weaponStyle(c));\n    if((c.cast||0)>0)");
rep("const n=cls==='mage'?0:leeks(c);","const n=RANGED[cls]?0:leeks(c);");

// ---- armaduras das novas classes ----
rep("if(arm==='vet'||cls){\n    ctx.fillStyle=cls==='mage'?'#3d1d70':cls==='knight'?'#c0392b':'#b03030';","if(arm==='vet'||cls){\n    ctx.fillStyle=cls==='mage'?'#3d1d70':cls==='knight'?'#c0392b':cls==='archer'?'#2f7a3a':cls==='bomber'?'#6b3a1a':'#b03030';");
rep("const bootCol=(arm==='cloth'||arm==='leather')?'#fff3e0':arm==='mage'?'#5a2b99':'#8d9bb0';","const bootCol=(arm==='cloth'||arm==='leather')?'#fff3e0':arm==='mage'?'#5a2b99':arm==='archer'?'#6b4420':arm==='bomber'?'#4a4f5c':'#8d9bb0';");
rep("    else if(arm==='leather'){ctx.save();torso();ctx.clip();",
`    else if(arm==='archer'){ // tunica verde, cinto e aljava
      ctx.save();torso();ctx.clip();ctx.fillStyle='#3f9a3f';ctx.fillRect(-12,6,24,22);ctx.fillStyle='#2a6a2c';ctx.fillRect(-12,6,24,4);
      ctx.fillStyle='#6b4420';ctx.fillRect(-12,17,24,3.5);ctx.fillStyle='#f2c94c';ctx.fillRect(-2,16.5,4,4.5);ctx.restore();torso();ctx.stroke();
      ctx.save();ctx.translate(11,6);ctx.rotate(.5);ctx.fillStyle='#8a5a2b';ctx.strokeStyle=OUT;ctx.lineWidth=2;rr(ctx,-3,-2,7,16,2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#e8404f';ctx.fillRect(-2,-6,2,5);ctx.fillRect(1,-5,2,4);ctx.restore();
    }else if(arm==='bomber'){ // colete laranja com bombas
      ctx.save();torso();ctx.clip();ctx.fillStyle='#d9631f';ctx.fillRect(-12,6,24,22);ctx.fillStyle='#7a3410';ctx.fillRect(-12,18,24,3);ctx.restore();torso();ctx.stroke();
      ctx.fillStyle='#22262e';ctx.strokeStyle='#000';ctx.lineWidth=1.5;for(const bx of[-6,0,6]){ctx.beginPath();ctx.arc(bx,18.5,3,0,6.28);ctx.fill();ctx.stroke();ctx.strokeStyle='#ffd23a';ctx.beginPath();ctx.moveTo(bx,15.5);ctx.lineTo(bx+1.5,13.5);ctx.stroke();ctx.strokeStyle='#000';}
    }else if(arm==='leather'){ctx.save();torso();ctx.clip();`);
rep("  }else if(arm==='mage'){\n    ctx.fillStyle='#5a2b99'",
`  }else if(arm==='archer'){ // capuz verde com pena
    ctx.fillStyle='#2f8a3a';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(0,-5,18.5,11,0,Math.PI,0);ctx.lineTo(17,-1);ctx.quadraticCurveTo(0,-9,-17,-1);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#1f6a2a';ctx.beginPath();ctx.moveTo(-12,-13);ctx.lineTo(0,-24);ctx.lineTo(12,-13);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ff5a4a';ctx.strokeStyle=OUT;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(8,-14);ctx.quadraticCurveTo(22,-26,26,-12);ctx.quadraticCurveTo(16,-18,9,-10);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(arm==='bomber'){ // capacete de couro com oculos de latao
    ctx.fillStyle='#8a5a2b';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,-5,18.5,10.5,0,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#5a3a1b';ctx.fillRect(-17,-8,34,4);
    for(const sx of[-1,1]){ctx.fillStyle='#bfe8ff';ctx.strokeStyle='#c99a3a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx*8,-9,5.5,0,6.28);ctx.fill();ctx.stroke();ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(sx*8-1.5,-10.5,1.6,0,6.28);ctx.fill();}
  }else if(arm==='mage'){
    ctx.fillStyle='#5a2b99'`);
rep("cls?(cls==='mage'?'#7b3fc4':'#2a63d8'):'#2f9e44'","cls?(({mage:'#7b3fc4',archer:'#2f8f3a',bomber:'#c4561c'})[cls]||'#2a63d8'):'#2f9e44'");
rep("(c.cls==='mage'?'   Bola de fogo (área)':'   Lâminas '+leeks(c))","(RANGED[c.cls]?'   '+RANGED[c.cls].label:'   Lâminas '+leeks(c))");

// ---- tela de escolha: 4 classes em grade 2x2 ----
{const a=s.indexOf('const CARDS=['),b=s.indexOf('function drawJar(');if(a<0||b<0)throw new Error('cards markers');
s=s.slice(0,a)+`const CARDS=[
  {k:'knight',x:12,y:128,w:164,h:236,title:'Cavaleiro',tag:'Corpo a corpo',desc:['Dano muito alto','Espadas giratórias','Armadura pesada'],c0:'#2a4a8c',c1:'#8fb4ff'},
  {k:'mage',x:184,y:128,w:164,h:236,title:'Mago',tag:'Magia',desc:['Bola de fogo em área','Deixa a minhoca lenta','Ignora armadura'],c0:'#4a2a7c',c1:'#c79bff'},
  {k:'archer',x:12,y:374,w:164,h:236,title:'Arqueiro',tag:'Longo alcance',desc:['Alcance gigante','Tiro muito rápido','Crítico 20% (x2)'],c0:'#1f5a2a',c1:'#86e07a'},
  {k:'bomber',x:184,y:374,w:164,h:236,title:'Artilheiro',tag:'Explosivos',desc:['Bomba em área grande','Perfura armadura','Disparo lento'],c0:'#7a3a12',c1:'#ffb36a'}
];
function drawChoice(){
  ctx.fillStyle='rgba(8,12,20,.86)';ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';ctx.font='900 21px system-ui';ctx.lineWidth=5;ctx.strokeStyle='#000';ctx.fillStyle='#ffe066';
  ctx.strokeText('Nível 5 alcançado!',W/2,72);ctx.fillText('Nível 5 alcançado!',W/2,72);
  ctx.font='14px system-ui';ctx.fillStyle='#dfe8f5';ctx.fillText('Escolha a classe deste gato',W/2,98);
  for(const cd of CARDS){
    const gr=ctx.createLinearGradient(0,cd.y,0,cd.y+cd.h);gr.addColorStop(0,cd.c0);gr.addColorStop(1,'#141a2c');
    ctx.fillStyle=gr;ctx.strokeStyle=cd.c1;ctx.lineWidth=3;rr(ctx,cd.x,cd.y,cd.w,cd.h,16);ctx.fill();ctx.stroke();
    ctx.textAlign='center';ctx.font='900 17px system-ui';ctx.fillStyle='#fff';ctx.fillText(cd.title,cd.x+cd.w/2,cd.y+24);
    ctx.font='11px system-ui';ctx.fillStyle=cd.c1;ctx.fillText(cd.tag,cd.x+cd.w/2,cd.y+39);
    ctx.save();ctx.translate(cd.x+cd.w/2,cd.y+95);ctx.scale(1.7,1.7);drawCat({id:0,lvl:5,cls:cd.k,ang:0,pop:0,aim:0},0,0,false,true);ctx.restore();
    ctx.font='12px system-ui';ctx.fillStyle='#e6eefc';
    cd.desc.forEach((t,i)=>ctx.fillText('• '+t,cd.x+cd.w/2,cd.y+150+i*17));
    ctx.fillStyle='#ffb02e';rr(ctx,cd.x+22,cd.y+cd.h-40,cd.w-44,28,9);ctx.fill();
    ctx.font='900 13px system-ui';ctx.fillStyle='#4a2a00';ctx.fillText('ESCOLHER',cd.x+cd.w/2,cd.y+cd.h-21);
  }
}

`+s.slice(b);}
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
