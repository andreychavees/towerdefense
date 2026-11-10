const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,60));s=s.replace(o,n);}
rep("function drawDragonHead(r,pal){",`// sprite do dragao (Knight, Princess and Dragon 2 - CC0)
const DRAGON_IMGS=[];let dragonReady=0;
for(let i=0;i<20;i++){const im=new Image();im.onload=()=>dragonReady++;im.src='assets/dragon/Dragon-Walk_'+String(i).padStart(2,'0')+'.png';DRAGON_IMGS.push(im);}
const DRAGON_FILTER={fire:'none',ice:'hue-rotate(185deg) saturate(.9) brightness(1.2)',toxic:'hue-rotate(95deg) saturate(1.15)',shadow:'hue-rotate(255deg) saturate(1.2) brightness(.6)'};
function drawDragonSprite(r,variant){
  if(dragonReady<20)return false;
  const im=DRAGON_IMGS[Math.floor(now*16)%20],w=118,h=w*im.naturalHeight/im.naturalWidth;
  ctx.save();ctx.filter=DRAGON_FILTER[variant||'fire']||'none';
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,h*.34,w*.34,h*.1,0,0,6.2832);ctx.fill();
  ctx.drawImage(im,-w*.5,-h*.62,w,h);ctx.restore();return true;
}
function drawDragonHead(r,pal){`);
rep("}else if(head){drawDragonHead(r,DRAGON_PAL[(worm&&worm.variant)||'fire']);","}else if(head){if(!drawDragonSprite(r,worm&&worm.variant))drawDragonHead(r,DRAGON_PAL[(worm&&worm.variant)||'fire']);");
rep("if(sg.flash>0&&!(type==='dragon'&&head))","if(sg.flash>0&&!(type==='dragon'&&head)&&!(dragonReady>=20&&type==='dragon'&&head))");
rep("p.y-r-(type==='dragon'?24:6));ctx.fillText(sg.hp,p.x,p.y-r-(type==='dragon'?24:6));","p.y-r-(type==='dragon'?30:6));ctx.fillText(sg.hp,p.x,p.y-r-(type==='dragon'?30:6));");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
