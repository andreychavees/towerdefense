const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}

rep("function drawSeg(type,sg,r,i,ang,armor){",
`function drawDragonHead(r){
  const sc=r/29,OL='#2a0606';
  ctx.save();ctx.scale(sc,sc);ctx.lineJoin='round';ctx.lineCap='round';
  // franja/crista de espinhos atras da cabeca
  for(let i=-3;i<=3;i++){
    const a=-Math.PI/2+i*0.44,L=44-Math.abs(i)*3.5;
    ctx.fillStyle=i%2?'#6e0f12':'#9c1a1c';ctx.strokeStyle=OL;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(Math.cos(a-.24)*18,Math.sin(a-.24)*18);ctx.lineTo(Math.cos(a)*L,Math.sin(a)*L);ctx.lineTo(Math.cos(a+.24)*18,Math.sin(a+.24)*18);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,150,90,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(Math.cos(a)*20,Math.sin(a)*20);ctx.lineTo(Math.cos(a)*(L-5),Math.sin(a)*(L-5));ctx.stroke();
  }
  // chifres curvos com aneis
  for(const sx of[-1,1]){
    const g=ctx.createLinearGradient(sx*10,-20,sx*40,-44);g.addColorStop(0,'#fff3cf');g.addColorStop(1,'#c9a867');
    ctx.fillStyle=g;ctx.strokeStyle=OL;ctx.lineWidth=2.2;
    ctx.beginPath();ctx.moveTo(sx*11,-17);ctx.bezierCurveTo(sx*34,-18,sx*44,-30,sx*38,-50);ctx.bezierCurveTo(sx*32,-36,sx*20,-30,sx*6,-12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(110,80,30,.55)';ctx.lineWidth=1.4;
    for(let k=0;k<4;k++){const t=.25+k*.17;ctx.beginPath();ctx.moveTo(sx*(14+t*22),-18-t*18);ctx.lineTo(sx*(10+t*22),-14-t*18+4);ctx.stroke();}
  }
  // espinhos de bochecha
  ctx.fillStyle='#7d1214';ctx.strokeStyle=OL;ctx.lineWidth=2;
  for(const sx of[-1,1]){
    ctx.beginPath();ctx.moveTo(sx*24,2);ctx.lineTo(sx*42,10);ctx.lineTo(sx*25,14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx*24,14);ctx.lineTo(sx*38,24);ctx.lineTo(sx*21,24);ctx.closePath();ctx.fill();ctx.stroke();
  }
  // cranio
  let g=ctx.createRadialGradient(-8,-14,3,0,0,34);g.addColorStop(0,'#ff8a5c');g.addColorStop(.55,'#c6281f');g.addColorStop(1,'#661010');
  ctx.fillStyle=g;ctx.strokeStyle=OL;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(0,-27);ctx.bezierCurveTo(22,-27,31,-9,27,8);ctx.bezierCurveTo(25,18,17,22,13,30);ctx.lineTo(-13,30);ctx.bezierCurveTo(-17,22,-25,18,-27,8);ctx.bezierCurveTo(-31,-9,-22,-27,0,-27);ctx.closePath();ctx.fill();ctx.stroke();
  // escamas da testa
  ctx.save();ctx.clip();ctx.strokeStyle='rgba(60,5,5,.4)';ctx.lineWidth=1.4;
  for(let row=0;row<4;row++)for(let c=-3;c<=3;c++){ctx.beginPath();ctx.arc(c*8+(row%2?4:0),-22+row*7,4.5,0.2,2.95);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,.17)';ctx.beginPath();ctx.ellipse(-8,-18,13,4.5,-.4,0,6.28);ctx.fill();ctx.restore();
  // focinho alongado
  g=ctx.createLinearGradient(0,8,0,42);g.addColorStop(0,'#e0502a');g.addColorStop(1,'#a82a18');
  ctx.fillStyle=g;ctx.strokeStyle=OL;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(-14,8);ctx.bezierCurveTo(-19,24,-15,40,0,42);ctx.bezierCurveTo(15,40,19,24,14,8);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(60,5,5,.4)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(0,22);ctx.stroke();
  // boca aberta com presas
  ctx.fillStyle='#2a0505';ctx.strokeStyle=OL;ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(-12,28);ctx.quadraticCurveTo(0,22,12,28);ctx.quadraticCurveTo(10,40,0,41);ctx.quadraticCurveTo(-10,40,-12,28);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff8e0';ctx.strokeStyle='#3a0808';ctx.lineWidth=1.3;
  for(const x of[-9,-5,5,9]){ctx.beginPath();ctx.moveTo(x-2.2,26.5);ctx.lineTo(x+2.2,26.5);ctx.lineTo(x,x===-9||x===9?36:33);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle='#e0536b';ctx.beginPath();ctx.ellipse(0,37,5,2.8,0,0,6.28);ctx.fill();
  // narinas com fumaca
  ctx.fillStyle='#2a0505';for(const sx of[-1,1]){ctx.beginPath();ctx.ellipse(sx*5.5,14,2.3,3.4,sx*.3,0,6.28);ctx.fill();}
  ctx.fillStyle='rgba(200,200,200,'+(0.25+0.15*Math.sin(now*6))+')';
  for(const sx of[-1,1]){ctx.beginPath();ctx.arc(sx*7,8-Math.sin(now*5)*2,3,0,6.28);ctx.fill();}
  // sobrancelhas pesadas
  ctx.fillStyle='#4a0a0c';ctx.strokeStyle=OL;ctx.lineWidth=2;
  for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*3,-6);ctx.lineTo(sx*24,-14);ctx.lineTo(sx*25,-6);ctx.lineTo(sx*5,-1);ctx.closePath();ctx.fill();ctx.stroke();}
  // olhos brilhantes de fenda
  for(const sx of[-1,1]){
    ctx.save();ctx.translate(sx*13,-1.5);ctx.rotate(sx*0.3);
    const eg=ctx.createRadialGradient(0,0,1,0,0,12);eg.addColorStop(0,'rgba(255,230,80,.9)');eg.addColorStop(1,'rgba(255,120,0,0)');ctx.fillStyle=eg;ctx.beginPath();ctx.arc(0,0,12,0,6.28);ctx.fill();
    ctx.fillStyle='#ffd22a';ctx.strokeStyle=OL;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,7,5,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(0,0,1.7,4.6,0,0,6.28);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-2.4,-1.8,1.1,0,6.28);ctx.fill();
    ctx.restore();
  }
  // chama saindo da boca
  const f=Math.sin(now*18)*2.2;
  ctx.fillStyle='#ff7a1a';ctx.beginPath();ctx.moveTo(-8,36);ctx.quadraticCurveTo(-12+f,52,0,58+f);ctx.quadraticCurveTo(12-f,52,8,36);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffd23a';ctx.beginPath();ctx.moveTo(-4,38);ctx.quadraticCurveTo(-4,48,0,52);ctx.quadraticCurveTo(4,48,4,38);ctx.closePath();ctx.fill();
  ctx.restore();
}
function drawSeg(type,sg,r,i,ang,armor){`);
rep("  }else{ // dragao","  }else if(head){drawDragonHead(r);\n  }else{ // dragao");
rep("ctx.strokeText(sg.hp,p.x,p.y-r-6);ctx.fillText(sg.hp,p.x,p.y-r-6);","ctx.strokeText(sg.hp,p.x,p.y-r-(type==='dragon'?24:6));ctx.fillText(sg.hp,p.x,p.y-r-(type==='dragon'?24:6));");
// brilho branco do flash so em segmentos redondos
rep("if(sg.flash>0){ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();}","if(sg.flash>0&&!(type==='dragon'&&head)){ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();}");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
