// Auditoria de colisões: node colisao.js <roteiro> <cena> [amostras]
const {chromium}=require('playwright');(async()=>{
const [r,cenaNome,am]=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});const p=await b.newPage({viewport:{width:900,height:560}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__qaPassos=30;});
await p.goto('http://127.0.0.1:8765/apresentacao/?r='+r,{timeout:240000,waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.Deck||document.querySelector('.hub'),null,{timeout:240000});await p.waitForTimeout(2500);
await p.evaluate(n=>Cena.ir(n),cenaNome);await p.waitForTimeout(4000);
await p.evaluate(()=>{
  const {cena,mundo,THREE}=__cena3d; const A=mundo.auditoria?mundo.auditoria():{moveis:[],pessoas:[]};
  const moveisSet=new Set();[...A.moveis,...A.pessoas].forEach(o=>o.traverse(c=>moveisSet.add(c)));
  const estat=[],terreno=[];
  cena.traverse(o=>{ if(!o.isMesh||moveisSet.has(o))return; let v=true,q=o;while(q){if(!q.visible){v=false;break}q=q.parent} if(!v)return;
    const t=o.geometry.type; if(o.userData.terreno||(o.parent&&o.parent.userData&&o.parent.userData.terreno)){terreno.push(o);return}
    let ok=false,qq=o;while(qq){if(qq.userData&&(qq.userData.oco||qq.userData.contatoOk||qq.userData.mesmaMaquina)){ok=true;break}qq=qq.parent} if(ok)return;
    if(/Plane|Circle|Ring/.test(t))return; const m=o.material; if(!m||m.blending===THREE.AdditiveBlending||(m.transparent&&m.opacity<0.6)||m.isMeshBasicMaterial)return;
    if(o.isInstancedMesh){terreno.push(o);return}
    const bb=new THREE.Box3().setFromObject(o),s=bb.getSize(new THREE.Vector3()); if(Math.max(s.x,s.y,s.z)>15)return; if(o.isLineSegments)return;
    estat.push({o,bb:bb.expandByScalar(-0.03)});});
  window.__aud={A,estat,terreno,achados:{},n:0};
  // Caixa orientada (OBB) no referencial do próprio objeto: exata para carros girados/inclinados
  window.__obb=function(o){ o.updateMatrixWorld(true); const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),bb=new THREE.Box3(),tmp=new THREE.Box3(),m=new THREE.Matrix4();
    (function perc(c){ if(!c.visible||(c.userData&&c.userData.membro))return; if(c.isMesh&&!c.material.isMeshBasicMaterial){ if(!c.geometry.boundingBox)c.geometry.computeBoundingBox(); m.multiplyMatrices(inv,c.matrixWorld); tmp.copy(c.geometry.boundingBox).applyMatrix4(m); bb.union(tmp);} c.children.forEach(perc); })(o);
    const ctr=bb.getCenter(new THREE.Vector3()).applyMatrix4(o.matrixWorld),h=bb.getSize(new THREE.Vector3()).multiplyScalar(0.5),e=o.matrixWorld.elements;
    const ax=[new THREE.Vector3(e[0],e[1],e[2]),new THREE.Vector3(e[4],e[5],e[6]),new THREE.Vector3(e[8],e[9],e[10])];const sc=ax.map(a=>a.length());ax.forEach(a=>a.normalize());
    return {c:ctr,a:ax,h:[h.x*sc[0],h.y*sc[1],h.z*sc[2]]}; };
  window.__sat=function(A,B,folga){ const axes=[...A.a,...B.a]; for(const u of A.a)for(const v of B.a){const w=new THREE.Vector3().crossVectors(u,v);if(w.lengthSq()>1e-6)axes.push(w.normalize());}
    const d=new THREE.Vector3().subVectors(B.c,A.c);
    for(const L of axes){ const ra=A.h[0]*Math.abs(A.a[0].dot(L))+A.h[1]*Math.abs(A.a[1].dot(L))+A.h[2]*Math.abs(A.a[2].dot(L)); const rb=B.h[0]*Math.abs(B.a[0].dot(L))+B.h[1]*Math.abs(B.a[1].dot(L))+B.h[2]*Math.abs(B.a[2].dot(L)); if(Math.abs(d.dot(L))>ra+rb-folga)return false; }
    return true; };
  estat.forEach(e=>{e.obb=__obb(e.o);});
});
const N=+(am||36);
for(let i=0;i<N;i++){await p.waitForTimeout(900);
 await p.evaluate(()=>{const {THREE}=__cena3d,{A,estat,terreno,achados}=__aud;__aud.n++;
  const desc=(o)=>{const bb=new THREE.Box3().setFromObject(o),c=bb.getCenter(new THREE.Vector3()),s=bb.getSize(new THREE.Vector3());return o.geometry.type.replace('Geometry','')+' c=('+c.x.toFixed(1)+','+c.y.toFixed(1)+','+c.z.toFixed(1)+') s=('+s.x.toFixed(1)+','+s.y.toFixed(1)+','+s.z.toFixed(1)+') cor='+(o.material.color?o.material.color.getHexString():'')};
  const nome=(o,i,tipo)=>tipo+'#'+i+'@('+o.position.x.toFixed(1)+','+o.position.z.toFixed(1)+')';
  const vivos=A.moveis.map((o,i)=>({o,i,t:'movel'})).concat(A.pessoas.map((o,i)=>({o,i,t:'pessoa'}))).filter(x=>{let q=x.o;while(q){if(!q.visible)return false;q=q.parent}return true});
  const ray=new THREE.Raycaster();
  vivos.forEach(x=>{
    const bb=new THREE.Box3().setFromObject(x.o).expandByScalar(x.t==='pessoa'?-0.08:-0.1), ob=__obb(x.o);
    estat.forEach(e=>{ if(bb.intersectsBox(e.bb)&&__sat(ob,e.obb,0.06)){ const k=x.t+x.i+'|'+e.o.uuid; if(!achados[k])achados[k]={a:nome(x.o,x.i,x.t),b:desc(e.o),vezes:0}; achados[k].vezes++; }});
  });
  for(let i=0;i<vivos.length;i++)for(let j=i+1;j<vivos.length;j++){const a=new THREE.Box3().setFromObject(vivos[i].o).expandByScalar(-0.1),c=new THREE.Box3().setFromObject(vivos[j].o).expandByScalar(-0.1);
    if(a.intersectsBox(c)&&__sat(__obb(vivos[i].o),__obb(vivos[j].o),0.06)){const k='mm'+vivos[i].t+vivos[i].i+'|'+vivos[j].t+vivos[j].i;if(!achados[k])achados[k]={a:nome(vivos[i].o,vivos[i].i,vivos[i].t),b:nome(vivos[j].o,vivos[j].i,vivos[j].t),vezes:0};achados[k].vezes++;}}
  // apoio: veículos (moveis com rodas) devem tocar o terreno
  A.moveis.forEach((o,i)=>{ if(!o.visible||!o.userData||o.userData.semApoio)return; const bb=new THREE.Box3().setFromObject(o),c=o.getWorldPosition(new THREE.Vector3());
    ray.set(new THREE.Vector3(c.x,bb.max.y+3,c.z),new THREE.Vector3(0,-1,0)); const hits=ray.intersectObjects(terreno.concat(estat.map(e=>e.o)).filter(m=>!o.getObjectById(m.id)),false);
    const g=hits.length?Math.max(0,hits[0].point.y):0; const d=c.y-g; if(Math.abs(d)>0.12){const k='apoio'+i;if(!achados[k])achados[k]={a:nome(o,i,'movel'),b:'apoio: origem '+c.y.toFixed(2)+' chão '+g.toFixed(2),vezes:0};achados[k].vezes++;}});
 });}
const res=await p.evaluate(()=>({n:__aud.n,estat:__aud.estat.length,achados:Object.values(__aud.achados).sort((a,b)=>b.vezes-a.vezes)}));
console.log(r,cenaNome,'amostras',res.n,'estáticos',res.estat,'achados',res.achados.length);res.achados.slice(0,60).forEach(a=>console.log(' ',a.vezes,'|',a.a,'×',a.b));
if(errs.length)console.log('ERROS',errs);await b.close();})();
