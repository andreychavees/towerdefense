// Animation, feedback and safe rescue placement. The simulation owns all timing.
const FX={items:[],hitStop:0,hitCooldown:0};
const clamp01=n=>Math.max(0,Math.min(1,n));
const smooth=t=>t*t*(3-2*t);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function clearMotion(){FX.items=[];FX.hitStop=0;FX.hitCooldown=0;}
function effect(kind,x,y,options={}){
  if(FX.items.length>=220)FX.items.shift();
  FX.items.push({kind,x,y,age:0,duration:.45,...options});
}
function catPose(c){
  const m=c.motion;
  if(!m)return{x:c.x,y:c.y,lift:0,t:1};
  const t=clamp01(m.age/m.duration),e=smooth(t);
  return{x:m.fromX+(c.x-m.fromX)*e,y:m.fromY+(c.y-m.fromY)*e,lift:Math.sin(t*Math.PI)*m.height,t};
}
function catOccupies(c,cl){
  if(Math.abs(c.x-cl.x)<6&&Math.abs(c.y-cl.y)<6)return true;
  return c.motion&&c.motion.kind==='walk'&&Math.abs(c.motion.fromX-cl.x)<6&&Math.abs(c.motion.fromY-cl.y)<6;
}
function randomFreeCell(ignore=null){
  const choices=[];
  for(let j=1;j<GROWS-1;j++)for(let i=0;i<GCOLS;i++){
    const cell={i,j,x:pcx(i),y:pcy(j)};
    if(cellOk(cell,ignore))choices.push(cell);
  }
  return choices.length?choices[Math.floor(Math.random()*choices.length)]:null;
}
function hopCat(c,target,kind='walk',origin=null){
  const from=origin||catPose(c);
  c.x=target.x;c.y=target.y;c.facing=target.x===from.x?(c.facing||1):Math.sign(target.x-from.x);
  const distance=Math.hypot(c.x-from.x,c.y-from.y);
  c.motion={kind,fromX:from.x,fromY:from.y,age:0,duration:kind==='rescue'?.65+Math.min(.45,distance/500):kind==='place'?.32:.3+Math.random()*.08,height:reducedMotion.matches?0:kind==='rescue'?Math.min(72,22+distance*.12):kind==='place'?18:7};
  if(kind!=='rescue')effect('dust',from.x,from.y+15,{duration:.4,radius:8});
}
function holdCat(c){c.motion=null;c.attack=0;}
function attackMotion(c){
  if((c.attack||0)<=.08)c.attack=.32;
  if(RANGED[c.cls])effect('cast',c.x+Math.cos(c.aim)*18,c.y+Math.sin(c.aim)*18,{duration:.25,color:tierCol(c),angle:c.aim});
}
function damageMotion(o,damage,p,critical=false){
  o.hurt=.2;o.flash=.12;o.recoil=(Math.random()<.5?-1:1)*3;
  if(o.kind==='jar')o.wobble=.35;
  effect('impact',p.x,p.y,{duration:.26,radius:critical?24:15,color:critical?'#ffe177':'#fff8c5',rotation:Math.random()*6.28});
  effect('number',p.x+(Math.random()-.5)*16,p.y-18,{duration:critical?.9:.72,text:critical?'CRÍTICO '+damage:'−'+damage,critical,drift:(Math.random()-.5)*22});
  if(FX.hitCooldown<=0){FX.hitStop=critical?.045:.022;FX.hitCooldown=.14;}
}
function breakJarMotion(j,p){
  const sprite=ART.props[8];
  // The glass actually separates into textured pieces of the illustrated jar.
  for(let row=0;row<4;row++)for(let col=0;col<4;col++){
    const angle=Math.atan2(row-1.5,col-1.5)+(Math.random()-.5)*.3,speed=45+Math.random()*95;
    effect('fragment',p.x+(col-1.5)*8,p.y+(row-1.5)*10,{duration:.65+Math.random()*.3,sprite,sx:col*sprite.w/4,sy:row*sprite.h/4,sw:sprite.w/4,sh:sprite.h/4,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-75,spin:(Math.random()-.5)*10,rotation:Math.random()});
  }
  effect('rescue',p.x,p.y,{duration:.8,radius:42,color:'#b9f8ef'});
  effect('dust',p.x,p.y+14,{duration:.55,radius:22});
}
function mergeMotion(c){
  c.pop=1;c.landing=.25;
  effect('merge',c.x,c.y,{duration:.9,radius:48,color:'#ffdc82'});
  for(let i=0;i<9;i++)effect('spark',c.x,c.y,{duration:.65+Math.random()*.4,angle:i*Math.PI*2/9,speed:30+Math.random()*35,color:i%2?'#d5ff98':'#ffe7a0'});
}
function updateMotion(dt){
  FX.hitCooldown=Math.max(0,FX.hitCooldown-dt);
  FX.items.forEach(e=>{e.age+=dt;});FX.items=FX.items.filter(e=>e.age<e.duration);
  for(const c of cats){
    c.attack=Math.max(0,(c.attack||0)-dt);c.landing=Math.max(0,(c.landing||0)-dt);
    if(drag&&drag.cat===c)continue;
    if(c.motion){
      c.motion.age+=dt;
      if(c.motion.age>=c.motion.duration){
        const rescue=c.motion.kind==='rescue';c.motion=null;c.landing=.22;
        effect('dust',c.x,c.y+15,{duration:.35,radius:rescue?16:7});
        if(rescue)effect('spark',c.x,c.y-15,{duration:.7,angle:-Math.PI/2,speed:28,color:'#fff0ad'});
      }
      continue;
    }

  }
  for(const j of jars){j.hurt=Math.max(0,(j.hurt||0)-dt);j.wobble=Math.max(0,(j.wobble||0)-dt);}
  if(worm)for(const sg of worm.segs){sg.hurt=Math.max(0,(sg.hurt||0)-dt);sg.flash=Math.max(0,(sg.flash||0)-dt);}
}
function animationSprite(c,preview=false){
  if(!preview&&!c.cls&&c.lvl===1&&ART.catFrames?.length===12){
    const row=c.motion?1:(c.attack||0)>0?2:0;
    const frame=row===1?Math.floor(clamp01(c.motion.age/c.motion.duration)*3.99):row===2?Math.floor((1-clamp01(c.attack/.32))*3.99):Math.floor(now*2+c.id)%4;
    return ART.catFrames[row*4+frame];
  }
  return spriteFor(c);
}
function drawEffects(behind=false){
  ctx.save();
  for(const e of FX.items){
    if((e.kind==='dust')!==behind)continue;
    const t=clamp01(e.age/e.duration),fade=Math.pow(1-t,1.5);ctx.save();
    ctx.translate(e.x,e.y);ctx.globalAlpha=fade;
    if(e.kind==='dust'){
      for(let k=0;k<5;k++){const a=k*2.4,r=e.radius*(.3+t);ctx.fillStyle='#e5d7a8';ctx.globalAlpha=fade*.22;ctx.beginPath();ctx.ellipse(Math.cos(a)*r,Math.sin(a)*r*.35,r*.45,r*.2,0,0,Math.PI*2);ctx.fill();}
    }else if(e.kind==='fragment'){
      ctx.translate(e.vx*e.age,e.vy*e.age+150*e.age*e.age);ctx.rotate(e.rotation+e.spin*e.age);ctx.drawImage(e.sprite.c,e.sx,e.sy,e.sw,e.sh,-5,-6,10,12);
    }else if(e.kind==='number'){
      ctx.translate(e.drift*t,-36*(1-Math.pow(1-t,2)));const scale=t<.16?.7+Math.sin(t/.16*Math.PI/2)*.5:1.2-.2*smooth((t-.16)/.84);ctx.scale(scale,scale);
      shadowText(e.text,0,0,(e.critical?'900 14':'900 12')+'px "Trebuchet MS",sans-serif',e.critical?'#ffe075':'#fff8e1','center');
    }else if(e.kind==='impact'){
      ctx.rotate(e.rotation);ctx.strokeStyle=e.color;ctx.lineWidth=2*(1-t)+.5;
      for(let k=0;k<7;k++){const a=k*Math.PI*2/7,r=e.radius*(.2+t);ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.45,Math.sin(a)*r*.45);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);ctx.stroke();}
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,Math.max(0,5*(1-t)),0,Math.PI*2);ctx.fill();
    }else if(e.kind==='spark'){
      ctx.translate(Math.cos(e.angle)*e.speed*e.age,Math.sin(e.angle)*e.speed*e.age-12*t);ctx.rotate(e.age*3);ctx.fillStyle=e.color;
      ctx.beginPath();ctx.moveTo(0,-5);ctx.quadraticCurveTo(1,-1,5,0);ctx.quadraticCurveTo(1,1,0,5);ctx.quadraticCurveTo(-1,1,-5,0);ctx.quadraticCurveTo(-1,-1,0,-5);ctx.fill();
    }else if(e.kind==='cast'){
      ctx.rotate(e.angle);const sp=ART.weapons[5];paintSprite(ctx,sp,0,0,18+20*t,18+20*t);
    }else{
      ctx.strokeStyle=e.color;ctx.lineWidth=3*(1-t)+.5;ctx.beginPath();ctx.ellipse(0,12,e.radius*t,e.radius*t*.4,0,0,Math.PI*2);ctx.stroke();
      if(e.kind==='merge'||e.kind==='rescue'){
        const g=ctx.createRadialGradient(0,0,0,0,0,e.radius);g.addColorStop(0,e.color+'88');g.addColorStop(1,e.color+'00');ctx.fillStyle=g;ctx.fillRect(-e.radius,-e.radius,e.radius*2,e.radius*2);
      }
    }
    ctx.restore();
  }
  ctx.restore();
}
