// QA visual: node qa.js <roteiro> <slides 1-based,...> <pasta> [espera_ms]
const {chromium}=require('playwright');(async()=>{
const [r,lst,dir,esp]=process.argv.slice(2);require('fs').mkdirSync(dir,{recursive:true});
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.stack.split('\n').slice(0,2).join(' | ')));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.addInitScript(()=>{window.__qaPassos=+(localStorage.qp||12);});
await p.goto('http://127.0.0.1:8765/apresentacao/?r='+r+'&empresa=Consorcio%20Via%20Oeste%20LTDA&func=260&anos=12&q='+(process.env.Q||'alto'),{timeout:240000,waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.Deck||document.querySelector('.hub'),null,{timeout:240000});
await p.waitForTimeout(4000);
for(const n of lst.split(',').map(Number)){await p.evaluate(n=>Deck.ir(n-1),n);await p.waitForTimeout(+esp||7000);await p.screenshot({path:dir+'/s'+n+'.png',timeout:400000});}
console.log('errs',errs);await b.close();})();
