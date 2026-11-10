// ---------- Inimigos (varios tipos + armaduras) ----------
const ENEMY_TYPES=[{k:'worm',name:'Minhoca de Pedra'},{k:'snake',name:'Cobra Venenosa'},{k:'centipede',name:'Lacraia Gigante'},{k:'dragon',name:'Dragão de Fogo'}];
const ARMOR_NAMES=['Sem armadura','Armadura de Ferro','Armadura de Aço','Armadura Dourada'];
const ARMOR_COL=['','#9fb0c4','#d6e0ee','#f2c94c'];

const TIER_NAME=['Filhote','Aprendiz','Guerreiro','Veterano'];
const WEAPON_NAME={leek:'Alho-poró',club:'Clava',axe:'Machado',mace:'Maça',sword:'Espada',greatsword:'Espadão Dourado',orb:'Cajado de Orbe',crystal:'Cajado de Cristal'};
function weaponStyle(c){
  if(c.cls==='knight')return c.lvl>=7?'greatsword':'sword';
  if(c.cls==='mage')return c.lvl>=7?'crystal':'orb';
  return['leek','club','axe','mace'][Math.min(c.lvl,4)-1];
}
function catName(c){return c.cls?CLS_INFO[c.cls].name:TIER_NAME[Math.min(c.lvl,4)-1];}

function angAt(d){const a=posAt(d-4),b=posAt(d+4);return Math.atan2(b.y-a.y,b.x-a.x);}
function bodyGrad(r,c0,c1,c2){const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r*1.05);g.addColorStop(0,c0);g.addColorStop(.6,c1);g.addColorStop(1,c2);return g;}
function spike(x,y,a,l,w){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,-w);ctx.lineTo(l,0);ctx.lineTo(0,w);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}

function drawSeg(type,sg,r,i,ang,armor){
  const head=sg.head;
  const OL={worm:'#2f2c27',snake:'#143d14',centipede:'#4a2208',dragon:'#3a0808'}[type];
  ctx.strokeStyle=OL;ctx.lineWidth=3;
  if(type==='worm'){
    if(head){ctx.fillStyle='#5a2f18';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;
      for(let a=0;a<10;a++){const an=a/10*6.2832+.3;ctx.beginPath();ctx.moveTo(Math.cos(an-.18)*r,Math.sin(an-.18)*r);ctx.lineTo(Math.cos(an)*(r+9),Math.sin(an)*(r+9));ctx.lineTo(Math.cos(an+.18)*r,Math.sin(an+.18)*r);ctx.fill();ctx.stroke();}}
    ctx.fillStyle=head?bodyGrad(r,'#c98a5a','#8a4f2c','#4a2614'):bodyGrad(r,'#b8b2a6','#7d776c','#46423b');ctx.strokeStyle=head?'#2a140a':OL;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,6.28);ctx.clip();
    if(!head){ctx.strokeStyle='rgba(30,28,24,.5)';ctx.lineWidth=1.6;
      for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){ctx.beginPath();ctx.arc(col*10+(row%2?5:0),row*9,6,0,3.14);ctx.stroke();}
      ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.ellipse(-6,-9,9,4,-.5,0,6.28);ctx.fill();
    }else{
      ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.ellipse(-8,-12,11,4,-.5,0,6.28);ctx.fill();
      for(const sx of[-1,1]){ctx.fillStyle='#fff8d0';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx*9,-5,6,6.5,0,0,6.28);ctx.fill();ctx.stroke();
        ctx.fillStyle='#d11';ctx.beginPath();ctx.arc(sx*9,-4,2.8,0,6.28);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(sx*9,-4,1.3,0,6.28);ctx.fill();
        ctx.strokeStyle='#2a140a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx*15,-14);ctx.lineTo(sx*3,-8);ctx.stroke();}
      ctx.fillStyle='#3a0b0b';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,10,13,8,0,0,6.28);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*3.6-2,3.5);ctx.lineTo(k*3.6+2,3.5);ctx.lineTo(k*3.6,9);ctx.fill();}
      ctx.fillStyle='#e0536b';ctx.beginPath();ctx.ellipse(0,15,6,3,0,0,6.28);ctx.fill();}
    ctx.restore();
  }else if(type==='snake'){
    ctx.fillStyle=bodyGrad(r,'#b4f27a','#4fae35','#1d5a1d');ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,6.28);ctx.clip();ctx.rotate(ang);
    ctx.fillStyle='rgba(15,70,20,.55)';
    ctx.beginPath();ctx.moveTo(-r*.7,0);ctx.lineTo(0,-r*.7);ctx.lineTo(r*.7,0);ctx.lineTo(0,r*.7);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,240,140,.75)';ctx.beginPath();ctx.moveTo(-r*.3,0);ctx.lineTo(0,-r*.3);ctx.lineTo(r*.3,0);ctx.lineTo(0,r*.3);ctx.closePath();ctx.fill();
    ctx.restore();
    if(head){
      const tg=Math.sin(now*14)*3; // lingua
      ctx.strokeStyle='#e0245e';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,r-6);ctx.lineTo(tg,r+8);ctx.moveTo(tg,r+8);ctx.lineTo(tg-4,r+13);ctx.moveTo(tg,r+8);ctx.lineTo(tg+4,r+13);ctx.stroke();
      for(const sx of[-1,1]){ctx.fillStyle='#ffe94a';ctx.strokeStyle='#143d14';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx*9,-5,5.5,6.5,0,0,6.28);ctx.fill();ctx.stroke();
        ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx*9,-4,1.6,5,0,0,6.28);ctx.fill();
        ctx.strokeStyle='#143d14';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx*15,-12);ctx.lineTo(sx*4,-8);ctx.stroke();}
      ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-8,9);ctx.lineTo(-5,9);ctx.lineTo(-6.5,16);ctx.fill();ctx.beginPath();ctx.moveTo(8,9);ctx.lineTo(5,9);ctx.lineTo(6.5,16);ctx.fill();
      ctx.fillStyle='#143d14';ctx.beginPath();ctx.arc(-3,3,1.2,0,6.28);ctx.arc(3,3,1.2,0,6.28);ctx.fill();
    }
  }else if(type==='centipede'){
    ctx.save();ctx.rotate(ang);ctx.strokeStyle='#4a2208';ctx.lineWidth=3;ctx.lineCap='round';
    const w=Math.sin(now*12+i)*3;ctx.beginPath();ctx.moveTo(w,-r-9);ctx.lineTo(0,-r+3);ctx.moveTo(-w,r+9);ctx.lineTo(0,r-3);ctx.stroke();ctx.restore();
    ctx.strokeStyle=OL;ctx.lineWidth=3;
    ctx.fillStyle=bodyGrad(r,'#ffc25e','#e0702a','#8a3410');ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,6.28);ctx.clip();ctx.rotate(ang);
    ctx.fillStyle='rgba(90,30,5,.55)';ctx.fillRect(-4,-r,5,r*2);ctx.fillStyle='rgba(255,230,160,.5)';ctx.fillRect(-9,-r,2,r*2);ctx.restore();
    if(head){
      ctx.strokeStyle='#4a2208';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-6,-r+4);ctx.quadraticCurveTo(-16,-r-6,-10,-r-14);ctx.moveTo(6,-r+4);ctx.quadraticCurveTo(16,-r-6,10,-r-14);ctx.stroke();
      for(const sx of[-1,1]){ctx.fillStyle='#fff';ctx.strokeStyle='#4a2208';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx*8,-4,5.5,0,6.28);ctx.fill();ctx.stroke();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(sx*8,-3,2.6,0,6.28);ctx.fill();}
      ctx.fillStyle='#c0201e';ctx.strokeStyle='#4a2208';ctx.lineWidth=2;
      for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*4,8);ctx.quadraticCurveTo(sx*16,10,sx*9,22);ctx.quadraticCurveTo(sx*8,14,sx*2,12);ctx.closePath();ctx.fill();ctx.stroke();}
    }
  }else{ // dragao
    ctx.fillStyle='#8a1212';ctx.strokeStyle='#3a0808';ctx.lineWidth=2;
    if(!head){spike(0,-r+1,-Math.PI/2+0.2,9,4);spike(0,r-1,Math.PI/2-0.2,9,4);}
    ctx.strokeStyle='#3a0808';ctx.lineWidth=3;
    ctx.fillStyle=bodyGrad(r,'#ff8a64','#c8301f','#5a0c0c');ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();ctx.stroke();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,6.28);ctx.clip();
    ctx.strokeStyle='rgba(60,5,5,.45)';ctx.lineWidth=1.5;for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){ctx.beginPath();ctx.arc(col*9+(row%2?4.5:0),row*8,5,0.2,3);ctx.stroke();}
    ctx.fillStyle='rgba(255,210,130,.35)';ctx.beginPath();ctx.ellipse(0,r*.45,r*.7,r*.45,0,0,6.28);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.ellipse(-7,-10,10,4,-.5,0,6.28);ctx.fill();ctx.restore();
    if(head){
      ctx.fillStyle='#f4e6c0';ctx.strokeStyle='#3a0808';ctx.lineWidth=2;
      for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*10,-r+6);ctx.quadraticCurveTo(sx*24,-r-2,sx*20,-r-16);ctx.quadraticCurveTo(sx*14,-r-4,sx*5,-r+3);ctx.closePath();ctx.fill();ctx.stroke();}
      for(const sx of[-1,1]){ctx.fillStyle='#ffd23a';ctx.strokeStyle='#3a0808';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx*10,-6,6,6,0,0,6.28);ctx.fill();ctx.stroke();
        ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(sx*10,-5.5,1.8,5,0,0,6.28);ctx.fill();
        ctx.strokeStyle='#3a0808';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx*17,-14);ctx.lineTo(sx*4,-9);ctx.stroke();}
      ctx.fillStyle='#4a0a0a';ctx.beginPath();ctx.arc(-3,4,1.6,0,6.28);ctx.arc(3,4,1.6,0,6.28);ctx.fill();
      ctx.fillStyle='#2a0505';ctx.strokeStyle='#3a0808';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,14,12,7,0,0,6.28);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(k*4.5-2,9);ctx.lineTo(k*4.5+2,9);ctx.lineTo(k*4.5,14);ctx.fill();}
      const f=Math.sin(now*18)*2; // chamas
      ctx.fillStyle='#ff7a1a';ctx.beginPath();ctx.moveTo(-8,r-4);ctx.quadraticCurveTo(-10+f,r+12,0,r+16+f);ctx.quadraticCurveTo(10-f,r+12,8,r-4);ctx.closePath();ctx.fill();
      ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-4,r-2);ctx.quadraticCurveTo(-4,r+8,0,r+11);ctx.quadraticCurveTo(4,r+8,4,r-2);ctx.closePath();ctx.fill();
    }
  }
  // armadura (aumenta a resistencia)
  if(armor>0){
    const mc=ARMOR_COL[Math.min(armor,3)];
    ctx.strokeStyle=mc;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r-2,0,6.28);ctx.stroke();
    ctx.strokeStyle='rgba(30,30,40,.55)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,r-4.2,0,6.28);ctx.stroke();
    ctx.fillStyle='#4a4f5c';for(let a=0;a<4;a++){const an=a*1.571+.7;ctx.beginPath();ctx.arc(Math.cos(an)*(r-2),Math.sin(an)*(r-2),1.8,0,6.28);ctx.fill();}
    if(armor>=2&&!head){ctx.fillStyle=mc;ctx.strokeStyle='#2b2f3a';ctx.lineWidth=1.5;for(let a=0;a<3;a++){const an=a*2.09+1.1+ang*0;spike(Math.cos(an)*(r-1),Math.sin(an)*(r-1),an,6,3);}}
    if(head){ // elmo
      const gg=ctx.createLinearGradient(0,-r,0,0);gg.addColorStop(0,'#fff');gg.addColorStop(1,mc);
      ctx.fillStyle=gg;ctx.strokeStyle='#2b2f3a';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,-r*.22,r*.98,r*.72,0,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='#2b2f3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-r*.94);ctx.lineTo(0,-r*.22);ctx.stroke();
      if(armor>=2){ctx.fillStyle=mc;spike(-r*.6,-r*.62,-2.2,9,3.5);spike(r*.6,-r*.62,-0.94,9,3.5);}
      if(armor>=3){ctx.fillStyle='#e03a3a';ctx.beginPath();ctx.moveTo(-3,-r*.94);ctx.quadraticCurveTo(0,-r-16,10,-r-8);ctx.quadraticCurveTo(5,-r-4,4,-r*.94);ctx.closePath();ctx.fill();ctx.stroke();}
    }
  }
  if(sg.flash>0){ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();}
}
function drawWorm(){
  if(!worm)return;
  const type=worm.type,boss=worm.boss;
  for(let i=worm.segs.length-1;i>=0;i--){
    const sg=worm.segs[i],d=worm.d-i*worm.gap,p=posAt(d);
    if(p.y<-30)continue;
    const r=sg.head?(boss?29:25):(type==='snake'?16:boss?19:18);
    ctx.save();ctx.translate(p.x,p.y);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(3,r*.75,r,r*.45,0,0,6.28);ctx.fill();
    drawSeg(type,sg,r,i,angAt(d),worm.armor);
    ctx.restore();
    ctx.textAlign='center';
    if(sg.head){ctx.font='900 22px system-ui';ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.fillStyle='#e01b1b';ctx.strokeText(sg.hp,p.x,p.y-r-6);ctx.fillText(sg.hp,p.x,p.y-r-6);}
    else{ctx.font='900 15px system-ui';ctx.lineWidth=3.5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(sg.hp,p.x,p.y+5.5);ctx.fillText(sg.hp,p.x,p.y+5.5);}
    if(sg.flash>0)sg.flash-=0.016;
  }
}

// ---------- HUD ----------
function heart(x,y,s,on){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle=on?'#ff4d6a':'#4a5160';ctx.strokeStyle=on?'#7a1226':'#2a2f3a';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-12,-2,-7,-11,0,-5);ctx.bezierCurveTo(7,-11,12,-2,0,6);ctx.closePath();ctx.fill();ctx.stroke();
  if(on){ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.ellipse(-4,-4,2,1.2,-0.6,0,6.28);ctx.fill();}
  ctx.restore();
}
function bar(x,y,w,h,f,c0,c1){
  ctx.fillStyle='rgba(0,0,0,.55)';rr(ctx,x,y,w,h,h/2);ctx.fill();
  f=Math.max(0,Math.min(1,f));if(f>0){const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;rr(ctx,x+1,y+1,Math.max(h-2,(w-2)*f),h-2,(h-2)/2);ctx.fill();}
}
function shadowText(t,x,y,font,fill,align='left'){ctx.font=font;ctx.textAlign=align;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(t,x,y);ctx.fillStyle=fill;ctx.fillText(t,x,y);}
function drawHUD(){
  // ---- topo ----
  const g=ctx.createLinearGradient(0,6,0,46);g.addColorStop(0,'rgba(34,42,62,.92)');g.addColorStop(1,'rgba(16,20,32,.92)');
  ctx.fillStyle=g;ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1.5;rr(ctx,6,6,W-12,42,12);ctx.fill();ctx.stroke();
  for(let i=0;i<3;i++)heart(24+i*22,27,1,i<lives);
  let title,sub,frac,c0,c1;
  if(worm){title='ONDA '+wave+' · '+worm.name;sub=ARMOR_NAMES[Math.min(worm.armor,3)]+(worm.boss?' · CHEFE':'');
    const hp=worm.segs.reduce((a,s)=>a+Math.max(0,s.hp),0);frac=hp/worm.total;c0='#ff7a7a';c1='#c82020';}
  else{const nx=ENEMY_TYPES[wave%4],na=Math.floor(wave/4);title='ONDA '+(wave+1)+' em '+Math.ceil(timer)+'s';sub='Próximo: '+nx.name+(na?' · '+ARMOR_NAMES[Math.min(na,3)]:'');frac=1-timer/4;c0='#7ad0ff';c1='#2a7ad0';}
  shadowText(title,92,22,'900 12px system-ui','#fff');
  bar(92,27,170,8,frac,c0,c1);
  shadowText(sub,92,44,'10px system-ui','#b9c6dd');
  // gatos / salvos
  shadowText('🐱 '+cats.length,W-16,24,'bold 13px system-ui','#ffe9b0','right');
  shadowText('🫙 '+saved,W-16,41,'bold 12px system-ui','#9fdcff','right');
  // ---- base ----
  ctx.fillStyle=g;ctx.strokeStyle='rgba(255,255,255,.18)';rr(ctx,6,H-44,W-12,38,12);ctx.fill();ctx.stroke();
  shadowText('🫙 Próximo pote',16,H-21,'bold 11px system-ui','#cfe');
  bar(112,H-31,110,10,1-jarTimer/16,'#9fdcff','#3f8fc8');
  shadowText(jars.length>=2?'cheio':Math.ceil(jarTimer)+'s',W-16,H-21,'bold 11px system-ui','#cfe','right');
  if(wave<=1&&!selected)shadowText('arraste os gatos para a grama · una gatos iguais · toque para ver status',W/2,H-52,'10px system-ui','#fff','center');
  // ---- painel do gato selecionado ----
  if(selected&&cats.includes(selected)){
    const c=selected;
    ctx.strokeStyle='#ffe066';ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(c.x,c.y,32,0,6.28);ctx.stroke();ctx.setLineDash([]);
    const y0=H-142;
    ctx.fillStyle='rgba(18,22,36,.94)';ctx.strokeStyle=tierCol(c);ctx.lineWidth=2.5;rr(ctx,10,y0,W-20,90,14);ctx.fill();ctx.stroke();
    ctx.save();ctx.translate(48,y0+52);ctx.scale(1.15,1.15);drawCat({id:c.id,lvl:c.lvl,cls:c.cls,ang:0,pop:0},0,0,false,true);ctx.restore();
    shadowText(catName(c)+' · Nível '+c.lvl,92,y0+24,'900 15px system-ui','#fff');
    shadowText('Arma: '+WEAPON_NAME[weaponStyle(c)],92,y0+42,'12px system-ui','#dfe8f5');
    shadowText('Dano '+catDmg(c)+'   Alcance '+Math.round(range(c))+'   Lâminas '+leeks(c),92,y0+60,'12px system-ui','#ffe9b0');
    const nx=c.lvl>=8?'Nível máximo':(c.lvl===4&&!c.cls?'Una com outro nível 4 e escolha a classe':'Una com outro gato nível '+c.lvl+(c.cls?' '+CLS_INFO[c.cls].name:''));
    shadowText(nx,92,y0+78,'10px system-ui','#9fb0c8');
  }
  if(paused){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);shadowText('PAUSADO',W/2,H/2,'900 30px system-ui','#fff','center');}
}

