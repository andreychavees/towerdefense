const http=require('http'),fs=require('fs'),path=require('path');
const T={'.html':'text/html; charset=utf-8','.png':'image/png','.js':'text/javascript','.md':'text/plain','.webp':'image/webp','.gif':'image/gif'};
const port=Number(process.env.PORT||8765);
const server=http.createServer((q,r)=>{
  let route;
  try{route=decodeURIComponent(q.url.split('?')[0]);}catch{r.writeHead(400);r.end();return;}
  const f=path.resolve(__dirname,route==='/'?'gatos-vs-minhoca.html':'.'+route);
  if(!f.startsWith(__dirname+path.sep)){r.writeHead(403);r.end();return;}
  r.setHeader('Cache-Control','no-cache');
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});r.end(d);}});
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'0.0.0.0',()=>console.log('Gatos vs Minhoca ativo na porta '+port));
