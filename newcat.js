function leekShape(len,style){
  ctx.lineCap='round';
  if(style==='sword'){ // espada de aco com guarda dourada
    ctx.strokeStyle=OUT;ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(len,0);ctx.stroke();
    const gr=ctx.createLinearGradient(0,-4,0,4);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#9fb0c8');
    ctx.strokeStyle=gr;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(len-4,0);ctx.stroke();
    ctx.strokeStyle='#7fe06a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(len*.4,0);ctx.lineTo(len-6,0);ctx.stroke();
    ctx.strokeStyle='#f2c94c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(16,-8);ctx.lineTo(16,8);ctx.stroke();
  }else if(style==='orb'){ // cajado com orbe magico
    ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-8,0);ctx.stroke();
    ctx.strokeStyle='#8a5a2b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len-8,0);ctx.stroke();
    const g=ctx.createRadialGradient(len-2,-2,1,len,0,13);g.addColorStop(0,'#fff');g.addColorStop(.4,'#d9a6ff');g.addColorStop(1,'rgba(150,60,230,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(len,0,13,0,6.28);ctx.fill();
    ctx.fillStyle='#b46bff';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.arc(len,0,6,0,6.28);ctx.fill();ctx.stroke();
  }else{ // alho-poro
    ctx.strokeStyle=OUT;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len,0);ctx.stroke();
    ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len*.55,0);ctx.stroke();
    ctx.strokeStyle='#52b83f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(len*.55,0);ctx.lineTo(len,0);ctx.stroke();
    ctx.strokeStyle='#8fe070';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(len*.58,-1.5);ctx.lineTo(len-2,-1.5);ctx.stroke();
  }
}
const CLS_INFO={knight:{name:'Cavaleiro'},mage:{name:'Mago'}};
function tierCol(c){return c.cls==='knight'?'#6fa8ff':c.cls==='mage'?'#c07bff':COLORS[Math.min(c.lvl-1,COLORS.length-1)];}
function steel(y0,y1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#e6edf7');g.addColorStop(1,'#8d9bb0');return g;}

function drawCat(c,x,y,lifted,preview){
  const lvl=c.lvl,cls=c.cls||null,tc=tierCol(c);
  const arm=cls||(lvl>=4?'vet':lvl===3?'iron':lvl===2?'leather':'cloth');
  const style=cls==='knight'?'sword':cls==='mage'?'orb':'leek';
  const gold=lvl>=6;
  const bob=Math.sin(now*5+c.id)*1.2;
  ctx.save();ctx.translate(x,y);
  if(lvl>=3||cls){const R=26+lvl*3,gr=ctx.createRadialGradient(0,0,6,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}
  if(!lifted&&!preview){
    ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(0,0,range(c),0,6.28);ctx.stroke();ctx.setLineDash([]);
    const n=leeks(c);
    ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=9;ctx.lineCap='round';
    for(let k=0;k<n;k++){const a=c.ang+k*6.2832/n;ctx.beginPath();ctx.arc(0,0,range(c)*.7,a-0.8,a-0.1);ctx.stroke();}
    for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(range(c)+4,style);
      ctx.fillStyle='#ffe1c9';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.arc(12,0,5,0,6.28);ctx.fill();ctx.stroke();ctx.restore();}
  }
  const sc=1+(c.pop||0)*0.4+(lvl-1)*0.055;ctx.scale(sc,sc);
  if(lifted)ctx.translate(0,-8);
  ctx.translate(0,bob*0.5);
  // sombra
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,26,15,5,0,0,6.28);ctx.fill();
  // capa
  if(arm==='vet'||cls){
    ctx.fillStyle=cls==='mage'?'#3d1d70':cls==='knight'?'#c0392b':'#b03030';ctx.strokeStyle=OUT;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-10,6);ctx.quadraticCurveTo(-20,20,-13,29);ctx.lineTo(13,29);ctx.quadraticCurveTo(20,20,10,6);ctx.closePath();ctx.fill();ctx.stroke();
  }
  // cauda
  ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(9,17);ctx.quadraticCurveTo(24,16,20,2);ctx.stroke();
  ctx.strokeStyle=tc;ctx.lineWidth=4;ctx.stroke();
  // pes
  const bootCol=(arm==='cloth'||arm==='leather')?'#fff3e0':arm==='mage'?'#5a2b99':'#8d9bb0';
  ctx.fillStyle=bootCol;ctx.strokeStyle=OUT;ctx.lineWidth=2;
  for(const sx of[-1,1]){ctx.beginPath();ctx.ellipse(sx*6,24,5.5,3.4,0,0,6.28);ctx.fill();ctx.stroke();}
  // corpo
  const torso=()=>{ctx.beginPath();ctx.ellipse(0,14,11,9.5,0,0,6.28);};
  let g=ctx.createLinearGradient(0,5,0,23);g.addColorStop(0,'#fff8ee');g.addColorStop(1,'#e3d2b8');
  ctx.fillStyle=g;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
  if(arm==='mage'){ // tunica longa
    ctx.fillStyle='#7b3fc4';ctx.beginPath();ctx.moveTo(-10,8);ctx.quadraticCurveTo(-16,22,-14,27);ctx.lineTo(14,27);ctx.quadraticCurveTo(16,22,10,8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#f2c94c';ctx.fillRect(-14,24.5,28,2.6);
    ctx.fillStyle='#f2c94c';ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(1.8,14);ctx.lineTo(6,14.4);ctx.lineTo(2.8,17);ctx.lineTo(3.8,21);ctx.lineTo(0,18.8);ctx.lineTo(-3.8,21);ctx.lineTo(-2.8,17);ctx.lineTo(-6,14.4);ctx.lineTo(-1.8,14);ctx.closePath();ctx.fill();
  }else{
    torso();ctx.fill();ctx.stroke();
    if(arm==='cloth'){ctx.fillStyle='#e8404f';ctx.strokeStyle=OUT;ctx.lineWidth=2;rr(ctx,-9,5.5,18,5,2.5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(4,10);ctx.lineTo(8,18);ctx.lineTo(2,16);ctx.closePath();ctx.fill();ctx.stroke();}
    else if(arm==='leather'){ctx.save();torso();ctx.clip();ctx.fillStyle='#a8672f';ctx.fillRect(-12,7,24,20);ctx.fillStyle='#6b4420';ctx.fillRect(-12,17,24,3);ctx.fillStyle='#f2c94c';ctx.fillRect(-2,16.5,4,4);ctx.restore();torso();ctx.stroke();}
    else{ // placas de metal
      ctx.save();torso();ctx.clip();
      ctx.fillStyle=arm==='knight'?'#e9f0fb':steel(5,24);ctx.fillRect(-12,5,24,22);
      ctx.strokeStyle='rgba(40,50,70,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,6);ctx.lineTo(0,24);ctx.moveTo(-11,13);ctx.lineTo(11,13);ctx.moveTo(-11,18);ctx.lineTo(11,18);ctx.stroke();
      if(arm==='knight'||gold){ctx.fillStyle='#f2c94c';ctx.fillRect(-12,22,24,3);ctx.fillRect(-1.5,6,3,18);}
      if(arm==='knight'){ctx.fillStyle='#3a63c8';ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(5,12);ctx.lineTo(0,20);ctx.lineTo(-5,12);ctx.closePath();ctx.fill();}
      ctx.restore();torso();ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.stroke();
      if(arm==='vet'||arm==='knight'){ // ombreiras
        for(const sx of[-1,1]){const gg=ctx.createRadialGradient(sx*12,7,1,sx*12,8,7);gg.addColorStop(0,'#f4f8ff');gg.addColorStop(1,arm==='knight'?'#8fa6cc':'#7e8ca3');
          ctx.fillStyle=gg;ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx*12,8,6.2,0,6.28);ctx.fill();ctx.stroke();
          if(gold||arm==='knight'){ctx.fillStyle='#f2c94c';ctx.beginPath();ctx.arc(sx*12,8,2,0,6.28);ctx.fill();}}
      }
    }
  }
  // escudo do cavaleiro
  if(cls==='knight'){
    const sg=ctx.createRadialGradient(-17,15,1,-16,16,10);sg.addColorStop(0,'#6fa8ff');sg.addColorStop(1,'#2a4fb0');
    ctx.fillStyle=sg;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(-16,16,9.5,0,6.28);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#f2c94c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-16,16,7,0,6.28);ctx.stroke();
    ctx.fillStyle='#f2c94c';ctx.beginPath();ctx.arc(-16,16,2.6,0,6.28);ctx.fill();
  }
  // orelhas
  for(const sx of[-1,1]){
    ctx.fillStyle='#e8404f';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(sx*17,-3);ctx.lineTo(sx*14,-20);ctx.lineTo(sx*3,-11);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffb3bd';ctx.beginPath();ctx.moveTo(sx*13.5,-6);ctx.lineTo(sx*12.5,-15);ctx.lineTo(sx*6,-10);ctx.closePath();ctx.fill();
  }
  // cabeca
  g=ctx.createRadialGradient(-5,-8,2,0,0,19);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#f0e2cc');
  ctx.fillStyle=g;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,0,18,14.5,0,0,6.28);ctx.fill();ctx.stroke();
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,18,14.5,0,0,6.28);ctx.clip();
  ctx.fillStyle=tc;ctx.beginPath();ctx.moveTo(-9,-16);ctx.quadraticCurveTo(-1,-3,9,-16);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(-16,2,6,8,0,0,6.28);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-6,-10,7,3,-0.4,0,6.28);ctx.fill();ctx.restore();
  // rosto
  const blink=(Math.sin(now*0.9+c.id*3)>0.985);
  for(const sx of[-1,1]){
    if(blink){ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx*7-3,1);ctx.lineTo(sx*7+3,1);ctx.stroke();continue;}
    ctx.fillStyle='#fff';ctx.strokeStyle=OUT;ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(sx*7,1,4.6,5.4,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.fillStyle=cls==='mage'?'#b46bff':'#33b34a';ctx.beginPath();ctx.ellipse(sx*7+Math.cos(c.ang)*0.8,1.5,3.3,4.2,0,0,6.28);ctx.fill();
    ctx.fillStyle='#10321a';ctx.beginPath();ctx.ellipse(sx*7+Math.cos(c.ang)*0.8,1.8,1.6,2.5,0,0,6.28);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sx*7-1,-1,1.3,0,6.28);ctx.fill();
  }
  ctx.fillStyle='rgba(255,120,140,.45)';ctx.beginPath();ctx.ellipse(-12,7,3.2,2,0,0,6.28);ctx.ellipse(12,7,3.2,2,0,0,6.28);ctx.fill();
  ctx.fillStyle='#ff6f91';ctx.beginPath();ctx.moveTo(-2,6);ctx.lineTo(2,6);ctx.lineTo(0,8.4);ctx.closePath();ctx.fill();
  ctx.strokeStyle=OUT;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,8.4);ctx.lineTo(0,10);ctx.moveTo(-3.5,10.5);ctx.quadraticCurveTo(-1.6,12,0,10);ctx.quadraticCurveTo(1.6,12,3.5,10.5);ctx.stroke();
  // capacete / chapeu
  if(arm==='leather'){ // bandana
    ctx.fillStyle='#c4793a';ctx.strokeStyle=OUT;ctx.lineWidth=2;rr(ctx,-17.5,-9,35,5.5,2.5);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(15,-8);ctx.lineTo(24,-12);ctx.lineTo(22,-4);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(arm==='iron'||arm==='vet'||arm==='knight'){
    ctx.fillStyle=arm==='knight'?'#e9f0fb':steel(-16,-4);ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(0,-5,18,10.5,0,Math.PI,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=(arm==='knight'||gold)?'#f2c94c':'#5a6678';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-17,-5);ctx.lineTo(17,-5);ctx.stroke();
    ctx.strokeStyle='rgba(40,50,70,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(0,-5);ctx.stroke();
    if(arm==='vet'){ // chifres
      ctx.fillStyle='#f0e6c8';ctx.strokeStyle=OUT;ctx.lineWidth=2;
      for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*13,-9);ctx.quadraticCurveTo(sx*22,-12,sx*20,-22);ctx.quadraticCurveTo(sx*16,-14,sx*8,-12);ctx.closePath();ctx.fill();ctx.stroke();}
    }
    if(arm==='knight'){ // penacho
      const w=Math.sin(now*4+c.id)*2;
      ctx.fillStyle='#e03a3a';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-4,-14);ctx.quadraticCurveTo(-2+w,-30,8+w,-28);ctx.quadraticCurveTo(4+w,-22,5,-14);ctx.closePath();ctx.fill();ctx.stroke();
    }
  }else if(arm==='mage'){
    ctx.fillStyle='#5a2b99';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(-15,-9);ctx.quadraticCurveTo(-8,-26,6,-44);ctx.quadraticCurveTo(10,-26,15,-9);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#7b3fc4';ctx.beginPath();ctx.ellipse(0,-9,21,5.5,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f2c94c';ctx.fillRect(-12,-14,24,3);
    ctx.fillStyle='#ffe066';ctx.beginPath();ctx.arc(3,-27,3,0,6.28);ctx.fill();
    if(gold){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-3,-20,1.6,0,6.28);ctx.arc(7,-17,1.4,0,6.28);ctx.fill();}
  }
  ctx.restore();
  // selo de nivel
  ctx.fillStyle=cls?(cls==='mage'?'#7b3fc4':'#2a63d8'):'#2f9e44';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(x-21*Math.min(1.4,1+(lvl-1)*0.055),y-20,9,0,6.28);ctx.fill();ctx.stroke();
  ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,x-21*Math.min(1.4,1+(lvl-1)*0.055),y-16);
  if(cls&&!preview){ctx.font='bold 10px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(CLS_INFO[cls].name,x,y+40);ctx.fillText(CLS_INFO[cls].name,x,y+40);}
}

// ---------- Escolha de classe (nivel 5) ----------
const CARDS=[
  {k:'knight',x:16,y:150,w:154,h:330,title:'Cavaleiro',desc:['Dano muito alto','Alcance curto','+1 espada girando','Armadura pesada']},
  {k:'mage',x:190,y:150,w:154,h:330,title:'Mago',desc:['Alcance enorme','Dano menor','Deixa a minhoca lenta','Cajado com orbe']}
];
function drawChoice(){
  ctx.fillStyle='rgba(8,12,20,.82)';ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';ctx.font='900 22px system-ui';ctx.lineWidth=5;ctx.strokeStyle='#000';ctx.fillStyle='#ffe066';
  ctx.strokeText('Nível 5 alcançado!',W/2,88);ctx.fillText('Nível 5 alcançado!',W/2,88);
  ctx.font='15px system-ui';ctx.fillStyle='#dfe8f5';ctx.fillText('Escolha a classe deste gato',W/2,114);
  for(const cd of CARDS){
    const gr=ctx.createLinearGradient(0,cd.y,0,cd.y+cd.h);gr.addColorStop(0,cd.k==='knight'?'#2a4a8c':'#4a2a7c');gr.addColorStop(1,'#141a2c');
    ctx.fillStyle=gr;ctx.strokeStyle=cd.k==='knight'?'#8fb4ff':'#c79bff';ctx.lineWidth=3;rr(ctx,cd.x,cd.y,cd.w,cd.h,16);ctx.fill();ctx.stroke();
    ctx.font='900 20px system-ui';ctx.fillStyle='#fff';ctx.fillText(cd.title,cd.x+cd.w/2,cd.y+34);
    ctx.save();ctx.translate(cd.x+cd.w/2,cd.y+130);ctx.scale(2.3,2.3);drawCat({id:0,lvl:5,cls:cd.k,ang:0,pop:0},0,0,false,true);ctx.restore();
    ctx.font='13px system-ui';ctx.fillStyle='#e6eefc';
    cd.desc.forEach((t,i)=>ctx.fillText('• '+t,cd.x+cd.w/2,cd.y+222+i*22));
    ctx.fillStyle='#ffb02e';rr(ctx,cd.x+22,cd.y+cd.h-46,cd.w-44,32,10);ctx.fill();
    ctx.font='900 15px system-ui';ctx.fillStyle='#4a2a00';ctx.fillText('ESCOLHER',cd.x+cd.w/2,cd.y+cd.h-24);
  }
}

