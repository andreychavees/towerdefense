const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
function cut(startMark,endMark,repl){const a=s.indexOf(startMark),b=s.indexOf(endMark,a);if(a<0||b<0)throw new Error('cut '+startMark);s=s.slice(0,a)+repl+s.slice(b);}

// ===== grade de blocos e estrada alinhada aos blocos =====
rep("const PATH=[[68,-30],[68,341],[289,341],[289,680]];",`const GCOLS=8,GROWS=13,TS=45,GX0=0,GY0=44;
const pcx=i=>GX0+TS*(i+.5),pcy=j=>GY0+TS*(j+.5);
// estrada: caverna (1,0) -> desce ate (1,7) -> vai ate (6,7) -> desce ate o portal (6,12)
const PATH=[[pcx(1),pcy(0)],[pcx(1),pcy(7)],[pcx(6),pcy(7)],[pcx(6),pcy(12)]];
const PATH_CELLS=new Map();
(()=>{const T=(i,j,t)=>PATH_CELLS.set(i+','+j,t);
  T(1,0,'cave');for(let j=1;j<=6;j++)T(1,j,'v');T(1,7,'cNE');for(let i=2;i<=5;i++)T(i,7,'h');T(6,7,'cWS');for(let j=8;j<=11;j++)T(6,j,'v');T(6,12,'portal');})();
// decoracao do mapa (i,j,tipo): 0 arvore grande, 1 arvore pequena, 2 arbusto, 3 pedra, 4 tronco, 5 cerca, 6 cerca canto, 7 lago
const DECOR=[[0,0,0],[7,0,0],[3,0,1],[0,4,2],[7,4,1],[5,4,3],[0,9,0],[7,8,7],[7,12,0],[0,12,1],[3,12,2],[4,10,3],[2,12,4],[0,6,5],[7,2,6]];
const BLOCKED=new Set([...PATH_CELLS.keys(),...DECOR.map(d=>d[0]+','+d[1])]);`);

cut("// blocos do chao (xadrez do mapa)","function targetPos(",`// blocos do chao: cada bloco e uma peca da grade
const TILE_W=TS,TILE_H=TS,TILE_X0=GX0,TILE_Y0=GY0;
function cellAt(x,y){const i=Math.floor((x-TILE_X0)/TILE_W),j=Math.floor((y-TILE_Y0)/TILE_H);return{i,j,x:pcx(i),y:pcy(j)};}
function cellOk(cl,ignore){
  if(cl.i<0||cl.i>=GCOLS||cl.j<0||cl.j>=GROWS)return false;
  if(BLOCKED.has(cl.i+','+cl.j))return false;
  return !cats.some(o=>o!==ignore&&Math.abs(o.x-cl.x)<6&&Math.abs(o.y-cl.y)<6);
}
function validSpot(x,y,ignore){return cellOk(cellAt(x,y),ignore);}
function freeSpot(x,y){
  let best=null,bd=1e9;
  for(let i=0;i<GCOLS;i++)for(let j=0;j<GROWS;j++){const cl={i,j,x:pcx(i),y:pcy(j)};if(!cellOk(cl,null))continue;const d=Math.hypot(cl.x-x,cl.y-y);if(d<bd){bd=d;best=cl;}}
  return best?{x:best.x,y:best.y}:{x:pcx(3),y:pcy(2)};
}
`);
s=s.split("j<=14").join("j<=12").split("i<=7").join("i<=7");
rep("addCat(156.25,129.6,1);addCat(115.75,432.4,1);","addCat(pcx(3),pcy(2),1);addCat(pcx(3),pcy(9),1);");

// ===== mapa montado com blocos =====
rep("function drawBG(){\n  if(bgMaps.length===4)",`// ---------- mapa de blocos (tileset) ----------
let TILEMAP=null;
function chromaCell(cv){
  const w=cv.width,h=cv.height,g=cv.getContext('2d'),img=g.getImageData(0,0,w,h),d=img.data,N=w*h,bg=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const isg=i=>{const r=d[i*4],gg=d[i*4+1],b=d[i*4+2];return gg>150&&gg>r+55&&gg>b+55;};
  const tp=i=>{if(!bg[i]&&isg(i)){bg[i]=1;st[sp++]=i;}};
  for(let x=0;x<w;x++){tp(x);tp((h-1)*w+x);}for(let y=0;y<h;y++){tp(y*w);tp(y*w+w-1);}
  while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;if(x>0)tp(i-1);if(x<w-1)tp(i+1);if(y>0)tp(i-w);if(y<h-1)tp(i+w);}
  for(let i=0;i<N;i++)if(bg[i])d[i*4+3]=0;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(bg[i])continue;if(bg[i-1]||bg[i+1]||bg[i-w]||bg[i+w]){const r=d[i*4],gg=d[i*4+1],b=d[i*4+2];if(gg>Math.max(r,b)+20)d[i*4+1]=Math.max(r,b);}}
  g.putImageData(img,0,0);
}
loadImg('assets/art/tiles_floresta.webp').then(im=>{
  if(!im)return;
  const cw=im.naturalWidth/8,ch=im.naturalHeight/4,IN=4;
  const cell=(r,c,decor)=>{const o=document.createElement('canvas');o.width=Math.round(cw-IN*2);o.height=Math.round(ch-IN*2);
    o.getContext('2d').drawImage(im,c*cw+IN,r*ch+IN,cw-IN*2,ch-IN*2,0,0,o.width,o.height);if(decor)chromaCell(o);return o;};
  const T=(r,c)=>cell(r,c,false),D=(c)=>cell(3,c,true);
  const grass=[T(0,0),T(0,1),T(0,2),T(0,3)];
  const pathT={v:T(1,0),h:T(1,1),cNE:T(1,2),cWS:T(1,4),cave:T(2,0),portal:T(2,6)};
  const decor=[0,1,2,3,4,5,6,7].map(D);
  const S=2,o=document.createElement('canvas');o.width=W*S;o.height=H*S;const g=o.getContext('2d');g.imageSmoothingQuality='high';
  // fundo geral (cobre faixas fora da grade)
  g.fillStyle='#5aa02a';g.fillRect(0,0,o.width,o.height);
  let sd=5;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
  for(let j=0;j<GROWS;j++)for(let i=0;i<GCOLS;i++){
    const k=i+','+j,pt=PATH_CELLS.get(k);let tile;
    if(pt)tile=pathT[pt];else{const r=rnd();tile=(i+j)%2?grass[1]:grass[0];if(r<.1)tile=grass[2];else if(r<.2)tile=grass[3];}
    g.drawImage(tile,(GX0+i*TS)*S,(GY0+j*TS)*S,TS*S+1,TS*S+1);
  }
  // cobre o espaco acima/abaixo da grade com grama
  for(let i=0;i<GCOLS;i++){g.drawImage(grass[(i)%2],i*TS*S,0,TS*S+1,GY0*S+1);}
  const bot=GY0+GROWS*TS;if(bot<H)for(let i=0;i<GCOLS;i++)g.drawImage(grass[(i+1)%2],i*TS*S,bot*S,TS*S+1,(H-bot)*S+1);
  // decoracao (assentada na base do bloco)
  DECOR.forEach(([i,j,t])=>{const sc=1.12,w2=TS*sc,h2=TS*sc;g.drawImage(decor[t],(GX0+i*TS-(w2-TS)/2)*S,(GY0+j*TS-(h2-TS)+2)*S,w2*S,h2*S);});
  // luz suave e vinheta
  const vg=g.createRadialGradient(W*S/2,H*S/2,H*S*.3,W*S/2,H*S/2,H*S*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(10,35,10,.28)');g.fillStyle=vg;g.fillRect(0,0,o.width,o.height);
  TILEMAP=o;
});
function drawBG(){
  if(TILEMAP){ctx.drawImage(TILEMAP,0,0,W,H);return;}
  if(bgMaps.length===4)`);
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
