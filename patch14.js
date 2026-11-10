const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
// corpo menor
rep("const h=(cls?72:66)+lvl*2,w=h*spr.w/spr.h,bob=Math.sin(now*5+c.id)*1.2;\n  ctx.drawImage(spr.c,-w/2,28-h+bob,w,h);","const h=(cls?50:44)+lvl*1.5,w=h*spr.w/spr.h,bob=Math.sin(now*5+c.id)*1;\n  ctx.drawImage(spr.c,-w/2,19-h+bob,w,h);");
rep("const pg=ctx.createRadialGradient(0,26,2,0,26,24);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,26,25,9.5,0,0,6.2832);ctx.fill();\n  ctx.strokeStyle=tc;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,26,18,6.5,0,0,6.2832);ctx.stroke();\n  const h=",
"const pg=ctx.createRadialGradient(0,19,2,0,19,18);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,19,19,7.5,0,0,6.2832);ctx.fill();\n  ctx.strokeStyle=tc;ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,19,13,5,0,0,6.2832);ctx.stroke();\n  const h=");
rep("if(lvl>=3||cls){const R=26+lvl*3,gr=ctx.createRadialGradient(0,0,6,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}\n  if(!lifted&&!preview){\n    if(selected===c)",
"if(lvl>=3||cls){const R=20+lvl*2,gr=ctx.createRadialGradient(0,0,4,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}\n  if(!lifted&&!preview){\n    if(selected===c)");
rep("ctx.translate(6,6);ctx.rotate((c.aim||0)","ctx.translate(4,3);ctx.rotate((c.aim||0)");
rep("leekShape(34,weaponStyle(c));\n    if((c.cast||0)>0){const f=ctx.createRadialGradient(40,0,1,40,0,22);f.addColorStop(0,'rgba(255,230,120,'+c.cast+')');f.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=f;ctx.beginPath();ctx.arc(40,0,22,0,6.28);ctx.fill();}\n    ctx.restore();\n  }\n  ctx.restore();\n  const bx=x-24;","leekShape(26,weaponStyle(c));\n    if((c.cast||0)>0){const f=ctx.createRadialGradient(30,0,1,30,0,16);f.addColorStop(0,'rgba(255,230,120,'+c.cast+')');f.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=f;ctx.beginPath();ctx.arc(30,0,16,0,6.28);ctx.fill();}\n    ctx.restore();\n  }\n  ctx.restore();\n  const bx=x-17;");
rep("ctx.beginPath();ctx.arc(bx,y-22,9,0,6.28);ctx.fill();ctx.stroke();\n  ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,bx,y-18);\n  if(cls&&!preview){ctx.font='bold 10px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(CLS_INFO[cls].name,x,y+40);ctx.fillText(CLS_INFO[cls].name,x,y+40);}",
"ctx.beginPath();ctx.arc(bx,y-20,7.5,0,6.28);ctx.fill();ctx.stroke();\n  ctx.font='900 10px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,bx,y-16.5);\n  if(cls&&!preview){ctx.font='bold 9px system-ui';ctx.lineWidth=2.5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(CLS_INFO[cls].name,x,y+31);ctx.fillText(CLS_INFO[cls].name,x,y+31);}");
// armas menores e alcance corpo a corpo menor
rep("const melee=c=>Math.min(range(c),74);","const melee=c=>Math.min(range(c),56);");
rep("const W_=Math.min(74,len*0.9)","const W_=Math.min(52,len*0.9)");
rep("const SPACING=52;","const SPACING=44;");
// previa nas cartas
rep("ctx.translate(cd.x+cd.w/2,cd.y+98);ctx.scale(1.05,1.05);","ctx.translate(cd.x+cd.w/2,cd.y+100);ctx.scale(1.7,1.7);");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
