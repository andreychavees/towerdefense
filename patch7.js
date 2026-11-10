const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}

// ---- 1) resolucao 2x ----
rep('<canvas id="c" width="360" height="640">','<canvas id="c" width="720" height="1280">');
rep("  const dt=Math.min(0.05,(t-last)/1000);last=t;","  const dt=Math.min(0.05,(t-last)/1000);last=t;ctx.setTransform(2,0,0,2,0,0);");

// ---- 2) mapa novo ----
{const a=s.indexOf('let bgCache=null;'),b=s.indexOf('function leekShape(');if(a<0||b<0)throw new Error('map markers');
 s=s.slice(0,a)+fs.readFileSync('map.js','utf8')+'\n'+s.slice(b);}

// ---- 3) armas novas ----
{const a=s.indexOf('function leekShape('),b=s.indexOf('const CLS_INFO=');if(a<0||b<0)throw new Error('weapon markers');
 s=s.slice(0,a)+fs.readFileSync('weapons.js','utf8')+'\n'+s.slice(b);}

// ---- 4) dragoes de varios elementos ----
rep("const ARMOR_NAMES=",
`const DRAGON_VARIANTS=[{k:'fire',name:'Dragão de Fogo'},{k:'ice',name:'Dragão de Gelo'},{k:'toxic',name:'Dragão Venenoso'},{k:'shadow',name:'Dragão Sombrio'}];
function enemyInfo(w){const et=ENEMY_TYPES[(w-1)%4];if(et.k!=='dragon')return{k:et.k,name:et.name};const v=DRAGON_VARIANTS[(Math.floor(w/4)-1)%4];return{k:'dragon',name:v.name,variant:v.k};}
const DRAGON_PAL={
 fire:{crest0:'#9c1a1c',crest1:'#6e0f12',horn0:'#fff3cf',horn1:'#c9a867',cheek:'#7d1214',s0:'#ff8a5c',s1:'#c6281f',s2:'#661010',n0:'#e0502a',n1:'#a82a18',brow:'#4a0a0c',eye:'#ffd22a',glow0:'rgba(255,230,80,.9)',glow1:'rgba(255,120,0,0)',flame0:'#ff7a1a',flame1:'#ffd23a',ol:'#2a0606',b0:'#ff8a64',b1:'#c8301f',b2:'#5a0c0c',belly:'rgba(255,210,130,.35)',fx:'fire'},
 ice:{crest0:'#6fb7e8',crest1:'#3e86bf',horn0:'#ffffff',horn1:'#bfe6ff',cheek:'#3f7fb8',s0:'#e6f8ff',s1:'#72bce8',s2:'#2a5a96',n0:'#a8e2ff',n1:'#4a98d0',brow:'#1f4a78',eye:'#7af0ff',glow0:'rgba(150,255,255,.9)',glow1:'rgba(80,180,255,0)',flame0:'#7ad8ff',flame1:'#ffffff',ol:'#0e2a48',b0:'#e6f8ff',b1:'#72bce8',b2:'#2a5a96',belly:'rgba(255,255,255,.5)',fx:'ice'},
 toxic:{crest0:'#6bbf3a',crest1:'#3e7d22',horn0:'#f0e8a8',horn1:'#a89a48',cheek:'#2f6a1e',s0:'#c4f580',s1:'#4da02e',s2:'#1d4a14',n0:'#9bdc50',n1:'#4a8a28',brow:'#173a0e',eye:'#ff4ad8',glow0:'rgba(255,100,220,.9)',glow1:'rgba(200,0,200,0)',flame0:'#9aff3a',flame1:'#e8ff9a',ol:'#0e2a08',b0:'#c4f580',b1:'#4da02e',b2:'#1d4a14',belly:'rgba(225,255,150,.4)',fx:'toxic'},
 shadow:{crest0:'#6a3fb0',crest1:'#3a1f70',horn0:'#e0d4ff',horn1:'#8a6fc0',cheek:'#3a1f70',s0:'#9a80e0',s1:'#4a2a90',s2:'#1a0f3a',n0:'#7a5ac0',n1:'#35207a',brow:'#12082a',eye:'#ff3a5a',glow0:'rgba(255,60,100,.9)',glow1:'rgba(150,0,60,0)',flame0:'#a64aff',flame1:'#ffd0ff',ol:'#0a0518',b0:'#9a80e0',b1:'#4a2a90',b2:'#1a0f3a',belly:'rgba(190,150,255,.3)',fx:'shadow'}
};
function dragonBreath(pal){
  const f=Math.sin(now*18)*2.2;
  ctx.fillStyle=pal.flame0;ctx.beginPath();ctx.moveTo(-8,36);ctx.quadraticCurveTo(-12+f,52,0,58+f);ctx.quadraticCurveTo(12-f,52,8,36);ctx.closePath();ctx.fill();
  ctx.fillStyle=pal.flame1;ctx.beginPath();ctx.moveTo(-4,38);ctx.quadraticCurveTo(-4,48,0,52);ctx.quadraticCurveTo(4,48,4,38);ctx.closePath();ctx.fill();
  if(pal.fx==='ice'){ctx.fillStyle='rgba(225,250,255,.9)';ctx.strokeStyle='#0e2a48';ctx.lineWidth=1.2;
    for(let k=0;k<6;k++){const t=((now*1.6+k*.17)%1),a=-1+k*.4;ctx.save();ctx.translate(Math.sin(a)*(8+t*18),44+t*20);ctx.rotate(a+now*3);ctx.globalAlpha=1-t*.7;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(2.6,0);ctx.lineTo(0,4);ctx.lineTo(-2.6,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}ctx.globalAlpha=1;
  }else if(pal.fx==='toxic'){for(let k=0;k<5;k++){const t=((now*1.2+k*.2)%1);ctx.fillStyle='rgba(190,255,90,'+(.8-t*.6)+')';ctx.strokeStyle='rgba(30,90,10,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.arc((k-2)*6+Math.sin(now*4+k)*2,40+t*22,2+(k%2)*1.4,0,6.2832);ctx.fill();ctx.stroke();}
  }else if(pal.fx==='shadow'){ctx.strokeStyle='rgba(190,120,255,.7)';ctx.lineWidth=2;for(let k=0;k<4;k++){const t=((now*1.3+k*.25)%1),x=(k-1.5)*7;ctx.globalAlpha=1-t;ctx.beginPath();ctx.moveTo(x,42);ctx.quadraticCurveTo(x+Math.sin(now*6+k)*6,50+t*10,x,60+t*14);ctx.stroke();}ctx.globalAlpha=1;}
}
const ARMOR_NAMES=`);
{ // reescreve drawDragonHead com paleta
 const a=s.indexOf('function drawDragonHead(r){'),b=s.indexOf('function drawSeg(');let f=s.slice(a,b);
 const sub=(o,n)=>{if(!f.includes(o))throw new Error('dragao: '+o);f=f.split(o).join(n);};
 sub('function drawDragonHead(r){','function drawDragonHead(r,pal){');
 sub("OL='#2a0606'","OL=pal.ol");
 sub("i%2?'#6e0f12':'#9c1a1c'","i%2?pal.crest1:pal.crest0");
 sub("g.addColorStop(0,'#fff3cf');g.addColorStop(1,'#c9a867')","g.addColorStop(0,pal.horn0);g.addColorStop(1,pal.horn1)");
 sub("ctx.fillStyle='#7d1214';ctx.strokeStyle=OL;","ctx.fillStyle=pal.cheek;ctx.strokeStyle=OL;");
 sub("g.addColorStop(0,'#ff8a5c');g.addColorStop(.55,'#c6281f');g.addColorStop(1,'#661010')","g.addColorStop(0,pal.s0);g.addColorStop(.55,pal.s1);g.addColorStop(1,pal.s2)");
 sub("g.addColorStop(0,'#e0502a');g.addColorStop(1,'#a82a18')","g.addColorStop(0,pal.n0);g.addColorStop(1,pal.n1)");
 sub("ctx.fillStyle='#4a0a0c';","ctx.fillStyle=pal.brow;");
 sub("eg.addColorStop(0,'rgba(255,230,80,.9)');eg.addColorStop(1,'rgba(255,120,0,0)')","eg.addColorStop(0,pal.glow0);eg.addColorStop(1,pal.glow1)");
 sub("ctx.fillStyle='#ffd22a';","ctx.fillStyle=pal.eye;");
 const i0=f.indexOf("  // chama saindo da boca"),i1=f.lastIndexOf("  ctx.restore();\n}");if(i0<0||i1<0)throw new Error('flame block');
 f=f.slice(0,i0)+"  dragonBreath(pal);\n"+f.slice(i1);
 s=s.slice(0,a)+f+s.slice(b);
}
rep("}else if(head){drawDragonHead(r);","}else if(head){drawDragonHead(r,DRAGON_PAL[(worm&&worm.variant)||'fire']);");
// corpo do dragao com a paleta da variante
rep("  const head=sg.head;\n","  const head=sg.head;const pal=DRAGON_PAL[(worm&&worm.variant)||'fire'];\n");
rep("ctx.fillStyle='#8a1212';ctx.strokeStyle='#3a0808';ctx.lineWidth=2;\n    if(!head){spike","ctx.fillStyle=pal.crest0;ctx.strokeStyle=pal.ol;ctx.lineWidth=2;\n    if(!head){spike");
rep("bodyGrad(r,'#ff8a64','#c8301f','#5a0c0c')","bodyGrad(r,pal.b0,pal.b1,pal.b2)");
rep("ctx.fillStyle='rgba(255,210,130,.35)';ctx.beginPath();ctx.ellipse(0,r*.45","ctx.fillStyle=pal.belly;ctx.beginPath();ctx.ellipse(0,r*.45");
// inicio de onda e HUD usam enemyInfo
rep("const et=ENEMY_TYPES[(wave-1)%4],armor=","const et=enemyInfo(wave),armor=");
rep("type:et.k,name:et.name,","type:et.k,variant:et.variant,name:et.name,");
rep("const nx=ENEMY_TYPES[wave%4],na=","const nx=enemyInfo(wave+1),na=");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
