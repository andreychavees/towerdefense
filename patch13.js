const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}

// ---- estrada do novo mapa (igual nos 4 temas) ----
rep("const PATH=[[46,-30],[46,318],[287,318],[287,680]];","const PATH=[[68,-30],[68,341],[289,341],[289,680]];");

// ---- extrator de sprites das folhas + carregamento ----
rep("const CAT_HI=[null,null,null,null];",`// ---------- Folhas de arte: recorte automatico por componentes ----------
function loadImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src;});}
function shrink(cv,maxH){let cur=cv;
  while(cur.height>maxH*2){const n=document.createElement('canvas');n.width=Math.round(cur.width/2);n.height=Math.round(cur.height/2);const g=n.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(cur,0,0,n.width,n.height);cur=n;}
  if(cur.height>maxH){const n=document.createElement('canvas');n.height=maxH;n.width=Math.round(cur.width*maxH/cur.height);const g=n.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(cur,0,0,n.width,n.height);cur=n;}
  return cur;}
function sheetToSprites(im,expected,cols,opt){
  opt=opt||{};
  const w=im.naturalWidth,h=im.naturalHeight,N=w*h;
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0);
  const img=g.getImageData(0,0,w,h),d=img.data;
  const white=(i,t)=>d[i*4]>t&&d[i*4+1]>t&&d[i*4+2]>t;
  const bg=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const tryPush=i=>{if(!bg[i]&&(d[i*4+3]<10||white(i,232))){bg[i]=1;st[sp++]=i;}};
  for(let x=0;x<w;x++){tryPush(x);tryPush((h-1)*w+x);}for(let y=0;y<h;y++){tryPush(y*w);tryPush(y*w+w-1);}
  while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;if(x>0)tryPush(i-1);if(x<w-1)tryPush(i+1);if(y>0)tryPush(i-w);if(y<h-1)tryPush(i+w);}
  if(opt.holes){const seen=new Uint8Array(N);
    for(let s0=0;s0<N;s0++){if(bg[s0]||seen[s0]||!white(s0,246))continue;
      sp=0;st[sp++]=s0;seen[s0]=1;const reg=[];
      while(sp){const i=st[--sp];reg.push(i);const x=i%w,y=(i/w)|0;
        for(const j of[x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1]){if(j>=0&&!seen[j]&&!bg[j]&&white(j,246)){seen[j]=1;st[sp++]=j;}}}
      if(reg.length>400)for(const j of reg)bg[j]=1;}}
  for(let i=0;i<N;i++)if(bg[i])d[i*4+3]=0;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(bg[i])continue;
    if(bg[i-1]||bg[i+1]||bg[i-w]||bg[i+w]){const b=(d[i*4]+d[i*4+1]+d[i*4+2])/3;if(b>190)d[i*4+3]=Math.max(0,255-(b-190)*4);}}
  const lab=new Int32Array(N),comps=[];let nl=0;
  for(let s0=0;s0<N;s0++){if(bg[s0]||lab[s0])continue;nl++;let x0=w,y0=h,x1=0,y1=0,area=0;sp=0;st[sp++]=s0;lab[s0]=nl;
    while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;area++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;const j=Y*w+X;if(!bg[j]&&!lab[j]){lab[j]=nl;st[sp++]=j;}}}
    comps.push({id:nl,x0,y0,x1,y1,area});}
  comps.sort((a,b)=>b.area-a.area);
  const anchors=comps.slice(0,expected),owner=new Int32Array(nl+1).fill(-1);
  anchors.forEach((a,k)=>{owner[a.id]=k;a.k=k;});
  for(const cp of comps.slice(expected)){let best=-1,bd=45;
    anchors.forEach((a,k)=>{const dx=Math.max(0,a.x0-cp.x1,cp.x0-a.x1),dy=Math.max(0,a.y0-cp.y1,cp.y0-a.y1),dd=Math.hypot(dx,dy);if(dd<bd){bd=dd;best=k;}});
    if(best>=0){owner[cp.id]=best;const a=anchors[best];a.x0=Math.min(a.x0,cp.x0);a.y0=Math.min(a.y0,cp.y0);a.x1=Math.max(a.x1,cp.x1);a.y1=Math.max(a.y1,cp.y1);}}
  const out=anchors.map(a=>{const cw=a.x1-a.x0+1,ch=a.y1-a.y0+1,oc=document.createElement('canvas');oc.width=cw;oc.height=ch;
    const og=oc.getContext('2d'),oi=og.createImageData(cw,ch),od=oi.data;
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y+a.y0)*w+(x+a.x0),L=lab[i];if(L&&owner[L]===a.k){const o=(y*cw+x)*4,q=i*4;od[o]=d[q];od[o+1]=d[q+1];od[o+2]=d[q+2];od[o+3]=d[q+3];}}
    og.putImageData(oi,0,0);const sc=shrink(oc,opt.maxH||200);return{c:sc,w:sc.width,h:sc.height,cx:(a.x0+a.x1)/2,cy:(a.y0+a.y1)/2};});
  out.sort((a,b)=>a.cy-b.cy);const rows=[];for(let i=0;i<out.length;i+=cols)rows.push(out.slice(i,i+cols).sort((a,b)=>a.cx-b.cx));
  return rows.flat();
}
const CLS_ORDER=['knight','mage','archer','bomber','ninja','healer','summoner','angel'];
const WEAPON_ORDER=['leek','club','axe','mace','sword','greatsword','orb','crystal','bow','cannon','dagger','holystaff'];
const CLS_SPR={},EVO_SPR=[],WEAPON_SPR={},bgMaps=[];
loadImg('assets/art/classes.webp').then(im=>{if(!im)return;const sp=sheetToSprites(im,8,4,{maxH:220});CLS_ORDER.forEach((k,i)=>{CLS_SPR[k]=sp[i];});});
loadImg('assets/art/evolucoes.webp').then(im=>{if(!im)return;sheetToSprites(im,4,2,{maxH:220}).forEach(x=>EVO_SPR.push(x));});
loadImg('assets/art/armas.webp').then(im=>{if(!im)return;const sp=sheetToSprites(im,12,3,{maxH:150,holes:true});WEAPON_ORDER.forEach((k,i)=>{WEAPON_SPR[k]=sp[i];});});
loadImg('assets/art/mapas.webp').then(im=>{if(!im)return;
  [[0,468],[471,938],[943,1409],[1413,1880]].forEach(([x0,x1])=>{const o=document.createElement('canvas');o.width=W*2;o.height=H*2;const g=o.getContext('2d');g.imageSmoothingQuality='high';
    g.drawImage(im,x0+2,2,x1-x0-3,im.naturalHeight-4,0,0,W*2,H*2);bgMaps.push(o);});});
const CAT_HI=[null,null,null,null];`);

// ---- fundo por tema (a cada 4 ondas) ----
rep("function drawBG(){\n  if(bgSheet){ctx.drawImage(bgSheet,0,0,W,H);return;}",
`function drawBG(){
  if(bgMaps.length===4){ctx.drawImage(bgMaps[Math.floor(Math.max(0,wave-1)/4)%4],0,0,W,H);return;}
  if(bgSheet){ctx.drawImage(bgSheet,0,0,W,H);return;}`);

// ---- sprite de qualquer unidade (gato base, classe, evolucao) ----
function cutFn(startMark){const a=s.indexOf(startMark),b=s.indexOf('\n}\n',a)+3;if(a<0||b<3)throw new Error('fn '+startMark);return [a,b];}
{const [a,b]=cutFn('function drawSpriteCat(');
s=s.slice(0,a)+`const EVO_OF={knight:3,mage:2,archer:0,bomber:1};
const CLS_COL={knight:'#2a63d8',mage:'#7b3fc4',archer:'#2f8f3a',bomber:'#c4561c',ninja:'#555566',healer:'#d9a400',summoner:'#4aa020',angel:'#4a8ad8'};
function spriteFor(c){
  if(!c.cls){const i=Math.min(c.lvl,4)-1;return CAT_HI[i]||(CAT_SPR.length===4?CAT_SPR[i]:null);}
  if(c.lvl>=8&&EVO_OF[c.cls]!==undefined&&EVO_SPR[EVO_OF[c.cls]])return EVO_SPR[EVO_OF[c.cls]];
  return CLS_SPR[c.cls]||null;
}
function drawSpriteCat(c,x,y,lifted,preview){
  const lvl=c.lvl,cls=c.cls||null,tc=tierCol(c),spr=spriteFor(c);
  ctx.save();ctx.translate(x,y);
  if(lvl>=3||cls){const R=26+lvl*3,gr=ctx.createRadialGradient(0,0,6,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}
  if(!lifted&&!preview){
    if(selected===c){ctx.fillStyle='rgba(255,255,255,.10)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(0,0,RANGED[cls]?range(c):melee(c),0,6.28);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
    if(!RANGED[cls]){const n=leeks(c);for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(melee(c)+4,weaponStyle(c));ctx.restore();}}
  }
  const sc=1+(c.pop||0)*0.4;ctx.scale(sc,sc);
  if(lifted)ctx.translate(0,-8);
  const pg=ctx.createRadialGradient(0,26,2,0,26,24);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,26,25,9.5,0,0,6.2832);ctx.fill();
  ctx.strokeStyle=tc;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,26,18,6.5,0,0,6.2832);ctx.stroke();
  const h=(cls?72:66)+lvl*2,w=h*spr.w/spr.h,bob=Math.sin(now*5+c.id)*1.2;
  ctx.drawImage(spr.c,-w/2,28-h+bob,w,h);
  if(RANGED[cls]&&!lifted&&!preview){ // arma apontada para o alvo (+ clarao ao atirar)
    ctx.save();ctx.translate(6,6);ctx.rotate((c.aim||0)+Math.sin(now*3+c.id)*0.08-(c.cast||0)*0.35);leekShape(34,weaponStyle(c));
    if((c.cast||0)>0){const f=ctx.createRadialGradient(40,0,1,40,0,22);f.addColorStop(0,'rgba(255,230,120,'+c.cast+')');f.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=f;ctx.beginPath();ctx.arc(40,0,22,0,6.28);ctx.fill();}
    ctx.restore();
  }
  ctx.restore();
  const bx=x-24;ctx.fillStyle=cls?CLS_COL[cls]:'#2f9e44';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(bx,y-22,9,0,6.28);ctx.fill();ctx.stroke();
  ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,bx,y-18);
  if(cls&&!preview){ctx.font='bold 10px system-ui';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.strokeText(CLS_INFO[cls].name,x,y+40);ctx.fillText(CLS_INFO[cls].name,x,y+40);}
}
`+s.slice(b);}
rep("  if(!cls&&lvl<=4&&(CAT_HI[lvl-1]||CAT_SPR.length===4))return drawSpriteCat(c,x,y,lifted,preview);\n  if(cls==='knight'&&knightReady>=54)return drawKnight(c,x,y,lifted,preview);","  if(spriteFor(c))return drawSpriteCat(c,x,y,lifted,preview);");

// ---- armas com arte nova ----
rep("function leekShape(len,style){","function leekShapeOld(len,style){");
rep("function leekShapeOld(len,style){",`function leekShape(len,style){
  const w=WEAPON_SPR[style];if(!w)return leekShapeOld(len,style);
  ctx.save();
  if(style==='bow'){const bw=len*0.95,bh=bw*w.h/w.w;ctx.translate(len*0.6,0);ctx.rotate(Math.PI/2);ctx.drawImage(w.c,-bw/2,-bh/2,bw,bh);}
  else{const W_=Math.min(74,len*0.9),H_=W_*w.h/w.w;ctx.drawImage(w.c,4,-H_/2,W_,H_);}
  ctx.restore();
}
function leekShapeOld(len,style){`);

// ---- 4 novas classes: dados e comportamento ----
rep("if(c.cls==='bomber')r*=1.2;","if(c.cls==='bomber')r*=1.2;if(c.cls==='ninja')r*=0.8;if(c.cls==='healer')r*=1.25;if(c.cls==='summoner')r*=1.3;if(c.cls==='angel')r*=1.45;");
rep("if(c.cls==='bomber')d=Math.round(d*2.2);","if(c.cls==='bomber')d=Math.round(d*2.2);if(c.cls==='ninja')d=Math.round(d*1.2);if(c.cls==='healer')d=Math.max(1,Math.round(d*0.6));if(c.cls==='angel')d=Math.round(d*1.4);");
rep("+(c.cls==='knight'?1:0)","+(c.cls==='knight'?1:0)+(c.cls==='ninja'?2:0)");
rep("c.ang+=dt*(6+c.lvl*0.4);","c.ang+=dt*(6+c.lvl*0.4)*(c.cls==='ninja'?1.7:1);");
rep("const CLS_INFO={knight:{name:'Cavaleiro'},mage:{name:'Mago'},archer:{name:'Arqueiro'},bomber:{name:'Artilheiro'}};","const CLS_INFO={knight:{name:'Cavaleiro'},mage:{name:'Mago'},archer:{name:'Arqueiro'},bomber:{name:'Artilheiro'},ninja:{name:'Ninja'},healer:{name:'Sacerdote'},summoner:{name:'Xamã'},angel:{name:'Anjo'}};");
rep("c.cls==='bomber'?'#ffa24a':","c.cls==='bomber'?'#ffa24a':c.cls==='ninja'?'#9a9aa8':c.cls==='healer'?'#ffe066':c.cls==='summoner'?'#9bff5a':c.cls==='angel'?'#9fd0ff':");
rep("  if(c.cls==='bomber')return 'cannon';","  if(c.cls==='bomber')return 'cannon';\n  if(c.cls==='ninja')return 'dagger';if(c.cls==='healer')return 'holystaff';if(c.cls==='summoner')return 'orb';if(c.cls==='angel')return 'greatsword';");
rep("const WEAPON_NAME={","const WEAPON_NAME={dagger:'Adaga',holystaff:'Cajado Sagrado',");
rep("  bomber:{rate:l=>Math.max(.9,1.6-.06*l),speed:210,splash:62,sp:.6,label:'Bomba (área grande)'}",
"  bomber:{rate:l=>Math.max(.9,1.6-.06*l),speed:210,splash:62,sp:.6,label:'Bomba (área grande)'},\n  healer:{rate:l=>Math.max(.45,.9-.05*l),speed:320,splash:30,sp:.5,label:'Orbe sagrado (cura vidas)'},\n  summoner:{rate:l=>Math.max(.5,1.0-.05*l),speed:260,splash:55,sp:.6,label:'Esfera venenosa (área)'},\n  angel:{rate:l=>Math.max(.2,.45-.03*l),speed:520,splash:0,sp:0,label:'Raio sagrado'}");
rep("// armadura do inimigo: reduz dano fisico","const PTR={mage:['#ff9a2a','#ffd23a'],healer:['#ffe066','#ffffff'],summoner:['#9bff5a','#3fae20'],angel:['#ffffff','#bfdcff']};\nconst PCOL={mage:['255,250,200','255,170,40','255,60,20'],healer:['255,255,230','255,224,102','255,170,40'],summoner:['230,255,200','150,240,80','40,140,30'],angel:['255,255,255','200,230,255','120,160,255']};\nlet healHits=0;\n// armadura do inimigo: reduz dano fisico");
rep("c:p.k==='mage'?(Math.random()<.5?'#ff9a2a':'#ffd23a'):'#8a8f9a'}","c:(PTR[p.k]||['#8a8f9a','#8a8f9a'])[Math.random()<.5?0:1]}");
rep("if(p.k==='mage'&&worm&&p.t.kind!=='jar')worm.slow=0.8;","if((p.k==='mage'||p.k==='summoner')&&worm&&p.t.kind!=='jar')worm.slow=p.k==='summoner'?1.3:0.8;\n      if(p.k==='healer'){healHits++;if(healHits>=30){healHits=0;if(lives<3){lives++;texts.push({x:W/2,y:280,s:'+1 vida!',life:2,big:true});}}}");
rep("p.k==='bomber'?['#444','#ff7a1a','#ffd23a','#888']:['#ff7a1a','#ffd23a','#ff4a1a']","p.k==='bomber'?['#444','#ff7a1a','#ffd23a','#888']:(PTR[p.k]||['#ff7a1a','#ffd23a','#ff4a1a'])");
rep("const g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,r*2.1);g.addColorStop(0,'rgba(255,250,200,1)');g.addColorStop(.35,'rgba(255,170,40,.95)');g.addColorStop(1,'rgba(255,60,20,0)');",
"const PC=PCOL[p.k]||PCOL.mage,g=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,r*2.1);g.addColorStop(0,'rgba('+PC[0]+',1)');g.addColorStop(.35,'rgba('+PC[1]+',.95)');g.addColorStop(1,'rgba('+PC[2]+',0)');");

// ---- escolha de classe: 4 cartas sorteadas entre as 8 ----
rep("const CARDS=[","let CARDS=[");
rep("function drawChoice(){",`const CLASS_DEFS={
  knight:{title:'Cavaleiro',tag:'Corpo a corpo',desc:['Dano muito alto','3 espadas giratórias','Armadura pesada'],c0:'#2a4a8c',c1:'#8fb4ff'},
  mage:{title:'Mago',tag:'Magia',desc:['Bola de fogo em área','Deixa a minhoca lenta','Ignora armadura'],c0:'#4a2a7c',c1:'#c79bff'},
  archer:{title:'Arqueiro',tag:'Longo alcance',desc:['Alcance gigante','Tiro muito rápido','Crítico 20% (x2)'],c0:'#1f5a2a',c1:'#86e07a'},
  bomber:{title:'Artilheiro',tag:'Explosivos',desc:['Bomba em área grande','Perfura armadura','Disparo lento'],c0:'#7a3a12',c1:'#ffb36a'},
  ninja:{title:'Ninja',tag:'Velocista',desc:['3 adagas giratórias','Giro muito rápido','Alcance curto'],c0:'#33333f',c1:'#b0b0c4'},
  healer:{title:'Sacerdote',tag:'Suporte',desc:['Orbes sagrados','+1 vida a cada 30 acertos','Dano baixo'],c0:'#7a6414',c1:'#ffe27a'},
  summoner:{title:'Xamã',tag:'Veneno',desc:['Esfera venenosa em área','Lentidão forte','Alcance longo'],c0:'#2f5a14',c1:'#a8ff6a'},
  angel:{title:'Anjo',tag:'Divino',desc:['Raios sagrados rápidos','Ignora armadura','Alcance enorme'],c0:'#2a4a7a',c1:'#bfe0ff'}
};
function rollCards(){
  const ks=Object.keys(CLASS_DEFS);for(let i=ks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ks[i],ks[j]]=[ks[j],ks[i]];}
  const pos=[[12,128],[184,128],[12,374],[184,374]];
  return ks.slice(0,4).map((k,i)=>Object.assign({k,x:pos[i][0],y:pos[i][1],w:164,h:236},CLASS_DEFS[k]));
}
function drawChoice(){`);
rep("if(other.lvl===5&&!other.cls)choice=other;","if(other.lvl===5&&!other.cls){CARDS=rollCards();choice=other;}");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
