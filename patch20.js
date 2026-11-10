const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("let SNAKE_HEAD=null,",`// ---------- Familias de inimigos (folha 4x2: cabecas e corpos em 4 niveis de armadura) ----------
function cropCell(im,x0,y0,x1,y1){
  const w=x1-x0,h=y1-y0,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,x0,y0,w,h,0,0,w,h);
  const img=g.getImageData(0,0,w,h),d=img.data,N=w*h,lab=new Int32Array(N),st=new Int32Array(N),comps=[];let nl=0;
  const solid=i=>d[i*4+3]>=40&&!(d[i*4]>240&&d[i*4+1]>240&&d[i*4+2]>240&&d[i*4+3]>=250&&false);
  for(let s0=0;s0<N;s0++){if(!solid(s0)||lab[s0])continue;nl++;let sp=0,area=0,x0b=w,y0b=h,x1b=0,y1b=0;st[sp++]=s0;lab[s0]=nl;
    while(sp){const i=st[--sp];area++;const x=i%w,y=(i/w)|0;if(x<x0b)x0b=x;if(x>x1b)x1b=x;if(y<y0b)y0b=y;if(y>y1b)y1b=y;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;const j=Y*w+X;if(solid(j)&&!lab[j]){lab[j]=nl;st[sp++]=j;}}}
    comps.push({id:nl,area,x0:x0b,y0:y0b,x1:x1b,y1:y1b});}
  comps.sort((a,b)=>b.area-a.area);if(!comps.length)return null;
  const keep=new Set(comps.filter(q=>q.area>=comps[0].area*0.08).map(q=>q.id));
  let bx0=w,by0=h,bx1=0,by1=0;for(const q of comps)if(keep.has(q.id)){bx0=Math.min(bx0,q.x0);by0=Math.min(by0,q.y0);bx1=Math.max(bx1,q.x1);by1=Math.max(by1,q.y1);}
  const cw=bx1-bx0+1,ch=by1-by0+1,oc=document.createElement('canvas');oc.width=cw;oc.height=ch;const og=oc.getContext('2d'),oi=og.createImageData(cw,ch),od=oi.data;
  for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y+by0)*w+(x+bx0);if(lab[i]&&keep.has(lab[i])){const o=(y*cw+x)*4;od[o]=d[i*4];od[o+1]=d[i*4+1];od[o+2]=d[i*4+2];od[o+3]=d[i*4+3];}}
  og.putImageData(oi,0,0);return{c:oc,w:cw,h:ch};
}
const FAM={};
function loadFamily(type,file,opt){
  opt=opt||{};loadImg(file).then(im=>{if(!im)return;
    const cw=im.naturalWidth/4,ch=im.naturalHeight/2,heads=[],bodies=[];
    for(let t=0;t<4;t++){
      const h=cropCell(im,Math.round(t*cw),0,Math.round((t+1)*cw),Math.round(ch));
      const b=cropCell(im,Math.round(t*cw),Math.round(ch),Math.round((t+1)*cw),Math.round(ch*2));
      if(!h||!b)return;
      const hs=shrink(h.c,260),bs=shrink(b.c,opt.bodyMaxH||300);
      heads.push({c:hs,w:hs.width,h:hs.height,baked:true});
      // corpo = pilha de segmentos; fatia em faixas para repetir ao longo da fila
      const n=opt.bands||3,bw=bs.width,bh=bs.height,list=[];
      for(let k=0;k<n;k++){const y0=Math.max(0,Math.round(k*bh/n-bh*0.04)),y1=Math.min(bh,Math.round((k+1)*bh/n+bh*0.04)),o=document.createElement('canvas');o.width=bw;o.height=y1-y0;o.getContext('2d').drawImage(bs,0,y0,bw,y1-y0,0,0,bw,y1-y0);list.push({c:o,w:bw,h:y1-y0,baked:true,band:true});}
      bodies.push(list);
    }
    FAM[type]={heads,bodies};});
}
loadFamily('worm','assets/art/fam_minhoca.webp');
let SNAKE_HEAD=null,`);
rep("function spriteForSeg(type,head){\n","function spriteForSeg(type,head,armor,i){\n  if(FAM[type]&&!(type==='worm'&&worm&&worm.variant==='lava')){const f=FAM[type],t=Math.min(armor||0,3);return head?f.heads[t]:f.bodies[t][(i||0)%f.bodies[t].length];}\n");
rep("{const sp=spriteForSeg(type,head);if(sp){","{const sp=spriteForSeg(type,head,armor,i);if(sp){");
rep("  const h=r*SEG_SIZE[type][head?1:0],w=h*sp.w/sp.h;","  let h=r*SEG_SIZE[type][head?1:0],w=h*sp.w/sp.h;\n  if(sp.band){w=r*3.0;h=w*sp.h/sp.w;}");
rep("let f='';if(armor>0){const c=ARMOR_COL","let f='';if(armor>0&&!sp.baked){const c=ARMOR_COL");
rep("ctx.rotate(head||type==='snake'||type==='centipede'?ang-Math.PI/2:i*0.9);","ctx.rotate(head||sp.band||type==='snake'||type==='centipede'?ang-Math.PI/2:i*0.9);");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
