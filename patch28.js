const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
rep("const isSide=",`// folha de 5 estagios com fundo verde (chroma) ou xadrez desenhado: remove o fundo a partir das bordas e separa os 5
function evoSheet(im,mode){
  const w=im.naturalWidth,h=im.naturalHeight,N=w*h,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0);
  const img=g.getImageData(0,0,w,h),d=img.data,bg=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const isbg=i=>{const r=d[i*4],gg=d[i*4+1],b=d[i*4+2],a=d[i*4+3];if(a<10)return true;
    if(mode==='green')return gg>150&&gg>r+55&&gg>b+55;
    const mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);return mn>168&&mx-mn<26;};
  const tp=i=>{if(!bg[i]&&isbg(i)){bg[i]=1;st[sp++]=i;}};
  for(let x=0;x<w;x++){tp(x);tp((h-1)*w+x);}for(let y=0;y<h;y++){tp(y*w);tp(y*w+w-1);}
  while(sp){const i=st[--sp],x=i%w,y=(i/w)|0;if(x>0)tp(i-1);if(x<w-1)tp(i+1);if(y>0)tp(i-w);if(y<h-1)tp(i+w);}
  for(let i=0;i<N;i++)if(bg[i])d[i*4+3]=0;
  // tira o halo verde das bordas
  if(mode==='green')for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(bg[i])continue;
    if(bg[i-1]||bg[i+1]||bg[i-w]||bg[i+w]){const r=d[i*4],gg=d[i*4+1],b=d[i*4+2];if(gg>Math.max(r,b)+25){d[i*4+1]=Math.max(r,b);}}}
  g.putImageData(img,0,0);
  // colunas ocupadas -> 5 personagens
  const occ=new Int32Array(w);for(let x=0;x<w;x++){let n=0;for(let y=0;y<h;y+=2)if(d[(y*w+x)*4+3]>40)n++;occ[x]=n;}
  let segs=[],a=-1,gap=0;
  for(let x=0;x<w;x++){if(occ[x]>0){if(a<0)a=x;gap=0;}else if(a>=0){gap++;if(gap>5){if(x-gap-a>20)segs.push([a,x-gap]);a=-1;gap=0;}}}
  if(a>=0)segs.push([a,w-1]);
  let cuts;
  if(segs.length===5){cuts=[0];for(let i=0;i<4;i++)cuts.push(Math.round((segs[i][1]+segs[i+1][0])/2));cuts.push(w);}
  else{cuts=[0];[.2,.4,.6,.8].forEach(f=>{const c0=Math.round(f*w),r=Math.round(w*.04);let best=c0,bv=1e9;for(let x=c0-r;x<=c0+r;x++)if(occ[x]<bv){bv=occ[x];best=x;}cuts.push(best);});cuts.push(w);}
  const out=[];
  for(let i=0;i<5;i++){const sp_=cropCell(c,cuts[i],0,cuts[i+1],h,0.01);if(!sp_)return null;const cc=shrink(sp_.c,190);out.push({c:cc,w:cc.width,h:cc.height});}
  return out;
}
const WOLF_NEW=[],TIGER_NEW=[];
function loadImgC(src){return loadImg(src);}
loadImg('assets/art/tigre_evo.webp').then(im=>{if(!im)return;const o=evoSheet(im,'green');if(o)o.forEach(x=>TIGER_NEW.push(x));});
loadImg('assets/art/lobo_evo.webp').then(im=>{if(!im)return;const o=evoSheet(im,'checker');if(o)o.forEach(x=>WOLF_NEW.push(x));});
const isSide=`);
// cropCell recebe canvas ou imagem (drawImage aceita os dois, mas usa naturalWidth em loadFamily - aqui so usa x0..y1)
rep("function spriteFor(c){","function spriteFor(c){\n  if(c.cls==='tiger'&&TIGER_NEW.length===5)return TIGER_NEW[Math.max(1,Math.min(4,c.lvl-4))];\n  if(c.cls==='wolf'&&WOLF_NEW.length===5)return WOLF_NEW[Math.max(1,Math.min(4,c.lvl-4))];");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
