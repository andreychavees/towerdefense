const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
rep("function cropCell(im,x0,y0,x1,y1){","function cropCell(im,x0,y0,x1,y1,minFrac){");
rep("comps[0].area*0.08","comps[0].area*(minFrac||0.08)");
{const a=s.indexOf("loadImg('assets/art/gato_evo.webp')"),b=s.indexOf("const isSide=");if(a<0||b<0)throw new Error('evo');
s=s.slice(0,a)+`loadImg('assets/art/gato_evo.webp').then(im=>{if(!im)return;
  const W_=im.naturalWidth,H_=im.naturalHeight,c0=document.createElement('canvas');c0.width=W_;c0.height=H_;const g0=c0.getContext('2d');g0.drawImage(im,0,0);
  const d=g0.getImageData(0,0,W_,H_).data,occ=new Int32Array(W_);
  for(let x=0;x<W_;x++){let n=0;for(let y=0;y<H_;y+=2)if(d[(y*W_+x)*4+3]>40)n++;occ[x]=n;}
  // cortes: menor ocupacao perto de onde os personagens se separam
  const cuts=[0];[.153,.325,.516,.725].forEach(f=>{const c=Math.round(f*W_),r=Math.round(W_*.025);let best=c,bv=1e9;for(let x=c-r;x<=c+r;x++){if(occ[x]<bv){bv=occ[x];best=x;}}cuts.push(best);});cuts.push(W_);
  const out=[];
  for(let i=0;i<5;i++){const sp=cropCell(im,cuts[i],0,cuts[i+1],H_,0.01);if(!sp)return;const c=shrink(sp.c,190);out.push({c,w:c.width,h:c.height});}
  out.forEach(x=>EVO5.push(x));});
`+s.slice(b);}
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
