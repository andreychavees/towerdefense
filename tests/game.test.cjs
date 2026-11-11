const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function game(){
  const element={clientWidth:390,clientHeight:844,style:{setProperty(){}},getContext:()=>({}),getBoundingClientRect:()=>({height:44}),addEventListener(){},setAttribute(){},querySelector:()=>({textContent:''})};
  const context=vm.createContext({console,Math,performance,matchMedia:()=>({matches:false}),ResizeObserver:class{observe(){}},getComputedStyle:()=>({paddingLeft:'8',paddingRight:'8',paddingTop:'8',paddingBottom:'8',gap:'8'}),document:{getElementById:()=>element,querySelector:()=>element}});
  const html=fs.readFileSync(path.join(root,'gatos-vs-minhoca.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].split('loadGameArt().then(')[0];
  vm.runInContext(fs.readFileSync(path.join(root,'motion.js'),'utf8')+'\n'+script,context);
  const run=code=>vm.runInContext(code,context);
  run('reset();ART.props[8]={c:{},w:256,h:256}');
  return run;
}
test('rescued cats reserve different random free grass cells inside the playable area',()=>{
  const run=game();
  assert.equal(run(`(()=>{for(let n=0;n<30;n++){if(!spawnRescuedCat(1,{x:180,y:380}))return false;const c=cats.at(-1),cl=cellAt(c.x,c.y);if(!cellOk(cl,c)||!c.motion||c.motion.kind!=='rescue')return false;}return new Set(cats.map(c=>c.x+','+c.y)).size===cats.length})()`),true);
});
test('breaking a jar creates textured debris and animates the cat from the jar to its reserved cell',()=>{
  const run=game();
  run('spawnJar();jars[0].d=PLEN*.5;jars[0].hp=1;globalThis.origin=posAt(jars[0].d);dmgObj(jars[0],9,origin);FX.hitStop=0;update(.01)');
  assert.equal(run('saved'),1);assert.equal(run('jars.length'),0);assert.equal(run('cats.length'),3);
  assert.equal(run("FX.items.filter(e=>e.kind==='fragment').length"),16);
  assert.equal(run('cats.at(-1).motion.fromX===origin.x && cats.at(-1).motion.fromY===origin.y'),true);
  run('updateMotion(.3)');assert.equal(run('catPose(cats.at(-1)).lift>0'),true);
  run('updateMotion(2)');assert.equal(run('cats.at(-1).motion'),null);
  assert.equal(run('cellOk(cellAt(cats.at(-1).x,cats.at(-1).y),cats.at(-1))'),true);
});
test('cats stay where they land and do not wander randomly',()=>{
  const run=game();run('spawnRescuedCat(1,{x:180,y:350});updateMotion(2);globalThis.positions=JSON.stringify(cats.map(c=>[c.x,c.y]));for(let k=0;k<600;k++)updateMotion(1/60)');
  assert.equal(run('JSON.stringify(cats.map(c=>[c.x,c.y]))===positions'),true);
  assert.equal(run('cats.every(c=>!c.motion)'),true);
});
test('a full board queues rescues and releases one once a cell becomes free',()=>{
  const run=game();
  run('cats=[];for(let j=0;j<GROWS;j++)for(let i=0;i<GCOLS;i++){const cl={i,j,x:pcx(i),y:pcy(j)};if(cellOk(cl))addCat(cl.x,cl.y,1)}');
  assert.equal(run('randomFreeCell()'),null);
  run('spawnJar();jars[0].d=PLEN*.5;jars[0].hp=0;update(.01)');assert.equal(run('pendingRescues.length'),1);
  const count=run('cats.length');run('cats.pop();update(.01)');assert.equal(run('pendingRescues.length'),0);assert.equal(run('cats.length'),count);
  assert.equal(run('new Set(cats.map(c=>c.x+","+c.y)).size===cats.length'),true);
});
test('pause freezes effects, jumps and animation time, then resumes them',()=>{
  const run=game();run('spawnRescuedCat(1,{x:180,y:350});effect("spark",180,350);paused=true;globalThis.before=now;update(.2)');
  assert.equal(run('now===before && cats.at(-1).motion.age===0 && FX.items[0].age===0'),true);
  run('paused=false;update(.1)');assert.equal(run('now>before && cats.at(-1).motion.age>0 && FX.items[0].age>0'),true);
});
test('damage triggers impact/recoil and reset clears every pending animation',()=>{
  const run=game();run('spawnJar();dmgObj(jars[0],1,posAt(jars[0].d),true)');
  assert.equal(run('jars[0].wobble>0 && jars[0].hurt>0 && FX.hitStop>0'),true);
  assert.equal(run('FX.items.some(e=>e.kind==="number" && e.critical)'),true);
  run('pendingRescues.push({lvl:1});reset()');assert.equal(run('FX.items.length+pendingRescues.length'),0);
});
