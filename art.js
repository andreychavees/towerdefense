// ---------- Arte (procedural) ----------
const OUT='#3a2614';
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}

let bgCache=null;
function buildBG(){
  const o=document.createElement('canvas');o.width=W;o.height=H;const g=o.getContext('2d');
  for(let y=0;y<H;y+=40)for(let x=0;x<W;x+=40){
    const gr=g.createLinearGradient(x,y,x,y+40);const l=((x+y)/40)%2;
    gr.addColorStop(0,l?'#98d85f':'#86c84c');gr.addColorStop(1,l?'#8bcc54':'#79bb42');g.fillStyle=gr;g.fillRect(x,y,40,40);
  }
  let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  g.strokeStyle='rgba(50,110,30,.35)';g.lineWidth=1.5;g.lineCap='round';
  for(let i=0;i<140;i++){const x=rnd()*W,y=rnd()*H;g.beginPath();g.moveTo(x-3,y);g.lineTo(x-4,y-5);g.moveTo(x,y);g.lineTo(x,y-7);g.moveTo(x+3,y);g.lineTo(x+4,y-5);g.stroke();}
  for(let i=0;i<18;i++){const x=rnd()*W,y=rnd()*H;if(nearestOnPath(x,y).dist<40)continue;
    g.fillStyle=i%2?'#fff6a8':'#ffffff';for(let k=0;k<5;k++){g.beginPath();g.arc(x+Math.cos(k*1.256)*3.5,y+Math.sin(k*1.256)*3.5,2.6,0,6.28);g.fill();}
    g.fillStyle='#f3a712';g.beginPath();g.arc(x,y,2.2,0,6.28);g.fill();}
  // caminho
  g.lineCap='round';g.lineJoin='round';
  const stroke=(w,c,dy=0)=>{g.beginPath();PATH.forEach((p,i)=>i?g.lineTo(p[0],p[1]+dy):g.moveTo(p[0],p[1]+dy));g.strokeStyle=c;g.lineWidth=w;g.stroke();};
  stroke(68,'rgba(0,0,0,.22)',5);stroke(66,'#a8742f');stroke(60,'#e9c47a');stroke(46,'#f3d995');
  for(let i=0;i<110;i++){const d=rnd()*PLEN,p=posAt(d);const x=p.x+(rnd()-.5)*50,y=p.y+(rnd()-.5)*50;if(nearestOnPath(x,y).dist>26)continue;
    g.fillStyle='rgba(150,105,50,.35)';g.beginPath();g.ellipse(x,y,2+rnd()*2.5,1.5+rnd()*1.5,0,0,6.28);g.fill();}
  // cercas laterais
  const fence=(x,y0,y1)=>{g.strokeStyle='#55687a';g.lineWidth=2;g.beginPath();g.moveTo(x-6,y0);g.lineTo(x+6,y1);g.moveTo(x+6,y0);g.lineTo(x-6,y1);g.stroke();
    g.strokeStyle='#2f3b46';g.lineWidth=3.5;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();};
  fence(10,90,230);fence(350,180,330);fence(12,380,500);fence(348,400,520);
  const rock=(x,y,r)=>{g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(x+2,y+r*.6,r*1.1,r*.5,0,0,6.28);g.fill();
    const gr=g.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);gr.addColorStop(0,'#d8d0c0');gr.addColorStop(1,'#8f8878');g.fillStyle=gr;g.strokeStyle='#5a5448';g.lineWidth=2;g.beginPath();g.ellipse(x,y,r,r*.75,0,0,6.28);g.fill();g.stroke();};
  [[24,300,13],[336,100,12],[28,236,9],[330,545,11],[300,60,10],[32,620,14]].forEach(a=>rock(...a));
  const cone=(x,y)=>{g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(x,y+12,11,4,0,0,6.28);g.fill();
    g.fillStyle='#ff6a1f';g.strokeStyle='#8a2c05';g.lineWidth=1.5;g.beginPath();g.moveTo(x,y-14);g.lineTo(x+9,y+11);g.lineTo(x-9,y+11);g.closePath();g.fill();g.stroke();
    g.fillStyle='#fff';g.fillRect(x-5,y-1,10,4);g.fillStyle='#d9531a';g.fillRect(x-11,y+10,22,4);};
  [[326,180],[24,440],[332,360],[22,520],[300,585]].forEach(a=>cone(...a));
  g.fillStyle='#2c9e8e';g.strokeStyle='#145a50';g.lineWidth=2.5;rr(g,300,98,50,34,8);g.fill();g.stroke();
  g.fillStyle='#1d6d62';for(let i=0;i<3;i++)for(let j=0;j<2;j++){g.beginPath();g.arc(314+i*12,109+j*12,4,0,6.28);g.fill();}
  for(let x=-10;x<W+20;x+=34){const gr=g.createRadialGradient(x,6,2,x,10,22);gr.addColorStop(0,'#5fae35');gr.addColorStop(1,'#3a7a22');g.fillStyle=gr;g.beginPath();g.arc(x,6,20,0,6.28);g.fill();}
  g.fillStyle='#7a5230';for(let x=0;x<W;x+=16){g.fillRect(x,0,10,12);}
  bgCache=o;
}
function drawBG(){if(!bgCache)buildBG();ctx.drawImage(bgCache,0,0);}

function leekShape(len){
  ctx.lineCap='round';
  ctx.strokeStyle=OUT;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len,0);ctx.stroke();
  ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(len*.55,0);ctx.stroke();
  ctx.strokeStyle='#52b83f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(len*.55,0);ctx.lineTo(len,0);ctx.stroke();
  ctx.strokeStyle='#8fe070';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(len*.58,-1.5);ctx.lineTo(len-2,-1.5);ctx.stroke();
}
function drawCat(c,x,y,lifted){
  const lvl=c.lvl,col=COLORS[Math.min(lvl-1,COLORS.length-1)];
  const bob=Math.sin(now*5+c.id)*1.2;
  const n=leeks(c);
  ctx.save();ctx.translate(x,y);
  if(lvl>=3){const gr=ctx.createRadialGradient(0,0,6,0,0,30);gr.addColorStop(0,col+'88');gr.addColorStop(1,col+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,30,0,6.28);ctx.fill();}
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=10;ctx.lineCap='round';
  for(let k=0;k<n;k++){const a=c.ang+k*6.2832/n;ctx.beginPath();ctx.arc(0,0,reach(c)-8,a-0.9,a-0.1);ctx.stroke();}
  ctx.restore();
  for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(reach(c)+4);
    ctx.fillStyle='#ffe1c9';ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.arc(12,0,5,0,6.28);ctx.fill();ctx.stroke();ctx.restore();}
  const sc=1+c.pop*0.4+(lvl-1)*0.035;ctx.scale(sc,sc);
  if(lifted)ctx.translate(0,-8);
  ctx.translate(0,bob*0.5);
  ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,13,14,5,0,0,6.28);ctx.fill();
  ctx.strokeStyle=OUT;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(8,9);ctx.quadraticCurveTo(22,8,18,-4);ctx.stroke();
  ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();
  let gr=ctx.createLinearGradient(0,4,0,15);gr.addColorStop(0,'#fff8ee');gr.addColorStop(1,'#e3d2b8');
  ctx.fillStyle=gr;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,9,10,7,0,0,6.28);ctx.fill();ctx.stroke();
  for(const sx of[-1,1]){
    ctx.fillStyle='#e8404f';ctx.strokeStyle=OUT;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(sx*17,-3);ctx.lineTo(sx*14,-20);ctx.lineTo(sx*3,-11);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffb3bd';ctx.beginPath();ctx.moveTo(sx*13.5,-6);ctx.lineTo(sx*12.5,-15);ctx.lineTo(sx*6,-10);ctx.closePath();ctx.fill();
  }
  gr=ctx.createRadialGradient(-5,-8,2,0,0,19);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#f0e2cc');
  ctx.fillStyle=gr;ctx.strokeStyle=OUT;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,0,18,14.5,0,0,6.28);ctx.fill();ctx.stroke();
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,18,14.5,0,0,6.28);ctx.clip();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-9,-16);ctx.quadraticCurveTo(-1,-3,9,-16);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(-16,2,6,8,0,0,6.28);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-6,-10,7,3,-0.4,0,6.28);ctx.fill();ctx.restore();
  const blink=(Math.sin(now*0.9+c.id*3)>0.985);
  for(const sx of[-1,1]){
    if(blink){ctx.strokeStyle=OUT;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx*7-3,1);ctx.lineTo(sx*7+3,1);ctx.stroke();continue;}
    ctx.fillStyle='#fff';ctx.strokeStyle=OUT;ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(sx*7,1,4.6,5.4,0,0,6.28);ctx.fill();ctx.stroke();
    ctx.fillStyle='#33b34a';ctx.beginPath();ctx.ellipse(sx*7+Math.cos(c.ang)*0.8,1.5,3.3,4.2,0,0,6.28);ctx.fill();
    ctx.fillStyle='#0f3d1a';ctx.beginPath();ctx.ellipse(sx*7+Math.cos(c.ang)*0.8,1.8,1.6,2.5,0,0,6.28);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sx*7-1,-1,1.3,0,6.28);ctx.fill();
  }
  ctx.fillStyle='rgba(255,120,140,.45)';ctx.beginPath();ctx.ellipse(-12,7,3.2,2,0,0,6.28);ctx.ellipse(12,7,3.2,2,0,0,6.28);ctx.fill();
  ctx.fillStyle='#ff6f91';ctx.beginPath();ctx.moveTo(-2,6);ctx.lineTo(2,6);ctx.lineTo(0,8.4);ctx.closePath();ctx.fill();
  ctx.strokeStyle=OUT;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,8.4);ctx.lineTo(0,10);ctx.moveTo(-3.5,10.5);ctx.quadraticCurveTo(-1.6,12,0,10);ctx.quadraticCurveTo(1.6,12,3.5,10.5);ctx.stroke();
  ctx.restore();
  ctx.font='900 16px system-ui';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#0b3d0b';ctx.fillStyle='#74ff74';
  ctx.strokeText(lvl,x-20,y-17);ctx.fillText(lvl,x-20,y-17);
}
function drawJar(j){
  const p=posAt(j.d),col=COLORS[Math.min(j.lvl-1,COLORS.length-1)];
  ctx.save();ctx.translate(p.x,p.y+Math.sin(now*4+j.d*.05)*1);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,17,16,6,0,0,6.28);ctx.fill();
  ctx.save();ctx.scale(.8,.8);ctx.translate(0,2);
  ctx.fillStyle='#e8404f';ctx.strokeStyle=OUT;ctx.lineWidth=2;
  for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*13,-3);ctx.lineTo(sx*11,-16);ctx.lineTo(sx*3,-9);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle='#fff8ee';ctx.beginPath();ctx.ellipse(0,0,14,12,0,0,6.28);ctx.fill();ctx.stroke();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-7,-11);ctx.quadraticCurveTo(0,-2,7,-11);ctx.fill();
  for(const sx of[-1,1]){ctx.fillStyle='#fff';ctx.strokeStyle=OUT;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(sx*5.5,1,3.4,4,0,0,6.28);ctx.fill();ctx.stroke();ctx.fillStyle='#33b34a';ctx.beginPath();ctx.ellipse(sx*5.5,2,2.2,3,0,0,6.28);ctx.fill();}
  ctx.restore();
  const body=()=>{ctx.beginPath();ctx.moveTo(-9,-15);ctx.lineTo(-9,-10);ctx.bezierCurveTo(-21,-7,-20,14,-12,16);ctx.lineTo(12,16);ctx.bezierCurveTo(20,14,21,-7,9,-10);ctx.lineTo(9,-15);ctx.closePath();};
  const gr=ctx.createLinearGradient(-18,0,18,0);gr.addColorStop(0,'rgba(190,230,255,.55)');gr.addColorStop(.5,'rgba(220,245,255,.25)');gr.addColorStop(1,'rgba(150,200,240,.6)');
  ctx.fillStyle=j.flash>0?'rgba(255,255,255,.9)':gr;body();ctx.fill();ctx.strokeStyle='#3f6f96';ctx.lineWidth=2.6;ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,-2);ctx.quadraticCurveTo(-15,8,-11,12);ctx.stroke();
  ctx.fillStyle='#c98d4b';ctx.strokeStyle='#6b4420';ctx.lineWidth=2;rr(ctx,-9,-20,18,7,2);ctx.fill();ctx.stroke();
  ctx.restore();
  ctx.font='900 17px system-ui';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#000';ctx.fillStyle='#fff';
  ctx.strokeText(j.hp,p.x,p.y-26);ctx.fillText(j.hp,p.x,p.y-26);
}
function stoneSeg(r,flash,head){
  const gr=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r*1.05);
  if(flash>0){gr.addColorStop(0,'#fff');gr.addColorStop(1,'#ddd');}
  else if(head){gr.addColorStop(0,'#c98a5a');gr.addColorStop(.6,'#8a4f2c');gr.addColorStop(1,'#4a2614');}
  else{gr.addColorStop(0,'#b8b2a6');gr.addColorStop(.6,'#7d776c');gr.addColorStop(1,'#46423b');}
  ctx.fillStyle=gr;ctx.strokeStyle=head?'#2a140a':'#2f2c27';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,6.28);ctx.fill();ctx.stroke();
}
function drawWorm(){
  if(!worm)return;
  for(let i=worm.segs.length-1;i>=0;i--){
    const sg=worm.segs[i],p=posAt(worm.d-i*worm.gap);
    if(p.y<-30)continue;
    const r=sg.head?25:18;
    ctx.save();ctx.translate(p.x,p.y);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(3,r*.75,r,r*.45,0,0,6.28);ctx.fill();
    if(sg.head){
      ctx.fillStyle='#5a2f18';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;
      for(let a=0;a<10;a++){const an=a/10*6.2832+.3;ctx.beginPath();ctx.moveTo(Math.cos(an-.18)*r,Math.sin(an-.18)*r);ctx.lineTo(Math.cos(an)*(r+9),Math.sin(an)*(r+9));ctx.lineTo(Math.cos(an+.18)*r,Math.sin(an+.18)*r);ctx.fill();ctx.stroke();}
    }
    stoneSeg(r,sg.flash,sg.head);
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-1.5,0,6.28);ctx.clip();
    if(!sg.head){
      ctx.strokeStyle='rgba(30,28,24,.5)';ctx.lineWidth=1.6;
      for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){const cx=col*10+(row%2?5:0),cy=row*9;ctx.beginPath();ctx.arc(cx,cy,6,0,3.14);ctx.stroke();}
      ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.ellipse(-6,-9,9,4,-.5,0,6.28);ctx.fill();
    }else{
      ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.ellipse(-8,-12,11,4,-.5,0,6.28);ctx.fill();
      for(const sx of[-1,1]){ctx.fillStyle='#fff8d0';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx*9,-5,6,6.5,0,0,6.28);ctx.fill();ctx.stroke();
        ctx.fillStyle='#d11';ctx.beginPath();ctx.arc(sx*9,-4,2.8,0,6.28);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(sx*9,-4,1.3,0,6.28);ctx.fill();
        ctx.strokeStyle='#2a140a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx*15,-14);ctx.lineTo(sx*3,-8);ctx.stroke();}
      ctx.fillStyle='#3a0b0b';ctx.strokeStyle='#2a140a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,10,13,8,0,0,6.28);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*3.6-2,3.5);ctx.lineTo(k*3.6+2,3.5);ctx.lineTo(k*3.6,9);ctx.fill();}
      ctx.fillStyle='#e0536b';ctx.beginPath();ctx.ellipse(0,15,6,3,0,0,6.28);ctx.fill();
    }
    ctx.restore();
    ctx.restore();
    ctx.textAlign='center';
    if(sg.head){ctx.font='900 22px system-ui';ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.fillStyle='#e01b1b';ctx.strokeText(sg.hp,p.x,p.y-30);ctx.fillText(sg.hp,p.x,p.y-30);}
    else{ctx.font='900 15px system-ui';ctx.lineWidth=3.5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(sg.hp,p.x,p.y+5.5);ctx.fillText(sg.hp,p.x,p.y+5.5);}
    if(sg.flash>0)sg.flash-=0.016;
  }
}

