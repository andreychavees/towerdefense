const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("for(const cp of comps.slice(expected)){let best=-1,bd=45;","if(!opt.noattach)for(const cp of comps.slice(expected)){let best=-1,bd=45;");
rep("function drawWormHead(r,ang,armor){",`let SNAKE_HEAD=null,SNAKE_BODY=null,WORM_BODY=null;
loadImg('assets/art/cobra_cabeca.webp').then(im=>{if(im)SNAKE_HEAD=sheetToSprites(im,1,1,{maxH:260})[0];});
loadImg('assets/art/cobra_corpo.webp').then(im=>{if(im)SNAKE_BODY=sheetToSprites(im,1,1,{maxH:200,noattach:true})[0];});
loadImg('assets/art/minhoca_corpo.webp').then(im=>{if(im)WORM_BODY=sheetToSprites(im,1,1,{maxH:200,noattach:true})[0];});
function spriteForSeg(type,head){
  if(type==='worm')return head?WORM_HEAD:WORM_BODY;
  if(type==='snake')return head?SNAKE_HEAD:SNAKE_BODY;
  return null;
}
function drawSegSprite(sp,type,head,r,ang,i,armor,flash){
  const h=r*(head?(type==='snake'?3.0:2.9):(type==='snake'?2.5:2.7)),w=h*sp.w/sp.h;
  ctx.save();
  let f='';if(armor>0){const c=ARMOR_COL[Math.min(armor,3)];f+='drop-shadow(0 0 3px '+c+') drop-shadow(0 0 2px '+c+') ';}
  if(flash>0)f+='brightness(2)';
  ctx.filter=f||'none';
  ctx.rotate(head||type==='snake'?ang-Math.PI/2:i*0.9);
  ctx.drawImage(sp.c,-w/2,-h/2,w,h);ctx.restore();
}
function drawWormHead(r,ang,armor){`);
rep("  const head=sg.head;const pal=","  const head=sg.head;\n  {const sp=spriteForSeg(type,head);if(sp){drawSegSprite(sp,type,head,r,ang,i,armor,sg.flash);return;}}\n  const pal=");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
