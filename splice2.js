const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
const a=s.indexOf('function leekShape('),b=s.indexOf('function drawJar(');
if(a<0||b<0)throw new Error('marcadores nao achados');
s=s.slice(0,a)+fs.readFileSync('newcat.js','utf8')+s.slice(b);
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,50));s=s.replace(o,n);}
// status por classe
rep("const range=c=>62+c.lvl*7;\nconst leeks=c=>1+Math.floor(c.lvl/3);\nconst catDmg=c=>c.lvl===1?1:c.lvl*2-1;",
"const range=c=>{let r=62+c.lvl*7;if(c.cls==='mage')r*=1.35;if(c.cls==='knight')r*=0.88;return r;};\nconst leeks=c=>1+Math.floor(c.lvl/3)+(c.cls==='knight'?1:0);\nconst catDmg=c=>{let d=c.lvl===1?1:c.lvl*2-1;if(c.cls==='knight')d=Math.round(d*1.7);if(c.cls==='mage')d=Math.max(1,Math.round(d*0.75));return d;};\nlet choice=null;");
rep("  projs=[];addCat(135,200,1)","  choice=null;projs=[];addCat(135,200,1)");
rep("  now+=dt;\n","  now+=dt;\n  if(choice)return; // jogo pausado na escolha de classe\n");
rep("if(worm){worm.d+=worm.speed*dt;","if(worm){worm.d+=worm.speed*(worm.slow>0?0.5:1)*dt;worm.slow=(worm.slow||0)-dt;");
rep("dmgObj(t,catDmg(c),p);if(t.hp<=0&&t.head)shake=6;}","dmgObj(t,catDmg(c),p);if(c.cls==='mage'&&worm&&t.kind!=='jar')worm.slow=0.8;if(t.hp<=0&&t.head)shake=6;}");
rep("  if(state==='over'){reset();return;}\n  const p=pt(e),c=catAt(p.x,p.y);",
"  if(choice){const q=pt(e);for(const cd of CARDS)if(q.x>=cd.x&&q.x<=cd.x+cd.w&&q.y>=cd.y&&q.y<=cd.y+cd.h){choice.cls=cd.k;choice.pop=1;burst(choice.x,choice.y,24,[tierCol(choice),'#fff','#ffe066']);choice=null;}return;}\n  if(state==='over'){reset();return;}\n  const p=pt(e),c=catAt(p.x,p.y);");
rep("if(other.lvl===c.lvl&&c.lvl<8){other.lvl++;other.pop=1;cats=cats.filter(k=>k!==c);burst(other.x,other.y,12,['#6dff6d','#fff']);}",
"if(other.lvl===c.lvl&&(other.cls||null)===(c.cls||null)&&c.lvl<8){other.lvl++;other.pop=1;cats=cats.filter(k=>k!==c);burst(other.x,other.y,12,['#6dff6d','#fff']);if(other.lvl===5&&!other.cls)choice=other;}");
rep("const ok=!!o?(o.lvl===c.lvl):","const ok=!!o?(o.lvl===c.lvl&&(o.cls||null)===(c.cls||null)):");
rep("draw();requestAnimationFrame(loop);","draw();if(choice)drawChoice();requestAnimationFrame(loop);");
fs.writeFileSync('gatos-vs-minhoca.html',s);
console.log('ok');
