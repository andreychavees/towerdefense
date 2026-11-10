const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("const CLS_ORDER=[",`// Separa desenhos que se encostam: erode a mascara, rotula os nucleos e devolve os pixels ao nucleo mais proximo
function splitSheet(im,R,minArea,maxH){
  const w=im.naturalWidth,h=im.naturalHeight,N=w*h;
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0);
  const d=g.getImageData(0,0,w,h).data;
  const op=new Uint8Array(N);for(let i=0;i<N;i++)op[i]=d[i*4+3]>40?1:0;
  // erosao separavel
  const tmp=new Uint8Array(N),er=new Uint8Array(N);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let ok=1;for(let k=-R;k<=R&&ok;k++){const X=x+k;if(X<0||X>=w||!op[y*w+X])ok=0;}tmp[y*w+x]=ok;}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let ok=1;for(let k=-R;k<=R&&ok;k++){const Y=y+k;if(Y<0||Y>=h||!tmp[Y*w+x])ok=0;}er[y*w+x]=ok;}
  // rotula nucleos
  const lab=new Int32Array(N),stack=new Int32Array(N),comps=[];let nl=0;
  for(let s0=0;s0<N;s0++){if(!er[s0]||lab[s0])continue;nl++;let sp=0,area=0;stack[sp++]=s0;lab[s0]=nl;
    while(sp){const i=stack[--sp];area++;const x=i%w,y=(i/w)|0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;const j=Y*w+X;if(er[j]&&!lab[j]){lab[j]=nl;stack[sp++]=j;}}}
    comps.push({id:nl,area});}
  const keep=new Uint8Array(nl+1);comps.forEach(c=>{if(c.area>=minArea)keep[c.id]=1;});
  // crescimento a partir dos nucleos mantidos
  const own=new Int32Array(N).fill(0),queue=new Int32Array(N);let qh=0,qt=0;
  for(let i=0;i<N;i++){if(er[i]&&keep[lab[i]]){own[i]=lab[i];queue[qt++]=i;}}
  while(qh<qt){const i=queue[qh++],x=i%w,y=(i/w)|0,L=own[i];
    if(x>0&&op[i-1]&&!own[i-1]){own[i-1]=L;queue[qt++]=i-1;}
    if(x<w-1&&op[i+1]&&!own[i+1]){own[i+1]=L;queue[qt++]=i+1;}
    if(y>0&&op[i-w]&&!own[i-w]){own[i-w]=L;queue[qt++]=i-w;}
    if(y<h-1&&op[i+w]&&!own[i+w]){own[i+w]=L;queue[qt++]=i+w;}}
  // caixas e sprites
  const bb={};for(let i=0;i<N;i++){const L=own[i];if(!L)continue;const x=i%w,y=(i/w)|0,b=bb[L]||(bb[L]={x0:w,y0:h,x1:0,y1:0,area:0});if(x<b.x0)b.x0=x;if(x>b.x1)b.x1=x;if(y<b.y0)b.y0=y;if(y>b.y1)b.y1=y;b.area++;}
  return Object.keys(bb).map(L=>{const b=bb[L],cw=b.x1-b.x0+1,ch=b.y1-b.y0+1,oc=document.createElement('canvas');oc.width=cw;oc.height=ch;
    const og=oc.getContext('2d'),oi=og.createImageData(cw,ch),od=oi.data;
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y+b.y0)*w+(x+b.x0);if(own[i]==L){const o=(y*cw+x)*4,q=i*4;od[o]=d[q];od[o+1]=d[q+1];od[o+2]=d[q+2];od[o+3]=d[q+3];}}
    og.putImageData(oi,0,0);const sc=shrink(oc,maxH||160);
    return{c:sc,w:sc.width,h:sc.height,cx:(b.x0+b.x1)/2,cy:(b.y0+b.y1)/2,area:b.area};});
}
const CLS_ORDER=[`);
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
