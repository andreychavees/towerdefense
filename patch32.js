const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
// estrada com curvas arredondadas, como nos blocos de curva
rep("const PATH=[[pcx(1),pcy(0)],[pcx(1),pcy(7)],[pcx(6),pcy(7)],[pcx(6),pcy(12)]];",`const PATH=(()=>{
  const pts=[[pcx(1),GY0+TS*0.5]],H2=TS/2;
  const arc=(p0,c,p1)=>{for(let k=1;k<=8;k++){const t=k/8,a=(1-t)*(1-t),b=2*(1-t)*t,d=t*t;pts.push([a*p0[0]+b*c[0]+d*p1[0],a*p0[1]+b*c[1]+d*p1[1]]);}};
  pts.push([pcx(1),pcy(7)-H2]);arc([pcx(1),pcy(7)-H2],[pcx(1),pcy(7)],[pcx(1)+H2,pcy(7)]);
  pts.push([pcx(6)-H2,pcy(7)]);arc([pcx(6)-H2,pcy(7)],[pcx(6),pcy(7)],[pcx(6),pcy(7)+H2]);
  pts.push([pcx(6),pcy(12)]);return pts;})();`);
s=s.split("p.y<8").join("p.y<GY0+14");
rep("if(p.y<-30)continue;","if(p.y<GY0+TS*0.3)continue;");
// caverna por cima: inimigos saem da boca da caverna
rep("const pathT={v:T(1,0),h:T(1,1),cNE:T(1,2),cWS:T(1,4),cave:T(2,0),portal:T(2,6)};","const pathT={v:T(1,0),h:T(1,1),cNE:T(1,2),cWS:T(1,4),cave:T(2,0),portal:T(2,6)};CAVE_TILE=pathT.cave;");
rep("let TILEMAP=null;","let TILEMAP=null,CAVE_TILE=null;");
rep("  drawWorm();\n","  drawWorm();\n  if(CAVE_TILE){ctx.save();ctx.beginPath();ctx.rect(pcx(1)-TS/2,GY0,TS,TS*0.5);ctx.clip();ctx.drawImage(CAVE_TILE,pcx(1)-TS/2,GY0,TS,TS);ctx.restore();}\n");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
