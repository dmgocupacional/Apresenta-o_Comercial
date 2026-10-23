// node cam.js <roteiro> <saida.png> "px,py,pz" "ax,ay,az" [modo] [obra] [espera]
const {chromium}=require('playwright');(async()=>{
const [r,out,pos,alvo,modo,obra,esp]=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__qaPassos=40;});
await p.goto('http://127.0.0.1:8765/apresentacao/?r='+r+'&empresa=Consorcio%20Via%20Oeste%20LTDA');await p.waitForTimeout(3000);
await p.evaluate(([pos,alvo,modo,obra])=>{const c={pos:pos.split(',').map(Number),alvo:alvo.split(',').map(Number),obra:+(obra||0.55),torre:modo==='verde'?7:0,modo:modo||'neutro'};
 ROTEIRO.cenas.__dbg=c;document.querySelectorAll('#deck,.veu,.grain,#prog,.hud,#hud-ato,#dots,#count').forEach(e=>e.style.display='none');
 c.pos[0]+=3;c.alvo[0]+=6;Cena.ir('__dbg');},[pos,alvo,modo,obra]);
await p.waitForTimeout(+esp||9000);await p.screenshot({path:out});console.log('errs',errs);await b.close();})();
