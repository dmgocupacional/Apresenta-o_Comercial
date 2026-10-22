/* Cenário: construção esportiva — fábrica de piso, estrada com caminhão da equipe e estádio em montagem.
   Usado pelo roteiro construcao-esportiva. O nome do cliente aparece no baú do caminhão e no placar. */

/* ═══ BLOCO: CENARIO_ESPORTIVA ═══ */
CENARIOS.esportiva = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa, HALO = kit.HALO;
  var POS = { fabrica: [-29, 0, 0], estadio: [16, 0, -2], portao: [18, 0, 11] };
  var mAco = mat(COR.aco, { r: 0.35, m: 0.8 });

  var luzEstadio = new THREE.PointLight(0xfff2d8, 0, 60, 1.5); luzEstadio.position.set(POS.estadio[0], 18, POS.estadio[2]); cena.add(luzEstadio);

  /* ── Estrada ── */
  var estrada = new THREE.Mesh(new THREE.PlaneGeometry(70, 3.4), mat(0x1a2a30, { r: 0.95 }));
  estrada.rotation.x = -Math.PI / 2; estrada.position.set(2, 0.02, 7); estrada.receiveShadow = true; cena.add(estrada);
  for (var f = 0; f < 22; f++){
    var faixa = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.12), basico(0xF0D2A4, 0.55));
    faixa.rotation.x = -Math.PI / 2; faixa.position.set(-31 + f * 3.2, 0.03, 7); cena.add(faixa);
  }
  kit.halo(0x30747F, 28, POS.fabrica[0], 0, 0.14);
  var haloEstadio = kit.halo(0x6FE3EC, 46, POS.estadio[0], -2, 0.08);

  /* ── Fábrica ── */
  var fab = new THREE.Group(); fab.position.set(POS.fabrica[0], 0, POS.fabrica[2]); cena.add(fab);
  var mGalpao = mat(0x2c4249, { r: 0.6, m: 0.3 }), mTelha = mat(0x3d5a62, { r: 0.4, m: 0.5 });
  caixa(14, 4.6, 10, mGalpao, 0, 2.3, 0, fab);
  for (var t = 0; t < 5; t++){
    var dente = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 10, 3, 1, false), mTelha);
    dente.rotation.x = Math.PI / 2; dente.rotation.y = Math.PI / 2; dente.position.set(-5.6 + t * 2.8, 5.3, 0);
    dente.castShadow = true; fab.add(dente);
    var claraboia = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 9.6), basico(0xffd9a0, 0.5));
    claraboia.position.set(-4.9 + t * 2.8, 5.6, 0); claraboia.rotation.x = -Math.PI / 2; fab.add(claraboia);
  }
  // Fachada aberta mostrando a linha de produção
  var portaoFab = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.6), basico(0xffcf8a, 0.16, true));
  portaoFab.position.set(2, 1.8, 5.02); fab.add(portaoFab);
  var linha = new THREE.Group(); linha.position.set(0, 0, 6.5); fab.add(linha);
  caixa(9, 0.6, 1.4, mat(0x4b5a5e, { r: 0.5, m: 0.6 }), 0, 0.6, 0, linha);       // esteira
  cilindro(0.7, 0.7, 2.2, mat(0xD6B17D, { r: 0.35, m: 0.8 }), -3.4, 1.4, 0, linha); // extrusora
  caixa(1.6, 1.8, 1.6, mat(0x30747F, { r: 0.4, m: 0.4 }), 3.6, 1.1, 0, linha);     // prensa
  var rolos = [];
  for (var r = 0; r < 4; r++){
    var rolo = cilindro(0.45, 0.45, 1.3, mat(r % 2 ? COR.pista : 0x2a8a52, { r: 0.85 }), -1.2 + r * 1.1, 1.35, 0, linha, 20);
    rolo.rotation.x = Math.PI / 2; rolos.push(rolo);
  }
  // Tambores químicos com faixa de risco
  for (var d = 0; d < 6; d++){
    cilindro(0.38, 0.38, 1.1, mat(d % 2 ? 0x2e7d9a : 0xc9862d, { r: 0.4, m: 0.5 }), 5.6 + (d % 3) * 0.85, 0.55, 3.4 + Math.floor(d / 3) * 0.9, fab);
    cilindro(0.39, 0.39, 0.12, basico(0xF2B957, 0.9), 5.6 + (d % 3) * 0.85, 0.75, 3.4 + Math.floor(d / 3) * 0.9, fab);
  }
  // Chaminé com vapor
  cilindro(0.5, 0.6, 7, mGalpao, -5.5, 3.5, -3.5, fab);
  var vapor = [];
  for (var v = 0; v < 8; v++){
    var nv = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: HALO, color: 0xa8d8db, transparent: true, opacity: 0.2, depthWrite: false }));
    nv.position.set(-5.5, 7 + v, -3.5); nv.userData.f = v / 8; fab.add(nv); vapor.push(nv);
  }
  // Letreiro da fábrica com o nome do cliente
  var lf = textoTex(512, 96);
  kit.aoCarregarFonte(function(){
    var c = lf.ctx, txt = 'FÁBRICA ' + EMPRESA.nome.toUpperCase(), tam = 54;
    c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#A8D8DB';
    c.font = '800 ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > 490 && tam > 24){ tam -= 2; c.font = '800 ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, 256, 50); lf.tex.needsUpdate = true;
  });
  var letFab = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.75), new THREE.MeshBasicMaterial({ map: lf.tex, transparent: true, toneMapped: false }));
  letFab.position.set(-3.5, 3.9, 5.05); fab.add(letFab);

  /* ── Caminhão: cavalo com cabine arredondada e baú com a marca do cliente ── */
  var caminhao = new THREE.Group(); cena.add(caminhao);
  var mCabine = mat(0xf2f4f5, { r: 0.25, m: 0.35 }), mOuro = mat(0xD6B17D, { r: 0.25, m: 0.85 }), mCromo = mat(0xdfe6e8, { r: 0.12, m: 1 });
  var mVidroCam = new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.6, roughness: 0.05, clearcoat: 1 });
  caixa(6.6, 0.25, 1.5, mat(0x1b2226, { r: 0.6, m: 0.5 }), -0.4, 0.62, 0, caminhao);
  var bau = caixaRedonda(4.3, 2.2, 2.05, 0.12, mCabine); bau.position.set(-1.45, 1.9, 0); caminhao.add(bau);
  var faixaBau = caixaRedonda(4.32, 0.22, 2.08, 0.04, mOuro); faixaBau.position.set(-1.45, 1.15, 0); caminhao.add(faixaBau);
  var lt = textoTex(1024, 256);
  kit.aoCarregarFonte(function(){
    var c = lt.ctx, nome = EMPRESA.nome.toUpperCase(), tam = 120;
    c.clearRect(0, 0, 1024, 256); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '800 ' + tam + 'px Sora, sans-serif';
    while (c.measureText(nome).width > 960 && tam > 40){ tam -= 4; c.font = '800 ' + tam + 'px Sora, sans-serif'; }
    c.fillStyle = '#17444C'; c.fillText(nome, 512, 112);
    c.fillStyle = '#30747F'; c.font = '600 44px Sora, sans-serif'; c.fillText('equipe de montagem', 512, 200);
    lt.tex.needsUpdate = true;
  });
  [1.04, -1.04].forEach(function(z){
    var lado = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true }));
    lado.position.set(-1.45, 2.05, z); if (z < 0) lado.rotation.y = Math.PI; caminhao.add(lado);
  });
  var cabine = caixaRedonda(1.55, 1.75, 2, 0.28, mCabine); cabine.position.set(1.75, 1.72, 0); caminhao.add(cabine);
  var defletor = caixaRedonda(1.1, 0.5, 1.9, 0.2, mCabine); defletor.position.set(1.55, 2.75, 0); defletor.rotation.z = 0.25; caminhao.add(defletor);
  var parabrisa = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.75), mVidroCam);
  parabrisa.position.set(2.54, 2.05, 0); parabrisa.rotation.y = Math.PI / 2; parabrisa.rotation.x = -0.12; caminhao.add(parabrisa);
  [1.005, -1.005].forEach(function(z){
    var janela = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), mVidroCam); janela.position.set(1.95, 2.05, z); if (z < 0) janela.rotation.y = Math.PI; caminhao.add(janela);
    var espelho = caixaRedonda(0.12, 0.38, 0.1, 0.03, mat(0x1b2226, { r: 0.4 })); espelho.position.set(2.45, 2.1, z * 1.2); caminhao.add(espelho);
  });
  var gradeCam = caixaRedonda(0.08, 0.55, 1.3, 0.03, mCromo); gradeCam.position.set(2.56, 1.25, 0); caminhao.add(gradeCam);
  for (var gl = 0; gl < 4; gl++) caixa(0.02, 0.03, 1.2, mat(0x2a3338, { r: 0.5 }), 2.61, 1.08 + gl * 0.12, 0, caminhao);
  var parachoque = caixaRedonda(0.22, 0.28, 2.05, 0.08, mat(0x2a3338, { r: 0.4, m: 0.6 })); parachoque.position.set(2.6, 0.78, 0); caminhao.add(parachoque);
  var faroisM = basico(0xfff1c9, 1);
  [0.72, -0.72].forEach(function(z){
    var farol = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), faroisM); farol.scale.set(0.4, 0.7, 1.4); farol.position.set(2.6, 1.05, z); caminhao.add(farol);
    var lanterna = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.12), basico(0xff4a3a, 1)); lanterna.position.set(-3.62, 1.1, z * 1.2); caminhao.add(lanterna);
  });
  function roda(x, z){
    var rg = new THREE.Group(); rg.position.set(x, 0.46, z); caminhao.add(rg);
    var pneu = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.14, 12, 28), mat(0x121416, { r: 0.95 })); rg.add(pneu);
    var aro = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 24), mCromo); aro.rotation.x = Math.PI / 2; rg.add(aro);
    var cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12), mOuro); cubo.rotation.x = Math.PI / 2; rg.add(cubo);
    rg.traverse(function(o){ if (o.isMesh) o.castShadow = true; });
    return rg;
  }
  var rodas = [];
  [-2.9, -2.1, 1.75].forEach(function(x){ [-0.92, 0.92].forEach(function(z){ rodas.push(roda(x, z)); }); });
  caminhao.position.set(-22, 0, 7.8);

  /* ── Estádio ── */
  var est = new THREE.Group(); est.position.set(POS.estadio[0], 0, POS.estadio[2]); cena.add(est);
  var EX = 1.45;
  var pista = new THREE.Mesh(new THREE.RingGeometry(7, 9.3, 96), mat(COR.pista, { r: 0.85 }));
  pista.rotation.x = -Math.PI / 2; pista.scale.set(EX, 1, 1); pista.position.y = 0.05; pista.receiveShadow = true; est.add(pista);
  for (var l = 1; l < 5; l++){
    var raia = new THREE.Mesh(new THREE.RingGeometry(7 + l * 0.46, 7 + l * 0.46 + 0.04, 96), basico(0xffffff, 0.55));
    raia.rotation.x = -Math.PI / 2; raia.scale.set(EX, 1, 1); raia.position.y = 0.06; est.add(raia);
  }
  var mGrama = mat(COR.grama, { r: 0.9, e: 0x0e3a20, ei: 0 });
  var campo = new THREE.Mesh(new THREE.CircleGeometry(7, 96), mGrama);
  campo.rotation.x = -Math.PI / 2; campo.scale.set(EX, 1, 1); campo.position.y = 0.05; campo.receiveShadow = true; est.add(campo);
  var linhasCampo = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.48, 48), basico(0xffffff, 0.6));
  linhasCampo.rotation.x = -Math.PI / 2; linhasCampo.position.y = 0.07; est.add(linhasCampo);
  var meio = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 13), basico(0xffffff, 0.6));
  meio.rotation.x = -Math.PI / 2; meio.position.y = 0.07; est.add(meio);

  // Arquibancada em segmentos que aparecem conforme a obra avança
  var segmentos = [], NSEG = 22, mDegrau = mat(0xb9c4c7, { r: 0.7 }), mCadeira = mat(0x30747F, { r: 0.5 });
  for (var s = 0; s < NSEG; s++){
    var ang = s / NSEG * Math.PI * 2;
    var g = new THREE.Group();
    for (var degrau = 0; degrau < 4; degrau++){
      var raio = 10 + degrau * 0.9;
      var b = caixa(2.7, 0.55 + degrau * 0.6, 0.85, degrau === 3 ? mCadeira : mDegrau, 0, (0.55 + degrau * 0.6) / 2, raio - 10, g);
      b.scale.x = 1 + degrau * 0.08;
    }
    g.position.set(Math.cos(ang) * 10 * EX, 0, Math.sin(ang) * 10);
    g.rotation.y = Math.PI / 2 - ang;   // local +z aponta para fora do campo
    g.scale.y = 0.001; est.add(g); segmentos.push(g);
  }
  // Torres de iluminação
  var torres = [];
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(q){
    var tg = new THREE.Group(); tg.position.set(q[0] * 19, 0, q[1] * 14.5);
    cilindro(0.18, 0.3, 16, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 0, 8, 0, tg);
    var cab = caixa(2.2, 1.2, 0.4, mat(0x1d2c31, { e: 0xfff4d6, ei: 0 }), 0, 16.4, 0, tg);
    cab.rotation.y = Math.atan2(-q[0], -q[1]);
    var cone = new THREE.Mesh(new THREE.ConeGeometry(5, 17, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.position.set(-q[0] * 3, 8, -q[1] * 3);
    cone.rotation.set(q[1] * -0.35, 0, q[0] * 0.35);
    tg.add(cone);
    tg.userData = { cab: cab, cone: cone }; est.add(tg); torres.push(tg);
  });
  // Placar com contagem regressiva
  var placarTx = textoTex(1024, 400);
  var placarG = new THREE.Group(); placarG.position.set(0, 0, -13.5); est.add(placarG);
  cilindro(0.2, 0.2, 7, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), -3, 3.5, 0, placarG);
  cilindro(0.2, 0.2, 7, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 3, 3.5, 0, placarG);
  caixa(8.6, 3.6, 0.3, mat(0x0a1216, { r: 0.4 }), 0, 8.2, -0.05, placarG);
  var tela = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.2), new THREE.MeshBasicMaterial({ map: placarTx.tex, toneMapped: false }));
  tela.position.set(0, 8.2, 0.12); placarG.add(tela);
  function desenharPlacar(titulo, valor, cor, rodape){
    var c = placarTx.ctx;
    c.fillStyle = '#05090b'; c.fillRect(0, 0, 1024, 400);
    c.strokeStyle = cor; c.lineWidth = 6; c.strokeRect(14, 14, 996, 372);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,.6)'; c.font = '700 44px Sora, sans-serif'; c.fillText(titulo, 512, 82);
    c.fillStyle = cor; c.font = '800 150px Sora, sans-serif'; c.fillText(valor, 512, 210);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '600 36px Sora, sans-serif'; c.fillText(rodape, 512, 330);
    placarTx.tex.needsUpdate = true;
  }
  var placarEstado = { perdidos: 1 }, modoAtual = 'neutro';
  function atualizarPlacar(){
    var marca = EMPRESA.nome.toUpperCase();
    if (modoAtual === 'verde') desenharPlacar('INAUGURAÇÃO · ' + marca, 'ENTREGUE', '#5EE0A6', 'no dia marcado');
    else if (modoAtual === 'acidente') desenharPlacar('FRENTE DE MONTAGEM', 'PARADA', '#FF6B5E', 'investigação em andamento');
    else if (modoAtual === 'prazo' && placarEstado.perdidos > 0) desenharPlacar('ENTREGA DA OBRA', '+' + placarEstado.perdidos + ' DIAS', '#FF6B5E', 'depois da inauguração');
    else desenharPlacar('INAUGURAÇÃO EM', 'D-30', '#F0D2A4', 'montagem ' + marca + ' em andamento');
  }
  kit.aoCarregarFonte(atualizarPlacar);

  // Grua do estádio
  var grua = new THREE.Group(); grua.position.set(POS.estadio[0] + 15, 0, POS.estadio[2] - 10); cena.add(grua);
  for (var gy = 0; gy < 11; gy++) caixa(0.9, 0.06, 0.9, mAco, 0, gy * 2, 0, grua);
  [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]].forEach(function(p){ caixa(0.08, 22, 0.08, mAco, p[0], 11, p[1], grua); });
  var braco = new THREE.Group(); braco.position.y = 22; grua.add(braco);
  caixa(18, 0.5, 0.5, mAco, -6, 0, 0, braco);
  caixa(2, 1.2, 1.2, mat(COR.concreto), 3.6, -0.4, 0, braco);
  var cabo = cilindro(0.02, 0.02, 7, mat(0x222222), -12, -3.5, 0, braco, 4);
  var carga = caixa(2.6, 0.4, 0.9, mAco, -12, -7.2, 0, braco);

  // Andaime na arquibancada do fundo
  var andaime = new THREE.Group(); andaime.position.set(POS.estadio[0] - 9, 0, POS.estadio[2] - 11); andaime.rotation.y = 0.5; cena.add(andaime);
  var mTubo = mat(COR.aco, { r: 0.3, m: 0.9 });
  for (var h = 0; h < 5; h++){
    var tb = cilindro(0.05, 0.05, 8, mTubo, 0, 0.8 + h * 1.6, 1.2, andaime, 8); tb.rotation.z = Math.PI / 2;
    if (h % 2 === 0) caixa(7.8, 0.08, 0.8, mat(0x5a4a33, { r: 0.9 }), 0, 0.75 + h * 1.6, 1.5, andaime);
  }
  [-3.9, -1.3, 1.3, 3.9].forEach(function(x){ cilindro(0.05, 0.05, 8, mTubo, x, 4, 1.2, andaime, 8); });

  /* ── Pessoas ── */
  pessoa(-30.5, 6.6, COR.colete); pessoa(-27.6, 6.6, COR.colete); pessoa(-25.8, 8, COR.colete);
  for (var e = 0; e < 6; e++) pessoa(-24 + (e % 3) * 0.9, 9.6 + Math.floor(e / 3) * 0.9, COR.colete);
  var noAndaime = pessoa(POS.estadio[0] - 8.2, POS.estadio[2] - 10, COR.colete); noAndaime.position.y = 6.45; noAndaime.userData.base.y = 6.45;
  for (var p2 = 0; p2 < 6; p2++) pessoa(POS.portao[0] - 2 + (p2 % 3) * 1, POS.portao[2] + Math.floor(p2 / 3) * 1, p2 < 3 ? COR.colete : COR.terc);
  var viajante = pessoa(-22, 9, COR.colete);
  // Portão de obra
  caixa(0.3, 3, 0.3, mAco, POS.portao[0] - 3, 1.5, POS.portao[2] - 1, null);
  caixa(0.3, 3, 0.3, mAco, POS.portao[0] + 2, 1.5, POS.portao[2] - 1, null);
  caixa(5.3, 0.3, 0.3, mat(0xF2B957, { r: 0.4 }), POS.portao[0] - 0.5, 3, POS.portao[2] - 1, null);

  /* ── Estado próprio do cenário ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, caminhaoT = 0;

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      return modo === 'virada' || modo === 'clinica' ? [kit.R.clinica.pos[0], kit.R.clinica.pos[2] + 7.6] : modo === 'verde' ? [14, 10.5] : [-22, 9];
    },
    modosRisco: ['fabrica', 'viagem', 'altura', 'terceiros', 'acidente', 'prazo'],
    alertas: {
      fabrica:   [POS.fabrica[0] + 2, 4.2, 6.5, 0.08],
      viagem:    [-21, 4.2, 9.6, 0.08],
      altura:    [POS.estadio[0] - 8.2, 11, POS.estadio[2] - 10, 6.5],
      terceiros: [POS.portao[0], 4.2, POS.portao[2] + 1, 0.08],
      acidente:  [POS.estadio[0] - 8.2, 9, POS.estadio[2] - 8.4, 6.5]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([new THREE.Vector3(-24, 0.3, 9), new THREE.Vector3(-16, 0.3, 6), new THREE.Vector3(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([new THREE.Vector3(-9, 0.3, 1.6), new THREE.Vector3(2, 0.3, 7), new THREE.Vector3(14, 0.3, 10.5)])
    },
    fogos: [POS.estadio[0], POS.estadio[2]],

    aplicarModo: function(modo, c){
      modoAtual = modo;
      obraAlvo = c ? c.obra : 0.55;
      luzesAlvo = modo === 'verde' ? 1 : 0;
      noAndaime.rotation.z = modo === 'acidente' ? 1.35 : 0;
      noAndaime.position.y = modo === 'acidente' ? 0.3 : 6.45;
      noAndaime.position.z = modo === 'acidente' ? POS.estadio[2] - 8.4 : POS.estadio[2] - 10;
      noAndaime.visible = modo !== 'verde';
      atualizarPlacar();
    },

    placar: function(n){ placarEstado.perdidos = n; atualizarPlacar(); },

    quadro: function(dt, k, relogio, modo){
      // Obra do estádio avança
      obra += (obraAlvo - obra) * k * 0.6;
      var visiveis = Math.round(obra * NSEG);
      segmentos.forEach(function(sg, i){ sg.scale.y += ((i < visiveis ? 1 : 0.001) - sg.scale.y) * k; });
      andaime.visible = grua.visible = obraAlvo < 1;
      braco.rotation.y = Math.sin(relogio * 0.2) * 0.5;
      carga.position.y = -7.2 + Math.sin(relogio * 0.6) * 1.2; cabo.scale.y = 1 - Math.sin(relogio * 0.6) * 0.17; cabo.position.y = -3.5 + Math.sin(relogio * 0.6) * 0.6;

      // Luzes do estádio e campo
      luzes += (luzesAlvo - luzes) * k * 0.6;
      torres.forEach(function(tg){ tg.userData.cab.material.emissiveIntensity = luzes * 2.2; tg.userData.cone.material.opacity = luzes * 0.07; });
      luzEstadio.intensity = luzes * 2.4;
      mGrama.emissiveIntensity = luzes * 0.6;
      haloEstadio.material.opacity = 0.08 + luzes * 0.25;

      // Caminhão na estrada
      if (modo === 'viagem'){ caminhaoT = 0.3 + ((relogio * 0.08) % 1) * 0.45; }
      else if (modo === 'verde'){ caminhaoT += (0.8 - caminhaoT) * k * 0.3; }
      else { caminhaoT = (relogio * 0.03) % 1; }   // circula pela estrada em todas as outras cenas
      var xAnt = caminhao.position.x;
      caminhao.position.x = -42 + caminhaoT * 66;
      var dx = caminhao.position.x - xAnt, giro = Math.abs(dx) < 1 ? dx / 0.47 : 0;   // ignora o salto ao recomeçar o trajeto
      rodas.forEach(function(rd){ rd.rotation.z -= giro; });

      // Fábrica viva
      rolos.forEach(function(rl){ rl.rotation.y += dt * 1.5; });
      vapor.forEach(function(nv){
        nv.userData.f = (nv.userData.f + dt * 0.08) % 1;
        nv.position.y = 7 + nv.userData.f * 7; nv.material.opacity = 0.22 * (1 - nv.userData.f);
        nv.scale.setScalar(1 + nv.userData.f * 2.5); nv.lookAt(kit.cam.position);
      });
    }
  };
};
/* ── FIM BLOCO ── */
