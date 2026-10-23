/* Cenário: infraestrutura — obra viária com trecho pavimentado, terraplenagem em aterro de terra armada,
   ponte de concreto em vigas pré-moldadas sobre o rio (montagem por guindaste), túnel em NATM na encosta
   (cambotas, concreto projetado, jumbo de perfuração, ventilação), drenagem em vala, desvio de trânsito com
   ponte provisória metálica e base com placa de obra do cliente.
   Regra de ouro do cenário: nada atravessa nada. Todo veículo anda sobre a cota real da pista
   (perfil longitudinal) e cada faixa tem um traçado próprio; a auditoria de QA verifica isso. */

/* ═══ BLOCO: CENARIO_INFRAESTRUTURA ═══ */
CENARIOS.infraestrutura = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa,
      barra = kit.barra, trelica = kit.trelica, fita = kit.fita, texturaProc = kit.texturaProc, granulado = kit.granulado;
  var V = function(x, y, z){ return new THREE.Vector3(x, y, z); };
  var MARCA = EMPRESA.nome.toUpperCase();

  /* ── Geometria de projeto (todas as cotas derivam daqui) ── */
  var EIXO_Z = 6, INI_OBRA = -2;
  var Y_OAE = 4.2;                        // elevação da pista sobre a ponte
  var RAMPA_O = 9, ENC_O = 29, ENC_L = 43, RAMPA_L = 63;   // aterros de acesso e encontros
  var PONTE_X = 36, PILARES = [33.5, 38.5];
  // Vãos de viga: as extremidades apoiam na viga de apoio dos encontros (0,7 m para dentro do aterro)
  var VAOS = [[ENC_O - 0.7, 33.5], [33.5, 38.5], [38.5, ENC_L + 0.7]];
  var PORTAL_X = 64, TUN_L = 36, TUN_FIM = PORTAL_X + TUN_L;
  var R_TUN = 5.0, R_EXC = 5.45, Y_ARCO = 1.6;          // seção em arco (ferradura) do túnel
  var MEIA_PISTA = 4.6, MEIA_TAB = 4.8;
  var Z_DESV = EIXO_Z + 9.2, BAILEY = [31, 41], Y_BAILEY = 1.0;
  var BASE = [-24, 0, -1], PLACA = [-15, 0, 0.2];
  var ESCAV = [15, 0, -3.5], RE = [5, 0, 4.6], VALA = [3, 0, -9], SINAL = [-1.5, 0, 10.4], GUIND = [28.5, 0, -5.2];
  // Maciço: soma de cumes gaussianos + ruído, contido por uma elipse de pé suave (longe do desvio)
  var MORRO = { cx: 88, cz: 4, rx: 34, rz: 30,
    cumes: [[76, 4, 14, 10, 12], [86, -6, 24, 12, 14], [92, 12, 20, 14, 12], [102, 2, 28, 16, 16], [110, -12, 18, 12, 12]] };

  function suave(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  // Perfil longitudinal: cota da pista acabada em função de x
  function elev(x){
    if (x < ENC_O) return Y_OAE * suave((x - RAMPA_O) / (ENC_O - RAMPA_O));
    if (x <= ENC_L) return Y_OAE;
    return Y_OAE * (1 - suave((x - ENC_L) / (RAMPA_L - ENC_L)));
  }
  function perfil(x){ return 0.05 + elev(x); }
  // Desvio: sai da pista existente, corre paralelo e contorna a encosta; cruza o rio na ponte provisória
  function zDesvio(x){
    if (x < -16) return EIXO_Z;
    if (x < -2) return EIXO_Z + (Z_DESV - EIXO_Z) * suave((x + 16) / 14);
    if (x < 50) return Z_DESV;
    return Z_DESV + 0.09 * (x - 50) * (x - 50);
  }
  function yDesvio(x){
    var r = 0;
    if (x > BAILEY[0] - 4 && x < BAILEY[0]) r = Y_BAILEY * suave((x - BAILEY[0] + 4) / 4);
    else if (x >= BAILEY[0] && x <= BAILEY[1]) r = Y_BAILEY;
    else if (x > BAILEY[1] && x < BAILEY[1] + 4) r = Y_BAILEY * (1 - suave((x - BAILEY[1]) / 4));
    return 0.06 + r;
  }
  function ruido(x, z){ return Math.sin(x * 0.21 + z * 0.13) * 0.5 + Math.sin(x * 0.07 - z * 0.17 + 1.3) * 0.8 + Math.sin(x * 0.43 + z * 0.37) * 0.22 + Math.sin(x * 0.9 - z * 0.7) * 0.08; }
  function morroH(x, z){
    var dx = (x - MORRO.cx) / MORRO.rx, dz = (z - MORRO.cz) / MORRO.rz, d = Math.sqrt(dx * dx + dz * dz);
    if (d >= 1) return 0;
    var h = 0;
    MORRO.cumes.forEach(function(c){ var ax = (x - c[0]) / c[3], az = (z - c[1]) / c[4]; h += c[2] * Math.exp(-(ax * ax + az * az) / 2); });
    h += 1.4 * ruido(x, z) + 0.6 * ruido(x * 2.3 + 7, z * 2.1 - 3);
    return Math.max(0, h * suave((1 - d) / 0.35));
  }
  // Corte do emboque: plataforma de 5,6 m de meia-largura e taludes com bermas a cada 3,5 m de altura
  function corteH(z){
    var s = Math.max(0, Math.abs(z - EIXO_Z) - 5.6), t = Math.floor(s / 3), r = s - t * 3;
    return t * 3.5 + Math.min(r, 2) / 2 * 3.5;
  }
  function terrenoH(x, z){ var m = morroH(x, z); return x < PORTAL_X ? Math.min(m, corteH(z)) : m; }

  /* ── Materiais e texturas ── */
  var mTerra = mat(0x5a4632, { r: 1 }), mTerraClara = mat(0x7a5f42, { r: 1 }), mAsfalto = mat(0x1c2529, { r: 0.92 });
  var mAmarelo = mat(0xe3a21a, { r: 0.42, m: 0.2 }), mCromo = mat(0xdfe6e8, { r: 0.12, m: 1 }), mPreto = mat(0x1f2427, { r: 0.7, m: 0.4 });
  var mVidro = new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.6, roughness: 0.05, clearcoat: 1 });
  var mAco = mat(0x7d8a8f, { r: 0.4, m: 0.85 }), mCabo = mat(0x1a1d1f, { r: 0.6, m: 0.6 });
  var txConcreto = texturaProc(256, function(g, t){ granulado(g, t, '#a9b2b4', 0.16, 2600); }, [2, 2]);
  var mConcreto = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txConcreto, roughness: 0.88 });
  var mConcretoNovo = new THREE.MeshStandardMaterial({ color: 0xe9eeee, map: txConcreto, roughness: 0.82 });
  var mConcretoDS = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txConcreto, roughness: 0.88, side: THREE.DoubleSide });
  var txTerraArmada = texturaProc(256, function(g, t){
    granulado(g, t, '#9aa3a5', 0.12, 1800);
    g.strokeStyle = 'rgba(40,48,52,.55)'; g.lineWidth = 3;
    for (var row = 0; row < 2; row++) for (var col = -1; col < 2; col++){
      var ox = col * 128 + (row ? 64 : 0), oy = row * 128;
      g.beginPath(); g.moveTo(ox + 32, oy); g.lineTo(ox + 96, oy); g.lineTo(ox + 128, oy + 64); g.lineTo(ox + 96, oy + 128); g.lineTo(ox + 32, oy + 128); g.lineTo(ox, oy + 64); g.closePath(); g.stroke();
    }
  });
  var mTerraArmada = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txTerraArmada, roughness: 0.9, side: THREE.DoubleSide });
  var txProjetado = texturaProc(256, function(g, t){
    granulado(g, t, '#7f8789', 0.3, 5200);
    for (var i = 0; i < 26; i++){ g.fillStyle = 'rgba(30,34,36,.35)'; g.beginPath(); g.arc(Math.random() * t, Math.random() * t, 3 + Math.random() * 9, 0, 6.3); g.fill(); }
  }, [3, 2]);
  var mProjetado = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txProjetado, roughness: 1, side: THREE.DoubleSide });
  var txRocha = texturaProc(256, function(g, t){
    granulado(g, t, '#5d5348', 0.35, 6000);
    g.strokeStyle = 'rgba(20,16,12,.5)'; g.lineWidth = 2;
    for (var i = 0; i < 16; i++){ g.beginPath(); var x = Math.random() * t, y = Math.random() * t; g.moveTo(x, y); for (var k = 0; k < 4; k++){ x += (Math.random() - 0.5) * 60; y += Math.random() * 40; g.lineTo(x, y); } g.stroke(); }
  }, [2, 2]);
  var mRocha = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txRocha, roughness: 1, side: THREE.DoubleSide });
  var txAsf = texturaProc(256, function(g, t){ granulado(g, t, '#222b2f', 0.18, 7000); }, [1, 1]);
  var mPista = new THREE.MeshStandardMaterial({ color: 0xffffff, map: txAsf, roughness: 0.86, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  var mBrita = new THREE.MeshStandardMaterial({ color: 0x8b8173, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  var mPintura = new THREE.MeshBasicMaterial({ color: 0xF0D2A4, transparent: true, opacity: 0.85, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  var mPinturaB = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });

  function escrever(c, txt, x, y, larguraMax, peso, tam, cor){
    c.fillStyle = cor; c.font = peso + ' ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > larguraMax && tam > 18){ tam -= 2; c.font = peso + ' ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, x, y);
  }
  function plano(w, d, m, x, y, z){
    var p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); p.receiveShadow = true; cena.add(p); return p;
  }
  function roda(pai, x, y, z, r, larg, cubo){
    var g = new THREE.Group(); g.position.set(x, y, z); pai.add(g);
    var w = larg || 0.4;
    // Pneu como anel (lathe): banda de rodagem e flancos com furo central onde o aro aparece
    var perfilPneu = [[r * 0.56, -w / 2], [r * 0.86, -w / 2 - 0.01], [r, -w / 2 + 0.06], [r, w / 2 - 0.06], [r * 0.86, w / 2 + 0.01], [r * 0.56, w / 2]].map(function(q){ return new THREE.Vector2(q[0], q[1]); });
    var pneu = new THREE.Mesh(new THREE.LatheGeometry(perfilPneu, 24), new THREE.MeshStandardMaterial({ color: 0x121416, roughness: 0.95, side: THREE.DoubleSide })); pneu.rotation.x = Math.PI / 2; g.add(pneu);
    [-1, 1].forEach(function(s){
      // Aro rebaixado dentro do pneu (o flanco cobre a borda: sem faces coplanares)
      var aro = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, w * 0.9, 16), cubo || mAmarelo); aro.rotation.x = Math.PI / 2; aro.position.z = s * 0.06; g.add(aro);
      var miolo = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.18, r * 0.2, 0.08, 10), mCromo); miolo.rotation.x = Math.PI / 2; miolo.position.z = s * (w * 0.45 + 0.06); g.add(miolo);
    });
    g.traverse(function(o){ if (o.isMesh) o.castShadow = true; }); return g;
  }
  // Pista e faixas: amostras do traçado
  function tracado(x0, x1, passo, zFn, yFn){
    var pts = []; for (var x = x0; x <= x1 + 1e-6; x += passo) pts.push(V(x, yFn(x), zFn(x))); return pts;
  }
  var zEixo = function(){ return EIXO_Z; };

  // Textura de porta de máquina/caminhão com o nome do cliente
  var portaTx = textoTex(512, 160);
  kit.aoCarregarFonte(function(){
    var c = portaTx.ctx; c.clearRect(0, 0, 512, 160); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 256, 70, 480, '800', 64, '#17444C'); escrever(c, 'obra viária', 256, 128, 460, '600', 28, '#30747F');
    portaTx.tex.needsUpdate = true;
  });
  function adesivo(pai, w, h, x, y, z, ry){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: portaTx.tex, transparent: true }));
    m.position.set(x, y, z); m.rotation.y = ry || 0; pai.add(m); return m;
  }

  /* ═══ Estrada existente, subleito, aterros e pavimento ═══ */
  plano(60, 7, mAsfalto, INI_OBRA - 30, 0.025, EIXO_Z);
  for (var f = 0; f < 18; f++){ var fx = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.14), mPintura); fx.rotation.x = -Math.PI / 2; fx.position.set(INI_OBRA - 58 + f * 3.2, 0.03, EIXO_Z); cena.add(fx); }
  [EIXO_Z - 3.2, EIXO_Z + 3.2].forEach(function(z){ var b = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.12), mPinturaB); b.rotation.x = -Math.PI / 2; b.position.set(INI_OBRA - 30, 0.03, z); cena.add(b); });
  // Faixa de domínio em terra no trecho em obra (antes dos aterros e dentro do corte do emboque)
  fita(tracado(INI_OBRA, PORTAL_X - 7, 1, zEixo, function(){ return 0.018; }), 9.6, mTerraClara);

  // Aterro de acesso com paramento em terra armada: seção trapezoidal varrida ao longo do perfil
  function aterro(x0, x1, zFn, yTopo, meiaTopo, inclin, mLado, mTopo){
    var n = Math.ceil((x1 - x0) / 0.5), pos = [], uv = [], idx = [];
    for (var i = 0; i <= n; i++){
      var x = x0 + (x1 - x0) * i / n, h = Math.max(0, yTopo(x)), z = zFn(x), pe = meiaTopo + h * inclin;
      // Lado esquerdo (z−) e direito (z+): topo → pé
      pos.push(x, h, z - meiaTopo, x, 0, z - pe, x, h, z + meiaTopo, x, 0, z + pe);
      uv.push(x / 2.4, h / 2.4, x / 2.4, 0, x / 2.4, h / 2.4, x / 2.4, 0);
      if (i < n){
        var a = i * 4, b = a + 4;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
        idx.push(a + 2, a + 3, b + 2, a + 3, b + 3, b + 2);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    var lado = new THREE.Mesh(geo, mLado); lado.castShadow = true; lado.receiveShadow = true; lado.userData.terreno = true; cena.add(lado);
    var topo = fita(tracado(x0, x1, 0.5, zFn, function(x){ return Math.max(0.026, yTopo(x) + 0.001); }), meiaTopo * 2, mTopo);
    topo.userData.terreno = true;
    return { lado: lado, topo: topo };
  }
  aterro(RAMPA_O - 0.5, ENC_O, zEixo, function(x){ return perfil(x) - 0.12; }, MEIA_PISTA, 0.35, mTerraArmada, mTerraClara);
  aterro(ENC_L, RAMPA_L + 0.5, zEixo, function(x){ return perfil(x) - 0.12; }, MEIA_PISTA, 0.35, mTerraArmada, mTerraClara);
  // Base de brita graduada sobre o aterro (já executada) e pavimento asfáltico que avança com a obra
  var XS_PISTA = [], xp;
  for (xp = INI_OBRA; xp <= TUN_FIM; xp += 0.5) XS_PISTA.push(xp);
  var ptsBase = XS_PISTA.filter(function(x){ return (x < ENC_O || x > ENC_L) && x < PORTAL_X - 0.5; }).map(function(x){ return V(x, Math.max(0.034, perfil(x) - 0.06), EIXO_Z); });
  var baseA = fita(ptsBase.filter(function(p){ return p.x < ENC_O; }), 8.2, mBrita);
  var baseB = fita(ptsBase.filter(function(p){ return p.x > ENC_L; }), 8.2, mBrita);
  baseA.userData.terreno = baseB.userData.terreno = true;
  var pavimento = fita(XS_PISTA.map(function(x){ return V(x, perfil(x), EIXO_Z); }), 7.4, mPista);
  pavimento.userData.terreno = true;
  var N_PAVE = XS_PISTA.length;
  function revelarPavimento(xFim){
    var n = 0; while (n < N_PAVE - 1 && XS_PISTA[n + 1] <= xFim) n++;
    pavimento.geometry.setDrawRange(0, n * 6); pavimento.visible = n > 0;
  }
  // Sinalização horizontal da pista nova (pintada na entrega)
  var faixasNovas = new THREE.Group(); cena.add(faixasNovas);
  for (var tr = INI_OBRA + 1; tr < TUN_FIM - 2; tr += 3.2){
    var tre = fita(tracado(tr, tr + 1.6, 0.4, zEixo, function(x){ return perfil(x) + 0.004; }), 0.14, mPintura); cena.remove(tre); faixasNovas.add(tre);
  }
  [-3.25, 3.25].forEach(function(o){ var bd = fita(tracado(INI_OBRA, TUN_FIM, 0.5, zEixo, function(x){ return perfil(x) + 0.004; }), 0.12, mPinturaB, o); cena.remove(bd); faixasNovas.add(bd); });
  faixasNovas.visible = false;

  // Marcos de quilômetro
  [[-20, 'KM 0'], [7, 'KM 6']].forEach(function(k){
    var g = new THREE.Group(); g.position.set(k[0], 0, EIXO_Z - 4.2); cena.add(g);
    cilindro(0.06, 0.06, 1.6, mat(0xdfe6e8, { r: 0.4, m: 0.6 }), 0, 0.8, 0, g);
    var tx = textoTex(256, 128);
    kit.aoCarregarFonte(function(){ var c = tx.ctx; c.fillStyle = '#1f6b3f'; c.fillRect(0, 0, 256, 128); c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(6, 6, 244, 116); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, k[1], 128, 66, 230, '800', 60, '#ffffff'); tx.tex.needsUpdate = true; });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: tx.tex })); m.position.set(0, 1.7, 0.05); g.add(m);
  });
  // Defensa metálica (guard-rail) nos aterros altos — instalada na entrega
  var defensas = new THREE.Group(); cena.add(defensas);
  [[RAMPA_O + 3, ENC_O], [ENC_L, RAMPA_L - 3]].forEach(function(tr){
    [-1, 1].forEach(function(s){
      var z = EIXO_Z + s * (MEIA_PISTA - 0.25);
      var pts = tracado(tr[0], tr[1], 0.5, function(){ return z; }, function(x){ return perfil(x) + 0.62; });
      var n = pts.length, pos = [], idx = [];
      pts.forEach(function(p, i){ pos.push(p.x, p.y - 0.16, p.z, p.x, p.y + 0.16, p.z); if (i < n - 1) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3); });
      var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
      var lamina = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xc9d1d4, roughness: 0.3, metalness: 0.9, side: THREE.DoubleSide })); lamina.castShadow = true; defensas.add(lamina);
      for (var x = tr[0]; x <= tr[1]; x += 2) caixa(0.1, 0.75, 0.1, mAco, x, perfil(x) + 0.37, z + s * 0.08, defensas);
    });
  });
  defensas.visible = false;

  // Postes de iluminação: os do trecho existente sempre; os do trecho novo aparecem na entrega
  var postes = [];
  [-44, -34, -24, 4, 14, 24, 34, 48, 58].forEach(function(px){
    var naPonte = px > ENC_O && px < ENC_L, y0 = px > INI_OBRA ? perfil(px) + (naPonte ? 0.77 : 0) : 0;
    var pg = new THREE.Group(); pg.position.set(px, y0, EIXO_Z - (naPonte ? MEIA_TAB - 0.3 : 4.4)); pg.rotation.y = Math.PI; cena.add(pg);
    cilindro(0.08, 0.13, 6, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 0, 3, 0, pg);
    var braco = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.045, 6, 16, Math.PI / 2), mat(0x9aa7ab, { r: 0.4, m: 0.7 }));
    braco.rotation.y = Math.PI / 2; braco.position.set(0, 5.3, -0.7); pg.add(braco);
    var luminaria = caixaRedonda(0.3, 0.12, 0.7, 0.04, mat(0x3a4245, { r: 0.4, m: 0.6 })); luminaria.position.set(0, 6.02, -1.15); pg.add(luminaria);
    var lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.55), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0.25, toneMapped: false, side: THREE.DoubleSide }));
    lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 5.95, -1.15); pg.add(lamp);
    var cone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.position.set(0, 3.1, -1.15); pg.add(cone);
    postes.push({ g: pg, lamp: lamp, cone: cone, x: px, novo: px > INI_OBRA });
  });

  /* ═══ Rio, margens com enrocamento e mata ciliar ═══ */
  var rio = plano(7, 84, new THREE.MeshPhysicalMaterial({ color: 0x1d5866, roughness: 0.12, metalness: 0.25, clearcoat: 1, transparent: true, opacity: 0.94 }), PONTE_X, 0.035, 2);
  (function enrocamento(){
    var n = 340, im = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.3, 0), mat(0x6c6a64, { r: 1 }), n), d = new THREE.Object3D(), c = new THREE.Color();
    for (var i = 0; i < n; i++){
      var lado = i % 2 ? 1 : -1, z = -40 + Math.random() * 84;
      d.position.set(PONTE_X + lado * (3.4 + Math.random() * 0.9), 0.05 + Math.random() * 0.08, z);
      d.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      var s = 0.5 + Math.random() * 0.9; d.scale.set(s, s * 0.6, s); d.updateMatrix(); im.setMatrixAt(i, d.matrix);
      c.setHSL(0.09, 0.05 + Math.random() * 0.08, 0.3 + Math.random() * 0.14); im.setColorAt(i, c);
    }
    im.castShadow = true; im.receiveShadow = true; cena.add(im);
  })();

  /* ═══ Ponte em vigas pré-moldadas (OAE) ═══ */
  var Y_LAJE_TOPO = perfil(PONTE_X) - 0.08, E_LAJE = 0.24, H_VIGA = 0.72, Y_VIGA_BASE = Y_LAJE_TOPO - E_LAJE - H_VIGA;
  var Y_TRAV_TOPO = Y_VIGA_BASE - 0.06;
  var ponte = new THREE.Group(); cena.add(ponte);
  // Fundação: blocos de coroamento sobre estacas no leito do rio
  PILARES.forEach(function(px){
    caixa(2.4, 0.7, 9.6, mConcreto, px, 0.2, EIXO_Z, ponte);
    [-2.8, 0, 2.8].forEach(function(dz){ cilindro(0.32, 0.32, 0.5, mConcreto, px, -0.05, EIXO_Z + dz, ponte, 14); });
  });
  // Pilares (dois fustes circulares) e travessa de apoio das vigas
  var pilaresG = [];
  PILARES.forEach(function(px){
    var g = new THREE.Group(); ponte.add(g); pilaresG.push(g);
    [-2.6, 2.6].forEach(function(dz){ cilindro(0.42, 0.42, Y_TRAV_TOPO - 0.7 - 0.55, mConcreto, px, 0.55 + (Y_TRAV_TOPO - 0.7 - 0.55) / 2, EIXO_Z + dz, g, 24); });
    var trav = caixaRedonda(1.3, 0.7, 10.2, 0.08, mConcreto); trav.position.set(px, Y_TRAV_TOPO - 0.35, EIXO_Z); g.add(trav);
    for (var b = -3.3; b <= 3.31; b += 2.2) caixa(0.36, 0.06, 0.4, mPreto, px, Y_TRAV_TOPO + 0.03, EIXO_Z + b, g);   // aparelhos de apoio
  });
  // Encontros: parede frontal com viga de apoio (assento das vigas), cortina e alas, encaixados no aterro
  [[ENC_O, -1], [ENC_L, 1]].forEach(function(e){
    var x = e[0], s = e[1];
    caixa(1.2, Y_TRAV_TOPO, 12.6, mConcreto, x + s * 0.6, Y_TRAV_TOPO / 2, EIXO_Z, ponte);
    caixa(0.35, Y_LAJE_TOPO - Y_TRAV_TOPO + E_LAJE * 0, 9.6, mConcreto, x + s * 1.02, Y_TRAV_TOPO + (Y_LAJE_TOPO - Y_TRAV_TOPO) / 2, EIXO_Z, ponte);
    for (var b = -3.3; b <= 3.31; b += 2.2) caixa(0.36, 0.06, 0.4, mPreto, x + s * 0.4, Y_TRAV_TOPO + 0.03, EIXO_Z + b, ponte);
    [-1, 1].forEach(function(lz){
      var ala = new THREE.Shape(), pts = [[0, 0], [0, Y_LAJE_TOPO + 0.5], [3.4, Y_LAJE_TOPO + 0.5], [3.4, Y_LAJE_TOPO - 0.4], [0.8, 0]];
      pts.forEach(function(p, i){ var px = p[0] * s; if (s < 0) px = p[0] * -1; if (i) ala.lineTo(px, p[1]); else ala.moveTo(px, p[1]); });
      var geo = new THREE.ExtrudeGeometry(ala, { depth: 0.35, bevelEnabled: false }); geo.translate(0, 0, -0.175);
      var m = new THREE.Mesh(geo, mConcretoDS); m.castShadow = m.receiveShadow = true;
      m.position.set(x + s * 1.2, 0, EIXO_Z + lz * 6.15); ponte.add(m);
    });
  });
  // Vigas I pré-moldadas: 4 por vão
  var perfilI = new THREE.Shape();
  [[-0.32, 0], [0.32, 0], [0.32, 0.12], [0.1, 0.2], [0.08, 0.56], [0.36, 0.62], [0.36, 0.72], [-0.36, 0.72], [-0.36, 0.62], [-0.08, 0.56], [-0.1, 0.2], [-0.32, 0.12]]
    .forEach(function(p, i){ if (i) perfilI.lineTo(p[0], p[1]); else perfilI.moveTo(p[0], p[1]); });
  var POS_VIGAS = [-3.3, -1.1, 1.1, 3.3];
  function viga(x0, x1){
    var geo = new THREE.ExtrudeGeometry(perfilI, { depth: x1 - x0 - 0.1, bevelEnabled: false });
    geo.rotateY(Math.PI / 2);
    var m = new THREE.Mesh(geo, mConcretoNovo); m.castShadow = true; m.receiveShadow = true; return m;
  }
  var vigas = [];   // [vão][viga]
  VAOS.forEach(function(v, iv){
    vigas.push(POS_VIGAS.map(function(dz){ var m = viga(v[0], v[1]); m.position.set(v[0] + 0.05, Y_VIGA_BASE, EIXO_Z + dz); ponte.add(m); return m; }));
  });
  // Lajes do tabuleiro, forma de madeira e armadura do vão em execução
  var lajes = VAOS.map(function(v){ return caixa(v[1] - v[0] - 0.04, E_LAJE, MEIA_TAB * 2, mConcretoNovo, (v[0] + v[1]) / 2, Y_LAJE_TOPO - E_LAJE / 2, EIXO_Z, ponte); });
  var forma = new THREE.Group(); ponte.add(forma);
  caixa(VAOS[1][1] - VAOS[1][0] - 0.04, 0.05, MEIA_TAB * 2, mat(0x9a6b3b, { r: 0.85 }), PONTE_X, Y_VIGA_BASE + H_VIGA + 0.03, EIXO_Z, forma);
  (function armadura(){
    var pts = [], y = Y_VIGA_BASE + H_VIGA + 0.14, x0 = VAOS[1][0] + 0.15, x1 = VAOS[1][1] - 0.15;
    for (var z = EIXO_Z - MEIA_TAB + 0.15; z <= EIXO_Z + MEIA_TAB - 0.14; z += 0.3) pts.push(x0, y, z, x1, y, z);
    for (var x = x0; x <= x1; x += 0.3) pts.push(x, y + 0.02, EIXO_Z - MEIA_TAB + 0.15, x, y + 0.02, EIXO_Z + MEIA_TAB - 0.15);
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    forma.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x8a4b2a })));
  })();
  // Guarda-corpo provisório (obra) e barreira New Jersey (entrega)
  var gcProv = new THREE.Group(); ponte.add(gcProv);
  [-1, 1].forEach(function(s){
    var z = EIXO_Z + s * (MEIA_TAB - 0.1);
    for (var x = ENC_O - 0.6; x <= VAOS[1][1]; x += 1.2) caixa(0.06, 1.2, 0.06, mat(0xe3a21a, { r: 0.5 }), x, Y_LAJE_TOPO + 0.6, z, gcProv);
    [0.55, 1.15].forEach(function(h, k){ caixa(VAOS[1][1] - ENC_O + 0.6, 0.08, 0.04, mat(k ? 0xd9342b : 0xf2f4f5, { r: 0.5 }), (ENC_O - 0.6 + VAOS[1][1]) / 2, Y_LAJE_TOPO + h, z, gcProv); });
  });
  var perfilNJ = new THREE.Shape();
  [[0.3, 0], [0.3, 0.85], [0.1, 0.85], [0.03, 0.33], [-0.3, 0.08], [-0.3, 0]].forEach(function(p, i){ if (i) perfilNJ.lineTo(p[0], p[1]); else perfilNJ.moveTo(p[0], p[1]); });
  var barreiras = new THREE.Group(); ponte.add(barreiras);
  [-1, 1].forEach(function(s){
    // Face vertical para fora do tabuleiro, face inclinada (perfil New Jersey) voltada para a pista
    var geo = new THREE.ExtrudeGeometry(perfilNJ, { depth: ENC_L - ENC_O + 2.4, bevelEnabled: false }); geo.rotateY(-Math.PI / 2);
    var m = new THREE.Mesh(geo, mConcretoNovo); m.castShadow = m.receiveShadow = true;
    if (s > 0) m.position.set(ENC_L + 1.2, Y_LAJE_TOPO, EIXO_Z + s * (MEIA_TAB - 0.3));
    else { m.rotation.y = Math.PI; m.position.set(ENC_O - 1.2, Y_LAJE_TOPO, EIXO_Z + s * (MEIA_TAB - 0.3)); }
    barreiras.add(m);
  });
  // Lajes de transição e drenos
  // (lajes de transição ficam sob o pavimento, acompanhando o greide: não aparecem e não interferem)
  for (var dx = ENC_O + 2; dx < ENC_L; dx += 3) [-1, 1].forEach(function(s){ cilindro(0.06, 0.06, 0.5, mat(0x2a3033), dx, Y_VIGA_BASE + H_VIGA - 0.1, EIXO_Z + s * (MEIA_TAB - 0.2), barreiras, 8); });
  barreiras.visible = false;

  /* ═══ Guindaste sobre esteiras içando a viga do último vão ═══ */
  var guind = new THREE.Group(); guind.position.set(GUIND[0], 0, GUIND[2]); cena.add(guind);
  var ALVO_VIGA = V(VAOS[2][0] + 0.05, Y_VIGA_BASE, EIXO_Z + POS_VIGAS[2]);
  var vigaIcada = vigas[2][2], vigaFalta = vigas[2][3];
  var centroViga = V((VAOS[2][0] + VAOS[2][1]) / 2, 0, ALVO_VIGA.z);
  var guiYaw = Math.atan2(-(centroViga.z - GUIND[2]), centroViga.x - GUIND[0]);
  guind.rotation.y = guiYaw;
  var mGuind = mat(0xd9a52a, { r: 0.4, m: 0.3 });
  [-1.7, 1.7].forEach(function(z){
    var est = caixaRedonda(5.4, 0.95, 0.85, 0.42, mat(0x232729, { r: 0.85, m: 0.4 })); est.position.set(0, 0.48, z); guind.add(est);
    for (var r = -2; r <= 2; r++) cilindro(0.16, 0.16, 0.9, mat(0x3a3f42, { r: 0.6, m: 0.6 }), r * 1.05, 0.3, z, guind, 10).rotation.x = Math.PI / 2;
  });
  caixa(2.6, 0.5, 3.4, mPreto, 0, 1.05, 0, guind);
  var casa = new THREE.Group(); casa.position.y = 1.3; guind.add(casa);
  var corpoG = caixaRedonda(4.4, 1.7, 2.8, 0.14, mGuind); corpoG.position.set(-0.6, 0.9, 0); casa.add(corpoG);
  var contraP = caixaRedonda(1.3, 1.5, 2.9, 0.18, mat(0x3d4346, { r: 0.8, m: 0.3 })); contraP.position.set(-3.2, 0.95, 0); casa.add(contraP);
  var cabG = caixaRedonda(1.3, 1.6, 1.0, 0.12, mGuind); cabG.position.set(1.2, 1.0, 1.0); casa.add(cabG);
  var vCab = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.0), mVidro); vCab.position.set(1.86, 1.2, 1.0); vCab.rotation.y = Math.PI / 2; casa.add(vCab);
  adesivo(casa, 1.8, 0.56, -0.9, 0.9, 1.42);
  // Pórtico (A-frame) e lança treliçada apontada para o vão
  var D_LANCA = Math.sqrt(Math.pow(centroViga.x - GUIND[0], 2) + Math.pow(centroViga.z - GUIND[2], 2));
  var PIV = V(1.3, 1.9, 0), L_LANCA = 21;
  var phi = Math.acos(Math.min(0.95, (D_LANCA - PIV.x) / L_LANCA));
  var lancaG = trelica(L_LANCA, 1.1, mGuind, { afina: 0.45, passo: 1.1 });
  lancaG.position.copy(PIV); lancaG.rotation.z = -(Math.PI / 2 - phi); casa.add(lancaG); lancaG.traverse(function(o){ o.userData.oco = true; });
  var PONTA = V(PIV.x + Math.cos(phi) * L_LANCA, PIV.y + Math.sin(phi) * L_LANCA, 0);
  var topoA = V(-1.6, 4.4, 0);
  [-0.9, 0.9].forEach(function(z){ barra(V(-0.4, 1.7, z), V(topoA.x, topoA.y, z * 0.4), 0.08, mGuind, casa); barra(V(-2.6, 1.7, z), V(topoA.x, topoA.y, z * 0.4), 0.08, mGuind, casa); });
  [-0.25, 0.25].forEach(function(z){ barra(V(topoA.x, topoA.y, z), V(PONTA.x, PONTA.y, z * 0.6), 0.025, mCabo, casa).userData.oco = true; });
  var polia = cilindro(0.3, 0.3, 0.3, mPreto, PONTA.x, PONTA.y - 0.1, 0, casa, 16); polia.rotation.x = Math.PI / 2;
  // Cabo de içamento, moitão e estropos (atualizados no quadro)
  var mCaboI = mat(0x15181a, { r: 0.5, m: 0.7 });
  var caboI = cilindro(0.03, 0.03, 1, mCaboI, 0, 0, 0, cena, 6);
  var moitao = caixaRedonda(0.5, 0.7, 0.35, 0.1, mat(0xffb020, { r: 0.4, m: 0.5 })); cena.add(moitao);
  var estropos = [cilindro(0.02, 0.02, 1, mCaboI, 0, 0, 0, cena, 5), cilindro(0.02, 0.02, 1, mCaboI, 0, 0, 0, cena, 5)];
  var pontaMundo = new THREE.Vector3();
  function esticar(c, a, b){
    var d = new THREE.Vector3().subVectors(b, a), l = d.length();
    c.position.copy(a).addScaledVector(d, 0.5); c.scale.set(1, l, 1); c.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
  }

  /* ═══ Encosta e túnel em NATM ═══ */
  // Encosta: malha de relevo com o corte do emboque; a faixa da boca do túnel fica aberta para o portal
  (function encosta(){
    var xs = [], zs = [], x, z;
    for (x = 52; x <= 124; x += 0.5){ if (x === PORTAL_X) xs.push(PORTAL_X - 0.02); xs.push(x); }
    for (z = -26; z <= 34; z += 0.5) zs.push(z);
    var nx = xs.length, nz = zs.length, pos = new Float32Array(nx * nz * 3), cor = new Float32Array(nx * nz * 3), idx = [];
    var cGrama = new THREE.Color(0x35582f), cMata = new THREE.Color(0x1d3a24), cRocha = new THREE.Color(0x6b6156), cProj = new THREE.Color(0x6c7476), cPe = new THREE.Color(0x13241f), tmp = new THREE.Color();
    for (var i = 0; i < nx; i++) for (var j = 0; j < nz; j++){
      var h = terrenoH(xs[i], zs[j]), k = (i * nz + j);
      // 15 cm abaixo do piso: o contorno do pé vira uma curva suave onde o morro emerge, sem serrilhado nem z-fighting
      pos[k * 3] = xs[i]; pos[k * 3 + 1] = h - 0.15; pos[k * 3 + 2] = zs[j];
      // Rocha aflorando onde a encosta é íngreme; concreto projetado nos taludes do corte
      var inc = Math.abs(terrenoH(xs[i] + 0.7, zs[j]) - terrenoH(xs[i] - 0.7, zs[j])) + Math.abs(terrenoH(xs[i], zs[j] + 0.7) - terrenoH(xs[i], zs[j] - 0.7));
      var cortado = xs[i] < PORTAL_X && corteH(zs[j]) < morroH(xs[i], zs[j]) - 0.05 && h > 0.05;
      if (cortado) tmp.copy(cProj).multiplyScalar(0.9 + Math.random() * 0.2);
      else {
        tmp.copy(cGrama).lerp(cMata, Math.min(1, h / 16));
        tmp.lerp(cRocha, Math.max(0, Math.min(0.8, (inc - 3.2) * 0.35 + 0.18 * ruido(xs[i] * 1.7, zs[j] * 1.9))));
        tmp.lerp(cPe, Math.max(0, 1 - h / 1.6) * 0.75);   // pé do morro se funde ao chão
        tmp.multiplyScalar(0.9 + Math.random() * 0.2);
      }
      tmp.convertSRGBToLinear(); cor[k * 3] = tmp.r; cor[k * 3 + 1] = tmp.g; cor[k * 3 + 2] = tmp.b;
    }
    function aberto(i, j){   // célula da testa do emboque: substituída pela parede de concreto projetado com a boca
      if (xs[i] !== PORTAL_X - 0.02) return false;
      return corteH(zs[j]) < morroH(PORTAL_X, zs[j]) - 0.05 || corteH(zs[j + 1]) < morroH(PORTAL_X, zs[j + 1]) - 0.05;
    }
    for (var a = 0; a < nx - 1; a++) for (var b = 0; b < nz - 1; b++){
      if (aberto(a, b)) continue;
      var p = a * nz + b, q = (a + 1) * nz + b;
      if (pos[p * 3 + 1] < -0.14 && pos[(p + 1) * 3 + 1] < -0.14 && pos[q * 3 + 1] < -0.14 && pos[(q + 1) * 3 + 1] < -0.14) continue;   // planície: o piso já está lá
      idx.push(p, p + 1, q, q, p + 1, q + 1);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    var m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); m.castShadow = true; m.receiveShadow = true; m.userData.terreno = true; cena.add(m);
    // Testa do emboque: parede em concreto projetado seguindo o relevo, com a boca do túnel recortada
    var zA = null, zB = null;
    zs.forEach(function(zz){ if (corteH(zz) < morroH(PORTAL_X, zz) - 0.05){ if (zA === null) zA = zz; zB = zz; } });
    zA -= 1; zB += 1;
    var testa = new THREE.Shape(), zz;
    testa.moveTo(zA, Math.min(corteH(zA), morroH(PORTAL_X, zA)) - 0.4);
    for (zz = zA; zz <= zB + 1e-6; zz += 0.5) testa.lineTo(zz, morroH(PORTAL_X, zz));
    for (zz = zB; zz >= zA - 1e-6; zz -= 0.5) testa.lineTo(zz, Math.min(corteH(zz), morroH(PORTAL_X, zz)) - 0.4);
    var boca = new THREE.Path(), t0 = Math.asin((-0.1 - Y_ARCO) / R_EXC);
    boca.moveTo(EIXO_Z + Math.cos(t0) * R_EXC, -0.1);
    boca.absarc(EIXO_Z, Y_ARCO, R_EXC, t0, Math.PI - t0, false);
    boca.lineTo(EIXO_Z + Math.cos(t0) * R_EXC, -0.1);
    testa.holes.push(boca);
    var tg = new THREE.ShapeGeometry(testa, 24), uvT = tg.attributes.uv;
    for (var u = 0; u < uvT.count; u++) uvT.setXY(u, uvT.getX(u) / 3, uvT.getY(u) / 3);
    var tm = new THREE.Mesh(tg, mProjetado); tm.rotation.y = -Math.PI / 2; tm.position.x = PORTAL_X; tm.receiveShadow = true; cena.add(tm);
    // Plataforma do emboque em terra compactada
    fita(tracado(PORTAL_X - 7, PORTAL_X, 1, zEixo, function(){ return 0.024; }), 11.2, mTerra);
    // Mata na encosta (fora do corte e do traçado)
    var lista = [];
    for (var n = 0; n < 1600 && lista.length < 260; n++){
      var tx = 54 + Math.random() * 68, tz = -25 + Math.random() * 58, th = terrenoH(tx, tz);
      if (th < 1.2 || (tx < PORTAL_X + 3 && Math.abs(tz - EIXO_Z) < 9.5)) continue;
      lista.push({ x: tx, y: th - 0.2, z: tz, h: 3 + Math.random() * 3.5, tipo: Math.random() < 0.55 ? 'redonda' : 'conica' });
    }
    // Mata ciliar nas margens, longe dos traçados
    for (var c = 0; c < 46; c++){
      var lz = Math.random() < 0.5 ? -40 + Math.random() * 26 : 26 + Math.random() * 16, lx = PONTE_X + (Math.random() < 0.5 ? -1 : 1) * (4.6 + Math.random() * 4);
      lista.push({ x: lx, y: 0, z: lz, h: 3 + Math.random() * 3, tipo: 'redonda' });
    }
    kit.arvores(lista);
  })();

  // Seção em arco do túnel extrudada ao longo de +x a partir de x0
  function casca(x0, comp, rIn, rOut, m){
    var tI = Math.asin(-Y_ARCO / rIn), tO = Math.asin(-Y_ARCO / rOut), s = new THREE.Shape();
    s.moveTo(Math.cos(tO) * rOut, 0); s.absarc(0, Y_ARCO, rOut, tO, Math.PI - tO, false);
    s.lineTo(-Math.cos(tI) * rIn, 0); s.absarc(0, Y_ARCO, rIn, Math.PI - tI, tI, true); s.lineTo(Math.cos(tO) * rOut, 0);
    var geo = new THREE.ExtrudeGeometry(s, { depth: comp, bevelEnabled: false, curveSegments: 40 });
    var uv = geo.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 3);
    var mesh = new THREE.Mesh(geo, m); mesh.rotation.y = Math.PI / 2; mesh.position.set(x0, 0, EIXO_Z); mesh.receiveShadow = true; mesh.userData.oco = true; cena.add(mesh); return mesh;
  }
  var tunelObra = new THREE.Group(), tunelPronto = new THREE.Group(); cena.add(tunelObra); cena.add(tunelPronto);
  var AVANCO = 15;   // frente de escavação a 15 m do emboque
  // Obra: concreto projetado até 3 m da frente, rocha com cambotas expostas no trecho final e a frente de escavação
  var c1 = casca(PORTAL_X, AVANCO - 3, R_TUN, R_EXC + 0.3, mProjetado); cena.remove(c1); tunelObra.add(c1);
  var c2 = casca(PORTAL_X + AVANCO - 3, 3, R_EXC - 0.05, R_EXC + 0.3, mRocha); cena.remove(c2); tunelObra.add(c2);
  var mCambota = mat(0x8a5a2b, { r: 0.6, m: 0.7 });
  for (var cb = 0; cb <= 3; cb++){
    var t0c = Math.asin(-Y_ARCO / (R_EXC - 0.15));
    var arco = new THREE.Mesh(new THREE.TorusGeometry(R_EXC - 0.15, 0.08, 6, 40, Math.PI - 2 * t0c), mCambota);
    arco.rotation.set(0, Math.PI / 2, t0c); arco.position.set(PORTAL_X + AVANCO - 3 + cb * 0.95, Y_ARCO, EIXO_Z); arco.castShadow = true; tunelObra.add(arco);
  }
  (function frente(){
    var s = new THREE.Shape(), t0f = Math.asin(-Y_ARCO / R_EXC);
    s.moveTo(Math.cos(t0f) * R_EXC, 0); s.absarc(0, Y_ARCO, R_EXC, t0f, Math.PI - t0f, false); s.lineTo(Math.cos(t0f) * R_EXC, 0);
    var m = new THREE.Mesh(new THREE.ShapeGeometry(s, 32), mRocha); m.rotation.y = -Math.PI / 2; m.position.set(PORTAL_X + AVANCO, 0, EIXO_Z); tunelObra.add(m);
    // Furos da malha de fogo marcados na frente
    for (var i = 0; i < 46; i++){
      var ang = Math.random() * Math.PI, rr = Math.sqrt(Math.random()) * (R_EXC - 0.6), fy = Y_ARCO + Math.sin(ang) * rr * (Math.random() < 0.3 ? -0.3 : 1);
      if (fy < 0.4) continue;
      var furo = new THREE.Mesh(new THREE.CircleGeometry(0.05, 8), new THREE.MeshBasicMaterial({ color: 0x0b0a08 }));
      furo.rotation.y = -Math.PI / 2; furo.position.set(PORTAL_X + AVANCO - 0.01, fy, EIXO_Z + Math.cos(ang) * rr); tunelObra.add(furo);
    }
  })();
  // Piso de terra na obra e enfilagens (guarda-chuva de tubos) sobre a boca
  var pisoT = fita(tracado(PORTAL_X, PORTAL_X + AVANCO, 1, zEixo, function(){ return 0.036; }), 9.2, mTerra); cena.remove(pisoT); tunelObra.add(pisoT);
  for (var en = 0; en < 15; en++){
    var ae = 0.35 + en * (Math.PI - 0.7) / 14;
    cilindro(0.05, 0.05, 2.2, mAco, PORTAL_X - 0.6, Y_ARCO + Math.sin(ae) * (R_EXC + 0.35), EIXO_Z + Math.cos(ae) * (R_EXC + 0.35), tunelObra, 8).rotation.z = Math.PI / 2;
  }
  // Ventilação: exaustor no emboque e duto flexível até a frente
  var DUTO_Z = EIXO_Z - 3.9, DUTO_Y = 3.9;
  var exaustor = cilindro(0.75, 0.75, 2.4, mat(0x2f6f86, { r: 0.4, m: 0.6 }), PORTAL_X - 3.2, DUTO_Y, DUTO_Z, tunelObra, 20); exaustor.rotation.z = Math.PI / 2;
  [-1, 1].forEach(function(s){ caixa(0.15, DUTO_Y - 0.6, 0.15, mAco, PORTAL_X - 3.2 + s * 0.8, (DUTO_Y - 0.6) / 2, DUTO_Z, tunelObra); });
  var duto = cilindro(0.42, 0.42, AVANCO + 1.4, mat(0xf2b81f, { r: 0.6 }), PORTAL_X + (AVANCO - 4.6) / 2 - 0.2, DUTO_Y, DUTO_Z, tunelObra, 16); duto.rotation.z = Math.PI / 2;
  for (var an = 0; an < AVANCO - 3; an += 1.2){ var anel = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.025, 6, 16), mAco); anel.rotation.y = Math.PI / 2; anel.position.set(PORTAL_X - 1.8 + an, DUTO_Y, DUTO_Z); tunelObra.add(anel); }
  // Iluminação provisória da frente
  var lampObra = [];
  for (var lo = 1; lo < AVANCO - 1; lo += 2.4){
    var lb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd28a, toneMapped: false }));
    lb.position.set(PORTAL_X + lo, 4.3, EIXO_Z + 3.4); tunelObra.add(lb); lampObra.push(lb);
  }
  var luzFrente = new THREE.PointLight(0xffc77a, 1.4, 16, 2); luzFrente.position.set(PORTAL_X + AVANCO - 4, 4.4, EIXO_Z); tunelObra.add(luzFrente);
  // Jumbo de perfuração de dois braços na frente
  var jumbo = new THREE.Group(); jumbo.position.set(PORTAL_X + AVANCO - 7.4, 0, EIXO_Z); tunelObra.add(jumbo);
  var chassiJ = caixaRedonda(5.6, 0.8, 2.3, 0.12, mAmarelo); chassiJ.position.set(0, 1.0, 0); jumbo.add(chassiJ);
  [[-1.9], [1.7]].forEach(function(p){ [-1, 1].forEach(function(s){ roda(jumbo, p[0], 0.62, s * 1.05, 0.62, 0.45); }); });
  var canopyJ = new THREE.Group(); canopyJ.position.set(-1.6, 1.4, 0); jumbo.add(canopyJ);
  [[-0.7, -0.9], [-0.7, 0.9], [0.7, -0.9], [0.7, 0.9]].forEach(function(p){ caixa(0.09, 1.7, 0.09, mPreto, p[0], 0.85, p[1], canopyJ); });
  caixa(1.6, 0.08, 2.0, mAmarelo, 0, 1.72, 0, canopyJ);
  var bancoJ = caixaRedonda(0.6, 0.6, 0.6, 0.1, mPreto); bancoJ.position.set(-0.1, 0.35, 0); canopyJ.add(bancoJ);
  adesivo(jumbo, 1.6, 0.5, 0.6, 1.05, 1.17);
  var bracosJ = [];
  [-0.65, 0.65].forEach(function(dz, i){
    var piv = new THREE.Group(); piv.position.set(2.6, 1.6, dz); jumbo.add(piv);
    var braco = caixa(3.0, 0.22, 0.22, mAmarelo, 1.5, 0, 0, piv);
    var vigaAv = new THREE.Group(); vigaAv.position.set(3.0, 0, 0); piv.add(vigaAv);
    caixa(2.0, 0.14, 0.18, mAco, 0.6, 0.18, 0, vigaAv);
    var haste = cilindro(0.03, 0.03, 1.6, mCromo, 0.6, 0.32, 0, vigaAv, 6); haste.rotation.z = Math.PI / 2;
    piv.rotation.z = i ? 0.42 : 0.12; piv.rotation.y = i ? -0.18 : 0.22;
    bracosJ.push({ piv: piv, haste: haste, fase: i * 1.7 });
  });
  [-1, 1].forEach(function(s){ var hl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.3), new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false })); hl.position.set(2.85, 1.25, s * 0.85); jumbo.add(hl); });
  // Túnel pronto: revestimento definitivo, passeios, iluminação e luz no fim
  var lining = casca(PORTAL_X, TUN_L, R_TUN, R_EXC + 0.3, new THREE.MeshStandardMaterial({ color: 0x8b9497, map: txConcreto, roughness: 0.75, side: THREE.DoubleSide }));
  cena.remove(lining); tunelPronto.add(lining);
  [-1, 1].forEach(function(s){ caixa(TUN_L + 2.6, 0.25, 1.0, mConcretoNovo, PORTAL_X - 1.3 + TUN_L / 2, 0.12, EIXO_Z + s * 4.2, tunelPronto); });
  var faixaLed = [];
  for (var lz = 0; lz < TUN_L; lz += 2.8) [-1, 1].forEach(function(s){
    var led = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.22), new THREE.MeshBasicMaterial({ color: 0xfff1d6, toneMapped: false }));
    led.position.set(PORTAL_X + 1 + lz, 5.7, EIXO_Z + s * 2.2); tunelPronto.add(led); faixaLed.push(led);
  });
  var fimLuz = new THREE.Mesh(new THREE.CircleGeometry(R_TUN, 40, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffe8c2, toneMapped: false }));
  fimLuz.rotation.y = -Math.PI / 2; fimLuz.position.set(TUN_FIM, Y_ARCO, EIXO_Z); tunelPronto.add(fimLuz);
  var fimBase = new THREE.Mesh(new THREE.PlaneGeometry(R_TUN * 2, Y_ARCO), fimLuz.material); fimBase.rotation.y = -Math.PI / 2; fimBase.position.set(TUN_FIM, Y_ARCO / 2, EIXO_Z); tunelPronto.add(fimBase);
  // Portal de concreto com o nome do cliente (emboque definitivo)
  (function portal(){
    var t0p = Math.asin((-0.1 - Y_ARCO) / 6.7), tI = Math.asin((-0.1 - Y_ARCO) / R_TUN), s = new THREE.Shape();
    s.moveTo(Math.cos(t0p) * 6.7, -0.1); s.absarc(0, Y_ARCO, 6.7, t0p, Math.PI - t0p, false); s.lineTo(-Math.cos(t0p) * 6.7, -0.1);
    s.lineTo(-Math.cos(tI) * R_TUN, -0.1); s.absarc(0, Y_ARCO, R_TUN, Math.PI - tI, tI, true); s.lineTo(Math.cos(t0p) * 6.7, -0.1);
    var geo = new THREE.ExtrudeGeometry(s, { depth: 2.6, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 48 });
    var m = new THREE.Mesh(geo, mConcretoNovo); m.rotation.y = Math.PI / 2; m.position.set(PORTAL_X - 2.6, 0, EIXO_Z); m.castShadow = m.receiveShadow = true; m.userData.oco = true; tunelPronto.add(m);
    var tx = textoTex(1024, 220);
    kit.aoCarregarFonte(function(){
      var c = tx.ctx; c.clearRect(0, 0, 1024, 220); c.textAlign = 'center'; c.textBaseline = 'middle';
      escrever(c, 'TÚNEL', 512, 58, 900, '600', 54, '#2a3a40'); escrever(c, MARCA, 512, 150, 980, '800', 92, '#17444C'); tx.tex.needsUpdate = true;
    });
    var placaP = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.0), new THREE.MeshBasicMaterial({ map: tx.tex, transparent: true }));
    placaP.rotation.y = -Math.PI / 2; placaP.position.set(PORTAL_X - 2.68, Y_ARCO + 5.85, EIXO_Z); tunelPronto.add(placaP);
  })();
  tunelPronto.visible = false;

  /* ═══ Escavadeira hidráulica carregando o basculante ═══ */
  var esc = new THREE.Group(); esc.position.set(ESCAV[0], 0, ESCAV[2]); cena.add(esc);
  [-1.1, 1.1].forEach(function(z){
    var est = caixaRedonda(4.0, 0.8, 0.62, 0.38, mat(0x24292c, { r: 0.85, m: 0.4 })); est.position.set(0, 0.42, z); esc.add(est);
    [-1.6, 1.6].forEach(function(x){ cilindro(0.3, 0.3, 0.66, mat(0x3a3f42, { r: 0.6, m: 0.6 }), x, 0.42, z, esc, 14).rotation.x = Math.PI / 2; });
    for (var r = -1; r <= 1; r++) cilindro(0.13, 0.13, 0.66, mat(0x3a3f42, { r: 0.6, m: 0.6 }), r * 0.9, 0.18, z, esc, 10).rotation.x = Math.PI / 2;
  });
  caixa(2.4, 0.4, 1.6, mPreto, 0, 0.62, 0, esc);
  var superior = new THREE.Group(); superior.position.y = 0.92; esc.add(superior);
  var giroBase = cilindro(1.0, 1.0, 0.18, mPreto, 0, 0, 0, superior, 24);
  var corpoEsc = caixaRedonda(2.9, 1.05, 2.3, 0.16, mAmarelo); corpoEsc.position.set(-0.45, 0.62, 0); superior.add(corpoEsc);
  var capo = caixaRedonda(1.3, 0.3, 2.2, 0.12, mAmarelo); capo.position.set(-1.1, 1.2, 0); superior.add(capo);
  cilindro(0.07, 0.07, 0.7, mPreto, -1.4, 1.6, -0.6, superior, 8);
  var cabEsc = caixaRedonda(1.15, 1.45, 0.98, 0.1, mAmarelo); cabEsc.position.set(0.5, 1.75, 0.62); superior.add(cabEsc);
  var vidroEsc = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.05), mVidro); vidroEsc.position.set(1.085, 1.82, 0.62); vidroEsc.rotation.y = Math.PI / 2; superior.add(vidroEsc);
  var vidroLat = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.9), mVidro); vidroLat.position.set(0.5, 1.85, 1.115); superior.add(vidroLat);
  adesivo(superior, 1.6, 0.5, -0.7, 0.62, 1.16);
  var contrapeso = caixaRedonda(0.8, 0.95, 2.3, 0.3, mat(0x24292c, { r: 0.7, m: 0.4 })); contrapeso.position.set(-2.0, 0.7, 0); superior.add(contrapeso);
  // Lança curva e braço em chapa, cilindros hidráulicos e caçamba com dentes
  var lanca = new THREE.Group(); lanca.position.set(0.9, 1.05, -0.25); superior.add(lanca);
  var sLanca = new THREE.Shape(); sLanca.moveTo(0, -0.2); sLanca.quadraticCurveTo(1.9, 0.95, 3.6, 0.1); sLanca.lineTo(3.6, -0.22); sLanca.quadraticCurveTo(1.9, 0.5, 0, 0.2); sLanca.lineTo(0, -0.2);
  var gL = new THREE.ExtrudeGeometry(sLanca, { depth: 0.38, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 }); gL.translate(0, 0, -0.19);
  var lancaM = new THREE.Mesh(gL, mAmarelo); lancaM.castShadow = true; lanca.add(lancaM);
  var cilL = cilindro(0.07, 0.07, 1.6, mCromo, 0.9, -0.3, 0, lanca, 8); cilL.rotation.z = 1.0;
  var braco = new THREE.Group(); braco.position.set(3.5, -0.05, 0); lanca.add(braco);
  var sBraco = new THREE.Shape(); sBraco.moveTo(-0.3, 0.25); sBraco.lineTo(2.6, 0.08); sBraco.lineTo(2.6, -0.08); sBraco.lineTo(-0.1, -0.2); sBraco.lineTo(-0.3, 0.25);
  var gB = new THREE.ExtrudeGeometry(sBraco, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2 }); gB.translate(0, 0, -0.15);
  var bracoM = new THREE.Mesh(gB, mAmarelo); bracoM.castShadow = true; braco.add(bracoM);
  var cilB = cilindro(0.06, 0.06, 1.3, mCromo, 0.4, 0.4, 0, braco, 8); cilB.rotation.z = -1.35;
  var cacamba = new THREE.Group(); cacamba.position.set(2.55, 0, 0); braco.add(cacamba);
  var sCac = new THREE.Shape(); sCac.moveTo(0, 0.15); sCac.quadraticCurveTo(0.95, 0.2, 0.9, -0.55); sCac.lineTo(0.35, -0.75); sCac.quadraticCurveTo(0.1, -0.3, 0, 0.15);
  var gC = new THREE.ExtrudeGeometry(sCac, { depth: 0.9, bevelEnabled: false }); gC.translate(0, 0, -0.45);
  var cacM = new THREE.Mesh(gC, mat(0x3a3f42, { r: 0.6, m: 0.6 })); cacM.castShadow = true; cacamba.add(cacM);
  for (var dn = -0.36; dn <= 0.37; dn += 0.18) caixa(0.16, 0.06, 0.08, mat(0x7c8386, { r: 0.4, m: 0.9 }), 0.42, -0.8, dn, cacamba).rotation.z = -0.5;
  var montesTerra = [];
  [[ESCAV[0] - 0.6, ESCAV[2] - 6, 2.2], [ESCAV[0] + 2.6, ESCAV[2] - 6.6, 1.5]].forEach(function(m){
    var geo = new THREE.ConeGeometry(m[2], m[2] * 0.75, 22, 4), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++){ var y = p.getY(i); if (y > -m[2] * 0.37){ p.setX(i, p.getX(i) * (0.9 + Math.random() * 0.22)); p.setZ(i, p.getZ(i) * (0.9 + Math.random() * 0.22)); } }
    geo.computeVertexNormals();
    var mt = new THREE.Mesh(geo, mTerra); mt.userData.contatoOk = true; mt.position.set(m[0], m[2] * 0.37, m[1]); mt.castShadow = true; mt.receiveShadow = true; cena.add(mt); montesTerra.push(mt);
  });

  /* ═══ Caminhão basculante 6x4 ═══ */
  function basculante(){
    var g = new THREE.Group(); cena.add(g);
    var mBranco = mat(0xf2f4f5, { r: 0.25, m: 0.35 });
    caixa(6.2, 0.28, 1.1, mPreto, 0, 0.82, 0, g);
    var cab = caixaRedonda(1.7, 1.9, 2.3, 0.22, mBranco); cab.position.set(2.35, 1.95, 0); g.add(cab);
    var grade = caixa(0.06, 0.8, 1.6, mat(0x1a1f22, { r: 0.4, m: 0.7 }), 3.22, 1.4, 0, g);
    caixa(0.3, 0.3, 2.4, mPreto, 3.2, 0.72, 0, g);   // para-choque
    [-0.85, 0.85].forEach(function(z){ var f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.36), new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false })); f.position.set(3.25, 1.05, z); g.add(f); });
    var pb = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.85), mVidro); pb.position.set(3.21, 2.35, 0); pb.rotation.y = Math.PI / 2; g.add(pb);
    [-1.16, 1.16].forEach(function(z, i){ var jl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), mVidro); jl.position.set(2.65, 2.35, z); jl.rotation.y = i ? 0 : Math.PI; g.add(jl); });
    adesivo(g, 1.1, 0.35, 2.15, 1.65, 1.17); adesivo(g, 1.1, 0.35, 2.15, 1.65, -1.17, Math.PI);
    cilindro(0.3, 0.3, 0.9, mCromo, 1.0, 0.95, 1.0, g, 16).rotation.z = Math.PI / 2;   // tanque
    var cac = new THREE.Group(); cac.position.set(-2.9, 1.0, 0); g.add(cac);
    var mCac = mAmarelo, CL = 4.2;
    caixa(CL, 0.1, 2.3, mCac, CL / 2, 0.05, 0, cac);
    [-1, 1].forEach(function(s){
      var lat = new THREE.Shape(); lat.moveTo(0, 0); lat.lineTo(CL, 0); lat.lineTo(CL + 0.1, 1.25); lat.lineTo(0.1, 1.15); lat.lineTo(0, 0);
      var gl = new THREE.ExtrudeGeometry(lat, { depth: 0.08, bevelEnabled: false }); var ml = new THREE.Mesh(gl, mCac); ml.position.z = s * 1.15 - (s > 0 ? 0.08 : 0); ml.castShadow = true; cac.add(ml);
      for (var nv = 0.6; nv < CL; nv += 0.8) caixa(0.08, 1.15, 0.06, mCac, nv, 0.6, s * 1.2, cac);
    });
    caixa(0.1, 1.5, 2.3, mCac, CL, 0.75, 0, cac);
    caixa(0.3, 0.12, 2.3, mCac, CL + 0.15, 1.5, 0, cac);   // proteção da cabine
    var tampa = caixa(0.1, 1.1, 2.26, mCac, 0.02, 0.58, 0, cac);
    var carga = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mTerra); carga.userData.contatoOk = true; carga.scale.set(2.0, 0.55, 1.05); carga.position.set(CL / 2, 1.0, 0); cac.add(carga);
    var rodas = [];
    [[-2.0, 0.55], [-0.75, 0.55], [2.35, 0.55]].forEach(function(r){ [-0.92, 0.92].forEach(function(z){ rodas.push(roda(g, r[0], 0.55, z, 0.55, r[0] < 0 ? 0.62 : 0.4)); }); });
    [-0.92, 0.92].forEach(function(z){ caixa(1.1, 0.06, 0.62, mPreto, 2.35, 1.16, z, g); });
    var giroflex = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffa21a, toneMapped: false }));
    giroflex.position.set(2.3, 3.0, 0); g.add(giroflex);
    return { g: g, cac: cac, rodas: rodas, giroflex: giroflex, carga: carga };
  }
  // Parado com a caçamba ao alcance da escavadeira (cabine virada para fora do giro)
  var bascParado = basculante(); bascParado.g.position.set(ESCAV[0] + 6.2, 0, ESCAV[2] - 0.6);
  var bascRe = basculante(); bascRe.g.position.set(RE[0], 0, RE[2]);

  /* ═══ Motoniveladora e rolo compactador no aterro ═══ */
  var moto = new THREE.Group(); cena.add(moto);
  var sChassi = new THREE.Shape(); sChassi.moveTo(-1.4, 0.95); sChassi.lineTo(0.6, 0.95); sChassi.quadraticCurveTo(1.6, 1.0, 2.8, 1.25); sChassi.lineTo(2.8, 1.55); sChassi.quadraticCurveTo(1.5, 1.4, 0.6, 1.3); sChassi.lineTo(-1.4, 1.3);
  var gCh = new THREE.ExtrudeGeometry(sChassi, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }); gCh.translate(0, 0, -0.275);
  var chassiM = new THREE.Mesh(gCh, mAmarelo); chassiM.castShadow = true; moto.add(chassiM);
  var motorM = caixaRedonda(1.6, 1.0, 1.9, 0.14, mAmarelo); motorM.position.set(-2.1, 1.35, 0); moto.add(motorM);
  var cabMoto = caixaRedonda(1.25, 1.55, 1.7, 0.14, mAmarelo); cabMoto.position.set(-0.95, 2.35, 0); moto.add(cabMoto);
  var vMoto = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), mVidro); vMoto.position.set(-0.31, 2.45, 0); vMoto.rotation.y = Math.PI / 2; moto.add(vMoto);
  [-0.86, 0.86].forEach(function(z, i){ var vl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.9), mVidro); vl.position.set(-0.95, 2.45, z); vl.rotation.y = i ? 0 : Math.PI; moto.add(vl); });
  adesivo(moto, 1.2, 0.38, -2.1, 1.4, 0.97);
  var sLam = new THREE.Shape(); sLam.moveTo(0, 0); sLam.quadraticCurveTo(-0.28, 0.25, -0.05, 0.55); sLam.lineTo(0.04, 0.55); sLam.quadraticCurveTo(-0.18, 0.25, 0.06, 0); sLam.lineTo(0, 0);
  var gLam = new THREE.ExtrudeGeometry(sLam, { depth: 3.0, bevelEnabled: false }); gLam.translate(0, 0, -1.5);
  var lamina = new THREE.Mesh(gLam, mat(0x3a3f42, { r: 0.5, m: 0.7 })); lamina.position.set(0.7, 0.12, 0); lamina.rotation.y = 0.38; lamina.castShadow = true; moto.add(lamina);
  barra(V(0.5, 0.7, 0), V(2.4, 1.2, 0), 0.07, mPreto, moto); barra(V(0.6, 0.65, 0.9), V(0.6, 1.0, 0.2), 0.04, mCromo, moto); barra(V(0.6, 0.65, -0.9), V(0.6, 1.0, -0.2), 0.04, mCromo, moto);
  [[-2.4, -1.0], [-2.4, 1.0], [-1.25, -1.0], [-1.25, 1.0], [2.65, -0.95], [2.65, 0.95]].forEach(function(r){ roda(moto, r[0], 0.6, r[1], 0.6, 0.42); });
  var rolo = new THREE.Group(); cena.add(rolo);
  var tamborRolo = new THREE.Group(); tamborRolo.position.set(1.35, 0.8, 0); rolo.add(tamborRolo);
  var tamborM = cilindro(0.8, 0.8, 2.1, mat(0x3a3f42, { r: 0.45, m: 0.75 }), 0, 0, 0, tamborRolo, 32); tamborM.rotation.x = Math.PI / 2;
  [-1.12, 1.12].forEach(function(z){ caixa(1.9, 1.1, 0.12, mAmarelo, 1.35, 1.05, z, rolo); });
  caixa(0.5, 0.5, 2.36, mAmarelo, 0.5, 1.4, 0, rolo);
  var corpoRolo = caixaRedonda(2.3, 1.15, 1.75, 0.2, mAmarelo); corpoRolo.position.set(-0.75, 1.32, 0); rolo.add(corpoRolo);
  var tetoRolo = caixaRedonda(1.6, 0.1, 1.6, 0.04, mAmarelo); tetoRolo.position.set(-0.7, 2.75, 0); rolo.add(tetoRolo);
  [[-0.05, -0.72], [-1.35, -0.72], [-0.05, 0.72], [-1.35, 0.72]].forEach(function(p){ cilindro(0.045, 0.045, 0.85, mPreto, p[0], 2.3, p[1], rolo, 8); });
  var bancoR = caixaRedonda(0.5, 0.5, 0.5, 0.08, mPreto); bancoR.position.set(-0.7, 2.1, 0); rolo.add(bancoR);
  adesivo(rolo, 1.4, 0.44, -0.75, 1.3, 0.89);
  [-0.85, 0.85].forEach(function(z){ roda(rolo, -1.25, 0.62, z, 0.62, 0.5); });

  /* ═══ Vala de drenagem com escoramento ═══ */
  var vala = new THREE.Group(); vala.position.set(VALA[0], 0, VALA[2]); cena.add(vala);
  var fundoVala = new THREE.Mesh(new THREE.PlaneGeometry(11, 1.5), mat(0x241b14, { r: 1 })); fundoVala.rotation.x = -Math.PI / 2; fundoVala.position.y = 0.04; vala.add(fundoVala);
  [-1, 1].forEach(function(lado){
    caixa(11, 1, 0.3, mat(0x4a3a2a, { r: 1 }), 0, 0.5, lado * 0.9, vala);
    var monte = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 10.4, 20), mTerra);
    monte.rotation.z = Math.PI / 2; monte.position.set(0, 0, lado * 2.05);
    monte.castShadow = true; monte.receiveShadow = true; vala.add(monte);
  });
  var escoras = new THREE.Group(); vala.add(escoras);
  for (var e = 0; e < 6; e++){
    var x = -4.5 + e * 1.8;
    [-0.68, 0.68].forEach(function(z){ caixa(1.5, 1.05, 0.07, mat(0x8a6a3d, { r: 0.9 }), x, 0.55, z, escoras); });
    [0.35, 0.8].forEach(function(y){ var estronca = cilindro(0.055, 0.055, 1.3, mAmarelo, x, y, 0, escoras, 8); estronca.rotation.x = Math.PI / 2; });
  }
  for (var tb = 0; tb < 5; tb++){
    var tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.3, 22, 1, true), new THREE.MeshStandardMaterial({ color: 0x8d979a, roughness: 0.85, side: THREE.DoubleSide }));
    tubo.rotation.x = Math.PI / 2; tubo.position.set(VALA[0] - 4 + tb * 1.7, 0.36, VALA[2] - 3.3); tubo.castShadow = true; tubo.receiveShadow = true; cena.add(tubo);
    var ponta = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.04, 6, 22), mat(0x8d979a, { r: 0.85 })); ponta.position.set(tubo.position.x, 0.36, VALA[2] - 3.3 + 0.65); cena.add(ponta);
  }

  /* ═══ Desvio de trânsito, ponte provisória, cones e sinaleiro ═══ */
  var XS_DESV = []; for (xp = -18; xp <= 64; xp += 0.5) XS_DESV.push(xp);
  var ptsDesv = XS_DESV.map(function(x){ return V(x, yDesvio(x), zDesvio(x)); });
  // Tudo que é provisório do desvio vai para um grupo: sai de cena quando o trecho é liberado
  var provisorio = new THREE.Group(); cena.add(provisorio);
  function prov(m){ cena.remove(m); provisorio.add(m); return m; }
  // Pista do desvio em dois trechos, deixando o tabuleiro metálico da ponte provisória à vista
  var desvA = ptsDesv.filter(function(p){ return p.x <= BAILEY[0]; }), desvB = ptsDesv.filter(function(p){ return p.x >= BAILEY[1]; });
  [desvA, desvB].forEach(function(tr){
    prov(fita(tr, 4.6, mPista)).userData.terreno = true;
    [-1, 1].forEach(function(o){ prov(fita(tr, 0.1, mPinturaB, o * 2.1)); });
    for (var tc = 0; tc < tr.length - 4; tc += 6) prov(fita(tr.slice(tc, tc + 3), 0.1, mPintura));   // eixo tracejado
  });
  [[BAILEY[0] - 4.5, BAILEY[0]], [BAILEY[1], BAILEY[1] + 4.5]].forEach(function(t){
    var a = aterro(t[0], t[1], function(){ return Z_DESV; }, function(x){ return yDesvio(x) - 0.05; }, 2.4, 0.8, mTerra, mTerraClara);
    prov(a.lado); prov(a.topo);
  });
  // Ponte provisória tipo Bailey: painéis treliçados laterais e tabuleiro em chapa
  (function bailey(){
    var gB = new THREE.Group(), mB = mat(0x5b6b4e, { r: 0.55, m: 0.6 }), L = BAILEY[1] - BAILEY[0], yT = Y_BAILEY + 0.06;
    var chapa = caixa(L + 0.4, 0.12, 4.6, mat(0x4a5052, { r: 0.6, m: 0.8 }), (BAILEY[0] + BAILEY[1]) / 2, yT - 0.06, Z_DESV, provisorio);
    chapa.userData.terreno = true;
    for (var x = BAILEY[0]; x <= BAILEY[1] + 0.01; x += 1.0) caixa(0.12, 0.25, 4.6, mB, x, yT - 0.24, Z_DESV, gB);
    [-1, 1].forEach(function(s){
      var z = Z_DESV + s * 2.4, nP = Math.round(L / 2.5), pl = L / nP;
      barra(V(BAILEY[0], yT, z), V(BAILEY[1], yT, z), 0.07, mB, gB); barra(V(BAILEY[0], yT + 1.45, z), V(BAILEY[1], yT + 1.45, z), 0.07, mB, gB);
      for (var p = 0; p <= nP; p++){
        var px = BAILEY[0] + p * pl; barra(V(px, yT, z), V(px, yT + 1.45, z), 0.05, mB, gB);
        if (p < nP){ barra(V(px, yT, z), V(px + pl / 2, yT + 1.45, z), 0.04, mB, gB); barra(V(px + pl, yT, z), V(px + pl / 2, yT + 1.45, z), 0.04, mB, gB); }
      }
    });
    provisorio.add(gB); kit.fundir(gB); gB.traverse(function(o){ o.userData.oco = true; });
    // Vigas de apoio (berços) sob as cabeceiras do tabuleiro metálico
    [BAILEY[0], BAILEY[1]].forEach(function(x){ caixa(1.0, Y_BAILEY - 0.3, 5.6, mConcreto, x, (Y_BAILEY - 0.3) / 2, Z_DESV, provisorio); });
  })();
  var cones = [];
  var GEO_CONE = new THREE.ConeGeometry(0.2, 0.66, 18), GEO_BASE = new THREE.BoxGeometry(0.42, 0.04, 0.42), GEO_FX = new THREE.CylinderGeometry(0.125, 0.15, 0.09, 18);
  var mCone = mat(0xff6a1a, { r: 0.5, e: 0x5a1e00, ei: 0.3 }), mConeBase = mat(0x1c1c1c, { r: 0.9 }), mRefl = mat(0xffffff, { r: 0.2, m: 0.4, e: 0xffffff, ei: 0.35 });
  function cone(x, z){
    var g = new THREE.Group(); g.position.set(x, 0, z); cena.add(g);
    var b = new THREE.Mesh(GEO_BASE, mConeBase); b.position.y = 0.02; g.add(b);
    var c = new THREE.Mesh(GEO_CONE, mCone); c.position.y = 0.37; c.castShadow = true; g.add(c);
    var r = new THREE.Mesh(GEO_FX, mRefl); r.position.y = 0.44; g.add(r);
    cones.push(g); return g;
  }
  for (var cn = 0; cn < 15; cn++) cone(-1 + cn * 1.8, EIXO_Z + 6.4);
  // Taper de entrada: cones acompanhando a borda interna do desvio, 0,7 m fora da faixa
  for (var ct = 0; ct < 9; ct++){
    var cx = -15 + ct * 1.6, d = 0.05, tz = (zDesvio(cx + d) - zDesvio(cx - d)) / (2 * d), l = Math.sqrt(1 + tz * tz);
    var afast = (1.6 - 0.5 * suave((cx + 16) / 14)) + 1.75;   // 0,9 m além da borda da faixa interna, medido na normal
    cone(cx + afast * tz / l, zDesvio(cx) - afast / l);
  }
  var placaPS = new THREE.Group(); placaPS.position.set(SINAL[0] + 0.45, 0, SINAL[2]); cena.add(placaPS);
  cilindro(0.03, 0.03, 1.6, mat(0x24292c), 0, 0.8, 0, placaPS, 6);
  placaPS.userData.contatoOk = true;
  var discoPare = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 8), mat(0xd9342b, { r: 0.4, e: 0x5a0d0a, ei: 0.4 })); discoPare.rotation.x = Math.PI / 2; discoPare.position.set(0, 1.7, 0.03); placaPS.add(discoPare);

  /* ═══ Trânsito: cada carro percorre um traçado (x → cota, faixa) sem atravessar nada ═══ */
  function pistaFaixa(sentido){
    return { x0: -58, x1: TUN_FIM - 6, ponto: function(x){ return [perfil(x), EIXO_Z + sentido * 1.6]; } };
  }
  function desvioFaixa(sentido){
    return { x0: -58, x1: 63, ponto: function(x){
      var zc = zDesvio(x), d = 0.04, tz = (zDesvio(x + d) - zDesvio(x - d)) / (2 * d), l = Math.sqrt(1 + tz * tz);
      var off = sentido * (1.6 - 0.5 * suave((x + 16) / 14));
      return [x < -2 ? 0.05 : yDesvio(x), zc + off / l, -off * tz / l];   // [y, z, deslocamento em x pela normal]
    } };
  }
  var carros = [];
  var CORES = [0xb83a32, 0xdfe6e8, 0x2e6fa8, 0x30363a, 0xe3a21a, 0x5a6e74, 0x8a1f2a, 0xc9ced0];
  CORES.forEach(function(cor, i){
    var g = kit.carro(cor); cena.add(g);
    var sentido = i % 2 ? -1 : 1;
    g.userData.sentido = sentido; g.userData.v = sentido > 0 ? 6.2 : 5.6;
    g.userData.u = (Math.floor(i / 2) / 4 + (sentido > 0 ? 0 : 0.12)) % 1;   // fração do traçado, espaçamento uniforme por faixa
    carros.push(g);
  });
  var faixaAtual = 'desvio';
  function posCarro(c, dt){
    var f = faixaAtual === 'pista' ? pistaFaixa(c.userData.sentido) : desvioFaixa(c.userData.sentido);
    var L = f.x1 - f.x0, s = c.userData.sentido;
    c.userData.u = (c.userData.u + (c.userData.v * dt) / L + 1) % 1;
    var x = s > 0 ? f.x0 + c.userData.u * L : f.x1 - c.userData.u * L;
    var p = f.ponto(x), p2 = f.ponto(x + s * 0.6);
    var px = x + (p[2] || 0), px2 = x + s * 0.6 + (p2[2] || 0);
    c.position.set(px, p[0], p[1]);
    var vx = px2 - px, vz = p2[1] - p[1], vy = p2[0] - p[0], hz = Math.sqrt(vx * vx + vz * vz);
    c.rotation.order = 'YZX'; c.rotation.set(0, Math.atan2(-vz, vx), Math.atan2(vy, hz));
    // Entra e sai de cena suavemente nas pontas do traçado (névoa ao longe, escuro do túnel)
    var bordas = Math.min(x - f.x0, f.x1 - x);
    c.userData.opacidade(Math.max(0, Math.min(1, bordas / 6)));
  }

  /* ═══ Base da obra: contêineres e placa de obra com o nome do cliente ═══ */
  ['ESCRITÓRIO DA OBRA', 'VESTIÁRIO', 'REFEITÓRIO'].forEach(function(nome, i){
    var ct = new THREE.Group(); ct.position.set(BASE[0] - 3 + i * 3.4, 0, BASE[2] - 3); cena.add(ct);
    var corC = i ? 0x30747F : 0xf2f4f5;
    var corpo = caixaRedonda(3.1, 2.5, 2.4, 0.06, mat(corC, { r: 0.5, m: 0.3 })); corpo.position.y = 1.3; ct.add(corpo);
    for (var nv = -1.2; nv <= 1.21; nv += 0.3) caixa(0.04, 2.3, 0.02, mat(corC, { r: 0.6, m: 0.3 }), nv, 1.3, 1.215, ct);   // chapa corrugada
    caixa(0.9, 2.0, 0.04, mat(0x2a3033, { r: 0.6, m: 0.5 }), -0.9, 1.05, 1.23, ct);
    var jan = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), mVidro); jan.position.set(0.6, 1.5, 1.25); ct.add(jan);
    caixa(0.6, 0.4, 0.3, mat(0xe8ecee, { r: 0.4 }), 0.6, 2.05, 1.36, ct);   // ar-condicionado
    caixa(1.2, 0.18, 0.9, mat(0x5a6266, { r: 0.8, m: 0.4 }), -0.9, 0.09, 1.7, ct);   // degrau
    var lt = textoTex(512, 96);
    kit.aoCarregarFonte(function(){ var c = lt.ctx; c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, nome, 256, 50, 480, '800', 48, i ? '#F0D2A4' : '#17444C'); lt.tex.needsUpdate = true; });
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true, toneMapped: false })); rot.position.set(0, 2.32, 1.27); ct.add(rot);
  });
  kit.halo(0x30747F, 18, BASE[0], BASE[2], 0.12);
  var placaTx = textoTex(1024, 512);
  var placa = new THREE.Group(); placa.position.set(PLACA[0], 0, PLACA[2]); cena.add(placa);
  [-3.4, 3.4].forEach(function(x){
    cilindro(0.12, 0.12, 8.3, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), x, 4.15, -0.1, placa, 14);
    caixa(0.7, 0.3, 0.7, mConcreto, x, 0.15, -0.1, placa);
  });
  [4.6, 7.8].forEach(function(y){ caixa(7.6, 0.1, 0.1, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 0, y, -0.18, placa); });
  caixa(8, 4.1, 0.16, mat(0x0a1216, { r: 0.4 }), 0, 6.2, -0.03, placa);
  var telaPlaca = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 3.85), new THREE.MeshBasicMaterial({ map: placaTx.tex, toneMapped: false }));
  telaPlaca.position.set(0, 6.2, 0.06); placa.add(telaPlaca);
  function desenharPlaca(rotulo, valor, cor, rodape){
    var c = placaTx.ctx;
    c.fillStyle = '#071014'; c.fillRect(0, 0, 1024, 512);
    c.fillStyle = '#17444C'; c.fillRect(0, 0, 1024, 150);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 512, 62, 940, '800', 72, '#FFFFFF');
    escrever(c, 'Obra viária · KM 0 ao KM 12', 512, 120, 900, '600', 30, '#A8D8DB');
    escrever(c, rotulo, 512, 210, 900, '700', 38, 'rgba(255,255,255,.62)');
    escrever(c, valor, 512, 320, 960, '800', 130, cor);
    escrever(c, rodape, 512, 440, 900, '600', 32, 'rgba(255,255,255,.55)');
    c.strokeStyle = cor; c.lineWidth = 8; c.strokeRect(6, 6, 1012, 500);
    placaTx.tex.needsUpdate = true;
  }
  var placaEstado = { perdidos: 1 }, modoAtual = 'neutro';
  function atualizarPlaca(){
    if (modoAtual === 'verde') desenharPlaca('TRECHO KM 0 AO KM 12', 'LIBERADO', '#5EE0A6', 'ponte e túnel entregues no prazo');
    else if (modoAtual === 'acidente') desenharPlaca('FRENTE DE ESCAVAÇÃO', 'PARADA', '#FF6B5E', 'investigação e adequação em andamento');
    else if (modoAtual === 'prazo' && placaEstado.perdidos > 0) desenharPlaca('MEDIÇÃO DO MÊS', '−' + placaEstado.perdidos + ' DIAS', '#FF6B5E', 'de frente parada fora da medição');
    else desenharPlaca('FECHAMENTO DA MEDIÇÃO EM', 'D-30', '#F0D2A4', 'cinco frentes em andamento');
  }
  kit.aoCarregarFonte(atualizarPlaca);

  /* ═══ Pessoas ═══ */
  function emCota(p, y){ p.position.y = y; p.userData.base.y = y; return p; }
  var naBase = [];
  for (var nb = 0; nb < 4; nb++) naBase.push(pessoa(BASE[0] - 3 + nb * 1.2, BASE[2] + 0.4, COR.colete));
  var atrasDoCaminhao = pessoa(RE[0] - 5.4, RE[2] + 0.6, COR.colete);
  var naVala = pessoa(VALA[0] + 1, VALA[2], COR.colete);
  var naVala2 = pessoa(VALA[0] - 2, VALA[2] + 0.1, COR.colete);
  var sinaleiro = pessoa(SINAL[0], SINAL[2], COR.colete); sinaleiro.rotation.y = 0;
  var naPonte = emCota(pessoa(ENC_O + 2.2, EIXO_Z - 2.4, COR.colete), Y_LAJE_TOPO);
  var naPonte2 = emCota(pessoa(VAOS[1][0] - 0.8, EIXO_Z + 1.2, COR.terc), Y_LAJE_TOPO);
  var noTunel = pessoa(PORTAL_X + AVANCO - 5, EIXO_Z + 3.1, COR.colete);
  var noEmboque = pessoa(PORTAL_X - 4.6, EIXO_Z + 3.4, COR.terc);
  var topografo = emCota(pessoa(27, EIXO_Z - 3.9, COR.terc), perfil(27) - 0.12);
  var viajante = pessoa(BASE[0] + 2, BASE[2] + 3.4, COR.colete);

  /* ── Estado próprio do cenário ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, tempo = 0, escoradoAlvo = 0, escorado = 0;
  var XP_OBRA = 10;   // até onde o asfalto chega com a obra em 55 %
  function xPavimento(o){ return o <= 0.55 ? INI_OBRA + (o / 0.55) * (XP_OBRA - INI_OBRA) : XP_OBRA + (o - 0.55) / 0.45 * (TUN_FIM - XP_OBRA); }
  function noPerfil(obj, x, z, eixoT, eixoD){
    // Máquina sobre o aterro: as rodas traseiras e dianteiras tocam o perfil; a origem fica na cota sob o centro
    var yT = perfil(x + eixoT) - 0.06, yD = perfil(x + eixoD) - 0.06, inc = Math.atan2(yD - yT, eixoD - eixoT);
    obj.position.set(x, yT + (yD - yT) * (0 - eixoT) / (eixoD - eixoT), z); obj.rotation.set(0, 0, inc);
  }

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      var c = kit.R.clinica.pos;
      return modo === 'virada' || modo === 'clinica' ? [c[0], c[2] + 7.6] : modo === 'verde' ? [18, -0.6] : [BASE[0] + 2, BASE[2] + 3.4];
    },
    modosRisco: ['frentes', 'maquina', 'vala', 'transito', 'acidente', 'prazo'],
    alertas: {
      frentes:  [naPonte.position.x, Y_LAJE_TOPO + 4.4, naPonte.position.z, Y_LAJE_TOPO + 0.08],
      maquina:  [RE[0] - 5.4, 4.2, RE[2] + 0.6, 0.08],
      vala:     [VALA[0] + 1, 4.4, VALA[2], 0.1],
      transito: [SINAL[0], 4.2, SINAL[2], 0.08],
      acidente: [VALA[0] + 1, 4.4, VALA[2], 0.1]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([V(BASE[0] + 2, 0.3, BASE[2] + 3.4), V(-15, 0.3, 2.6), V(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([V(-9, 0.3, 1.6), V(4, 0.3, 0.6), V(18, 0.3, -0.6)])
    },
    fogos: [PONTE_X + 6, EIXO_Z],
    auditoria: function(){
      cacamba.userData.semApoio = true; vigaIcada.userData.semApoio = true;
      [lanca, braco].forEach(function(g){ g.children.forEach(function(c){ if (c !== braco && c !== cacamba) c.userData.mesmaMaquina = true; }); });
      return { moveis: carros.concat([bascRe.g, moto, rolo, cacamba, vigaIcada]), pessoas: naBase.concat([atrasDoCaminhao, naVala, naVala2, sinaleiro, naPonte, naPonte2, noTunel, noEmboque, topografo, viajante]) };
    },

    aplicarModo: function(modo, c){
      modoAtual = modo;
      obraAlvo = c ? c.obra : 0.55;
      luzesAlvo = modo === 'verde' ? 1 : 0;
      escoradoAlvo = (modo === 'vala' || modo === 'acidente') ? 0 : (modo === 'verde' || modo === 'clinica') ? 1 : 0.5;
      var soterrado = modo === 'acidente';
      naVala.rotation.z = soterrado ? 1.35 : 0;
      naVala.position.y = soterrado ? 0.25 : 0;
      atrasDoCaminhao.visible = modo !== 'verde';
      postes.forEach(function(p){ if (p.novo) p.g.visible = modo === 'verde'; });
      // Trecho liberado: máquinas, sinalização de obra e equipes saem de cena; o trânsito volta para a pista nova
      var emObra = modo !== 'verde';
      [esc, bascParado.g, bascRe.g, moto, rolo, placaPS, sinaleiro, topografo, guind, caboI, moitao, estropos[0], estropos[1], naPonte, naPonte2, noTunel, noEmboque].forEach(function(o){ o.visible = emObra; });
      montesTerra.forEach(function(m){ m.visible = emObra; });
      cones.forEach(function(c){ c.visible = emObra; });
      naVala.visible = naVala2.visible = emObra;
      tunelObra.visible = emObra; tunelPronto.visible = !emObra;
      gcProv.visible = emObra; defensas.visible = !emObra;
      faixaAtual = emObra ? 'desvio' : 'pista';
      provisorio.visible = emObra;
      atualizarPlaca();
    },

    placar: function(n){ placaEstado.perdidos = n; atualizarPlaca(); },

    quadro: function(dt, k, relogio, modo){
      tempo += dt;
      obra += (obraAlvo - obra) * k * 0.6;
      var pronta = obraAlvo >= 1;
      revelarPavimento(xPavimento(obra));
      // Etapas da ponte: vão 1 concretado, vão 2 em forma e armação, vão 3 recebendo vigas
      var o = pronta ? Math.max(obra, 0.56) : obra;
      lajes[0].visible = true;
      lajes[1].visible = o > 0.75; forma.visible = !lajes[1].visible;
      vigaFalta.visible = o > 0.82; lajes[2].visible = o > 0.88;
      barreiras.visible = o > 0.93; gcProv.visible = !barreiras.visible && modo !== 'verde';
      faixasNovas.visible = pronta && obra > 0.97;

      // Viga sendo posicionada pelo guindaste: desce devagar até os aparelhos de apoio e ajusta
      var icando = !pronta && o < 0.82;
      var sobe = icando ? 0.25 + 1.25 * (0.5 + 0.5 * Math.cos(tempo * 0.35)) : 0;
      vigaIcada.position.y = Y_VIGA_BASE + sobe;
      if (guind.visible){
        guind.updateMatrixWorld(true); pontaMundo.set(PONTA.x, PONTA.y - 0.35, 0).applyMatrix4(casa.matrixWorld);
        var topoViga = V(centroViga.x, vigaIcada.position.y + H_VIGA, centroViga.z);
        var gancho = V(centroViga.x, topoViga.y + 1.7, centroViga.z);
        pontaMundo.x = centroViga.x; pontaMundo.z = centroViga.z;   // lança alinhada ao centro da viga
        esticar(caboI, pontaMundo, V(gancho.x, gancho.y + 0.35, gancho.z));
        moitao.position.copy(gancho);
        esticar(estropos[0], V(gancho.x, gancho.y - 0.3, gancho.z), V(VAOS[2][0] + 0.7, topoViga.y, centroViga.z));
        esticar(estropos[1], V(gancho.x, gancho.y - 0.3, gancho.z), V(VAOS[2][1] - 0.7, topoViga.y, centroViga.z));
      }

      // Escavadeira: cava na pilha (−z), gira até a caçamba do basculante (+x) e descarrega
      var ciclo = (tempo * 0.16) % 1, g = ciclo < 0.45 ? 0 : ciclo < 0.58 ? (ciclo - 0.45) / 0.13 : ciclo < 0.8 ? 1 : 1 - (ciclo - 0.8) / 0.2;
      superior.rotation.y = Math.PI / 2 * (1 - suave(g));
      var cav = ciclo < 0.45 ? Math.sin(ciclo / 0.45 * Math.PI) : 0;
      var ergue = ciclo < 0.4 ? 0 : ciclo < 0.47 ? (ciclo - 0.4) / 0.07 : ciclo < 0.82 ? 1 : ciclo < 0.9 ? 1 - (ciclo - 0.82) / 0.08 : 0;
      ergue = suave(ergue);   // a lança sobe antes de girar e só desce depois de voltar à pilha
      lanca.rotation.z = 0.32 - cav * 0.5 + ergue * 0.55;
      braco.rotation.z = -1.25 + cav * 0.7 + ergue * 0.45;
      cacamba.rotation.z = ciclo > 0.6 && ciclo < 0.8 ? 1.3 * Math.sin((ciclo - 0.6) / 0.2 * Math.PI) - 0.4 : -0.4 - 0.5 * cav;

      // Caminhão de ré na direção de quem está no ponto cego
      var vai = Math.sin(tempo * 0.35) * 0.5 + 0.5, xAnt = bascRe.g.position.x;
      bascRe.g.position.x = RE[0] - vai * 1.35;   // traseira chega a ~0,6 m de quem está no ponto cego
      var dx = bascRe.g.position.x - xAnt;
      bascRe.rodas.forEach(function(r){ r.rotation.z -= dx / 0.55; });
      var pisca = (Math.sin(tempo * 9) > 0) ? 1 : 0.15;
      bascRe.giroflex.material.color.setRGB(1, 0.63 * pisca + 0.1, 0.1 * pisca);
      bascParado.giroflex.material.color.setRGB(1, 0.63 * (1 - pisca) + 0.1, 0.1);

      // Motoniveladora e rolo indo e voltando sobre o aterro, seguindo a cota e a rampa
      noPerfil(moto, 19.5 + Math.sin(tempo * 0.12) * 5, EIXO_Z - 1.6, -1.85, 2.65);   // lâmina para antes da cortina do encontro
      noPerfil(rolo, 17 + Math.sin(tempo * 0.12 + 1.2) * 6, EIXO_Z + 1.8, -1.25, 1.35);
      tamborRolo.rotation.z -= dt * 0.9 * Math.cos(tempo * 0.12 + 1.2);

      // Jumbo perfurando a frente do túnel
      bracosJ.forEach(function(b){ b.haste.position.x = 0.6 + 0.35 * Math.sin(tempo * 1.6 + b.fase); });
      lampObra.forEach(function(l, i){ l.material.color.setHSL(0.1, 0.9, 0.62 + 0.06 * Math.sin(tempo * 3 + i)); });

      escorado += (escoradoAlvo - escorado) * k;
      escoras.visible = escorado > 0.5;

      carros.forEach(function(c){ posCarro(c, dt); });
      discoPare.material.color.setHex(Math.sin(tempo * 0.4) > 0 ? 0xd9342b : 0x2fa866);
      discoPare.material.emissive.setHex(Math.sin(tempo * 0.4) > 0 ? 0x5a0d0a : 0x0d4a26);

      luzes += (luzesAlvo - luzes) * k * 0.6;
      postes.forEach(function(p){ p.lamp.material.opacity = 0.25 + luzes * 0.75; p.cone.material.opacity = luzes * 0.035; });
    }
  };
};
/* ── FIM BLOCO ── */
