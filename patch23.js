const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}

// ---- animacao de GIF: decodifica todos os quadros (ImageDecoder) ----
rep("const WOLF_SPR=[null,null,null,null,null];",`function removeBgCanvas(cv){
  const w=cv.width,h=cv.height,g=cv.getContext('2d'),img=g.getImageData(0,0,w,h),d=img.data,N=w*h,bg=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const tp=i=>{if(!bg[i]&&(d[i*4+3]<10||(d[i*4]>232&&d[i*4+1]>232&&d[i*4+2]>232))){bg[i]=1;st[sp++]=i;}};
  for(let x=0;x<w;x++){tp(x);tp((h-1)*w+x);}for(let y=0;y<h;y++){tp(y*w);tp(y*w+w-1);}
  while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;if(x>0)tp(i-1);if(x<w-1)tp(i+1);if(y>0)tp(i-w);if(y<h-1)tp(i+w);}
  for(let i=0;i<N;i++)if(bg[i])d[i*4+3]=0;
  g.putImageData(img,0,0);
}
function alphaBBox(cv){
  const w=cv.width,h=cv.height,d=cv.getContext('2d').getImageData(0,0,w,h).data;let x0=w,y0=h,x1=0,y1=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  return{x0,y0,x1,y1};
}
async function loadAnimSprite(url,maxH){
  try{
    if(typeof ImageDecoder==='undefined')throw new Error('sem ImageDecoder');
    const buf=await (await fetch(url)).arrayBuffer();
    const dec=new ImageDecoder({data:buf,type:'image/gif'});await dec.tracks.ready;
    const n=dec.tracks.selectedTrack.frameCount,step=Math.max(1,Math.ceil(n/20)),raw=[];
    for(let i=0;i<n;i+=step){
      const {image}=await dec.decode({frameIndex:i});
      const c=document.createElement('canvas');c.width=image.displayWidth;c.height=image.displayHeight;c.getContext('2d').drawImage(image,0,0);
      raw.push({c,dur:Math.max(30,(image.duration||80000)/1000)*step});image.close();
    }
    raw.forEach(f=>removeBgCanvas(f.c));
    let x0=1e9,y0=1e9,x1=0,y1=0;raw.forEach(f=>{const b=alphaBBox(f.c);x0=Math.min(x0,b.x0);y0=Math.min(y0,b.y0);x1=Math.max(x1,b.x1);y1=Math.max(y1,b.y1);});
    const cw=x1-x0+1,ch=y1-y0+1;
    const frames=raw.map(f=>{const o=document.createElement('canvas');o.width=cw;o.height=ch;o.getContext('2d').drawImage(f.c,x0,y0,cw,ch,0,0,cw,ch);return shrink(o,maxH);});
    let total=0;const durs=raw.map(f=>{total+=f.dur;return f.dur;});
    return{frames,durs,total,w:frames[0].width,h:frames[0].height,c:frames[0]};
  }catch(e){const im=await loadImg(url);return im?sheetToSprites(im,1,1,{maxH})[0]:null;}
}
function spriteImg(spr,c){
  if(!spr.frames)return spr.c;
  let t=(now*1000+(c&&c.id?c.id*137:0))%spr.total;
  for(let i=0;i<spr.frames.length;i++){if(t<spr.durs[i])return spr.frames[i];t-=spr.durs[i];}
  return spr.frames[0];
}
const WOLF_SPR=[null,null,null,null,null];`);
rep("for(let i=0;i<5;i++)loadImg('assets/art/lobo'+(i+1)+'.gif').then(im=>{if(im)WOLF_SPR[i]=sheetToSprites(im,1,1,{maxH:200})[0];});","for(let i=0;i<5;i++)loadAnimSprite('assets/art/lobo'+(i+1)+'.gif',170).then(sp=>{if(sp)WOLF_SPR[i]=sp;});");

// ---- Tigre de Fogo ----
rep("const CAT_HI=[null,null,null,null];",`const TIGER_SPR=[null,null,null,null,null];
for(let i=0;i<5;i++)loadAnimSprite('assets/art/tigre'+(i+1)+'.gif',170).then(sp=>{if(sp)TIGER_SPR[i]=sp;});
const CAT_HI=[null,null,null,null];`);
rep("function spriteFor(c){\n  if(c.cls==='wolf')return","function spriteFor(c){\n  if(c.cls==='tiger')return TIGER_SPR.every(Boolean)?TIGER_SPR[Math.max(0,Math.min(4,c.lvl-4))]:null;\n  if(c.cls==='wolf')return");
rep("c0:'#1f2a6a',c1:'#7fb4ff'}","c0:'#1f2a6a',c1:'#7fb4ff'},\n  tiger:{title:'Tigre de Fogo',tag:'Evolução',desc:['Bola de fogo + queimadura','Muda de forma a cada nível','Dano em área'],c0:'#7a2a0a',c1:'#ffb050'}");
rep("wolf:{name:'Lobo Trovão'}};","wolf:{name:'Lobo Trovão'},tiger:{name:'Tigre de Fogo'}};");
rep("c.cls==='wolf'?'#6fa8ff':","c.cls==='wolf'?'#6fa8ff':c.cls==='tiger'?'#ff9a3a':");
rep("wolf:'#2a52c8'}","wolf:'#2a52c8',tiger:'#e06a14'}");
rep("if(c.cls==='wolf')r*=1.25;","if(c.cls==='wolf')r*=1.25;if(c.cls==='tiger')r*=1.2;");
rep("if(c.cls==='wolf')d=Math.round(d*1.3);","if(c.cls==='wolf')d=Math.round(d*1.3);if(c.cls==='tiger')d=Math.round(d*1.2);");
rep("if(c.cls==='wolf')return 'bite';","if(c.cls==='wolf')return 'bite';if(c.cls==='tiger')return 'flame';");
rep("const WEAPON_NAME={bite:'Raio em cadeia',","const WEAPON_NAME={flame:'Fogo e queimadura',bite:'Raio em cadeia',");
rep("label:'Raio em cadeia (área)'}","label:'Raio em cadeia (área)'},\n  tiger:{rate:l=>Math.max(.35,.7-.04*l),speed:330,splash:50,sp:.6,label:'Fogo + queimadura (área)'}");
rep("wolf:['#ffffff','#7fb4ff']};","wolf:['#ffffff','#7fb4ff'],tiger:['#ff9a2a','#ffe066']};");
rep("wolf:['255,255,255','120,190,255','40,90,255']};","wolf:['255,255,255','120,190,255','40,90,255'],tiger:['255,240,180','255,140,30','230,50,10']};");
rep("if(cls==='wolf'&&w>64)","if((cls==='wolf'||cls==='tiger')&&w>64)");
rep("if(cls==='wolf'&&Math.cos(c.aim||0)<0)","if((cls==='wolf'||cls==='tiger')&&Math.cos(c.aim||0)<0)");
rep("if(RANGED[cls]&&cls!=='wolf'&&!lifted&&!preview)","if(RANGED[cls]&&cls!=='wolf'&&cls!=='tiger'&&!lifted&&!preview)");
rep("if((p.k==='mage'||p.k==='summoner')&&worm","if(p.k==='tiger')p.t.burn=3;\n      if((p.k==='mage'||p.k==='summoner')&&worm");
rep("{dmgObj(t,armorDmg(t,sp2,p.k),q);if(p.k==='wolf')","{dmgObj(t,armorDmg(t,sp2,p.k),q);if(p.k==='tiger')t.burn=3;if(p.k==='wolf')");
rep("  if(choice||paused)return; // pausado (escolha de classe ou botao)",`  if(choice||paused)return; // pausado (escolha de classe ou botao)
  {const bl=worm?jars.concat(worm.segs):jars;for(const t of bl){if(t.burn>0&&t.hp>0){t.burn-=dt;t.bt=(t.bt||0)+dt;if(t.bt>=0.5){t.bt=0;const bp=targetPos(t);if(bp){dmgObj(t,1,bp);parts.push({x:bp.x+(Math.random()-.5)*10,y:bp.y-6,vx:(Math.random()-.5)*30,vy:-70,life:.4,c:Math.random()<.5?'#ff9a2a':'#ffd23a'});}}}}}`);

// ---- desenhar o quadro atual da animacao ----
rep("const bob=Math.sin(now*5+c.id)*1;\n  if((cls==='wolf'||cls==='tiger')&&Math.cos(c.aim||0)<0)","const bob=Math.sin(now*5+c.id)*1,im_=spriteImg(spr,c);\n  if((cls==='wolf'||cls==='tiger')&&Math.cos(c.aim||0)<0)");
s=s.split("ctx.drawImage(spr.c,-w/2,19-h+bob,w,h)").join("ctx.drawImage(im_,-w/2,19-h+bob,w,h)");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
