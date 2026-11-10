const fs=require('fs');
let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,70));s=s.replace(o,n);}

// ---- armas giratorias menores (alcance corpo a corpo limitado) ----
rep("const leeks=c=>","const melee=c=>Math.min(range(c),74);\nconst leeks=c=>");
rep("const n=leeks(c),R=range(c);","const n=leeks(c),R=melee(c);");
rep("ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(0,0,range(c),0,6.28);ctx.stroke();ctx.setLineDash([]);",
"if(selected===c){ctx.fillStyle='rgba(255,255,255,.10)';ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(0,0,RANGED[cls]?range(c):melee(c),0,6.28);ctx.fill();ctx.stroke();ctx.setLineDash([]);}");
rep("ctx.arc(0,0,range(c)*.7,a-0.8,a-0.1)","ctx.arc(0,0,melee(c)*.7,a-0.8,a-0.1)");
rep("ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=9;","ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=9;");
rep("leekShape(range(c)+4,style)","leekShape(melee(c)+4,style)");
rep("ctx.arc(drag.x,drag.y,range(c),0,6.28)","ctx.arc(drag.x,drag.y,RANGED[c.cls]?range(c):melee(c),0,6.28)");
rep("'Dano '+catDmg(c)+'   Alcance '+Math.round(range(c))","'Dano '+catDmg(c)+'   Alcance '+Math.round(RANGED[c.cls]?range(c):melee(c))");

// ---- pedestal colorido por classe/nivel sob cada gato ----
rep("ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,26,15,5,0,0,6.28);ctx.fill();",
`const pg=ctx.createRadialGradient(0,26,2,0,26,24);pg.addColorStop(0,tc+'dd');pg.addColorStop(1,tc+'00');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(0,26,25,9.5,0,0,6.2832);ctx.fill();
  ctx.strokeStyle=tc;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,26,18,6.5,0,0,6.2832);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,26,14,4.6,0,0,6.28);ctx.fill();`);

// ---- mapa menos carregado ----
rep("for(let i=0;i<2600;i++)","for(let i=0;i<900;i++)");
rep("for(let i=0;i<150;i++){const x=rnd()*W,y=rnd()*H,r=rr_(25,70)","for(let i=0;i<70;i++){const x=rnd()*W,y=rnd()*H,r=rr_(35,80)");
rep("dark?'rgba(40,100,30,.20)':'rgba(190,235,110,.20)'","dark?'rgba(40,100,30,.12)':'rgba(190,235,110,.12)'");
rep("for(let i=0;i<70;i++){const d=rnd()*PLEN,p=posAt(d),x=p.x+rr_(-22,22)","for(let i=0;i<24;i++){const d=rnd()*PLEN,p=posAt(d),x=p.x+rr_(-22,22)");
rep("for(let d=0;d<PLEN;d+=8){\n    for(const side","for(let d=0;d<PLEN;d+=12){\n    for(const side");
{const a=s.indexOf('const items=['),b=s.indexOf('items.forEach(f=>f());');if(a<0||b<0)throw new Error('items');
 s=s.slice(0,a)+`const items=[
    ()=>pine(26,76,16),()=>tree(312,38,17),()=>pond(310,132,28,17),
    ()=>tree(24,330,20),()=>bush(334,372,12,false),()=>pine(28,470,18),
    ()=>bush(326,520,14,true),()=>tree(322,590,19),()=>rock(34,604,13),()=>flowers(300,300,5,['#fff','#ffe066'])
  ];
  `+s.slice(b);}
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
