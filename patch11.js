const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}
// estrada do novo mapa
rep("const PATH=[[62,-30],[62,300],[250,300],[250,680]];","const PATH=[[46,-30],[46,318],[287,318],[287,680]];");
// mapa e gatos vindos da folha de arte
rep("function drawBG(){if(!bgCache)buildBG();ctx.drawImage(bgCache,0,0,W,H);}",
`// ---------- Arte gerada (folha: mapa + gatos nivel 1-4) ----------
const SHEET=new Image();let sheetOK=false,bgSheet=null;const CAT_SPR=[];
SHEET.onload=()=>{
  sheetOK=true;
  const o=document.createElement('canvas');o.width=W*2;o.height=H*2;
  o.getContext('2d').drawImage(SHEET,310,24,706,1460,0,-104,W*2,1460*(W*2/706));bgSheet=o;
  // recorta os gatos e remove o fundo branco por preenchimento a partir das bordas
  [[19,52,285,365],[3,406,285,729],[13,768,283,1090],[13,1126,291,1455]].forEach(([x0,y0,x1,y1])=>{
    x0-=4;y0-=4;x1+=4;y1+=4;const w=x1-x0,h=y1-y0;
    const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(SHEET,x0,y0,w,h,0,0,w,h);
    const im=g.getImageData(0,0,w,h),d=im.data,seen=new Uint8Array(w*h),st=[];
    const white=i=>d[i*4]>232&&d[i*4+1]>232&&d[i*4+2]>232;
    const push=i=>{if(!seen[i]&&white(i)){seen[i]=1;st.push(i);}};
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
    while(st.length){const i=st.pop(),x=i%w,y=(i/w)|0;if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w);}
    for(let i=0;i<w*h;i++)if(seen[i])d[i*4+3]=0;
    // suaviza o halo claro na borda
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(seen[i])continue;if(seen[i-1]||seen[i+1]||seen[i-w]||seen[i+w]){const b=(d[i*4]+d[i*4+1]+d[i*4+2])/3;if(b>190)d[i*4+3]=Math.max(0,255-(b-190)*4);}}
    g.putImageData(im,0,0);CAT_SPR.push({c,w,h});
  });
};
SHEET.src='assets/art/sheet.webp';
function drawBG(){
  if(bgSheet){ctx.drawImage(bgSheet,0,0,W,H);return;}
  if(!bgCache)buildBG();ctx.drawImage(bgCache,0,0,W,H);
}
function drawSpriteCat(c,x,y,lifted,preview){
  const lvl=c.lvl,tc=tierCol(c),spr=CAT_SPR[lvl-1];
  ctx.save();ctx.translate(x,y);
  if(lvl>=3){const R=26+lvl*3,gr=ctx.createRadialGradient(0,0,6,0,0,R);gr.addColorStop(0,tc+'99');gr.addColorStop(1,tc+'00');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R,0,6.28);ctx.fill();}
  if(!lifted&&!preview){
    if(selected===c){ctx.fillStyle='rgba(255,255,255,.10)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(0,0,melee(c),0,6.28);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
    const n=leeks(c);
    for(let k=0;k<n;k++){ctx.save();ctx.rotate(c.ang+k*6.2832/n);leekShape(melee(c)+4,weaponStyle(c));ctx.restore();}
  }
  const sc=1+(c.pop||0)*0.4;ctx.scale(sc,sc);
  if(lifted)ctx.translate(0,-8);
  const pg=ctx.createRadialGradient(0,26,2,0,26,24);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,26,25,9.5,0,0,6.2832);ctx.fill();
  ctx.strokeStyle=tc;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,26,18,6.5,0,0,6.2832);ctx.stroke();
  const h=58+lvl*3,w=h*spr.w/spr.h,bob=Math.sin(now*5+c.id)*1.2;
  ctx.drawImage(spr.c,-w/2,28-h+bob,w,h);
  ctx.restore();
  ctx.fillStyle='#2f9e44';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;const bx=x-24;
  ctx.beginPath();ctx.arc(bx,y-22,9,0,6.28);ctx.fill();ctx.stroke();
  ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(lvl,bx,y-18);
}`);
rep("  if(cls==='knight'&&knightReady>=54)","  if(!cls&&lvl<=4&&CAT_SPR.length===4)return drawSpriteCat(c,x,y,lifted,preview);\n  if(cls==='knight'&&knightReady>=54)");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
