/* Cenário: incorporação econômica (Minha Casa Minha Vida) em alvenaria estrutural — condomínio de quatro blocos
   de 5 pavimentos em etapas diferentes (radier, primeiras fiadas, alvenaria subindo com andaime e guincho,
   bloco pronto em acabamento), portaria de empreiteiros, vivência, estação de corte de blocos, placa de obra,
   stand de vendas e casas já entregues. As cores da marca do cliente vêm de ROTEIRO.marca.
   Na entrega: condomínio pronto, pintado, com esquadrias, muro, paisagismo e janelas acesas na hora azul. */

/* ═══ BLOCO: CENARIO_MCMV ═══ */
CENARIOS.mcmv = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa,
      barra = kit.barra, trelica = kit.trelica, fundir = kit.fundir, uvMundo = kit.uvMundo;
  var V = function(x, y, z){ return new THREE.Vector3(x, y, z); };
  var R = kit.R, MARCA = EMPRESA.nome.toUpperCase();
  var M = R.marca || {}, COR_MARCA = M.cor || '#D6B17D', COR_ESC = M.escuro || '#17444C';
  var OBRA_NOME = R.obraNome || 'Residencial em construção', PROGRAMA = R.programa || 'Minha Casa Minha Vida';

  /* ── Geometria de projeto ── */
  var LARG = 12, PROF = 9, H = 2.8, NPAV = 5, ESP = 0.14, LAJE_E = 0.12;
  var BLOCOS = [
    { id: 'A', x: 8,  z: -17, obra: 1.0,  pint: 0.45 },   // estrutura completa, acabamento em andamento
    { id: 'B', x: 26, z: -17, obra: 0.62, pint: 0 },      // alvenaria subindo: andaime, guincho, pedreiros
    { id: 'C', x: 8,  z: -4,  obra: 0.38, pint: 0 },
    { id: 'D', x: 26, z: -4,  obra: 0.1,  pint: 0 }       // radier e primeiras fiadas
  ];
  var PORTAO = [14.2, 0, 9], VAO = 4.6, FILA = [18.55, 0, 10.45], VIV = [35.5, 0, -21], CORTE = [38.5, 0, -6];
  var STAND = [-27, 0, 1], PLACA = [5, 0, 10.2];

  function escrever(c, txt, x, y, larguraMax, peso, tam, cor){
    c.fillStyle = cor; c.font = peso + ' ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > larguraMax && tam > 18){ tam -= 2; c.font = peso + ' ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, x, y);
  }

  /* ═══ Rua, calçada, meio-fio, iluminação e trânsito ═══ */
  var rua = new THREE.Mesh(new THREE.PlaneGeometry(130, 4.2), kit.asfalto([48, 1.5])); rua.rotation.x = -Math.PI / 2; rua.position.set(0, 0.02, 13.4); rua.receiveShadow = true; cena.add(rua);
  for (var f = 0; f < 36; f++){ var fx = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.12), basico(0xF0D2A4, 0.6)); fx.rotation.x = -Math.PI / 2; fx.position.set(-60 + f * 3.4, 0.03, 13.4); cena.add(fx); }
  var calcada = new THREE.Mesh(new THREE.PlaneGeometry(130, 1.6), mat(0x9a978e, { r: 0.85 })); calcada.rotation.x = -Math.PI / 2; calcada.position.set(0, 0.03, 10.6); calcada.receiveShadow = true; cena.add(calcada);
  caixa(130, 0.16, 0.16, mat(0x8d979a, { r: 0.85 }), 0, 0.08, 11.42);
  [-36, -24, -12, 24, 36, 48].forEach(function(x){
    var pg = new THREE.Group(); pg.position.set(x, 0, 10.0); cena.add(pg);
    cilindro(0.08, 0.12, 6.4, mat(0x6f7c80, { r: 0.4, m: 0.7 }), 0, 3.2, 0, pg, 12);
    var braco = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 6, 16, Math.PI / 2), mat(0x6f7c80, { r: 0.4, m: 0.7 })); braco.rotation.y = -Math.PI / 2; braco.position.set(0, 5.6, 0.8); pg.add(braco);
    var lum = caixaRedonda(0.32, 0.12, 0.7, 0.04, mat(0x3a4245, { r: 0.4, m: 0.6 })); lum.position.set(0, 6.42, 1.3); pg.add(lum);
    var lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.5), new THREE.MeshBasicMaterial({ color: 0xfff1d0, toneMapped: false, side: THREE.DoubleSide })); lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 6.35, 1.3); pg.add(lamp);
  });
  var carros = [];
  [0xb83a32, 0xdfe6e8, 0x2e6fa8, 0x30363a, 0xc9ced0, 0x8a1f2a].forEach(function(cor, i){
    var g = kit.carro(cor); cena.add(g); var s = i % 2 ? -1 : 1;
    g.userData.s = s; g.userData.u = (Math.floor(i / 2) / 3 + (s > 0 ? 0 : 0.15)) % 1; g.position.z = 13.4 + s * 1.05; g.rotation.y = s > 0 ? 0 : Math.PI;
    carros.push(g);
  });

  /* ═══ Canteiro: terra batida, tapume na identidade do cliente e portão ═══ */
  var terreno = new THREE.Mesh(new THREE.PlaneGeometry(46, 34), mat(0x7a5c42, { r: 1 })); terreno.rotation.x = -Math.PI / 2; terreno.position.set(22, 0.015, -8); terreno.receiveShadow = true; cena.add(terreno);
  var tapTx = textoTex(1024, 192);
  kit.aoCarregarFonte(function(){
    var c = tapTx.ctx; c.fillStyle = '#0b0b0d'; c.fillRect(0, 0, 1024, 192);
    c.fillStyle = COR_MARCA; c.fillRect(0, 0, 1024, 18); c.fillRect(0, 174, 1024, 18);
    c.textAlign = 'left'; c.textBaseline = 'middle';
    escrever(c, MARCA, 40, 82, 560, '800', 80, COR_MARCA);
    c.textAlign = 'right'; escrever(c, OBRA_NOME, 990, 70, 400, '700', 34, '#ffffff'); escrever(c, PROGRAMA, 990, 118, 400, '600', 26, 'rgba(255,255,255,.7)');
    tapTx.tex.needsUpdate = true;
  });
  var mTapume = new THREE.MeshStandardMaterial({ map: tapTx.tex, roughness: 0.7 }), mTapVerso = mat(0x111214, { r: 0.8 });
  var tapumes = new THREE.Group(); cena.add(tapumes);
  function tapume(x1, z1, x2, z2){
    var dx = x2 - x1, dz = z2 - z1, comp = Math.hypot(dx, dz), n = Math.max(1, Math.round(comp / 5.2));
    for (var i = 0; i < n; i++){
      var t0 = (i + 0.5) / n, w = comp / n - 0.08;
      var p = new THREE.Mesh(new THREE.BoxGeometry(w, 2.2, 0.08), [mTapVerso, mTapVerso, mTapVerso, mTapVerso, mTapume, mTapVerso]);
      p.position.set(x1 + dx * t0, 1.1, z1 + dz * t0); p.rotation.y = -Math.atan2(dz, dx); p.castShadow = p.receiveShadow = true; tapumes.add(p);
    }
  }
  tapume(0, 9, PORTAO[0] - VAO / 2, 9); tapume(PORTAO[0] + VAO / 2, 9, 45, 9);
  tapume(45, -25, 0, -25); tapume(45, 9, 45, -25); tapume(0, -25, 0, 9);
  // Muro com gradil e letreiro do condomínio (aparece na entrega no lugar do tapume)
  var muro = new THREE.Group(); cena.add(muro); muro.visible = false;
  var mMuro = mat(0xe9e6df, { r: 0.85 }), mGradil = mat(0x1c1f22, { r: 0.4, m: 0.7 });
  [[0, PORTAO[0] - VAO / 2], [PORTAO[0] + VAO / 2, 45]].forEach(function(tr){
    caixa(tr[1] - tr[0], 0.9, 0.2, mMuro, (tr[0] + tr[1]) / 2, 0.45, 9, muro);
    for (var x = tr[0] + 0.1; x < tr[1]; x += 0.18) caixa(0.03, 1.2, 0.03, mGradil, x, 1.5, 9, muro);
    caixa(tr[1] - tr[0], 0.05, 0.05, mGradil, (tr[0] + tr[1]) / 2, 2.1, 9, muro);
  });
  var letTx = textoTex(1024, 256);
  kit.aoCarregarFonte(function(){
    var c = letTx.ctx; c.fillStyle = '#0b0b0d'; c.fillRect(0, 0, 1024, 256); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, OBRA_NOME.toUpperCase(), 512, 100, 960, '800', 84, COR_MARCA); escrever(c, MARCA, 512, 190, 900, '600', 40, '#ffffff'); letTx.tex.needsUpdate = true;
  });
  caixa(5.6, 1.5, 0.3, mat(0x0b0b0d, { r: 0.5 }), PORTAO[0] - VAO / 2 - 3, 1.4, 9.05, muro);
  var letreiro = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 1.32), new THREE.MeshBasicMaterial({ map: letTx.tex, toneMapped: false })); letreiro.position.set(PORTAO[0] - VAO / 2 - 3, 1.4, 9.21); muro.add(letreiro);

  /* ═══ Blocos em alvenaria estrutural ═══ */
  // Textura de alvenaria aparente (bloco de concreto em amarração, junta de argamassa): 0,8 m por repetição
  var txBloco = kit.texturaProc(256, function(g, t){
    g.fillStyle = '#8c8f8c'; g.fillRect(0, 0, t, t);
    for (var row = 0; row < 4; row++) for (var col = -1; col < 3; col++){
      var x = col * 128 + (row % 2 ? 64 : 0), y = row * 64;
      var v = 120 + Math.random() * 28 | 0; g.fillStyle = 'rgb(' + v + ',' + (v + 3) + ',' + (v + 1) + ')'; g.fillRect(x + 3, y + 3, 122, 58);
      for (var k = 0; k < 90; k++){ g.fillStyle = 'rgba(0,0,0,' + Math.random() * 0.12 + ')'; g.fillRect(x + 3 + Math.random() * 120, y + 3 + Math.random() * 56, 2, 2); }
    }
  });
  txBloco.anisotropy = 8;
  var mAlvenaria = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txBloco, roughness: 0.95 });
  var txPint = kit.texturaProc(128, function(g, t){ kit.granulado(g, t, '#eeeae2', 0.06, 900); });
  var mPintura = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txPint, roughness: 0.85 });
  var mFaixa = mat(new THREE.Color(COR_MARCA).getHex(), { r: 0.6 });
  var mLaje = mat(0xa9b0b1, { r: 0.85 }), mCaixilho = mat(0xc9cfd2, { r: 0.3, m: 0.85 });
  var mVidroAceso = new THREE.MeshStandardMaterial({ color: 0x1a3a44, roughness: 0.1, metalness: 0.6, emissive: 0xffb466, emissiveIntensity: 0 });
  var mVidroApag = new THREE.MeshStandardMaterial({ color: 0x14303a, roughness: 0.1, metalness: 0.7 });
  var JF = [-4.5, -1.5, 1.5, 4.5], JL = [-1.8, 1.8];   // janelas na frente/fundos e nas laterais
  // Parede ao longo de um eixo com vãos [centro, largura, y0, y1]; gera pedaços (montantes, peitoris e vergas)
  function paredeVaos(grupo, eixo, comp, fixo, vaos, h){
    vaos = vaos.slice().sort(function(a, b){ return a[0] - b[0]; });
    var ini = -comp / 2;
    function peca(c0, c1, y0, y1){
      if (c1 - c0 < 0.01 || y1 - y0 < 0.01) return;
      var w = c1 - c0, cx = (c0 + c1) / 2, cy = (y0 + y1) / 2;
      if (eixo === 'x') caixa(w, y1 - y0, ESP, mAlvenaria, cx, cy, fixo, grupo); else caixa(ESP, y1 - y0, w, mAlvenaria, fixo, cy, cx, grupo);
    }
    vaos.forEach(function(v){ var a = v[0] - v[1] / 2, b = v[0] + v[1] / 2; peca(ini, a, 0, h); peca(a, b, 0, v[2]); peca(a, b, v[3], h); ini = b; });
    peca(ini, comp / 2, 0, h);
  }
  function moldePavimento(terreo){
    var g = new THREE.Group(), hp = H - LAJE_E;
    var vF = JF.map(function(x){ return [x, 1.2, 1.0, 2.1]; }); if (terreo) vF.push([0, 1.0, 0, 2.1]);
    paredeVaos(g, 'x', LARG, PROF / 2 - ESP / 2, vF, hp);
    paredeVaos(g, 'x', LARG, -PROF / 2 + ESP / 2, JF.map(function(x){ return [x, 1.2, 1.0, 2.1]; }), hp);
    [-1, 1].forEach(function(s){ paredeVaos(g, 'z', PROF - 2 * ESP, s * (LARG / 2 - ESP / 2), JL.map(function(z){ return [z, 1.0, 1.0, 2.1]; }), hp); });
    caixa(LARG - 2 * ESP, hp, ESP, mAlvenaria, 0, hp / 2, 0, g);   // parede interna (divisa de apartamentos)
    fundir(g); var geo = g.children[0].geometry; uvMundo(geo, 0.8); return geo;
  }
  var GEO_PAV = moldePavimento(false), GEO_TERREO = moldePavimento(true);
  // Esquadrias: caixilho de alumínio e vidro em cada vão
  function moldeEsquadrias(terreo){
    var gC = new THREE.Group(), vid = [];
    function jan(eixo, c, fixo, w, s){
      var y0 = 1.0, y1 = 2.1, cy = (y0 + y1) / 2, off = s * (ESP / 2 + 0.01);
      if (eixo === 'x'){ caixa(w + 0.08, 0.06, 0.06, mCaixilho, c, y0, fixo + off, gC); caixa(w + 0.08, 0.06, 0.06, mCaixilho, c, y1, fixo + off, gC); caixa(0.05, y1 - y0, 0.06, mCaixilho, c, cy, fixo + off, gC); vid.push([eixo, c, fixo + off * 0.6, w, s]); }
      else { caixa(0.06, 0.06, w + 0.08, mCaixilho, fixo + off, y0, c, gC); caixa(0.06, 0.06, w + 0.08, mCaixilho, fixo + off, y1, c, gC); caixa(0.06, y1 - y0, 0.05, mCaixilho, fixo + off, cy, c, gC); vid.push([eixo, c, fixo + off * 0.6, w, s]); }
    }
    JF.forEach(function(x){ jan('x', x, PROF / 2 - ESP / 2, 1.2, 1); jan('x', x, -PROF / 2 + ESP / 2, 1.2, -1); });
    JL.forEach(function(z){ jan('z', z, LARG / 2 - ESP / 2, 1.0, 1); jan('z', z, -LARG / 2 + ESP / 2, 1.0, -1); });
    fundir(gC);
    return { caixilho: gC.children[0].geometry, vidros: vid, porta: terreo };
  }
  var ESQ = moldeEsquadrias(false);
  var GEO_MIOLO = new THREE.BoxGeometry(LARG - 2 * ESP - 0.05, H - LAJE_E - 0.02, PROF - 2 * ESP - 0.05), mMiolo = new THREE.MeshBasicMaterial({ color: 0x15171a, side: THREE.BackSide });
  function predio(b){
    var g = new THREE.Group(); g.position.set(b.x, 0, b.z); cena.add(g);
    var radier = caixa(LARG + 0.8, 0.3, PROF + 0.8, mLaje, 0, 0.15, 0, g);
    var pavs = [];
    for (var i = 0; i < NPAV; i++){
      var pg = new THREE.Group(); pg.position.y = 0.3 + i * H; g.add(pg);
      var parede = new THREE.Mesh(i === 0 ? GEO_TERREO : GEO_PAV, mAlvenaria); parede.castShadow = parede.receiveShadow = true; parede.userData.oco = true; pg.add(parede);
      var laje = caixa(LARG + 0.06, LAJE_E, PROF + 0.06, mLaje, 0, H - LAJE_E / 2, 0, pg);
      // Interior em penumbra: pelos vãos se vê o escuro de dentro, não a laje clara
      var miolo = new THREE.Mesh(GEO_MIOLO, mMiolo); miolo.position.y = (H - LAJE_E) / 2; pg.add(miolo);
      var esq = new THREE.Group(); pg.add(esq);
      var cx = new THREE.Mesh(ESQ.caixilho, mCaixilho); cx.castShadow = true; esq.add(cx);
      var mv = Math.random() < 0.7 ? mVidroAceso : mVidroApag;
      ESQ.vidros.forEach(function(v){
        var pl = new THREE.Mesh(new THREE.PlaneGeometry(v[3], 1.1), mv);
        if (v[0] === 'x'){ pl.position.set(v[1], 1.55, v[2]); if (v[4] < 0) pl.rotation.y = Math.PI; }
        else { pl.position.set(v[2], 1.55, v[1]); pl.rotation.y = v[4] > 0 ? Math.PI / 2 : -Math.PI / 2; }
        esq.add(pl);
      });
      if (i === 0){ var porta = caixa(1.0, 2.1, 0.05, mat(0x3b2f26, { r: 0.6 }), 0, 1.05, PROF / 2 + 0.02, pg); esq.add(porta); }
      var faixa = caixa(LARG + 0.08, 0.12, PROF + 0.08, mFaixa, 0, H - LAJE_E - 0.06, 0, pg); faixa.visible = false;
      pavs.push({ g: pg, parede: parede, laje: laje, esq: esq, faixa: faixa });
    }
    var topo = new THREE.Group(); topo.position.y = 0.3 + NPAV * H; g.add(topo);
    [[0, PROF / 2], [0, -PROF / 2]].forEach(function(p){ caixa(LARG + 0.06, 0.9, ESP, mPintura, p[0], 0.45, p[1], topo); });
    [-1, 1].forEach(function(s){ caixa(ESP, 0.9, PROF, mPintura, s * LARG / 2, 0.45, 0, topo); });
    // Arremate da platibanda na cor da marca (só a borda, não a cobertura inteira)
    [[0, PROF / 2], [0, -PROF / 2]].forEach(function(p){ caixa(LARG + 0.12, 0.14, 0.26, mFaixa, p[0], 0.96, p[1], topo); });
    [-1, 1].forEach(function(s2){ caixa(0.26, 0.14, PROF + 0.12, mFaixa, s2 * LARG / 2, 0.96, 0, topo); });
    caixa(LARG - 0.2, 0.06, PROF - 0.2, mat(0x6d7275, { r: 0.9 }), 0, 0.03, 0, topo);   // manta da cobertura
    caixa(2.6, 1.8, 2.2, mPintura, -3.2, 0.9 + 0.12, -1.5, topo);   // caixa d'água/casa de máquinas
    var nome = textoTex(512, 128);
    kit.aoCarregarFonte(function(){ var c = nome.ctx; c.clearRect(0, 0, 512, 128); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, 'BLOCO ' + b.id, 256, 66, 480, '800', 72, COR_ESC); nome.tex.needsUpdate = true; });
    var placaB = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ map: nome.tex, transparent: true })); placaB.position.set(-3.2, 1.2, -0.38); topo.add(placaB);
    topo.visible = false;
    return { g: g, radier: radier, pavs: pavs, topo: topo, b: b, prog: 0, pint: 0 };
  }
  var predios = BLOCOS.map(predio);
  function aplicarPredio(p, prog, pint, esqTodas){
    var floors = prog * NPAV;
    p.pavs.forEach(function(pv, i){
      var fr = Math.max(0, Math.min(1, floors - i));
      pv.g.visible = fr > 0.001;
      pv.parede.scale.y = Math.max(0.001, Math.min(1, fr / 0.96));
      pv.laje.visible = fr >= 0.999;
      var pintado = i < Math.round(pint * NPAV);
      pv.parede.material = pintado ? mPintura : mAlvenaria;
      pv.faixa.visible = pintado && i === 0;
      pv.esq.visible = pintado || esqTodas;
    });
    p.topo.visible = prog >= 0.999;
  }

  // Frente de alvenaria do Bloco B: fiadas em blocos reais sobre a última laje, palete e masseira
  var B = predios[1], Y_B = 0.3 + Math.floor(BLOCOS[1].obra * NPAV) * H;   // piso do pavimento em execução
  var frente = new THREE.Group(); frente.position.set(BLOCOS[1].x, Y_B, BLOCOS[1].z); cena.add(frente);
  (function fiadas(){
    var lst = [], GEO = kit.geoBloco();
    for (var f2 = 0; f2 < 4; f2++){
      var ate = 6 - f2 * 1.6;   // fiadas escalonadas: a de baixo mais longa (amarração em andamento)
      for (var x = -6 + 0.2 + (f2 % 2) * 0.2; x < ate; x += 0.4) lst.push([x, f2 * 0.2, PROF / 2 - ESP / 2, 0]);
      for (var z = PROF / 2 - 0.4 - (f2 % 2) * 0.2; z > PROF / 2 - 3.6 + f2 * 0.6; z -= 0.4) lst.push([-LARG / 2 + ESP / 2, f2 * 0.2, z, Math.PI / 2]);
    }
    var im = new THREE.InstancedMesh(GEO, mat(0xa7aeaf, { r: 0.95 }), lst.length), d = new THREE.Object3D();
    lst.forEach(function(q, i){ d.position.set(q[0], q[1], q[2]); d.rotation.set(0, q[3], 0); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.castShadow = im.receiveShadow = true; frente.add(im);
    var pal = kit.palete(frente, 2.2, 1.8);
    var bl = new THREE.InstancedMesh(GEO, mat(0xa7aeaf, { r: 0.95 }), 24);
    for (var c = 0; c < 24; c++){ d.position.set(2.2 - 0.39 + (c % 3) * 0.39, 0.15 + Math.floor(c / 12) * 0.19, 1.8 - 0.4 + Math.floor((c % 12) / 3) * 0.27); d.rotation.set(0, 0, 0); d.updateMatrix(); bl.setMatrixAt(c, d.matrix); }
    bl.castShadow = true; frente.add(bl);
    var masseira = cilindro(0.32, 0.26, 0.28, mat(0x2a2a2a, { r: 0.8 }), -1.2, 0.14, 2.0, frente, 18);
    var arg = cilindro(0.3, 0.3, 0.02, mat(0x8f8a80, { r: 1 }), -1.2, 0.27, 2.0, frente, 18);
  })();
  // Guarda-corpo provisório na periferia da laje em execução
  var gc = new THREE.Group(); frente.add(gc);
  var mGcV = mat(0xd9342b, { r: 0.5 }), mGcB = mat(0xf2f4f5, { r: 0.5 });
  [[0, -PROF / 2 - 0.08, LARG, 'x'], [LARG / 2 + 0.08, 0, PROF, 'z']].forEach(function(l){
    [0.55, 1.1].forEach(function(h, k){
      if (l[3] === 'x') caixa(l[2], 0.05, 0.05, k ? mGcV : mGcB, l[0], h, l[1], gc); else caixa(0.05, 0.05, l[2], k ? mGcV : mGcB, l[0], h, l[1], gc);
    });
  });
  // Guincho de coluna no canto do Bloco B, içando blocos pelos fundos
  var guincho = new THREE.Group(); guincho.position.set(BLOCOS[1].x + LARG / 2 - 0.8, Y_B, BLOCOS[1].z - PROF / 2 + 0.8); cena.add(guincho);
  caixa(0.9, 0.5, 0.7, mat(0x2e6fa8, { r: 0.4, m: 0.5 }), 0, 0.25, 0, guincho);
  barra(V(0, 0.5, 0), V(0, 2.6, 0), 0.06, mat(0xe8b41f, { r: 0.4, m: 0.6 }), guincho, 10);
  barra(V(0, 2.5, 0), V(0, 2.5, -1.9), 0.05, mat(0xe8b41f, { r: 0.4, m: 0.6 }), guincho, 10);
  var caboGu = cilindro(0.015, 0.015, 1, mat(0x1d2124), 0, 0, -1.85, guincho, 6); caboGu.userData.oco = true;
  var cargaGu = new THREE.Group(); guincho.add(cargaGu);
  kit.palete(cargaGu, 0, 0).scale.setScalar(0.7);
  var GEO_B = kit.geoBloco();
  for (var cg = 0; cg < 6; cg++){ var bm = new THREE.Mesh(GEO_B, mat(0xa7aeaf, { r: 0.95 })); bm.position.set(-0.27 + (cg % 3) * 0.27, 0.11, -0.15 + Math.floor(cg / 3) * 0.3); bm.scale.setScalar(0.7); cargaGu.add(bm); }

  // Andaime fachadeiro na frente do Bloco B (face voltada ao Bloco D)
  var andaime = kit.andaime(6, 4, { largura: 1.2, altNivel: 2.0 });
  andaime.position.set(BLOCOS[1].x - LARG / 2, 0, BLOCOS[1].z + PROF / 2 + 0.25); cena.add(andaime);
  var guardaTopo = andaime.userData.guardaTopo;

  /* ═══ Portaria, guarita, vivência e estação de corte ═══ */
  var guarita = new THREE.Group(); guarita.position.set(19, 0, 6.6); cena.add(guarita);
  var corpoG = caixaRedonda(2.0, 2.5, 1.8, 0.05, mat(0xf2f4f5, { r: 0.4 })); corpoG.position.y = 1.3; guarita.add(corpoG);
  var vjG = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.5, roughness: 0.05, clearcoat: 1 })); vjG.position.set(0, 1.6, 0.92); guarita.add(vjG);
  caixa(2.2, 0.12, 2.0, new THREE.MeshStandardMaterial({ color: new THREE.Color(COR_MARCA), roughness: 0.5 }), 0, 2.62, 0, guarita);
  var vivG = new THREE.Group(); cena.add(vivG);
  ['VESTIÁRIO', 'REFEITÓRIO', 'ALMOXARIFADO'].forEach(function(nome, i){
    var ct = new THREE.Group(); ct.position.set(VIV[0] + i * 3.4, 0, VIV[2]); vivG.add(ct);
    var corC = i === 1 ? 0xf2f4f5 : 0x2b2e33;
    var corpo = caixaRedonda(3.1, 2.5, 2.4, 0.06, mat(corC, { r: 0.5, m: 0.3 })); corpo.position.y = 1.3; ct.add(corpo);
    for (var nv = -1.2; nv <= 1.21; nv += 0.3) caixa(0.04, 2.3, 0.02, mat(corC, { r: 0.6, m: 0.3 }), nv, 1.3, 1.215, ct);
    caixa(0.85, 1.95, 0.04, mat(0x1b2226, { r: 0.5, m: 0.5 }), 0.85, 1.03, 1.235, ct);
    caixa(0.6, 0.42, 0.32, mat(0xe8ecee, { r: 0.4 }), -0.7, 2.12, 1.38, ct);
    caixa(1.2, 0.18, 0.9, mat(0x5a6266, { r: 0.8, m: 0.4 }), 0.85, 0.09, 1.7, ct);
    caixa(3.12, 0.14, 0.02, new THREE.MeshStandardMaterial({ color: new THREE.Color(COR_MARCA), roughness: 0.5 }), 0, 2.45, 1.225, ct);
    var lt = textoTex(512, 96);
    kit.aoCarregarFonte(function(){ var c = lt.ctx; c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, nome, 256, 50, 480, '800', 54, i === 1 ? '#111' : COR_MARCA); lt.tex.needsUpdate = true; });
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.45), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true, toneMapped: false })); rot.position.set(0, 2.1, 1.27); ct.add(rot);
  });
  var corte = kit.estacaoCorte(CORTE[0], CORTE[2], 0);

  /* ═══ Placa de obra e stand de vendas na identidade do cliente ═══ */
  var placaTx = textoTex(1024, 512);
  var placa = new THREE.Group(); placa.position.set(PLACA[0], 0, PLACA[2]); cena.add(placa);
  [-3.4, 3.4].forEach(function(x){ cilindro(0.12, 0.12, 8.3, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), x, 4.15, -0.1, placa, 14); caixa(0.7, 0.3, 0.7, mat(0x8d979a, { r: 0.85 }), x, 0.15, -0.1, placa); });
  caixa(8, 4.1, 0.16, mat(0x0a0a0c, { r: 0.4 }), 0, 6.2, -0.03, placa);
  var telaPlaca = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 3.85), new THREE.MeshBasicMaterial({ map: placaTx.tex, toneMapped: false })); telaPlaca.position.set(0, 6.2, 0.06); placa.add(telaPlaca);
  function desenharPlaca(rotulo, valor, cor, rodape){
    var c = placaTx.ctx;
    c.fillStyle = '#0b0b0d'; c.fillRect(0, 0, 1024, 512);
    c.fillStyle = COR_MARCA; c.fillRect(0, 0, 1024, 150);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 512, 60, 940, '800', 72, '#0b0b0d');
    escrever(c, OBRA_NOME + ' · ' + PROGRAMA, 512, 120, 900, '700', 30, '#0b0b0d');
    escrever(c, rotulo, 512, 210, 900, '700', 38, 'rgba(255,255,255,.62)');
    escrever(c, valor, 512, 320, 960, '800', 130, cor);
    escrever(c, rodape, 512, 440, 900, '600', 32, 'rgba(255,255,255,.55)');
    c.strokeStyle = cor; c.lineWidth = 8; c.strokeRect(6, 6, 1012, 500);
    placaTx.tex.needsUpdate = true;
  }
  var placaEstado = { perdidos: 1 }, modoAtual = 'neutro';
  function atualizarPlaca(){
    if (modoAtual === 'verde') desenharPlaca('ENTREGA DAS CHAVES', 'ENTREGUE', '#5EE0A6', 'no prazo, para cada família');
    else if (modoAtual === 'acidente') desenharPlaca('FRENTE DE ALVENARIA', 'EMBARGADA', '#FF6B5E', 'investigação e adequação em andamento');
    else if (modoAtual === 'prazo' && placaEstado.perdidos > 0) desenharPlaca('ENTREGA DAS CHAVES', '+' + placaEstado.perdidos + ' DIAS', '#FF6B5E', 'depois da data prometida às famílias');
    else desenharPlaca('ENTREGA DAS CHAVES EM', 'D-30', COR_MARCA, 'fundação 100% · construção em andamento');
  }
  kit.aoCarregarFonte(atualizarPlaca);
  var stand = new THREE.Group(); stand.position.set(STAND[0], 0, STAND[2]); cena.add(stand);
  caixa(11, 0.3, 8, mat(0x2a2c30, { r: 0.6 }), 0, 0.15, 0, stand);
  var caixaVidro = new THREE.Mesh(new THREE.BoxGeometry(9, 3.2, 6), new THREE.MeshPhysicalMaterial({ color: 0x8fd3dc, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.28, clearcoat: 1 })); caixaVidro.position.y = 1.9; stand.add(caixaVidro);
  caixa(10.4, 0.35, 7.4, new THREE.MeshStandardMaterial({ color: new THREE.Color(COR_MARCA), roughness: 0.5 }), 0, 3.65, 0, stand);
  caixa(2.4, 0.9, 0.6, mat(0x111214, { r: 0.4 }), -2, 0.75, -1, stand);
  caixa(3, 0.8, 1.8, mat(0xe9e6df, { r: 0.6 }), 2.2, 0.7, -0.5, stand);
  var standTx = textoTex(1024, 192);
  kit.aoCarregarFonte(function(){ var c = standTx.ctx; c.fillStyle = '#0b0b0d'; c.fillRect(0, 0, 1024, 192); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, MARCA, 512, 74, 960, '800', 90, COR_MARCA); escrever(c, 'STAND DE VENDAS · ' + PROGRAMA.toUpperCase(), 512, 150, 940, '600', 30, '#ffffff'); standTx.tex.needsUpdate = true; });
  var letStand = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.5), new THREE.MeshBasicMaterial({ map: standTx.tex, toneMapped: false })); letStand.position.set(0, 4.7, 3.75); stand.add(letStand);

  /* ═══ Casas já entregues (prova de quem entrega) ═══ */
  var mCasa = mat(0xf0ece4, { r: 0.85 }), mTelha = mat(0x9c4a2f, { r: 0.75 });
  for (var cs = 0; cs < 4; cs++){
    var casa = new THREE.Group(); casa.position.set(-52 + (cs % 2) * 8, 0, -16 + Math.floor(cs / 2) * 9); cena.add(casa);
    caixa(5.6, 2.8, 6.6, mCasa, 0, 1.4, 0, casa);
    // Telhado de duas águas: perfil triangular extrudado, com beiral
    var sT = new THREE.Shape(); sT.moveTo(-3.3, 0); sT.lineTo(3.3, 0); sT.lineTo(0, 1.5); sT.lineTo(-3.3, 0);
    var gT = new THREE.ExtrudeGeometry(sT, { depth: 7.2, bevelEnabled: false }); gT.translate(0, 0, -3.6);
    var tel = new THREE.Mesh(gT, mTelha); tel.position.y = 2.8; tel.castShadow = true; casa.add(tel);
    caixa(1.0, 2.1, 0.05, mat(0x3b2f26, { r: 0.6 }), -1.2, 1.05, 3.32, casa);
    var jc = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), mVidroAceso); jc.position.set(1.2, 1.6, 3.32); casa.add(jc);
    caixa(5.6, 0.12, 0.12, mFaixa, 0, 2.86, 3.32, casa);
  }

  /* ═══ Paisagismo da entrega ═══ */
  var paisagem = new THREE.Group(); cena.add(paisagem); paisagem.visible = false;
  [[17, -10.5, 30, 2.4], [17, 4.4, 28, 3.2], [40, -10, 7, 12]].forEach(function(q){   // [x, z, largura, profundidade]
    var gr = new THREE.Mesh(new THREE.PlaneGeometry(q[2], q[3]), mat(0x3f6e2a, { r: 1 })); gr.rotation.x = -Math.PI / 2; gr.position.set(q[0], 0.03, q[1]); gr.receiveShadow = true; paisagem.add(gr);
  });

  /* ═══ Pessoas ═══ */
  function emCota(p, y){ p.position.y = y; p.userData.base.y = y; return p; }
  var fila = [];
  for (var p2 = 0; p2 < 6; p2++) fila.push(pessoa(FILA[0] - 1.05 + (p2 % 3) * 1.05, FILA[2] - 0.48 + Math.floor(p2 / 3) * 0.95, p2 < 2 ? COR.colete : COR.terc));
  var vivencia = [];
  for (var fi = 0; fi < 5; fi++) vivencia.push(pessoa(VIV[0] - 0.8 + fi * 1.4, VIV[2] + 2.9, fi % 2 ? COR.colete : COR.terc));
  var cortador = pessoa(corte.operador.x, corte.operador.z, COR.colete); cortador.rotation.y = corte.operador.ry; cortador.userData.pose = [-0.95, -0.95, 0.12];
  kit.epi(cortador, ['abafador', 'mascara', 'oculos']);
  var pedreiro1 = emCota(pessoa(BLOCOS[1].x - 3.2, BLOCOS[1].z + PROF / 2 - 0.85, COR.colete), Y_B); pedreiro1.rotation.y = 0; pedreiro1.userData.pose = [-0.7, -0.4, 0.05];
  var pedreiro2 = emCota(pessoa(BLOCOS[1].x - LARG / 2 + 0.9, BLOCOS[1].z + PROF / 2 - 2.4, COR.terc), Y_B); pedreiro2.rotation.y = -Math.PI / 2; pedreiro2.userData.pose = [-0.6, -0.8, 0.05];
  kit.epi(pedreiro1, ['cinto']); kit.epi(pedreiro2, ['cinto']);
  var Y_AND = 4 * 2.0 + 0.06, P_AND = [BLOCOS[1].x - LARG / 2 + 5, BLOCOS[1].z + PROF / 2 + 0.25 + 0.6];
  var noAndaime = emCota(pessoa(P_AND[0], P_AND[1], COR.terc), Y_AND); noAndaime.rotation.y = Math.PI;
  var P_QUEDA = [P_AND[0], P_AND[1] + 2.2];
  var viajante = pessoa(PORTAO[0], 10.9, COR.colete);

  /* ── Estado ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, tempo = 0, poeiraAlvo = 0.3, poeiraNivel = 0.3, uCarro = 0;

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      var c = kit.R.clinica.pos, calc = 10.9, cli = [c[0], c[2] + 7.6];
      if (modo === 'virada' || modo === 'clinica') return [[PORTAO[0], calc], [cli[0], calc], cli];
      if (modo === 'verde') return [cli, [cli[0], calc], [PORTAO[0], calc], [PORTAO[0], 5.6]];
      return [cli, [cli[0], calc], [PORTAO[0], calc]];
    },
    modosRisco: ['terceiros', 'mobilizacao', 'altura', 'poeira', 'acidente', 'prazo'],
    alertas: {
      terceiros:   [FILA[0], 4.4, FILA[2], 0.08],
      mobilizacao: [VIV[0] + 2, 4.6, VIV[2] + 2.9, 0.08],
      altura:      [pedreiro1.position.x, Y_B + 4.2, pedreiro1.position.z, Y_B + 0.05],
      poeira:      [corte.operador.x + 1, 3.8, corte.operador.z, 0.08],
      acidente:    [P_QUEDA[0], 4.2, P_QUEDA[1], 0.08]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([V(PORTAO[0], 0.3, 10.9), V(1, 0.3, 10.9), V(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([V(-9, 0.3, 1.6), V(1, 0.3, 10.9), V(PORTAO[0], 0.3, 10.9), V(PORTAO[0], 0.3, 5.6)])
    },
    fogos: [17, -10],
    auditoria: function(){ cargaGu.userData.semApoio = true; return { moveis: carros.concat([cargaGu]), pessoas: fila.concat(vivencia, [cortador, pedreiro1, pedreiro2, noAndaime, viajante]) }; },

    aplicarModo: function(modo, c){
      modoAtual = modo;
      obraAlvo = c ? c.obra : 0.55;
      luzesAlvo = modo === 'verde' ? 1 : 0;
      poeiraAlvo = modo === 'poeira' ? 1 : modo === 'verde' ? 0 : 0.3;
      var emObra = modo !== 'verde';
      guardaTopo.visible = !(modo === 'altura' || modo === 'acidente');
      var caiu = modo === 'acidente';
      noAndaime.rotation.z = caiu ? 1.35 : 0;
      noAndaime.position.set(caiu ? P_QUEDA[0] : P_AND[0], caiu ? 0.25 : Y_AND, caiu ? P_QUEDA[1] : P_AND[1]);
      [frente, guincho, andaime, corte.g, cortador, pedreiro1, pedreiro2, noAndaime, tapumes, guarita, placa, vivG].forEach(function(o){ o.visible = emObra; });
      fila.concat(vivencia).forEach(function(p){ p.visible = emObra; });
      muro.visible = paisagem.visible = !emObra;
      atualizarPlaca();
    },

    placar: function(n){ placaEstado.perdidos = n; atualizarPlaca(); },

    quadro: function(dt, k, relogio, modo){
      tempo += dt;
      obra += (obraAlvo - obra) * k * 0.6;
      // Cada bloco na sua etapa; na entrega todos completos, pintados e com esquadrias
      var t = Math.max(0, Math.min(1, (obra - 0.55) / 0.45));
      predios.forEach(function(p){
        var prog = obra <= 0.55 ? p.b.obra * obra / 0.55 : p.b.obra + (1 - p.b.obra) * t;
        var pint = obra <= 0.55 ? p.b.pint * obra / 0.55 : p.b.pint + (1 - p.b.pint) * t;
        aplicarPredio(p, prog, pint, t > 0.98);
      });
      // Guincho sobe a carga de blocos pelos fundos
      var hg = 2.2 + (Math.sin(tempo * 0.5) * 0.5 + 0.5) * (Y_B - 1.4);
      cargaGu.position.set(0, -hg, -1.85);
      var top = 2.45, fim = -hg + 0.45; caboGu.scale.y = top - fim; caboGu.position.set(0, (top + fim) / 2, -1.85);
      // Luzes da entrega
      luzes += (luzesAlvo - luzes) * k * 0.6;
      mVidroAceso.emissiveIntensity = luzes * 1.2;
      // Corte e poeira
      poeiraNivel += (poeiraAlvo - poeiraNivel) * k;
      corte.atualizar(dt, poeiraNivel, modo === 'poeira' ? 0xb08a80 : 0x9c9384);
      // Trânsito na rua, entrando e saindo suavemente
      carros.forEach(function(cr){
        cr.userData.u = (cr.userData.u + dt * 6 / 130) % 1;
        var x = cr.userData.s > 0 ? -65 + cr.userData.u * 130 : 65 - cr.userData.u * 130;
        cr.position.x = x; cr.userData.opacidade(Math.max(0, Math.min(1, (65 - Math.abs(x)) / 8)));
      });
    }
  };
};
/* ── FIM BLOCO ── */
