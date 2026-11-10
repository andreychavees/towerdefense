const http=require('http'),fs=require('fs'),path=require('path');
const T={'.html':'text/html; charset=utf-8','.png':'image/png','.js':'text/javascript','.md':'text/plain','.webp':'image/webp','.gif':'image/gif'};
http.createServer((q,r)=>{
  const f=path.join(__dirname,q.url==='/'?'gatos-vs-minhoca.html':decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();}else{r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});r.end(d);}});
}).listen(8765);
