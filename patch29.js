const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
const a=s.indexOf("  // colunas ocupadas -> 5 personagens"),b=s.indexOf("  return out;\n}\nconst WOLF_NEW");
if(a<0||b<0)throw new Error('markers');
s=s.slice(0,a)+`  // componentes conectados: os 5 maiores sao os corpos; pecas soltas (raios, chamas) vao para o corpo mais proximo
  const lab=new Int32Array(N),comps=[];let nl=0;
  for(let s0=0;s0<N;s0++){if(d[s0*4+3]<40||lab[s0])continue;nl++;let q=0,area=0,x0=w,y0=h,x1=0,y1=0;st[q++]=s0;lab[s0]=nl;
    while(q){const i=st[--q];area++;const x=i%w,y=(i/w)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;const j=Y*w+X;if(d[j*4+3]>=40&&!lab[j]){lab[j]=nl;st[q++]=j;}}}
    comps.push({id:nl,area,x0,y0,x1,y1});}
  comps.sort((p,q)=>q.area-p.area);
  const anchors=comps.slice(0,5).map(c=>Object.assign({},c)),owner=new Int32Array(nl+1).fill(-1);
  anchors.forEach((c,k)=>{owner[c.id]=k;});
  for(const cp of comps.slice(5)){if(cp.area<12)continue;let best=-1,bd=1e9;
    anchors.forEach((an,k)=>{const dx=Math.max(0,an.x0-cp.x1,cp.x0-an.x1),dy=Math.max(0,an.y0-cp.y1,cp.y0-an.y1),dd=Math.hypot(dx,dy);if(dd<bd){bd=dd;best=k;}});
    if(best>=0&&bd<70){owner[cp.id]=best;const an=anchors[best];an.x0=Math.min(an.x0,cp.x0);an.y0=Math.min(an.y0,cp.y0);an.x1=Math.max(an.x1,cp.x1);an.y1=Math.max(an.y1,cp.y1);}}
  if(anchors.length<5)return null;
  anchors.sort((p,q)=>(p.x0+p.x1)-(q.x0+q.x1));
  const out=[];
  anchors.forEach(an=>{const k=owner[an.id],cw=an.x1-an.x0+1,ch=an.y1-an.y0+1,oc=document.createElement('canvas');oc.width=cw;oc.height=ch;
    const og=oc.getContext('2d'),oi=og.createImageData(cw,ch),od=oi.data;
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y+an.y0)*w+(x+an.x0),L=lab[i];if(L&&owner[L]===k){const o=(y*cw+x)*4,qq=i*4;od[o]=d[qq];od[o+1]=d[qq+1];od[o+2]=d[qq+2];od[o+3]=d[qq+3];}}
    og.putImageData(oi,0,0);const cc=shrink(oc,190);out.push({c:cc,w:cc.width,h:cc.height});});
`+s.slice(b);
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
