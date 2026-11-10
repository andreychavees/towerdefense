// ---------- Armas (desenhadas ao longo do eixo +x, com sombreamento) ----------
function vg_(h,stops){const g=ctx.createLinearGradient(0,-h,0,h);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
function shaft(x0,x1,w,stops){ // haste cilindrica com contorno
  ctx.lineCap='round';ctx.strokeStyle=OUT;ctx.lineWidth=w+3;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
  ctx.strokeStyle=vg_(w/2,stops);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x1,0);ctx.stroke();
}
function gem(x,y,r,c0,c1){const g=ctx.createRadialGradient(x-r*.3,y-r*.3,.5,x,y,r);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.strokeStyle=OUT;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill();ctx.stroke();}
function wrap(x0,x1,col){ctx.strokeStyle=col;ctx.lineWidth=1.6;for(let x=x0;x<x1;x+=3.2){ctx.beginPath();ctx.moveTo(x,-3);ctx.lineTo(x+1.6,3);ctx.stroke();}}
function leekShape(len,style){
  ctx.lineCap='round';ctx.lineJoin='round';
  if(style==='bow'){
    const bx=18;
    ctx.strokeStyle=OUT;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(bx-2,-19);ctx.bezierCurveTo(bx+26,-14,bx+26,14,bx-2,19);ctx.stroke();
    ctx.strokeStyle=vg_(5,['#e0b06a','#a8742f','#6b4420']);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(bx-2,-19);ctx.bezierCurveTo(bx+26,-14,bx+26,14,bx-2,19);ctx.stroke();
    ctx.strokeStyle='#f2c94c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx-2,-19);ctx.lineTo(bx-5,-22);ctx.moveTo(bx-2,19);ctx.lineTo(bx-5,22);ctx.stroke();
    ctx.fillStyle='#5a3a1b';ctx.strokeStyle=OUT;ctx.lineWidth=1.5;ctx.fillRect(bx+8,-5,6,10);ctx.strokeRect(bx+8,-5,6,10);
    ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(bx-4,-21);ctx.lineTo(bx-12,0);ctx.lineTo(bx-4,21);ctx.stroke();
    ctx.strokeStyle='#7a4c20';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(bx-12,0);ctx.lineTo(len+8,0);ctx.stroke();
    ctx.fillStyle='#e8404f';ctx.beginPath();ctx.moveTo(bx-12,0);ctx.lineTo(bx-18,-4);ctx.lineTo(bx-8,-1);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(bx-12,0);ctx.lineTo(bx-18,4);ctx.lineTo(bx-8,1);ctx.closePath();ctx.fill();
    const tg=ctx.createLinearGradient(len+2,-4,len+14,4);tg.addColorStop(0,'#fff');tg.addColorStop(1,'#8f9db3');ctx.fillStyle=tg;ctx.strokeStyle=OUT;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(len+15,0);ctx.lineTo(len+5,-4.5);ctx.lineTo(len+5,4.5);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(style==='cannon'){
    shaft(10,16,5,['#9a6a3a','#6b4420','#3a230f']);
    const g=ctx.createLinearGradient(0,-9,0,9);g.addColorStop(0,'#ffe9a0');g.addColorStop(.35,'#d9a53a');g.addColorStop(1,'#6b4a10');
    ctx.fillStyle=g;ctx.strokeStyle=OUT;ctx.lineWidth=2.4;rr(ctx,12,-9,len-6,18,6);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(16,-7,len-16,2.2);
    ctx.fillStyle='#3a3f4a';ctx.strokeStyle=OUT;for(const bx of[20,len-12]){ctx.fillRect(bx,-10,4,20);ctx.strokeRect(bx,-10,4,20);}
    ctx.fillStyle='#2a2f3a';ctx.beginPath();ctx.ellipse(len-3,0,5,10.5,0,0,6.2832);ctx.fill();ctx.stroke();
    ctx.fillStyle='#07080a';ctx.beginPath();ctx.ellipse(len-2,0,3,7.5,0,0,6.2832);ctx.fill();
    ctx.strokeStyle='#ffd23a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(14,-9);ctx.quadraticCurveTo(10,-14,6,-12);ctx.stroke();
    ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.arc(6+Math.sin(now*35),-12,2,0,6.2832);ctx.fill();
  }else if(style==='orb'){
    shaft(10,len-14,5,['#d9a566','#8a5a2b','#4a2c10']);
    ctx.strokeStyle='#f2c94c';ctx.lineWidth=2.6;for(const x of[len*.25,len*.5,len*.75]){ctx.beginPath();ctx.moveTo(x,-3.6);ctx.lineTo(x,3.6);ctx.stroke();}
    const pulse=1+Math.sin(now*5)*0.12;
    const hg=ctx.createRadialGradient(len,0,2,len,0,22*pulse);hg.addColorStop(0,'rgba(210,140,255,.75)');hg.addColorStop(1,'rgba(150,60,230,0)');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(len,0,22*pulse,0,6.2832);ctx.fill();
    ctx.strokeStyle='#f2c94c';ctx.lineWidth=3;for(const sy of[-1,1]){ctx.beginPath();ctx.moveTo(len-12,0);ctx.bezierCurveTo(len-8,sy*13,len+8,sy*13,len+10,sy*3);ctx.stroke();}
    const og=ctx.createRadialGradient(len-2.5,-3,1,len,0,8);og.addColorStop(0,'#ffffff');og.addColorStop(.35,'#e3b0ff');og.addColorStop(1,'#8a3fd0');ctx.fillStyle=og;ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.arc(len,0,8,0,6.2832);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.arc(len-3,-3,2,0,6.2832);ctx.fill();
  }else if(style==='crystal'){
    shaft(10,len-12,5,['#ffffff','#c9d6f0','#8a98c0']);
    ctx.fillStyle='#f2c94c';ctx.strokeStyle=OUT;ctx.lineWidth=1.5;for(const x of[len*.3,len*.65]){ctx.beginPath();ctx.arc(x,0,3.6,0,6.2832);ctx.fill();ctx.stroke();}
    const pulse=1+Math.sin(now*5)*0.15;
    const hg=ctx.createRadialGradient(len+3,0,2,len+3,0,28*pulse);hg.addColorStop(0,'rgba(140,255,255,.85)');hg.addColorStop(.6,'rgba(255,140,230,.35)');hg.addColorStop(1,'rgba(150,80,255,0)');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(len+3,0,28*pulse,0,6.2832);ctx.fill();
    ctx.save();ctx.translate(len+3,0);ctx.rotate(Math.sin(now*2)*.15);
    const cg=ctx.createLinearGradient(-9,-12,9,12);cg.addColorStop(0,'#cffaff');cg.addColorStop(.5,'#9ad8ff');cg.addColorStop(1,'#ff9be8');ctx.fillStyle=cg;ctx.strokeStyle=OUT;ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(3,-10);ctx.lineTo(-10,0);ctx.lineTo(3,10);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(0,0);ctx.lineTo(3,-10);ctx.moveTo(0,0);ctx.lineTo(3,10);ctx.stroke();ctx.restore();
    ctx.fillStyle='#fff';for(let k=0;k<4;k++){const a=now*3+k*1.57,d=18;ctx.beginPath();ctx.arc(len+3+Math.cos(a)*d,Math.sin(a)*d*.8,1.6,0,6.2832);ctx.fill();}
  }else if(style==='club'){
    shaft(10,len-14,6,['#d9a566','#a8742f','#5a3a1b']);wrap(16,34,'#3a2210');
    const cg=ctx.createLinearGradient(0,-11,0,11);cg.addColorStop(0,'#e0b070');cg.addColorStop(.5,'#a8742f');cg.addColorStop(1,'#5a3a1b');
    ctx.fillStyle=cg;ctx.strokeStyle=OUT;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(len-26,-4);ctx.bezierCurveTo(len-14,-6,len-8,-13,len+2,-11);ctx.bezierCurveTo(len+12,-8,len+12,8,len+2,11);ctx.bezierCurveTo(len-8,13,len-14,6,len-26,4);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#7d8696';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(len-12,-8);ctx.lineTo(len-12,8);ctx.stroke();
    for(const [dx,dy] of[[-2,-7],[3,-3],[3,4],[-2,8],[-8,0]]){gem(len+dx,dy,1.9,'#e8eef7','#7d8696');}
  }else if(style==='axe'){
    shaft(10,len-6,5.5,['#d9a566','#8a5a2b','#4a2c10']);wrap(14,30,'#3a2210');
    for(const sy of[-1,1]){const ag=ctx.createLinearGradient(0,0,0,sy*20);ag.addColorStop(0,'#8f9db3');ag.addColorStop(.5,'#e9f0fa');ag.addColorStop(1,'#ffffff');
      ctx.fillStyle=ag;ctx.strokeStyle=OUT;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(len-18,sy*3);ctx.quadraticCurveTo(len-20,sy*14,len-8,sy*21);ctx.quadraticCurveTo(len+4,sy*12,len+2,sy*3);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(len-8,sy*20);ctx.quadraticCurveTo(len+2,sy*12,len+1,sy*5);ctx.stroke();}
    ctx.fillStyle='#f2c94c';ctx.strokeStyle=OUT;ctx.lineWidth=1.5;rr(ctx,len-14,-4.5,14,9,3);ctx.fill();ctx.stroke();gem(len-7,0,2.4,'#ff8a8a','#b01818');
  }else if(style==='mace'){
    shaft(10,len-8,6,['#9aa4b4','#5a6272','#2f3440']);wrap(14,32,'#1a1d24');
    const cx=len;
    for(let a=0;a<6;a++){ctx.save();ctx.translate(cx,0);ctx.rotate(a*1.0472+.52);ctx.fillStyle=vg_(5,['#e9f0fa','#8f9db3','#4a5262']);ctx.strokeStyle=OUT;ctx.lineWidth=1.8;
      ctx.beginPath();ctx.moveTo(6,-4);ctx.lineTo(16,-2.5);ctx.lineTo(19,0);ctx.lineTo(16,2.5);ctx.lineTo(6,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    const mg=ctx.createRadialGradient(cx-3,-3,1,cx,0,10);mg.addColorStop(0,'#ffffff');mg.addColorStop(.5,'#9aa8bd');mg.addColorStop(1,'#4a5262');ctx.fillStyle=mg;ctx.strokeStyle=OUT;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(cx,0,9,0,6.2832);ctx.fill();ctx.stroke();
    gem(cx,0,3.2,'#ff9a9a','#b01818');
  }else if(style==='greatsword'){
    const hg=ctx.createLinearGradient(0,-12,0,12);hg.addColorStop(0,'rgba(255,230,120,0)');hg.addColorStop(.5,'rgba(255,230,120,.55)');hg.addColorStop(1,'rgba(255,230,120,0)');ctx.fillStyle=hg;ctx.fillRect(22,-12,len-18,24);
    gem(9,0,5,'#fff2a8','#c9921a');shaft(12,24,5,['#8a4a2a','#5a2a14','#2a1208']);wrap(13,24,'#f2c94c');
    ctx.fillStyle='#f2c94c';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(27,-3);ctx.lineTo(24,-14);ctx.quadraticCurveTo(30,-12,33,-5);ctx.lineTo(33,5);ctx.quadraticCurveTo(30,12,24,14);ctx.lineTo(27,3);ctx.closePath();ctx.fill();ctx.stroke();
    const bg=ctx.createLinearGradient(0,-6,0,6);bg.addColorStop(0,'#fffbe0');bg.addColorStop(.5,'#f2d870');bg.addColorStop(1,'#b8861c');ctx.fillStyle=bg;ctx.strokeStyle=OUT;ctx.lineWidth=2.4;
    ctx.beginPath();ctx.moveTo(33,-6);ctx.lineTo(len-8,-6);ctx.lineTo(len+10,0);ctx.lineTo(len-8,6);ctx.lineTo(33,6);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(120,70,0,.5)';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(36,0);ctx.lineTo(len-4,0);ctx.stroke();
    ctx.fillStyle='#ff6a3a';for(let x=44;x<len-8;x+=14){ctx.beginPath();ctx.moveTo(x,-2.5);ctx.lineTo(x+3,0);ctx.lineTo(x,2.5);ctx.lineTo(x-3,0);ctx.closePath();ctx.fill();}
    ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(34,-5);ctx.lineTo(len-6,-5);ctx.stroke();
    gem(30,0,2.8,'#ff8a8a','#b01818');
  }else if(style==='sword'){
    gem(9,0,4.2,'#fff2a8','#c9921a');shaft(12,22,5,['#6b4420','#3a2210','#1a0e05']);wrap(13,22,'#c9a867');
    ctx.fillStyle='#f2c94c';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(24,-2.5);ctx.lineTo(22,-11);ctx.quadraticCurveTo(28,-9,29,-3);ctx.lineTo(29,3);ctx.quadraticCurveTo(28,9,22,11);ctx.lineTo(24,2.5);ctx.closePath();ctx.fill();ctx.stroke();
    gem(26,0,2.2,'#8ad0ff','#1a5fb0');
    const bg=ctx.createLinearGradient(0,-5,0,5);bg.addColorStop(0,'#ffffff');bg.addColorStop(.5,'#c6d2e6');bg.addColorStop(1,'#7e8aa3');ctx.fillStyle=bg;ctx.strokeStyle=OUT;ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(29,-4.5);ctx.lineTo(len-8,-4.5);ctx.lineTo(len+9,0);ctx.lineTo(len-8,4.5);ctx.lineTo(29,4.5);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(90,105,135,.7)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(32,0);ctx.lineTo(len-6,0);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(30,-3.4);ctx.lineTo(len-6,-3.4);ctx.stroke();
  }else{ // alho-poro
    const stalk=ctx.createLinearGradient(0,-4,0,4);stalk.addColorStop(0,'#ffffff');stalk.addColorStop(1,'#cfe2b8');
    ctx.strokeStyle='#e8e0cc';ctx.lineWidth=1.2;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(10,k*1.6);ctx.lineTo(3,k*3.2);ctx.stroke();}
    shaft(10,len*.52,7,['#ffffff','#e4efd2','#aac88a']);
    ctx.strokeStyle='rgba(90,130,60,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(len*.2,-3);ctx.lineTo(len*.2,3);ctx.moveTo(len*.35,-3);ctx.lineTo(len*.35,3);ctx.stroke();
    const sx=len*.46;
    [[-.32,'#2f8a2a','#1d5a1c'],[.32,'#3f9f35','#1d5a1c'],[0,'#5cc247','#2a7a26']].forEach(([a,c0,c1],i)=>{
      ctx.save();ctx.translate(sx,0);ctx.rotate(a);
      const lg=ctx.createLinearGradient(0,-8,0,8);lg.addColorStop(0,c0);lg.addColorStop(1,c1);ctx.fillStyle=lg;ctx.strokeStyle=OUT;ctx.lineWidth=1.8;
      const L=len*.56+(i===2?4:0);ctx.beginPath();ctx.moveTo(0,-3);ctx.bezierCurveTo(L*.3,-10-i,L*.7,-8,L,0);ctx.bezierCurveTo(L*.7,8,L*.3,10+i,0,3);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(180,255,140,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(L-5,0);ctx.stroke();ctx.restore();});
  }
}
