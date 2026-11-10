const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}

// ===== 1) cauda densa, segmentos maiores e numerados =====
rep("gap:21,type:et.k","gap:15,type:et.k");
rep("const n=22+wave*3+(boss?10:0),segs=[];","const n=30+wave*4+(boss?12:0),segs=[];");
rep("const r=sg.head?(boss?29:25):(type==='snake'?16:boss?19:18);","const r=sg.head?(boss?30:26):(type==='snake'?18:boss?21:20);");
rep("if(sp.band){w=r*3.0;h=w*sp.h/sp.w;}","if(sp.band){w=r*2.8;h=w*sp.h/sp.w;}");
rep("ctx.strokeText(sg.hp,p.x,p.y-r-(type==='dragon'?30:6));ctx.fillText(sg.hp,p.x,p.y-r-(type==='dragon'?30:6));}",
"ctx.strokeText(sg.hp,p.x,p.y-r-(type==='dragon'?30:6));ctx.fillText(sg.hp,p.x,p.y-r-(type==='dragon'?30:6));}\n    else{ctx.font='900 11px system-ui';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.fillStyle='#fff';ctx.strokeText(sg.hp,p.x,p.y-r*.42);ctx.fillText(sg.hp,p.x,p.y-r*.42);}");

// ===== 2) mutacoes alteram dano/alcance =====
rep("const range=c=>{","const range=c=>(c.mr||1)*range_(c);\nconst range_=c=>{");
rep("const catDmg=c=>{","const catDmg=c=>Math.max(1,Math.round(catDmg_(c)*(c.md||1)));\nconst catDmg_=c=>{");

// ===== 3) tela "Escolha a recompensa": Evolucao (com risco) ou Mutacao =====
{const a=s.indexOf('function drawChoice(){'),b=s.indexOf('\n}\n',a)+3;if(a<0||b<3)throw new Error('drawChoice');
s=s.slice(0,a)+`const MUTS=[
  {n:'Fúria',d:['+50% de dano'],md:1.5,col:'#ff6a4a'},
  {n:'Olho de Águia',d:['+30% de alcance'],mr:1.3,col:'#6ad0ff'},
  {n:'Gigante',d:['+30% de dano','+15% de alcance'],md:1.3,mr:1.15,col:'#ffb04a'},
  {n:'Predador',d:['+80% de dano','-10% de alcance'],md:1.8,mr:0.9,col:'#c04aff'}
];
function rollReward(cat){
  const ks=Object.keys(CLASS_DEFS),k=ks[Math.floor(Math.random()*ks.length)],m=MUTS[Math.floor(Math.random()*MUTS.length)];
  const chance=cat.pity?100:75;
  return[
    {type:'evo',k,m:null,chance,x:18,y:150,w:156,h:300,def:CLASS_DEFS[k]},
    {type:'mut',k:null,m,chance:100,x:186,y:150,w:156,h:300,def:null}
  ];
}
function drawChoice(){
  ctx.fillStyle='rgba(8,12,20,.86)';ctx.fillRect(0,0,W,H);
  // faixa
  const rg=ctx.createLinearGradient(0,70,0,104);rg.addColorStop(0,'#ffd35a');rg.addColorStop(1,'#e8860a');
  ctx.fillStyle=rg;ctx.strokeStyle='#7a4a0a';ctx.lineWidth=3;rr(ctx,40,72,W-80,34,8);ctx.fill();ctx.stroke();
  shadowText('Escolha a recompensa',W/2,96,'900 19px system-ui','#fff','center');
  for(const cd of CARDS){
    const evo=cd.type==='evo',c0=evo?cd.def.c0:'#4a3a0a',c1=evo?cd.def.c1:cd.m.col;
    const gr=ctx.createLinearGradient(0,cd.y,0,cd.y+cd.h);gr.addColorStop(0,c0);gr.addColorStop(1,'#141a2c');
    ctx.fillStyle=gr;ctx.strokeStyle=c1;ctx.lineWidth=3.5;rr(ctx,cd.x,cd.y,cd.w,cd.h,16);ctx.fill();ctx.stroke();
    // etiqueta do tipo
    ctx.fillStyle=evo?'#ff7a2a':'#3ac86a';ctx.strokeStyle='#fff';ctx.lineWidth=2;rr(ctx,cd.x+cd.w/2-42,cd.y-12,84,24,12);ctx.fill();ctx.stroke();
    shadowText(evo?'EVOLUÇÃO':'MUTAÇÃO',cd.x+cd.w/2,cd.y+5,'900 12px system-ui','#fff','center');
    ctx.textAlign='center';
    if(evo){
      shadowText(cd.def.title,cd.x+cd.w/2,cd.y+42,'900 17px system-ui','#fff','center');
      ctx.font='11px system-ui';ctx.fillStyle=c1;ctx.fillText(cd.def.tag,cd.x+cd.w/2,cd.y+57);
      ctx.save();ctx.translate(cd.x+cd.w/2,cd.y+125);ctx.scale(1.7,1.7);drawCat({id:0,lvl:5,cls:cd.k,ang:0,pop:0,aim:0},0,0,false,true);ctx.restore();
      ctx.font='12px system-ui';ctx.fillStyle='#e6eefc';cd.def.desc.forEach((t,i)=>ctx.fillText('• '+t,cd.x+cd.w/2,cd.y+190+i*16));
    }else{
      shadowText(cd.m.n,cd.x+cd.w/2,cd.y+42,'900 17px system-ui','#fff','center');
      const g=ctx.createRadialGradient(cd.x+cd.w/2,cd.y+120,4,cd.x+cd.w/2,cd.y+120,50);g.addColorStop(0,cd.m.col+'ee');g.addColorStop(1,cd.m.col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cd.x+cd.w/2,cd.y+120,50,0,6.28);ctx.fill();
      ctx.save();ctx.translate(cd.x+cd.w/2,cd.y+125);ctx.scale(1.5,1.5);drawCat({id:0,lvl:Math.min(4,choice?choice.lvl:4),cls:null,ang:0,pop:0,aim:0},0,0,false,true);ctx.restore();
      ctx.font='13px system-ui';ctx.fillStyle='#fff4c8';cd.m.d.forEach((t,i)=>ctx.fillText(t,cd.x+cd.w/2,cd.y+192+i*17));
    }
    // chance
    const ch=cd.chance;shadowText(ch+'%',cd.x+cd.w/2,cd.y+cd.h-60,'900 20px system-ui',ch>=100?'#7aff8a':'#ffd35a','center');
    ctx.font='10px system-ui';ctx.fillStyle='#c8d4ea';ctx.fillText(evo?(ch>=100?'Evolução garantida':'Chance de evoluir'):'Sempre funciona',cd.x+cd.w/2,cd.y+cd.h-46);
    ctx.fillStyle='#ffb02e';rr(ctx,cd.x+20,cd.y+cd.h-36,cd.w-40,26,9);ctx.fill();
    ctx.font='900 13px system-ui';ctx.fillStyle='#4a2a00';ctx.fillText('ESCOLHER',cd.x+cd.w/2,cd.y+cd.h-18);
  }
}
`+s.slice(b);}

// clique nas cartas
rep("  if(choice){const q=pt(e);for(const cd of CARDS)if(q.x>=cd.x&&q.x<=cd.x+cd.w&&q.y>=cd.y&&q.y<=cd.y+cd.h){choice.cls=cd.k;choice.pop=1;burst(choice.x,choice.y,24,[tierCol(choice),'#fff','#ffe066']);choice=null;}return;}",
`  if(choice){const q=pt(e);for(const cd of CARDS)if(q.x>=cd.x&&q.x<=cd.x+cd.w&&q.y>=cd.y&&q.y<=cd.y+cd.h){
    const c=choice;choice=null;c.pop=1;
    if(cd.type==='mut'){c.md=(c.md||1)*(cd.m.md||1);c.mr=(c.mr||1)*(cd.m.mr||1);c.mut=cd.m.n;burst(c.x,c.y,24,[cd.m.col,'#fff','#ffe066']);texts.push({x:c.x,y:c.y-40,s:'Mutação: '+cd.m.n+'!',life:1.8,big:true});}
    else if(Math.random()*100<cd.chance){c.cls=cd.k;c.pity=false;burst(c.x,c.y,28,[tierCol(c),'#fff','#ffe066']);texts.push({x:c.x,y:c.y-40,s:'Evoluiu: '+cd.def.title+'!',life:1.8,big:true});}
    else{c.pity=true;shake=5;burst(c.x,c.y,16,['#888','#444','#ccc']);texts.push({x:c.x,y:c.y-40,s:'Evolução falhou! Próxima é garantida',life:2.2,big:true});}
    return;}return;}`);
rep("if(other.lvl===5&&!other.cls){CARDS=rollCards();choice=other;}","if(other.lvl>=5&&!other.cls&&!other.mut){CARDS=rollReward(other);choice=other;}");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
