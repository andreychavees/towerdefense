const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}
rep("function drawBG(){\n  if(bgSheet)",`// gatos em alta resolucao (um arquivo por nivel): reduz com qualidade, tira o fundo branco e apara as bordas
const CAT_HI=[null,null,null,null];
function processCatImg(im){
  const TH=300,ratio=im.naturalWidth/im.naturalHeight,TW=Math.round(TH*ratio);
  let cur=document.createElement('canvas');cur.width=im.naturalWidth;cur.height=im.naturalHeight;cur.getContext('2d').drawImage(im,0,0);
  while(cur.height>TH*2){const n=document.createElement('canvas');n.width=Math.round(cur.width/2);n.height=Math.round(cur.height/2);const g=n.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(cur,0,0,n.width,n.height);cur=n;}
  const c=document.createElement('canvas');c.width=TW;c.height=TH;const g=c.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(cur,0,0,TW,TH);
  const img=g.getImageData(0,0,TW,TH),d=img.data,w=TW,h=TH,seen=new Uint8Array(w*h),st=[];
  const bg=i=>d[i*4+3]<10||(d[i*4]>232&&d[i*4+1]>232&&d[i*4+2]>232);
  const push=i=>{if(!seen[i]&&bg(i)){seen[i]=1;st.push(i);}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
  while(st.length){const i=st.pop(),x=i%w,y=(i/w)|0;if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w);}
  let x0=w,y0=h,x1=0,y1=0;
  for(let i=0;i<w*h;i++){if(seen[i]){d[i*4+3]=0;continue;}const x=i%w,y=(i/w)|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(seen[i])continue;if(seen[i-1]||seen[i+1]||seen[i-w]||seen[i+w]){const b=(d[i*4]+d[i*4+1]+d[i*4+2])/3;if(b>190)d[i*4+3]=Math.max(0,255-(b-190)*4);}}
  g.putImageData(img,0,0);
  const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);
  return{c:o,w:o.width,h:o.height};
}
for(let i=0;i<4;i++){const im=new Image();im.onload=()=>{CAT_HI[i]=processCatImg(im);};im.src='assets/art/gato'+(i+1)+'.webp';}
function drawBG(){
  if(bgSheet)`);
rep("spr=CAT_SPR[lvl-1];","spr=CAT_HI[lvl-1]||CAT_SPR[lvl-1];");
rep("if(!cls&&lvl<=4&&CAT_SPR.length===4)","if(!cls&&lvl<=4&&(CAT_HI[lvl-1]||CAT_SPR.length===4))");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
