const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}

// dano do mago
rep("if(c.cls==='mage')d=Math.max(1,Math.round(d*0.75));","if(c.cls==='mage')d=Math.round(d*1.1);");

// logica do mago: mira, dispara bola de fogo
rep("    c.ang+=dt*(6+c.lvl*0.4);\n    const n=leeks(c),R=range(c);",
`    c.ang+=dt*(6+c.lvl*0.4);
    if(c.cls==='mage'){mageUpdate(c,dt);continue;}
    const n=leeks(c),R=range(c);`);
rep("function update(dt){",
`function mageUpdate(c,dt){
  c.cd-=dt;c.cast=Math.max(0,(c.cast||0)-dt*5);
  const R=range(c);let tgt=null;
  // prioridade: o segmento mais a frente (mais perigoso) dentro do alcance; senao um pote liberado
  if(worm)for(const t of worm.segs){if(t.hp<=0)continue;const p=targetPos(t);if(!p||p.y<8)continue;if(Math.hypot(p.x-c.x,p.y-c.y)<=R){tgt=t;break;}}
  if(!tgt)for(const j of jars){if(j.hp<=0||j.d>PLEN-JAR_SAFE)continue;const p=targetPos(j);if(p&&Math.hypot(p.x-c.x,p.y-c.y)<=R){tgt=j;break;}}
  if(!tgt)return;
  const tp=targetPos(tgt);c.aim=Math.atan2(tp.y-c.y,tp.x-c.x);
  if(c.cd<=0){c.cd=Math.max(0.35,0.75-c.lvl*0.05);c.cast=1;
    projs.push({x:c.x+Math.cos(c.aim)*26,y:c.y+Math.sin(c.aim)*26,t:tgt,dmg:catDmg(c),big:c.lvl>=7});}
}
function updateProjs(dt){
  for(const p of projs){
    const tp=p.t.hp>0?targetPos(p.t):null;
    if(!tp){p.dead=true;continue;}
    const dx=tp.x-p.x,dy=tp.y-p.y,dd=Math.hypot(dx,dy),sp=300*dt;
    parts.push({x:p.x,y:p.y,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,life:.25,c:Math.random()<.5?'#ff9a2a':'#ffd23a'});
    if(dd<=sp+8){
      dmgObj(p.t,p.dmg,tp);if(p.t.hp<=0&&p.t.head)shake=6;
      if(worm&&p.t.kind!=='jar')worm.slow=0.8;
      // explosao em area
      const sp2=Math.max(1,Math.ceil(p.dmg*0.5)),cand=jars.slice();if(worm)cand.push(...worm.segs);
      for(const t of cand){if(t===p.t||t.hp<=0||(t.kind==='jar'&&t.d>PLEN-JAR_SAFE))continue;const q=targetPos(t);if(q&&Math.hypot(q.x-tp.x,q.y-tp.y)<(p.big?52:40))dmgObj(t,sp2,q);}
      burst(tp.x,tp.y,14,['#ff7a1a','#ffd23a','#ff4a1a']);p.dead=true;
    }else{p.x+=dx/dd*sp;p.y+=dy/dd*sp;}
  }
  projs=projs.filter(p=>!p.dead);
}
function update(dt){`);
rep("  // potes quebrados => gato entra no time","  updateProjs(dt);\n  // potes quebrados => gato entra no time");

// desenho: projetil = bola de fogo
rep("for(const p of projs){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.translate(-12,0);leekShape(24);ctx.restore();}",
`for(const p of projs){const r=(p.big?11:8)+Math.sin(now*30)*1.2;
    const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,r*2.1);g.addColorStop(0,'rgba(255,250,200,1)');g.addColorStop(.35,'rgba(255,170,40,.95)');g.addColorStop(1,'rgba(255,60,20,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*2.1,0,6.28);ctx.fill();
    ctx.fillStyle='#fff4b0';ctx.beginPath();ctx.arc(p.x,p.y,r*.55,0,6.28);ctx.fill();}`);

// cat: mago nao gira lamina; segura cajado apontado pro alvo
rep("    const n=leeks(c);\n    ctx.strokeStyle='rgba(255,255,255,.3)'","    const n=cls==='mage'?0:leeks(c);\n    ctx.strokeStyle='rgba(255,255,255,.3)'");
rep("  const sc=1+(c.pop||0)*0.4+(lvl-1)*0.055;ctx.scale(sc,sc);",
`  if(cls==='mage'&&!lifted){ // cajado apontado + chama ao conjurar
    ctx.save();ctx.rotate((c.aim||0)+Math.sin(now*3+c.id)*0.08-(c.cast||0)*0.35);leekShape(34,weaponStyle(c));
    if((c.cast||0)>0){const f=ctx.createRadialGradient(36,0,1,36,0,22);f.addColorStop(0,'rgba(255,230,120,'+c.cast+')');f.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=f;ctx.beginPath();ctx.arc(36,0,22,0,6.28);ctx.fill();}
    ctx.restore();}
  const sc=1+(c.pop||0)*0.4+(lvl-1)*0.055;ctx.scale(sc,sc);`);

// textos
rep("'Dano '+catDmg(c)+'   Alcance '+Math.round(range(c))+'   Lâminas '+leeks(c)","'Dano '+catDmg(c)+'   Alcance '+Math.round(range(c))+(c.cls==='mage'?'   Bola de fogo (área)':'   Lâminas '+leeks(c))");
rep("desc:['Alcance enorme','Dano menor','Deixa a minhoca lenta','Cajado com orbe']","desc:['Atira bolas de fogo','Alcance enorme','Dano em área','Deixa a minhoca lenta']");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
