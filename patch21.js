const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
function cut(startMark,endMark,repl){const a=s.indexOf(startMark),b=s.indexOf(endMark,a);if(a<0||b<0)throw new Error('cut '+startMark);s=s.slice(0,a)+repl+s.slice(b);}

// ===== 1) grade do chao: personagens presos aos blocos =====
cut('function validSpot(','function targetPos(',`// blocos do chao (xadrez do mapa): 40.5 x 37.85, origem em (14.5, 35)
const TILE_W=40.5,TILE_H=37.85,TILE_X0=14.5,TILE_Y0=35;
function cellAt(x,y){const i=Math.floor((x-TILE_X0)/TILE_W),j=Math.floor((y-TILE_Y0)/TILE_H);return{i,j,x:TILE_X0+TILE_W*(i+.5),y:TILE_Y0+TILE_H*(j+.5)};}
function cellOk(cl,ignore){
  if(cl.i<0||cl.i>7||cl.j<0||cl.j>14||cl.y>588)return false;
  if(nearestOnPath(cl.x,cl.y).dist<38)return false;
  return !cats.some(o=>o!==ignore&&Math.abs(o.x-cl.x)<6&&Math.abs(o.y-cl.y)<6);
}
function validSpot(x,y,ignore){return cellOk(cellAt(x,y),ignore);}
function freeSpot(x,y){
  let best=null,bd=1e9;
  for(let i=0;i<=7;i++)for(let j=0;j<=14;j++){const cl={i,j,x:TILE_X0+TILE_W*(i+.5),y:TILE_Y0+TILE_H*(j+.5)};if(!cellOk(cl,null))continue;const d=Math.hypot(cl.x-x,cl.y-y);if(d<bd){bd=d;best=cl;}}
  return best?{x:best.x,y:best.y}:{x:156.25,y:129.6};
}
`);
rep("addCat(135,200,1);addCat(150,390,1);","addCat(156.25,129.6,1);addCat(115.75,432.4,1);");
rep("const other=cats.find(o=>o!==c&&Math.hypot(o.x-x,o.y-y)<CAT_R);","const tcl=cellAt(x,y),other=cats.find(o=>o!==c&&Math.abs(o.x-tcl.x)<6&&Math.abs(o.y-tcl.y)<6);");
rep("  if(!validSpot(x,y,c))return; // em cima da estrada ou fora do campo: volta ao lugar\n  c.x=x;c.y=y;","  if(!cellOk(tcl,c))return; // bloco ocupado, na estrada ou fora do campo: volta ao lugar\n  c.x=tcl.x;c.y=tcl.y;");
rep("  if(drag){\n    const c=drag.cat,o=cats.find(k=>k!==c&&Math.hypot(k.x-drag.x,k.y-drag.y)<CAT_R);",
`  if(drag){
    const cl=cellAt(drag.x,drag.y);
    for(let i=0;i<=7;i++)for(let j=0;j<=14;j++){const q={i,j,x:TILE_X0+TILE_W*(i+.5),y:TILE_Y0+TILE_H*(j+.5)};if(!cellOk(q,drag.cat))continue;
      ctx.fillStyle='rgba(255,255,255,.14)';rr(ctx,q.x-TILE_W/2+2,q.y-TILE_H/2+2,TILE_W-4,TILE_H-4,6);ctx.fill();}
    const c=drag.cat,o=cats.find(k=>k!==c&&Math.abs(k.x-cl.x)<6&&Math.abs(k.y-cl.y)<6);`);
rep("validSpot(drag.x,drag.y,c);","cellOk(cl,c);");
rep("ctx.beginPath();ctx.arc(drag.x,drag.y,RANGED[c.cls]?range(c):melee(c),0,6.28);ctx.fill();ctx.stroke();",
"ctx.beginPath();ctx.arc(cl.x,cl.y,RANGED[c.cls]?range(c):melee(c),0,6.28);ctx.fill();ctx.stroke();\n    ctx.strokeStyle=ok?'#6dff6d':'#ff5a5a';ctx.lineWidth=3;rr(ctx,cl.x-TILE_W/2+2,cl.y-TILE_H/2+2,TILE_W-4,TILE_H-4,7);ctx.stroke();");

// ===== 2) cauda longa e com mais vida; ao destruir a cauda a cabeca volta para tras =====
rep("const n=7+wave*2+(boss?4:0),segs=[];","const n=22+wave*3+(boss?10:0),segs=[];");
rep("const hp=Math.max(1,Math.round((1+Math.floor(wave/2)+(Math.random()<0.2?2:0))*mult));","const hp=Math.max(1,Math.round((5+wave*2+(Math.random()<0.25?3:0))*mult));");
rep("worm.slow=(worm.slow||0)-dt;","worm.slow=(worm.slow||0)-dt;if(worm.back>0){const st_=Math.min(worm.back,170*dt);worm.d=Math.max(-10,worm.d-st_);worm.back-=st_;}");
rep("worm.segs=worm.segs.filter(sg=>sg.hp>0||sg.head);","{const nd=worm.segs.filter(sg=>sg.hp<=0&&!sg.head).length;if(nd)worm.back=(worm.back||0)+nd*worm.gap*0.9;}\n      worm.segs=worm.segs.filter(sg=>sg.hp>0||sg.head);");

// ===== 5) sem numeros na cauda =====
rep("else{ctx.font='900 15px system-ui';ctx.lineWidth=3.5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(sg.hp,p.x,p.y+5.5);ctx.fillText(sg.hp,p.x,p.y+5.5);}","");

// ===== 3) efeitos de quebra no pote =====
rep("function dmgObj(o,dmg,p){",`function glassBurst(x,y,n){
  const cols=['#bfe6ff','#e8f7ff','#7ec0ee','#ffffff'];
  for(let i=0;i<n;i++){const a=Math.random()*6.283,v=60+Math.random()*190;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-90,life:.7+Math.random()*.5,c:cols[i%4],shard:true,rot:Math.random()*6,vr:(Math.random()-.5)*16,size:3+Math.random()*4});}
}
function dmgObj(o,dmg,p){
  if(o.kind==='jar')glassBurst(p.x,p.y-4,3);
  else for(let q=0;q<3;q++)parts.push({x:p.x,y:p.y,vx:(Math.random()-.5)*170,vy:(Math.random()-.5)*170-30,life:.3,c:Math.random()<.5?'#ffffff':'#ffe066'});
`);
rep("burst(p.x,p.y,14,['#9fdcff','#e8f7ff']);const fs=freeSpot(p.x,p.y);","glassBurst(p.x,p.y,30);burst(p.x,p.y,10,['#9fdcff','#e8f7ff']);parts.push({x:p.x,y:p.y,ring:true,r:6,vr:190,life:.4,c:'#cfeeff'});parts.push({x:p.x,y:p.y,ring:true,r:2,vr:90,life:.3,c:'#ffffff'});shake=Math.max(shake,3);const fs=freeSpot(p.x,p.y);");
rep("parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.life-=dt;});","parts.forEach(p=>{if(p.ring){p.r+=p.vr*dt;p.life-=dt;return;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.life-=dt;if(p.shard)p.rot+=p.vr*dt;});");
rep("parts.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*2);ctx.fillStyle=p.c;ctx.fillRect(p.x-3,p.y-3,6,6);});ctx.globalAlpha=1;",
`parts.forEach(p=>{
    if(p.ring){ctx.globalAlpha=Math.max(0,p.life*2.2);ctx.strokeStyle=p.c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.stroke();return;}
    ctx.globalAlpha=Math.max(0,Math.min(1,p.life*2));ctx.fillStyle=p.c;
    if(p.shard){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(p.size*.8,p.size*.7);ctx.lineTo(-p.size*.7,p.size*.5);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(40,90,140,.7)';ctx.lineWidth=1;ctx.stroke();ctx.restore();}
    else ctx.fillRect(p.x-3,p.y-3,6,6);
  });ctx.globalAlpha=1;`);
rep("ctx.save();ctx.translate(p.x,p.y+Math.sin(now*4+j.d*.05)*1);\n    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,h*.4,w*.34,h*.08,0,0,6.28);ctx.fill();",
"ctx.save();ctx.translate(p.x+(j.flash>0?(Math.random()-.5)*3:0),p.y+Math.sin(now*4+j.d*.05)*1);\n    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,h*.4,w*.34,h*.08,0,0,6.28);ctx.fill();");
rep("ctx.drawImage(JAR_SPR.c,-w/2,-h*.55,w,h);ctx.restore();",`ctx.drawImage(JAR_SPR.c,-w/2,-h*.55,w,h);
    ctx.filter='none';ctx.globalAlpha=1;const rt=j.hp/j.max;ctx.lineCap='round';ctx.lineJoin='round';
    const crack=(pts)=>{ctx.strokeStyle='rgba(30,60,100,.55)';ctx.lineWidth=2.4;ctx.beginPath();pts.forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.1;ctx.stroke();};
    if(rt<.75)crack([[-4,-9],[1,-3],[-2,2],[3,8]]);
    if(rt<.5)crack([[6,-6],[2,0],[7,5],[4,11]]);
    if(rt<.25){crack([[-9,2],[-3,4],[-6,10]]);crack([[2,-12],[8,-8],[6,-3]]);}
    ctx.restore();`);

// ===== 4) efeito de movimento nas armas =====
rep("if(!RANGED[cls]){const n=leeks(c);for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(melee(c)+4,weaponStyle(c));ctx.restore();}}",
`if(!RANGED[cls]){const n=leeks(c),ws=weaponStyle(c),R_=melee(c);
      for(let k=0;k<n;k++){const a0=c.ang+k*6.2832/n;
        ctx.save();ctx.lineCap='round';
        ctx.strokeStyle=tc+'33';ctx.lineWidth=16;ctx.beginPath();ctx.arc(0,0,R_*.6,a0-1.25,a0-0.05);ctx.stroke();
        ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,R_*.78,a0-0.95,a0-0.04);ctx.stroke();
        ctx.restore();
        for(let q=5;q>=1;q--){ctx.save();ctx.globalAlpha=.34*(1-q/6);ctx.rotate(a0-q*0.12);leekShape(R_+4,ws);ctx.restore();}
        ctx.save();ctx.rotate(a0);leekShape(R_+4,ws);ctx.restore();}}`);

// ===== 6) HUD simples e colorido =====
{const a=s.indexOf('function drawHUD(){'),b=s.indexOf('\n}\n',a)+3;if(a<0||b<3)throw new Error('hud');
s=s.slice(0,a)+`function pill(x,y,w,h,c0,c1){const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.stroke();}
function drawHUD(){
  pill(8,7,62,22,'#5a6aa8','#313c70');
  for(let i=0;i<3;i++)heart(22+i*18,18,.78,i<lives);
  let title,sub,frac,c0,c1;
  if(worm){title='ONDA '+wave;sub=worm.name+(worm.armor>0?' · '+ARMOR_NAMES[Math.min(worm.armor,3)].replace('Armadura de ','').replace('Armadura ',''):'');
    const hp=worm.segs.reduce((a,s_)=>a+Math.max(0,s_.hp),0);frac=hp/worm.total;c0='#ff8a6a';c1='#e03a2a';}
  else{title='ONDA '+(wave+1);const nx=enemyInfo(wave+1);sub='Próxima: '+nx.name;frac=1-timer/4;c0='#7ad0ff';c1='#2a7ad0';}
  pill(W/2-46,7,92,22,worm&&worm.boss?'#ff5a6a':'#ffbf3a',worm&&worm.boss?'#c4223a':'#f07a0a');
  shadowText(title,W/2,23,'900 12px system-ui','#fff','center');
  bar(W/2-42,32,84,6,frac,c0,c1);
  shadowText(sub,W/2,49,'bold 10px system-ui','#fff','center');
  pill(W-98,7,44,22,'#52bb68','#2a8044');shadowText('🐱 '+cats.length,W-76,23,'bold 11px system-ui','#fff','center');
  pill(W-50,7,42,22,'#4aa6ea','#2a6cb0');shadowText('🫙 '+saved,W-29,23,'bold 11px system-ui','#fff','center');
  if(jars.length<2){pill(8,H-28,92,20,'#4a86c8','#2a5694');shadowText('🫙',22,H-13,'bold 11px system-ui','#fff','center');bar(34,H-22,60,7,1-jarTimer/16,'#bfe8ff','#5ab0f0');}
  if(selected&&cats.includes(selected)){
    const c=selected;
    ctx.strokeStyle='#ffe066';ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(c.x,c.y,26,0,6.28);ctx.stroke();ctx.setLineDash([]);
    const y0=H-92;
    ctx.fillStyle='rgba(20,26,44,.92)';ctx.strokeStyle=tierCol(c);ctx.lineWidth=2.5;rr(ctx,10,y0,W-20,56,14);ctx.fill();ctx.stroke();
    ctx.save();ctx.translate(40,y0+38);ctx.scale(.95,.95);drawCat({id:c.id,lvl:c.lvl,cls:c.cls,ang:0,pop:0},0,0,false,true);ctx.restore();
    shadowText(catName(c)+' · Nível '+c.lvl,72,y0+21,'900 14px system-ui','#fff');
    shadowText('Dano '+catDmg(c)+'  ·  Alcance '+Math.round(RANGED[c.cls]?range(c):melee(c))+'  ·  '+WEAPON_NAME[weaponStyle(c)],72,y0+40,'11px system-ui','#ffe9b0');
  }
  if(paused){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);shadowText('PAUSADO',W/2,H/2,'900 30px system-ui','#fff','center');}
}
`+s.slice(b);}
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
