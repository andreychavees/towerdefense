// ---------- Mapa (pintado proceduralmente, 2x de resolucao) ----------
let bgCache=null;
function buildBG(){
  const o=document.createElement('canvas');o.width=W*2;o.height=H*2;const g=o.getContext('2d');g.scale(2,2);
  let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const rr_=(a,b)=>a+rnd()*(b-a);
  // ---- grama: base + manchas macias de tons variados ----
  let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#7fbf4a');gr.addColorStop(.5,'#88c953');gr.addColorStop(1,'#74b543');g.fillStyle=gr;g.fillRect(0,0,W,H);
  for(let i=0;i<150;i++){const x=rnd()*W,y=rnd()*H,r=rr_(25,70),dark=rnd()<.5;
    const rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,dark?'rgba(40,100,30,.20)':'rgba(190,235,110,.20)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,6.2832);g.fill();}
  // gramado em listras suaves (corte de grama)
  for(let y=0;y<H;y+=46){g.fillStyle='rgba(255,255,200,.045)';g.fillRect(0,y,W,23);}
  // folhas de grama
  g.lineCap='round';
  const blades=['#4f9a2c','#62b238','#9ad65a','#3f8a24','#b5e56f'];
  for(let i=0;i<2600;i++){const x=rnd()*W,y=rnd()*H,h=rr_(3,8),bend=rr_(-3,3);
    g.strokeStyle=blades[Math.floor(rnd()*blades.length)];g.globalAlpha=rr_(.25,.6);g.lineWidth=rr_(.8,1.5);
    g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+bend*.4,y-h*.6,x+bend,y-h);g.stroke();}
  g.globalAlpha=1;
  // ---- caminho de terra ----
  g.lineCap='round';g.lineJoin='round';
  const stroke=(w,c,dy=0,blur=0,sc='rgba(0,0,0,.4)')=>{g.save();g.shadowBlur=blur;g.shadowColor=sc;g.beginPath();PATH.forEach((p,i)=>i?g.lineTo(p[0],p[1]+dy):g.moveTo(p[0],p[1]+dy));g.strokeStyle=c;g.lineWidth=w;g.stroke();g.restore();};
  stroke(76,'rgba(40,25,5,.35)',4,10);
  stroke(68,'#7a5326');
  stroke(62,'#b88a47');
  stroke(54,'#d8b46e');
  stroke(40,'#e6c887');
  // manchas e textura de terra
  for(let i=0;i<420;i++){const d=rnd()*PLEN,p=posAt(d),ox=rr_(-24,24),oy=rr_(-24,24),x=p.x+ox,y=p.y+oy;if(nearestOnPath(x,y).dist>25)continue;
    g.fillStyle=rnd()<.5?'rgba(150,100,40,.18)':'rgba(255,240,190,.2)';g.beginPath();g.ellipse(x,y,rr_(2,9),rr_(1.5,6),rnd()*3,0,6.2832);g.fill();}
  for(let i=0;i<260;i++){const d=rnd()*PLEN,p=posAt(d),x=p.x+rr_(-23,23),y=p.y+rr_(-23,23);if(nearestOnPath(x,y).dist>24)continue;
    g.fillStyle='rgba(95,65,25,.45)';g.beginPath();g.arc(x,y,rr_(.5,1.3),0,6.2832);g.fill();}
  // pedrinhas com sombra e brilho
  for(let i=0;i<70;i++){const d=rnd()*PLEN,p=posAt(d),x=p.x+rr_(-22,22),y=p.y+rr_(-22,22);if(nearestOnPath(x,y).dist>23)continue;
    const r=rr_(1.5,3.2);g.fillStyle='rgba(60,35,10,.3)';g.beginPath();g.ellipse(x+1,y+1.4,r,r*.7,0,0,6.2832);g.fill();
    const rg=g.createRadialGradient(x-r*.3,y-r*.3,.3,x,y,r);rg.addColorStop(0,'#f1e6cc');rg.addColorStop(1,'#a3926f');g.fillStyle=rg;g.beginPath();g.ellipse(x,y,r,r*.75,0,0,6.2832);g.fill();}
  // marcas de rodas/passos
  g.strokeStyle='rgba(120,80,30,.22)';g.lineWidth=2;
  for(const off of[-9,9]){g.beginPath();let first=true;for(let d=0;d<PLEN;d+=6){const p=posAt(d),a=angAt(d)+Math.PI/2,j=Math.sin(d*.05)*1.2;const x=p.x+Math.cos(a)*(off+j),y=p.y+Math.sin(a)*(off+j);if(first){g.moveTo(x,y);first=false;}else g.lineTo(x,y);}g.stroke();}
  // borda de pedras e tufos de grama invadindo o caminho
  for(let d=0;d<PLEN;d+=8){
    for(const side of[-1,1]){
      const p=posAt(d),a=angAt(d)+Math.PI/2*side,off=rr_(30,35),x=p.x+Math.cos(a)*off,y=p.y+Math.sin(a)*off;
      if(nearestOnPath(x,y).dist<27)continue;
      const r=rr_(3.2,5.4);
      g.fillStyle='rgba(30,40,10,.35)';g.beginPath();g.ellipse(x+1.2,y+2,r*1.05,r*.7,0,0,6.2832);g.fill();
      const rg=g.createRadialGradient(x-r*.35,y-r*.4,.5,x,y,r*1.1);rg.addColorStop(0,'#e7e1d2');rg.addColorStop(.6,'#a8a08e');rg.addColorStop(1,'#6f6858');
      g.fillStyle=rg;g.strokeStyle='rgba(50,45,35,.7)';g.lineWidth=1;g.beginPath();g.ellipse(x,y,r,r*.8,rnd()*3,0,6.2832);g.fill();g.stroke();
      if(rnd()<.25){g.fillStyle='rgba(90,150,50,.6)';g.beginPath();g.ellipse(x-r*.3,y-r*.4,r*.5,r*.25,0,0,6.2832);g.fill();}
      if(rnd()<.35){g.strokeStyle=blades[Math.floor(rnd()*3)];g.lineWidth=1.2;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x+rr_(-4,4),y+3);g.lineTo(x+rr_(-6,6),y-rr_(5,9));g.stroke();}}
    }}
  // ---- decoracao ----
  const shadow=(x,y,rx,ry,al=.28)=>{g.fillStyle='rgba(20,40,10,'+al+')';g.beginPath();g.ellipse(x,y,rx,ry,0,0,6.2832);g.fill();};
  const leafBlob=(x,y,r,c0,c1,c2)=>{const rg=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);rg.addColorStop(0,c0);rg.addColorStop(.6,c1);rg.addColorStop(1,c2);g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,6.2832);g.fill();};
  const bush=(x,y,s,berries)=>{shadow(x+3,y+s*.55,s*1.2,s*.5);
    [[-.55,.1,.7],[.55,.1,.7],[0,-.35,.85],[0,.2,.8]].forEach(b=>leafBlob(x+b[0]*s,y+b[1]*s,b[2]*s,'#8fdc5a','#4aa233','#235c1c'));
    for(let i=0;i<14;i++){const a=rnd()*6.28,d=rnd()*s*.9;g.fillStyle=rnd()<.5?'rgba(180,240,110,.55)':'rgba(25,75,25,.4)';g.beginPath();g.ellipse(x+Math.cos(a)*d,y-s*.1+Math.sin(a)*d*.8,2.4,1.5,rnd()*3,0,6.2832);g.fill();}
    if(berries)for(let i=0;i<7;i++){const a=rnd()*6.28,d=rnd()*s*.8;g.fillStyle='#e8344a';g.strokeStyle='#7a0f1c';g.lineWidth=.8;g.beginPath();g.arc(x+Math.cos(a)*d,y-s*.1+Math.sin(a)*d*.7,1.8,0,6.2832);g.fill();g.stroke();}};
  const tree=(x,y,s)=>{shadow(x+s*.5,y+s*.5,s*1.4,s*.55,.3);
    const tg=g.createLinearGradient(x-s*.2,0,x+s*.2,0);tg.addColorStop(0,'#8a5a2b');tg.addColorStop(.5,'#6b4220');tg.addColorStop(1,'#46290f');
    g.fillStyle=tg;g.beginPath();g.moveTo(x-s*.18,y+s*.5);g.quadraticCurveTo(x-s*.12,y,x-s*.1,y-s*.3);g.lineTo(x+s*.1,y-s*.3);g.quadraticCurveTo(x+s*.12,y,x+s*.2,y+s*.5);g.closePath();g.fill();
    [[-.7,-.4,.8],[.7,-.45,.8],[0,-1.05,.95],[-.35,-.7,.9],[.4,-.75,.9]].forEach(b=>leafBlob(x+b[0]*s,y+b[1]*s,b[2]*s,'#9ee35f','#4fa634','#1f5a1b'));
    for(let i=0;i<46;i++){const a=rnd()*6.28,d=Math.sqrt(rnd())*s*1.2;const px=x+Math.cos(a)*d,py=y-s*.7+Math.sin(a)*d*.8;
      g.fillStyle=rnd()<.5?'rgba(200,250,120,.5)':'rgba(15,70,20,.4)';g.beginPath();g.ellipse(px,py,3.4,2.2,rnd()*3,0,6.2832);g.fill();}};
  const pine=(x,y,s)=>{shadow(x+s*.4,y+s*.6,s*1.0,s*.4,.3);g.fillStyle='#5a3a1b';g.fillRect(x-s*.1,y+s*.1,s*.2,s*.5);
    for(let i=0;i<4;i++){const yy=y-i*s*.5,w=s*(1-i*.17);const pg=g.createLinearGradient(x-w,0,x+w,0);pg.addColorStop(0,'#2f7a3a');pg.addColorStop(.5,'#4fae55');pg.addColorStop(1,'#1d5a2a');
      g.fillStyle=pg;g.strokeStyle='rgba(10,45,20,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x,yy-s*.9);g.quadraticCurveTo(x+w*.4,yy-s*.2,x+w,yy+s*.15);g.quadraticCurveTo(x,yy+s*.35,x-w,yy+s*.15);g.quadraticCurveTo(x-w*.4,yy-s*.2,x,yy-s*.9);g.closePath();g.fill();g.stroke();}};
  const rock=(x,y,s)=>{shadow(x+2,y+s*.5,s*1.2,s*.45,.32);
    const rg=g.createLinearGradient(x-s,y-s,x+s,y+s);rg.addColorStop(0,'#cfc9ba');rg.addColorStop(.5,'#9a9484');rg.addColorStop(1,'#625d50');
    g.fillStyle=rg;g.strokeStyle='#454034';g.lineWidth=1.6;g.beginPath();g.moveTo(x-s,y+s*.3);g.lineTo(x-s*.7,y-s*.5);g.lineTo(x-s*.1,y-s*.85);g.lineTo(x+s*.7,y-s*.5);g.lineTo(x+s,y+s*.2);g.lineTo(x+s*.4,y+s*.55);g.lineTo(x-s*.6,y+s*.55);g.closePath();g.fill();g.stroke();
    g.strokeStyle='rgba(40,36,28,.45)';g.lineWidth=1;g.beginPath();g.moveTo(x-s*.1,y-s*.85);g.lineTo(x,y-s*.1);g.lineTo(x+s*.7,y-s*.5);g.moveTo(x,y-s*.1);g.lineTo(x-s*.6,y+s*.55);g.stroke();
    g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.moveTo(x-s*.7,y-s*.5);g.lineTo(x-s*.1,y-s*.85);g.lineTo(x,y-s*.1);g.lineTo(x-s*.55,y+s*.1);g.closePath();g.fill();
    g.fillStyle='rgba(95,160,55,.65)';g.beginPath();g.ellipse(x-s*.3,y-s*.72,s*.45,s*.18,-.3,0,6.2832);g.fill();};
  const flowers=(x,y,n,pal)=>{for(let i=0;i<n;i++){const fx=x+rr_(-14,14),fy=y+rr_(-10,10),c=pal[Math.floor(rnd()*pal.length)];
      g.strokeStyle='#3f8a24';g.lineWidth=1.2;g.beginPath();g.moveTo(fx,fy+5);g.lineTo(fx,fy);g.stroke();
      g.fillStyle=c;for(let k=0;k<5;k++){g.beginPath();g.ellipse(fx+Math.cos(k*1.2566)*2.6,fy+Math.sin(k*1.2566)*2.6,2.1,1.6,k*1.2566,0,6.2832);g.fill();}
      g.fillStyle='#f6b91c';g.beginPath();g.arc(fx,fy,1.5,0,6.2832);g.fill();}};
  const mushroom=(x,y,s)=>{shadow(x+1,y+s*.6,s*.9,s*.3,.25);g.fillStyle='#f3e8d0';g.strokeStyle='#8a7a5a';g.lineWidth=1;g.beginPath();g.moveTo(x-s*.25,y+s*.5);g.lineTo(x-s*.18,y);g.lineTo(x+s*.18,y);g.lineTo(x+s*.25,y+s*.5);g.closePath();g.fill();g.stroke();
    const mg=g.createRadialGradient(x-s*.3,y-s*.4,1,x,y-s*.1,s);mg.addColorStop(0,'#ff7a6a');mg.addColorStop(1,'#c2271c');g.fillStyle=mg;g.strokeStyle='#6a0e0a';g.lineWidth=1.2;g.beginPath();g.ellipse(x,y,s,s*.7,0,Math.PI,0);g.closePath();g.fill();g.stroke();
    g.fillStyle='#fff';[[-.4,-.3],[.2,-.5],[.5,-.2]].forEach(d=>{g.beginPath();g.arc(x+d[0]*s,y+d[1]*s,s*.15,0,6.2832);g.fill();});};
  const fenceRun=(x,y0,y1)=>{ // cerca de madeira com sombra e veios
    for(let y=y0;y<y1;y+=24){shadow(x+4,y+22,7,3,.25);}
    for(const dy of[8,20]){const rg=g.createLinearGradient(x-4,0,x+4,0);rg.addColorStop(0,'#c9965a');rg.addColorStop(1,'#8a5a2b');g.fillStyle=rg;g.strokeStyle='#4a2c10';g.lineWidth=1.3;
      g.fillRect(x-5,y0+dy-3,10,(y1-y0)-dy+(dy===8?-4:-14));}
    for(let y=y0;y<y1;y+=24){const rg=g.createLinearGradient(x-5,0,x+5,0);rg.addColorStop(0,'#d9a86a');rg.addColorStop(.5,'#b8814a');rg.addColorStop(1,'#7a4c20');
      g.fillStyle=rg;g.strokeStyle='#3a2210';g.lineWidth=1.4;g.beginPath();g.moveTo(x-5,y+24);g.lineTo(x-5,y+4);g.lineTo(x,y-1);g.lineTo(x+5,y+4);g.lineTo(x+5,y+24);g.closePath();g.fill();g.stroke();
      g.strokeStyle='rgba(60,35,10,.4)';g.lineWidth=.8;g.beginPath();g.moveTo(x-1.5,y+6);g.lineTo(x-1.5,y+20);g.stroke();}};
  const pond=(x,y,rx,ry)=>{g.fillStyle='rgba(20,40,10,.35)';g.beginPath();g.ellipse(x+2,y+4,rx+5,ry+5,0,0,6.2832);g.fill();
    g.fillStyle='#8f8878';g.beginPath();g.ellipse(x,y,rx+5,ry+5,0,0,6.2832);g.fill();
    const wg=g.createRadialGradient(x-rx*.3,y-ry*.4,2,x,y,rx);wg.addColorStop(0,'#9be4f5');wg.addColorStop(.6,'#3f9fd0');wg.addColorStop(1,'#1f5f94');g.fillStyle=wg;g.beginPath();g.ellipse(x,y,rx,ry,0,0,6.2832);g.fill();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.2;g.beginPath();g.ellipse(x-rx*.2,y-ry*.2,rx*.45,ry*.3,0,3.4,5.2);g.stroke();g.beginPath();g.ellipse(x+rx*.25,y+ry*.2,rx*.3,ry*.2,0,0.2,2.2);g.stroke();
    for(const [dx,dy,r] of[[-.35,.25,5],[.3,-.2,4]]){g.fillStyle='#4aa233';g.strokeStyle='#235c1c';g.lineWidth=1;g.beginPath();g.ellipse(x+dx*rx,y+dy*ry,r,r*.7,0,.3,6);g.lineTo(x+dx*rx,y+dy*ry);g.fill();g.stroke();}
    for(let i=0;i<10;i++){const a=rnd()*6.28;const px=x+Math.cos(a)*(rx+3),py=y+Math.sin(a)*(ry+3);g.fillStyle='#b4aa94';g.strokeStyle='#5a5444';g.lineWidth=.9;g.beginPath();g.ellipse(px,py,4,3,a,0,6.2832);g.fill();g.stroke();}
    g.strokeStyle='#4a7a2a';g.lineWidth=1.6;for(let k=0;k<4;k++){const px=x+rx*.55+k*3,py=y+ry*.7;g.beginPath();g.moveTo(px,py);g.quadraticCurveTo(px+rr_(-3,3),py-8,px+rr_(-4,4),py-15);g.stroke();g.fillStyle='#7a4a1a';g.fillRect(px+(k%2?2:-1)-1,py-17,2.4,6);}};

  // ordem: de tras para frente (y crescente) para ficar natural
  const items=[
    ()=>pine(26,76,16),()=>pine(338,64,17),()=>tree(310,36,17),
    ()=>pond(310,132,28,17),
    ()=>rock(28,246,10),()=>bush(340,230,13,true),()=>mushroom(334,196,6),
    ()=>tree(24,330,20),()=>flowers(300,300,7,['#fff','#ffe066','#ff9ac8']),
    ()=>bush(334,372,12,false),()=>rock(330,430,12),()=>pine(28,470,18),
    ()=>mushroom(20,540,6),()=>bush(326,520,14,true),()=>tree(322,590,19),()=>rock(34,604,13),
    ()=>flowers(120,540,8,['#ff9ac8','#fff','#c8a0ff']),()=>flowers(170,70,7,['#ffe066','#fff']),
    ()=>bush(190,160,8,false),()=>flowers(300,470,6,['#ffe066','#ff9ac8'])
  ];
  items.forEach(f=>f());
  fenceRun(9,100,230);fenceRun(351,175,320);fenceRun(10,392,500);fenceRun(350,420,520);
  // luz e vinheta
  let lg=g.createRadialGradient(70,40,10,70,40,420);lg.addColorStop(0,'rgba(255,250,190,.22)');lg.addColorStop(1,'rgba(255,250,190,0)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  let vg=g.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,35,10,.32)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  // copas de arvores no topo (cobertura)
  for(let x=-10;x<W+20;x+=30){leafBlob(x,2,22,'#78c944','#3f9a2c','#1d5a1c');}
  bgCache=o;
}
function drawBG(){if(!bgCache)buildBG();ctx.drawImage(bgCache,0,0,W,H);}

