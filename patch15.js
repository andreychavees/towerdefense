const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("const CAT_HI=[null,null,null,null];",`let WORM_HEAD=null;
loadImg('assets/art/minhoca_cabeca.webp').then(im=>{if(!im)return;const sp=sheetToSprites(im,1,1,{maxH:260});WORM_HEAD=sp[0];});
function drawWormHead(r,ang,armor){
  const h=r*2.9,w=h*WORM_HEAD.w/WORM_HEAD.h;
  ctx.save();ctx.rotate(ang-Math.PI/2); // a arte olha para baixo
  if(armor>0)ctx.filter='drop-shadow(0 0 3px '+ARMOR_COL[Math.min(armor,3)]+') drop-shadow(0 0 2px '+ARMOR_COL[Math.min(armor,3)]+')';
  ctx.drawImage(WORM_HEAD.c,-w/2,-h/2,w,h);ctx.restore();
}
const CAT_HI=[null,null,null,null];`);
rep("  if(type==='worm'){\n","  if(type==='worm'&&head&&WORM_HEAD){drawWormHead(r,ang,worm.armor);\n  }else if(type==='worm'){\n");
rep("if(armor>0&&!(type==='dragon'&&head&&dragonReady>=20)){","if(armor>0&&!(type==='dragon'&&head&&dragonReady>=20)&&!(type==='worm'&&head&&WORM_HEAD)){");
rep("if(sg.flash>0&&!(type==='dragon'&&head)&&!(dragonReady>=20&&type==='dragon'&&head))","if(sg.flash>0&&!(type==='dragon'&&head)&&!(type==='worm'&&head&&WORM_HEAD))");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
