/* Cenário: construção esportiva — fábrica de piso esportivo, estrada com o caminhão da equipe de montagem
   e estádio em obra (arquibancada em degraus com cadeiras, cobertura, torres de iluminação treliçadas,
   grua, andaime fachadeiro e placar com contagem regressiva). Usado pelo roteiro construcao-esportiva.
   Layout pensado para nada atravessar nada: a estrada passa entre a fábrica e o canteiro do estádio,
   e o canteiro é fechado por alambrado com portão na frente. */

/* ═══ BLOCO: CENARIO_ESPORTIVA ═══ */
CENARIOS.esportiva = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa, HALO = kit.HALO,
      barra = kit.barra, trelica = kit.trelica, roda = kit.roda;
  var V = function(x, y, z){ return new THREE.Vector3(x, y, z); };
  var MARCA = EMPRESA.nome.toUpperCase();

  /* ── Geometria de projeto ── */
  var FAB = [-29, 0, 0];                       // galpão 14 × 10 (frente em z = +5)
  var EST = [16, 0, -16], EX = 1.45;          // estádio: elipse com campo de raio 7 e arquibancada de 10 a 16,4
  var Z_RUA = 7, MEIA_RUA = 1.7;              // estrada: z de 5,3 a 8,7
  var Z_ALAMB = 3.0, PORTAO = [16, 0, Z_ALAMB], VAO_PORTAO = 5;
  var FILA = [20.3, 0, 4.15];                  // terceiros aguardando liberação ao lado do portão
  var R_ARQ = 10, DEGRAUS = 8, PISO_D = 0.8, ESPELHO = 0.55;
  var NSEG = 30;
  var mAco = mat(0xb9c4c7, { r: 0.35, m: 0.85 });

  function escrever(c, txt, x, y, larguraMax, peso, tam, cor){
    c.fillStyle = cor; c.font = peso + ' ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > larguraMax && tam > 18){ tam -= 2; c.font = peso + ' ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, x, y);
  }
  // Ponto e normal (para fora) da elipse do estádio no raio r
  function elipse(a, r){ return V(EST[0] + r * EX * Math.cos(a), 0, EST[2] + r * Math.sin(a)); }
  function normal(a){ var n = V(Math.cos(a) / EX, 0, Math.sin(a)); return n.normalize(); }

  var luzEstadio = new THREE.PointLight(0xfff2d8, 0, 70, 1.5); luzEstadio.position.set(EST[0], 18, EST[2]); cena.add(luzEstadio);

  /* ═══ Estrada e acostamentos ═══ */
  var estrada = new THREE.Mesh(new THREE.PlaneGeometry(116, MEIA_RUA * 2), mat(0x1a2a30, { r: 0.95 }));
  estrada.rotation.x = -Math.PI / 2; estrada.position.set(0, 0.02, Z_RUA); estrada.receiveShadow = true; cena.add(estrada);
  for (var f = 0; f < 34; f++){
    var faixa = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.12), basico(0xF0D2A4, 0.55));
    faixa.rotation.x = -Math.PI / 2; faixa.position.set(-54 + f * 3.3, 0.03, Z_RUA); cena.add(faixa);
  }
  [Z_RUA - MEIA_RUA + 0.1, Z_RUA + MEIA_RUA - 0.1].forEach(function(z){ var b = new THREE.Mesh(new THREE.PlaneGeometry(116, 0.08), basico(0xffffff, 0.4)); b.rotation.x = -Math.PI / 2; b.position.set(0, 0.03, z); cena.add(b); });
  kit.halo(0x30747F, 28, FAB[0], 0, 0.14);
  var haloEstadio = kit.halo(0x6FE3EC, 56, EST[0], EST[2], 0.08);

  /* ═══ Fábrica: galpão com fachada aberta e a linha de produção dentro ═══ */
  var fab = new THREE.Group(); fab.position.set(FAB[0], 0, FAB[2]); cena.add(fab);
  var mGalpao = mat(0x2c4249, { r: 0.6, m: 0.3 }), mTelha = mat(0x3d5a62, { r: 0.4, m: 0.5 });
  caixa(14, 4.6, 0.25, mGalpao, 0, 2.3, -4.88, fab);                                // fundos
  [-7, 7].forEach(function(x){ caixa(0.25, 4.6, 10, mGalpao, x - Math.sign(x) * 0.12, 2.3, 0, fab); });
  caixa(5.0, 4.6, 0.25, mGalpao, -4.5, 2.3, 4.88, fab);                              // frente, à esquerda do vão
  caixa(1.0, 4.6, 0.25, mGalpao, 6.5, 2.3, 4.88, fab);                               // frente, à direita do vão
  caixa(8.0, 1.0, 0.25, mGalpao, 2.0, 4.1, 4.88, fab);                               // verga sobre o vão
  caixa(14, 0.2, 10, mGalpao, 0, 4.7, 0, fab);                                       // laje de cobertura
  caixa(13.5, 0.04, 9.5, mat(0x22343a, { r: 0.9 }), 0, 0.02, 0, fab);                // piso interno
  for (var t = 0; t < 5; t++){
    var dente = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 10, 3, 1, false), mTelha);
    dente.rotation.x = Math.PI / 2; dente.rotation.y = Math.PI / 2; dente.position.set(-5.6 + t * 2.8, 5.55, 0);
    dente.castShadow = true; fab.add(dente);
    var claraboia = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 9.6), basico(0xffd9a0, 0.5));
    claraboia.position.set(-4.9 + t * 2.8, 5.85, 0); claraboia.rotation.x = -Math.PI / 2; fab.add(claraboia);
  }
  var luzFab = new THREE.PointLight(0xffd9a0, 1.2, 14, 2); luzFab.position.set(1.5, 3.6, 2.2); fab.add(luzFab);
  // Linha de produção: extrusora, rolos de calandra, esteira e prensa (dentro do galpão, à vista pelo vão)
  var linha = new THREE.Group(); linha.position.set(2, 0, 2.6); fab.add(linha);
  caixa(8.2, 0.6, 1.4, mat(0x4b5a5e, { r: 0.5, m: 0.6 }), 0, 0.6, 0, linha);
  var extr = cilindro(0.7, 0.7, 2.2, mat(0xD6B17D, { r: 0.35, m: 0.8 }), -3.3, 1.5, 0, linha, 24); extr.rotation.x = Math.PI / 2;
  caixa(0.9, 1.2, 0.9, mat(0x30747F, { r: 0.4, m: 0.4 }), -3.3, 0.6, 0, linha);
  caixa(1.6, 1.8, 1.6, mat(0x30747F, { r: 0.4, m: 0.4 }), 3.4, 1.1, 0, linha);
  var rolos = [];
  for (var r = 0; r < 4; r++){
    var rolo = cilindro(0.42, 0.42, 1.3, mat(r % 2 ? COR.pista : 0x2a8a52, { r: 0.85 }), -1.6 + r * 1.0, 1.32, 0, linha, 22);
    rolo.rotation.x = Math.PI / 2; rolos.push(rolo);
  }
  var manta = caixa(5.2, 0.03, 1.2, mat(COR.pista, { r: 0.9 }), 0.4, 0.92, 0, linha);
  // Área de químicos ao lado do galpão: tambores sobre bacia de contenção, com sinalização
  var quim = new THREE.Group(); quim.position.set(FAB[0] + 9.2, 0, 0.6); cena.add(quim);
  caixa(2.8, 0.18, 2.0, mat(0xf2b81f, { r: 0.6 }), 0, 0.09, 0, quim);
  for (var d = 0; d < 6; d++){
    var dx0 = -0.85 + (d % 3) * 0.85, dz0 = -0.45 + Math.floor(d / 3) * 0.9;
    cilindro(0.36, 0.36, 1.05, mat(d % 2 ? 0x2e7d9a : 0xc9862d, { r: 0.4, m: 0.5 }), dx0, 0.7, dz0, quim, 20);
    cilindro(0.37, 0.37, 0.1, mat(0xF2B957, { r: 0.5 }), dx0, 0.95, dz0, quim, 20);
  }
  var placaQ = new THREE.Mesh(new THREE.CircleGeometry(0.28, 3), new THREE.MeshBasicMaterial({ color: 0xffc400 })); placaQ.position.set(0, 1.6, 1.0); quim.add(placaQ);
  caixa(0.06, 1.4, 0.06, mat(0x5a6266), 0, 0.7, 1.0, quim);
  // Chaminé com vapor
  cilindro(0.5, 0.6, 7, mGalpao, -5.5, 3.5, -3.5, fab);
  var vapor = [];
  for (var v = 0; v < 8; v++){
    var nv = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: HALO, color: 0xa8d8db, transparent: true, opacity: 0.2, depthWrite: false }));
    nv.position.set(-5.5, 7 + v, -3.5); nv.userData.f = v / 8; fab.add(nv); vapor.push(nv);
  }
  var lf = textoTex(512, 96);
  kit.aoCarregarFonte(function(){
    var c = lf.ctx; c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, 'FÁBRICA ' + MARCA, 256, 50, 490, '800', 54, '#A8D8DB'); lf.tex.needsUpdate = true;
  });
  var letFab = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.8), new THREE.MeshBasicMaterial({ map: lf.tex, transparent: true, toneMapped: false }));
  letFab.position.set(-4.5, 3.6, 5.03); fab.add(letFab);

  /* ═══ Caminhão da equipe: cavalo com cabine arredondada e baú com a marca do cliente ═══ */
  var caminhao = new THREE.Group(); cena.add(caminhao);
  var mCabine = mat(0xf2f4f5, { r: 0.25, m: 0.35 }), mOuro = mat(0xD6B17D, { r: 0.25, m: 0.85 }), mCromo = mat(0xdfe6e8, { r: 0.12, m: 1 });
  var mVidroCam = new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.6, roughness: 0.05, clearcoat: 1 });
  caixa(6.6, 0.25, 1.2, mat(0x1b2226, { r: 0.6, m: 0.5 }), -0.4, 0.8, 0, caminhao);
  var bau = caixaRedonda(4.3, 2.2, 2.05, 0.12, mCabine); bau.position.set(-1.45, 2.05, 0); caminhao.add(bau);
  var faixaBau = caixaRedonda(4.32, 0.22, 2.08, 0.04, mOuro); faixaBau.position.set(-1.45, 1.3, 0); caminhao.add(faixaBau);
  var lt = textoTex(1024, 256);
  kit.aoCarregarFonte(function(){
    var c = lt.ctx; c.clearRect(0, 0, 1024, 256); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 512, 112, 960, '800', 120, '#17444C');
    c.fillStyle = '#30747F'; c.font = '600 44px Sora, sans-serif'; c.fillText('equipe de montagem', 512, 200);
    lt.tex.needsUpdate = true;
  });
  [1.04, -1.04].forEach(function(z){
    var lado = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true }));
    lado.position.set(-1.45, 2.2, z); if (z < 0) lado.rotation.y = Math.PI; caminhao.add(lado);
  });
  var cabine = caixaRedonda(1.55, 1.75, 2, 0.28, mCabine); cabine.position.set(1.75, 1.87, 0); caminhao.add(cabine);
  var defletor = caixaRedonda(1.1, 0.5, 1.9, 0.2, mCabine); defletor.position.set(1.55, 2.9, 0); defletor.rotation.z = 0.25; caminhao.add(defletor);
  var parabrisa = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 0.75), mVidroCam);
  parabrisa.position.set(2.54, 2.2, 0); parabrisa.rotation.y = Math.PI / 2; parabrisa.rotation.x = -0.12; caminhao.add(parabrisa);
  [1.005, -1.005].forEach(function(z){
    var janela = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), mVidroCam); janela.position.set(1.95, 2.2, z); if (z < 0) janela.rotation.y = Math.PI; caminhao.add(janela);
    var espelho = caixaRedonda(0.12, 0.38, 0.1, 0.03, mat(0x1b2226, { r: 0.4 })); espelho.position.set(2.45, 2.25, z * 1.2); caminhao.add(espelho);
  });
  var gradeCam = caixaRedonda(0.08, 0.55, 1.3, 0.03, mCromo); gradeCam.position.set(2.56, 1.4, 0); caminhao.add(gradeCam);
  for (var gl = 0; gl < 4; gl++) caixa(0.02, 0.03, 1.2, mat(0x2a3338, { r: 0.5 }), 2.61, 1.23 + gl * 0.12, 0, caminhao);
  var parachoque = caixaRedonda(0.22, 0.28, 2.05, 0.08, mat(0x2a3338, { r: 0.4, m: 0.6 })); parachoque.position.set(2.6, 0.9, 0); caminhao.add(parachoque);
  [0.72, -0.72].forEach(function(z){
    var farol = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.34), new THREE.MeshBasicMaterial({ color: 0xfff1c9, toneMapped: false })); farol.position.set(2.62, 1.2, z); caminhao.add(farol);
    var lanterna = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.12), new THREE.MeshBasicMaterial({ color: 0xff4a3a, toneMapped: false })); lanterna.position.set(-3.62, 1.25, z * 1.2); caminhao.add(lanterna);
  });
  cilindro(0.26, 0.26, 0.8, mCromo, 0.9, 0.95, 1.0, caminhao, 18).rotation.z = Math.PI / 2;
  var rodas = [];
  [[-2.9, 0.6], [-2.05, 0.6], [1.75, 0.4]].forEach(function(p){ [-0.92, 0.92].forEach(function(z){ rodas.push(roda(caminhao, p[0], 0.5, z, 0.5, p[1], mCromo)); }); });
  [-0.92, 0.92].forEach(function(z){ caixa(1.0, 0.06, 0.5, mat(0x1b2226, { r: 0.6 }), 1.75, 1.05, z, caminhao); caixa(1.9, 0.06, 0.66, mat(0x1b2226, { r: 0.6 }), -2.47, 1.08, z, caminhao); });
  kit.desvanecivel(caminhao);
  caminhao.position.set(-40, 0, Z_RUA + 0.78);

  /* ═══ Estádio ═══ */
  var est = new THREE.Group(); est.position.set(EST[0], 0, EST[2]); cena.add(est);
  var pista = new THREE.Mesh(new THREE.RingGeometry(7, 9.3, 96), mat(COR.pista, { r: 0.85 }));
  pista.rotation.x = -Math.PI / 2; pista.scale.set(EX, 1, 1); pista.position.y = 0.05; pista.receiveShadow = true; est.add(pista);
  for (var l = 1; l < 5; l++){
    var raia = new THREE.Mesh(new THREE.RingGeometry(7 + l * 0.46, 7 + l * 0.46 + 0.04, 96), basico(0xffffff, 0.55));
    raia.rotation.x = -Math.PI / 2; raia.scale.set(EX, 1, 1); raia.position.y = 0.06; est.add(raia);
  }
  var mGrama = mat(COR.grama, { r: 0.9, e: 0x0e3a20, ei: 0 });
  var campo = new THREE.Mesh(new THREE.CircleGeometry(7, 96), mGrama);
  campo.rotation.x = -Math.PI / 2; campo.scale.set(EX, 1, 1); campo.position.y = 0.05; campo.receiveShadow = true; est.add(campo);
  // Marcação do campo: círculo central, linha do meio, grandes áreas e traves
  var mLinha = basico(0xffffff, 0.6);
  var circ = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.48, 48), mLinha); circ.rotation.x = -Math.PI / 2; circ.position.y = 0.07; est.add(circ);
  var meio = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 9.6), mLinha); meio.rotation.x = -Math.PI / 2; meio.position.y = 0.07; est.add(meio);
  [-1, 1].forEach(function(s){
    var xg = s * 8.6;
    [[2.2, 0.07, xg - s * 1.1, 2.3], [2.2, 0.07, xg - s * 1.1, -2.3], [0.07, 4.6, xg - s * 2.2, 0]].forEach(function(q){
      var m = new THREE.Mesh(new THREE.PlaneGeometry(q[0], q[1]), mLinha); m.rotation.x = -Math.PI / 2; m.position.set(q[2], 0.07, q[3]); est.add(m);
    });
    var trave = new THREE.Group(); trave.position.set(xg, 0, 0); est.add(trave);
    [-1.2, 1.2].forEach(function(z){ cilindro(0.05, 0.05, 1.2, mat(0xffffff, { r: 0.3 }), 0, 0.6, z, trave, 10); });
    var trav = cilindro(0.05, 0.05, 2.45, mat(0xffffff, { r: 0.3 }), 0, 1.2, 0, trave, 10); trav.rotation.x = Math.PI / 2;
    var rede = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
    rede.rotation.y = Math.PI / 2; rede.position.set(s * 0.6, 0.6, 0); trave.add(rede);
  });

  // Arquibancada: segmentos de degraus maciços, com largura ajustada à elipse (sem frestas) e cadeiras instanciadas
  var sCad = new THREE.Shape(); sCad.moveTo(0, 0); sCad.lineTo(0.42, 0); sCad.lineTo(0.42, 0.1); sCad.lineTo(0.1, 0.1); sCad.lineTo(0.06, 0.46); sCad.lineTo(0, 0.46); sCad.lineTo(0, 0);
  var GEO_CAD = new THREE.ExtrudeGeometry(sCad, { depth: 0.44, bevelEnabled: false }); GEO_CAD.translate(-0.21, 0, -0.22); GEO_CAD.rotateY(Math.PI / 2);   // encosto para fora: quem senta olha o campo
  var mDegrau = mat(0xb9c4c7, { r: 0.75 }), mCad = mat(0xffffff, { r: 0.45 }), corCad = new THREE.Color(), corA = new THREE.Color(0x30747F), corB = new THREE.Color(0xD6B17D);
  var segmentos = [], coberturas = [];
  for (var s = 0; s < NSEG; s++){
    var a = (s + 0.5) / NSEG * Math.PI * 2, da = Math.PI * 2 / NSEG;
    var g = new THREE.Group(); var p0 = elipse(a, R_ARQ), n0 = normal(a);
    g.position.set(p0.x - EST[0], 0, p0.z - EST[2]); g.rotation.y = Math.atan2(n0.x, n0.z);
    var nCad = [];
    for (var k = 0; k < DEGRAUS; k++){
      var rr = R_ARQ + k * PISO_D + PISO_D / 2;
      var larg = elipse(a + da / 2, rr).distanceTo(elipse(a - da / 2, rr)) + 0.06;
      var h = 0.45 + k * ESPELHO;
      caixa(larg, h, PISO_D, mDegrau, 0, h / 2, k * PISO_D + PISO_D / 2, g);
      var nc = Math.floor((larg - 0.2) / 0.52);
      for (var c = 0; c < nc; c++) nCad.push([-(nc - 1) * 0.26 + c * 0.52, h, k * PISO_D + 0.32, k]);
    }
    var cad = new THREE.InstancedMesh(GEO_CAD, mCad, nCad.length), dC = new THREE.Object3D();
    nCad.forEach(function(q, i){
      dC.position.set(q[0], q[1], q[2]); dC.updateMatrix(); cad.setMatrixAt(i, dC.matrix);
      corCad.copy((q[3] === 3 || q[3] === 6) ? corB : corA).convertSRGBToLinear(); cad.setColorAt(i, corCad);
    });
    cad.castShadow = true; g.add(cad);
    // Cobertura metálica sobre a arquibancada do fundo (pilar na borda externa e telhado em balanço)
    if (Math.sin(a) < -0.3){
      var cob = new THREE.Group(); g.add(cob);
      var hTopo = 0.45 + (DEGRAUS - 1) * ESPELHO, zFim = DEGRAUS * PISO_D;
      var largTopo = elipse(a + da / 2, R_ARQ + zFim).distanceTo(elipse(a - da / 2, R_ARQ + zFim)) + 0.08;
      caixa(0.35, 4.2, 0.35, mAco, 0, hTopo + 2.1, zFim - 0.3, cob);
      barra(V(0, hTopo + 4.2, zFim - 0.3), V(0, hTopo + 3.0, zFim - 5.4), 0.06, mAco, cob);
      var telha = caixa(largTopo, 0.08, 6.6, mat(0xdfe6e8, { r: 0.35, m: 0.7 }), 0, hTopo + 3.65, zFim - 3.1, cob); telha.rotation.x = -0.18;
      cob.visible = false; coberturas.push({ g: cob, i: s });
    }
    g.scale.y = 0.001; est.add(g); segmentos.push(g);
  }
  // Nome do cliente em faixa curva na parede externa da arquibancada da frente (acompanha a elipse)
  var faixaTx = textoTex(2048, 192);
  kit.aoCarregarFonte(function(){
    var c = faixaTx.ctx; c.fillStyle = '#17444C'; c.fillRect(0, 0, 2048, 192);
    c.fillStyle = '#D6B17D'; c.fillRect(0, 170, 2048, 22); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, 'ARENA · ' + MARCA, 1024, 92, 1960, '800', 118, '#F0D2A4'); faixaTx.tex.needsUpdate = true;
  });
  (function faixaArena(){
    var n = 40, pos = [], uv = [], idx = [], a0 = Math.PI / 2 - 0.42, a1 = Math.PI / 2 + 0.42;
    for (var i = 0; i <= n; i++){
      var aa = a0 + (a1 - a0) * i / n, nn = normal(aa), p = elipse(aa, R_ARQ).addScaledVector(nn, DEGRAUS * PISO_D + 0.03);
      pos.push(p.x, 1.55, p.z, p.x, 3.15, p.z); uv.push(1 - i / n, 0, 1 - i / n, 1);
      if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
    }
    var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: faixaTx.tex, toneMapped: false, side: THREE.DoubleSide })); cena.add(m);
  })();
  // Alambrado do canteiro com portão na frente
  var mAlamb = new THREE.MeshStandardMaterial({ color: 0x9fb3b8, roughness: 0.5, metalness: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  [[-3, PORTAO[0] - VAO_PORTAO / 2], [PORTAO[0] + VAO_PORTAO / 2, 38]].forEach(function(tr){
    var comp = tr[1] - tr[0];
    var tela = new THREE.Mesh(new THREE.PlaneGeometry(comp, 2.0), mAlamb); tela.position.set((tr[0] + tr[1]) / 2, 1.05, Z_ALAMB); cena.add(tela);
    for (var x = tr[0]; x <= tr[1] + 0.01; x += 2.5) cilindro(0.04, 0.04, 2.2, mAco, x, 1.1, Z_ALAMB, cena, 8);
    caixa(comp, 0.04, 0.04, mAco, (tr[0] + tr[1]) / 2, 2.1, Z_ALAMB);
  });
  [PORTAO[0] - VAO_PORTAO / 2, PORTAO[0] + VAO_PORTAO / 2].forEach(function(x){ caixa(0.3, 3.2, 0.3, mat(0x5a6266, { r: 0.5, m: 0.6 }), x, 1.6, Z_ALAMB); });
  var portico = caixa(VAO_PORTAO + 0.3, 0.6, 0.3, mat(0xF2B957, { r: 0.4 }), PORTAO[0], 3.2, Z_ALAMB);
  var porticoTx = textoTex(1024, 128);
  kit.aoCarregarFonte(function(){ var c = porticoTx.ctx; c.clearRect(0, 0, 1024, 128); c.fillStyle = '#17444C'; c.fillRect(0, 0, 1024, 128); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, 'ENTRADA DE OBRA · ' + MARCA, 512, 66, 980, '800', 64, '#F0D2A4'); porticoTx.tex.needsUpdate = true; });
  var letPortico = new THREE.Mesh(new THREE.PlaneGeometry(VAO_PORTAO, 0.52), new THREE.MeshBasicMaterial({ map: porticoTx.tex, toneMapped: false })); letPortico.position.set(PORTAO[0], 3.2, Z_ALAMB + 0.16); cena.add(letPortico);

  // Torres de iluminação treliçadas com projetores voltados para o campo
  var torres = [];
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(q){
    var tg = new THREE.Group(); tg.position.set(EST[0] + q[0] * 23.5, 0, EST[2] + q[1] * 17.6); cena.add(tg);
    caixa(1.6, 0.4, 1.6, mat(0x8d979a, { r: 0.85 }), 0, 0.2, 0, tg);
    var mastroT = trelica(19, 1.1, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), { afina: 0.55, passo: 1.2 }); mastroT.position.y = 0.4; tg.add(mastroT);
    var cabeca = new THREE.Group(); cabeca.position.y = 19.6; tg.add(cabeca);
    cabeca.rotation.y = Math.atan2(-q[0], -q[1]);
    caixa(3.2, 2.0, 0.15, mat(0x2a3338, { r: 0.5, m: 0.6 }), 0, 0.4, 0.3, cabeca);
    var mProj = mat(0x1d2c31, { e: 0xfff4d6, ei: 0 }), projs = [];
    for (var pj = 0; pj < 12; pj++){ var pr = caixaRedonda(0.6, 0.45, 0.3, 0.06, mProj); pr.position.set(-1.2 + (pj % 4) * 0.8, -0.2 + Math.floor(pj / 4) * 0.62, 0.5); pr.rotation.x = 0.35; cabeca.add(pr); projs.push(pr); }
    var cone = new THREE.Mesh(new THREE.ConeGeometry(6, 22, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    var alvoLuz = V(EST[0] - q[0] * 4, 0, EST[2] - q[1] * 3), topoT = V(tg.position.x, 19.4, tg.position.z), meioC = topoT.clone().lerp(alvoLuz, 0.5);
    cone.position.copy(meioC); cone.quaternion.setFromUnitVectors(V(0, -1, 0), alvoLuz.clone().sub(topoT).normalize()); cone.scale.y = topoT.distanceTo(alvoLuz) / 22; cena.add(cone);
    tg.userData = { mProj: mProj, cone: cone }; torres.push(tg);
  });

  // Placar elevado atrás da arquibancada do fundo
  var placarTx = textoTex(1024, 400);
  var placarG = new THREE.Group(); placarG.position.set(EST[0], 0, EST[2] - 18.2); cena.add(placarG);
  [-3.4, 3.4].forEach(function(x){ var col = trelica(10, 0.7, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), { passo: 1 }); col.position.set(x, 0, 0); placarG.add(col); caixa(1.2, 0.4, 1.2, mat(0x8d979a, { r: 0.85 }), x, 0.2, 0, placarG); });
  caixa(9.2, 4.2, 0.4, mat(0x0a1216, { r: 0.4 }), 0, 12, -0.05, placarG);
  var tela = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 3.8), new THREE.MeshBasicMaterial({ map: placarTx.tex, toneMapped: false }));
  tela.position.set(0, 12, 0.17); placarG.add(tela);
  function desenharPlacar(titulo, valor, cor, rodape){
    var c = placarTx.ctx;
    c.fillStyle = '#05090b'; c.fillRect(0, 0, 1024, 400);
    c.strokeStyle = cor; c.lineWidth = 6; c.strokeRect(14, 14, 996, 372);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, titulo, 512, 82, 960, '700', 44, 'rgba(255,255,255,.6)');
    escrever(c, valor, 512, 210, 980, '800', 150, cor);
    escrever(c, rodape, 512, 330, 960, '600', 36, 'rgba(255,255,255,.55)');
    placarTx.tex.needsUpdate = true;
  }
  var placarEstado = { perdidos: 1 }, modoAtual = 'neutro';
  function atualizarPlacar(){
    if (modoAtual === 'verde') desenharPlacar('INAUGURAÇÃO · ' + MARCA, 'ENTREGUE', '#5EE0A6', 'no dia marcado');
    else if (modoAtual === 'acidente') desenharPlacar('FRENTE DE MONTAGEM', 'PARADA', '#FF6B5E', 'investigação em andamento');
    else if (modoAtual === 'prazo' && placarEstado.perdidos > 0) desenharPlacar('ENTREGA DA OBRA', '+' + placarEstado.perdidos + ' DIAS', '#FF6B5E', 'depois da inauguração');
    else desenharPlacar('INAUGURAÇÃO EM', 'D-30', '#F0D2A4', 'montagem ' + MARCA + ' em andamento');
  }
  kit.aoCarregarFonte(atualizarPlacar);

  // Grua torre do estádio (fora da arquibancada), içando estrutura da cobertura
  var mGrua = mat(0xE8B41F, { r: 0.4, m: 0.55 }), mCaboG = mat(0x1d2124, { r: 0.6, m: 0.6 });
  var grua = new THREE.Group(); grua.position.set(EST[0] + 27, 0, EST[2] - 7); cena.add(grua);
  caixa(3, 0.6, 3, mat(0x8d979a, { r: 0.85 }), 0, 0.3, 0, grua);
  var mastroG = trelica(23.4, 1.2, mGrua, { passo: 1.2 }); mastroG.position.y = 0.6; grua.add(mastroG);
  var braco = new THREE.Group(); braco.position.y = 24; grua.add(braco);
  cilindro(0.9, 0.9, 0.4, mat(0x3a4245, { r: 0.5, m: 0.7 }), 0, 0.05, 0, braco, 24);
  var picoG = trelica(4.6, 0.9, mGrua, { afina: 0.25 }); picoG.position.y = 0.3; braco.add(picoG);
  var lancaG = trelica(20, 0.9, mGrua, { passo: 1.25, afina: 0.7 }); lancaG.rotation.z = Math.PI / 2; lancaG.position.y = 0.8; braco.add(lancaG);
  var contraG = trelica(7, 0.9, mGrua, { passo: 1.2 }); contraG.rotation.z = -Math.PI / 2; contraG.position.y = 0.8; braco.add(contraG);
  for (var lst = 0; lst < 3; lst++) caixa(0.55, 1.4, 1.5, mat(0x8d979a, { r: 0.85 }), 4.6 + lst * 0.62, 0.35, 0, braco);
  var cabG = caixaRedonda(1.2, 1.3, 1.1, 0.12, mat(0xf2f4f5, { r: 0.3 })); cabG.position.set(-0.5, 0.2, 1.15); braco.add(cabG);
  [-0.28, 0.28].forEach(function(z){ barra(V(0, 4.8, z), V(-13, 1.25, z * 0.5), 0.03, mCaboG, braco); barra(V(0, 4.8, z), V(6.9, 1.25, z * 0.5), 0.03, mCaboG, braco); });
  var R_CAR = -12;
  caixa(0.85, 0.32, 1.0, mat(0x3a4245, { r: 0.5, m: 0.7 }), R_CAR, 0.18, 0, braco);
  var cabo = cilindro(0.022, 0.022, 1, mCaboG, R_CAR, 0, 0, braco, 6); cabo.userData.oco = true;
  var carga = new THREE.Group(); carga.position.set(R_CAR, -8, 0); braco.add(carga);
  var tercaIcada = trelica(4.5, 0.5, mat(0xdfe6e8, { r: 0.35, m: 0.7 }), { passo: 0.75 }); tercaIcada.rotation.z = Math.PI / 2; tercaIcada.position.set(2.25, 0, 0); carga.add(tercaIcada);
  [-1.6, 1.6].forEach(function(x){ barra(V(0, 1.6, 0), V(x, 0.25, 0), 0.012, mCaboG, carga); });
  var moitao = caixaRedonda(0.36, 0.5, 0.28, 0.08, mat(0xffb020, { r: 0.4, m: 0.5 })); moitao.position.y = 1.85; carga.add(moitao);

  // Andaime fachadeiro na face externa da arquibancada da frente-esquerda
  var A_AND = 2.45, aSeg = A_AND, nA = normal(aSeg), pA = elipse(aSeg, R_ARQ).addScaledVector(nA, DEGRAUS * PISO_D + 0.35);
  var andaime = kit.andaime(4, 3, { largura: 1.2, altNivel: 2.0 });
  var tA = V(-nA.z, 0, nA.x);   // tangente
  andaime.rotation.y = Math.atan2(-nA.x, -nA.z) + Math.PI;   // +z local (face de trabalho) para fora da arquibancada
  var ancora = pA.clone().addScaledVector(tA, 3);   // deslocado para longe da clínica
  andaime.position.copy(ancora); cena.add(andaime);
  var guardaTopo = andaime.userData.guardaTopo;

  /* ═══ Pessoas ═══ */
  function emCota(p, y){ p.position.y = y; p.userData.base.y = y; return p; }
  var naFab = [];
  [[-1.4, 4.0], [0.6, 4.1], [4.4, 3.9]].forEach(function(q){ naFab.push(pessoa(FAB[0] + q[0], FAB[2] + q[1], COR.colete)); });
  // Equipe embarcando: no pátio da fábrica, fora da estrada
  var equipe = [];
  for (var e = 0; e < 6; e++) equipe.push(pessoa(FAB[0] + 9.3 + (e % 3) * 0.95, FAB[2] + 3.3 + Math.floor(e / 3) * 0.9, COR.colete));
  // Trabalhador no último nível do andaime (o guarda-corpo do topo some nas cenas de risco)
  var pAnd = new THREE.Vector3(2 * 2 + 1, 0, 0.6).applyMatrix4(andaime.matrixWorld.copy(new THREE.Matrix4().compose(andaime.position, andaime.quaternion, andaime.scale)));
  var Y_AND = 3 * 2.0 + 0.06;
  var noAndaime = emCota(pessoa(pAnd.x, pAnd.z, COR.colete), Y_AND);
  kit.epi(noAndaime, ['cinto']);
  var pQueda = new THREE.Vector3(2 * 2 + 1, 0, 2.6).applyMatrix4(andaime.matrixWorld);
  var fila = [];
  for (var p2 = 0; p2 < 6; p2++) fila.push(pessoa(FILA[0] - 1.05 + (p2 % 3) * 1.05, FILA[2] - 0.42 + Math.floor(p2 / 3) * 0.84, p2 < 3 ? COR.colete : COR.terc));
  var viajante = pessoa(FAB[0] + 12, 3.9, COR.colete);

  /* ── Estado próprio do cenário ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, uCam = 0, tempo = 0;
  var X0_CAM = -54, X1_CAM = 54;

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      var cli = [kit.R.clinica.pos[0], kit.R.clinica.pos[2] + 7.6], base = [FAB[0] + 12, 3.9], calc = 4.2;
      if (modo === 'virada' || modo === 'clinica') return [base, cli];
      if (modo === 'verde') return [cli, [cli[0], calc], [PORTAO[0], calc], [PORTAO[0], 1.6]];
      return [[PORTAO[0], 1.6], [PORTAO[0], calc], [cli[0], calc], cli, base];
    },
    modosRisco: ['fabrica', 'viagem', 'altura', 'terceiros', 'acidente', 'prazo'],
    alertas: {
      fabrica:   [FAB[0] + 0.6, 4.4, FAB[2] + 4.1, 0.08],
      viagem:    [equipe[1].position.x, 4.2, equipe[1].position.z, 0.08],
      altura:    [pAnd.x, Y_AND + 4.4, pAnd.z, Y_AND + 0.06],
      terceiros: [FILA[0], 4.2, FILA[2], 0.08],
      acidente:  [pQueda.x, 4.4, pQueda.z, 0.08]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([V(FAB[0] + 12, 0.3, 3.9), V(-13, 0.3, 3.2), V(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([V(-9, 0.3, 1.6), V(-9, 0.3, 4.2), V(4, 0.3, 4.2), V(PORTAO[0], 0.3, 4.2), V(PORTAO[0], 0.3, 1.6)])
    },
    fogos: [EST[0], EST[2]],
    auditoria: function(){ carga.userData.semApoio = true; return { moveis: [caminhao, carga], pessoas: naFab.concat(equipe, fila, [noAndaime, viajante]) }; },

    aplicarModo: function(modo, c){
      modoAtual = modo;
      obraAlvo = c ? c.obra : 0.55;
      luzesAlvo = modo === 'verde' ? 1 : 0;
      var risco = modo === 'altura' || modo === 'acidente';
      guardaTopo.visible = !risco;
      var caiu = modo === 'acidente';
      noAndaime.rotation.z = caiu ? 1.35 : 0;
      noAndaime.position.set(caiu ? pQueda.x : pAnd.x, caiu ? 0.25 : Y_AND, caiu ? pQueda.z : pAnd.z);
      noAndaime.visible = modo !== 'verde';
      fila.forEach(function(p){ p.visible = modo !== 'verde'; });
      atualizarPlacar();
    },

    placar: function(n){ placarEstado.perdidos = n; atualizarPlacar(); },

    quadro: function(dt, k, relogio, modo){
      tempo += dt;
      obra += (obraAlvo - obra) * k * 0.6;
      var visiveis = obra * NSEG;
      segmentos.forEach(function(sg, i){ sg.scale.y += ((i < visiveis ? 1 : 0.001) - sg.scale.y) * k; sg.visible = sg.scale.y > 0.01; });
      coberturas.forEach(function(cb){ cb.g.visible = cb.i < visiveis * 0.75 || obraAlvo >= 1; });
      andaime.visible = grua.visible = obraAlvo < 1;
      braco.rotation.y = -0.4 + Math.sin(relogio * 0.2) * 0.45;
      carga.position.y = -8 + Math.sin(relogio * 0.6) * 1.2;
      var topoCabo = 0.02, fimCabo = carga.position.y + 2.1;
      cabo.scale.y = topoCabo - fimCabo; cabo.position.y = (topoCabo + fimCabo) / 2;

      luzes += (luzesAlvo - luzes) * k * 0.6;
      torres.forEach(function(tg){ tg.userData.mProj.emissiveIntensity = luzes * 2.2; tg.userData.cone.material.opacity = luzes * 0.05; });
      luzEstadio.intensity = luzes * 2.4;
      mGrama.emissiveIntensity = luzes * 0.6;
      haloEstadio.material.opacity = 0.08 + luzes * 0.25;

      // Caminhão: percorre a estrada inteira e some/aparece suavemente nas pontas (sem teleporte à vista)
      var L = X1_CAM - X0_CAM, xAnt = caminhao.position.x;
      uCam = (uCam + dt * (modo === 'viagem' ? 7 : 5) / L) % 1;
      caminhao.position.x = X0_CAM + uCam * L;
      var dx = caminhao.position.x - xAnt;
      if (Math.abs(dx) < 2) rodas.forEach(function(rd){ rd.rotation.z -= dx / 0.5; });
      caminhao.userData.opacidade(Math.max(0, Math.min(1, Math.min(caminhao.position.x - X0_CAM, X1_CAM - caminhao.position.x) / 7)));

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
