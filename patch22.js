const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}

// ---- Lobo Trovao: nova classe que evolui a cada nivel ----
rep("const CAT_HI=[null,null,null,null];",`const WOLF_SPR=[null,null,null,null,null];
for(let i=0;i<5;i++)loadImg('assets/art/lobo'+(i+1)+'.gif').then(im=>{if(im)WOLF_SPR[i]=sheetToSprites(im,1,1,{maxH:200})[0];});
const CAT_HI=[null,null,null,null];`);
rep("function spriteFor(c){","function spriteFor(c){\n  if(c.cls==='wolf')return WOLF_SPR.every(Boolean)?WOLF_SPR[Math.max(0,Math.min(4,c.lvl-4))]:null;");
rep("angel:{title:'Anjo',tag:'Divino',desc:['Raios sagrados rápidos','Ignora armadura','Alcance enorme'],c0:'#2a4a7a',c1:'#bfe0ff'}","angel:{title:'Anjo',tag:'Divino',desc:['Raios sagrados rápidos','Ignora armadura','Alcance enorme'],c0:'#2a4a7a',c1:'#bfe0ff'},\n  wolf:{title:'Lobo Trovão',tag:'Evolução',desc:['Raio em cadeia (área)','Muda de forma a cada nível','Ignora armadura'],c0:'#1f2a6a',c1:'#7fb4ff'}");
rep("angel:{name:'Anjo'}};","angel:{name:'Anjo'},wolf:{name:'Lobo Trovão'}};");
rep("c.cls==='angel'?'#9fd0ff':","c.cls==='angel'?'#9fd0ff':c.cls==='wolf'?'#6fa8ff':");
rep("angel:'#4a8ad8'}","angel:'#4a8ad8',wolf:'#2a52c8'}");
rep("if(c.cls==='angel')r*=1.45;","if(c.cls==='angel')r*=1.45;if(c.cls==='wolf')r*=1.25;");
rep("if(c.cls==='angel')d=Math.round(d*1.4);","if(c.cls==='angel')d=Math.round(d*1.4);if(c.cls==='wolf')d=Math.round(d*1.3);");
rep("if(c.cls==='angel')return 'greatsword';","if(c.cls==='angel')return 'greatsword';if(c.cls==='wolf')return 'bite';");
rep("const WEAPON_NAME={dagger:'Adaga',","const WEAPON_NAME={bite:'Raio em cadeia',dagger:'Adaga',");
rep("  angel:{rate:l=>Math.max(.2,.45-.03*l),speed:520,splash:0,sp:0,label:'Raio sagrado'}","  angel:{rate:l=>Math.max(.2,.45-.03*l),speed:520,splash:0,sp:0,label:'Raio sagrado'},\n  wolf:{rate:l=>Math.max(.3,.65-.04*l),speed:620,splash:60,sp:.7,label:'Raio em cadeia (área)'}");
rep("angel:['#ffffff','#bfdcff']};","angel:['#ffffff','#bfdcff'],wolf:['#ffffff','#7fb4ff']};");
rep("angel:['255,255,255','200,230,255','120,160,255']};","angel:['255,255,255','200,230,255','120,160,255'],wolf:['255,255,255','120,190,255','40,90,255']};");
// desenho do lobo: espelha conforme a mira, sem arma na mao
rep("const h=(cls?50:44)+lvl*1.5,w=h*spr.w/spr.h,bob=Math.sin(now*5+c.id)*1;\n  ctx.drawImage(spr.c,-w/2,19-h+bob,w,h);",
`let h=(cls?50:44)+lvl*1.5,w=h*spr.w/spr.h;if(cls==='wolf'&&w>64){h*=64/w;w=64;}
  const bob=Math.sin(now*5+c.id)*1;
  if(cls==='wolf'&&Math.cos(c.aim||0)<0){ctx.save();ctx.scale(-1,1);ctx.drawImage(spr.c,-w/2,19-h+bob,w,h);ctx.restore();}
  else ctx.drawImage(spr.c,-w/2,19-h+bob,w,h);`);
rep("if(RANGED[cls]&&!lifted&&!preview){ // arma apontada","if(RANGED[cls]&&cls!=='wolf'&&!lifted&&!preview){ // arma apontada");
// raio em cadeia visual
rep("if(q&&Math.hypot(q.x-tp.x,q.y-tp.y)<rad)dmgObj(t,armorDmg(t,sp2,p.k),q);","if(q&&Math.hypot(q.x-tp.x,q.y-tp.y)<rad){dmgObj(t,armorDmg(t,sp2,p.k),q);if(p.k==='wolf')parts.push({bolt:true,x:tp.x,y:tp.y,x2:q.x,y2:q.y,life:.2});}");
rep("parts.forEach(p=>{if(p.ring){p.r+=p.vr*dt;p.life-=dt;return;}","parts.forEach(p=>{if(p.bolt){p.life-=dt;return;}if(p.ring){p.r+=p.vr*dt;p.life-=dt;return;}");
rep("    if(p.ring){ctx.globalAlpha=Math.max(0,p.life*2.2);",`    if(p.bolt){ctx.globalAlpha=Math.min(1,p.life*6);ctx.lineCap='round';ctx.lineJoin='round';
      const dx=p.x2-p.x,dy=p.y2-p.y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,pts=[[p.x,p.y]];
      for(let k=1;k<4;k++){const o=(((k*37+Math.floor(p.life*40))%7)-3)*3;pts.push([p.x+dx*k/4+nx*o,p.y+dy*k/4+ny*o]);}pts.push([p.x2,p.y2]);
      ctx.strokeStyle='#4a90ff';ctx.lineWidth=5;ctx.beginPath();pts.forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.lineWidth=1.8;ctx.stroke();return;}
    if(p.ring){ctx.globalAlpha=Math.max(0,p.life*2.2);`);
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
