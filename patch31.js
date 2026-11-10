const fs=require('fs');let s=fs.readFileSync('gatos-vs-minhoca.html','utf8');
const o="    g.drawImage(tile,(GX0+i*TS)*S,(GY0+j*TS)*S,TS*S+1,TS*S+1);\n  }";
if(!s.includes(o))throw new Error('x');
s=s.replace(o,()=>"    const px=(GX0+i*TS)*S,py=(GY0+j*TS)*S;\n    if(tile===grass[1]){g.drawImage(grass[0],px,py,TS*S+1,TS*S+1);g.globalAlpha=.5;g.drawImage(tile,px,py,TS*S+1,TS*S+1);g.globalAlpha=1;}\n    else g.drawImage(tile,px,py,TS*S+1,TS*S+1);\n  }");
fs.writeFileSync('gatos-vs-minhoca.html',s);console.log('ok');
