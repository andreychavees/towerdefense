const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}
rep("let SNAKE_HEAD=null,SNAKE_BODY=null,WORM_BODY=null;",`let SNAKE_HEAD=null,SNAKE_BODY=null,WORM_BODY=null,CENT_HEAD=null,CENT_BODY=null,LAVA_HEAD=null,LAVA_BODY=null;
loadImg('assets/art/lacraia_cabeca.webp').then(im=>{if(im)CENT_HEAD=sheetToSprites(im,1,1,{maxH:260})[0];});
loadImg('assets/art/lacraia_corpo.webp').then(im=>{if(im)CENT_BODY=sheetToSprites(im,1,1,{maxH:200})[0];});
loadImg('assets/art/lava_cabeca.webp').then(im=>{if(im)LAVA_HEAD=sheetToSprites(im,1,1,{maxH:260})[0];});
loadImg('assets/art/lava_corpo.webp').then(im=>{if(im)LAVA_BODY=sheetToSprites(im,1,1,{maxH:200,noattach:true})[0];});
const SEG_SIZE={worm:[2.7,2.9],snake:[2.5,2.1],centipede:[2.3,2.7]};`);
rep("  if(type==='worm')return head?WORM_HEAD:WORM_BODY;","  if(type==='worm'){if(worm&&worm.variant==='lava')return head?LAVA_HEAD:LAVA_BODY;return head?WORM_HEAD:WORM_BODY;}\n  if(type==='centipede')return head?CENT_HEAD:CENT_BODY;");
rep("const h=r*(head?(type==='snake'?2.1:2.9):(type==='snake'?2.5:2.7)),w=h*sp.w/sp.h;","const h=r*SEG_SIZE[type][head?1:0],w=h*sp.w/sp.h;");
rep("ctx.rotate(head||type==='snake'?ang-Math.PI/2:i*0.9);","ctx.rotate(head||type==='snake'||type==='centipede'?ang-Math.PI/2:i*0.9);");
// verme de lava no mapa do vulcao (ondas 13-16)
rep("function enemyInfo(w){const et=ENEMY_TYPES[(w-1)%4];","function enemyInfo(w){const et=ENEMY_TYPES[(w-1)%4];if(et.k==='worm'&&Math.floor((w-1)/4)%4===3)return{k:'worm',name:'Verme de Lava',variant:'lava'};");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
