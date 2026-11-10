const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
function rep(o,n){if(!s.includes(o))throw new Error('nao achei: '+o.slice(0,80));s=s.replace(o,()=>n);}
rep("return i<0?null:posAt(worm.d-i*worm.gap);","return i<0?null:posAt(t.pd!==undefined?t.pd:worm.d-i*worm.gap);");
rep("if(worm.d>PLEN+10){lives--;","{const cs=420*dt;worm.segs.forEach((sg,i)=>{const tg=worm.d-i*worm.gap;if(sg.pd===undefined)sg.pd=tg;else sg.pd+=Math.max(-cs,Math.min(cs,tg-sg.pd));});}if(worm.d>PLEN+10){lives--;");
rep("const p=posAt(worm.d-i*worm.gap);burst(p.x,p.y,sg.head?18:8);","const p=posAt(sg.pd!==undefined?sg.pd:worm.d-i*worm.gap);burst(p.x,p.y,sg.head?18:8);");
rep("const p=posAt(worm.d-i*worm.gap);burst(p.x,p.y,8);","const p=posAt(sg.pd!==undefined?sg.pd:worm.d-i*worm.gap);burst(p.x,p.y,8);parts.push({x:p.x,y:p.y,ring:true,r:4,vr:110,life:.25,c:'#ffffff'});");
rep("worm.back=(worm.back||0)+nd*worm.gap*0.9;","worm.back=(worm.back||0)+nd*worm.gap*0.35;");
rep("const sg=worm.segs[i],d=worm.d-i*worm.gap,p=posAt(d);","const sg=worm.segs[i],d=sg.pd!==undefined?sg.pd:worm.d-i*worm.gap,p=posAt(d);");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
