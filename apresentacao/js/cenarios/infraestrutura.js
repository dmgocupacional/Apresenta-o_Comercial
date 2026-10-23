/* Cenário: infraestrutura e terraplenagem — estrada em obra com trecho pavimentado e subleito,
   escavadeira carregando basculante, caminhão de ré, vala com e sem escoramento, motoniveladora e rolo,
   desvio de trânsito com sinaleiro, ponte em construção sobre o rio e base com placa de obra do cliente. */

/* ═══ BLOCO: CENARIO_INFRAESTRUTURA ═══ */
CENARIOS.infraestrutura = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa, HALO = kit.HALO;
  var MARCA = EMPRESA.nome.toUpperCase();
  var EIXO_Z = 6, INI_OBRA = -2, FIM_OBRA = 44;    // estrada: pavimentada até INI_OBRA, em obra depois
  var BASE = [-24, 0, -1], PLACA = [-15, 0, 1.6];
  var ESCAV = [15, 0, -3.5], RE = [5, 0, 4.6], VALA = [3, 0, -9], SINAL = [-1.5, 0, 10.4], PONTE_X = 36;
  var mTerra = mat(0x5a4632, { r: 1 }), mTerraClara = mat(0x7a5f42, { r: 1 }), mAsfalto = mat(0x1c2529, { r: 0.92 });
  var mAmarelo = mat(0xe3a21a, { r: 0.42, m: 0.2 }), mCromo = mat(0xdfe6e8, { r: 0.12, m: 1 });
  var mVidro = new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.6, roughness: 0.05, clearcoat: 1 });

  function escrever(c, txt, x, y, larguraMax, peso, tam, cor){
    c.fillStyle = cor; c.font = peso + ' ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > larguraMax && tam > 18){ tam -= 2; c.font = peso + ' ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, x, y);
  }
  function plano(w, d, m, x, y, z){
    var p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); p.receiveShadow = true; cena.add(p); return p;
  }
  function roda(pai, x, y, z, r, larg){
    var g = new THREE.Group(); g.position.set(x, y, z); pai.add(g);
    var pneu = new THREE.Mesh(new THREE.TorusGeometry(r * 0.72, r * 0.3, 12, 26), mat(0x121416, { r: 0.95 })); g.add(pneu);
    var aro = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.5, r * 0.5, larg || 0.14, 18), mAmarelo); aro.rotation.x = Math.PI / 2; g.add(aro);
    g.traverse(function(o){ if (o.isMesh) o.castShadow = true; }); return g;
  }
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

  /* ── Estrada: trecho pronto, subleito e pavimento que avança com a obra ── */
  plano(60, 7, mAsfalto, INI_OBRA - 30, 0.025, EIXO_Z);   // trecho já entregue
  for (var f = 0; f < 18; f++){ var fx = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.14), basico(0xF0D2A4, 0.55)); fx.rotation.x = -Math.PI / 2; fx.position.set(INI_OBRA - 58 + f * 3.2, 0.03, EIXO_Z); cena.add(fx); }
  [EIXO_Z - 3.2, EIXO_Z + 3.2].forEach(function(z){ var b = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.12), basico(0xffffff, 0.45)); b.rotation.x = -Math.PI / 2; b.position.set(INI_OBRA - 30, 0.03, z); cena.add(b); });
  var subleito = plano(FIM_OBRA - INI_OBRA, 7.5, mTerraClara, (INI_OBRA + FIM_OBRA) / 2, 0.02, EIXO_Z);
  // Pavimento novo cresce a partir do início da obra
  var paveGeo = new THREE.PlaneGeometry(1, 7); paveGeo.translate(0.5, 0, 0);
  var pavimento = new THREE.Mesh(paveGeo, mat(0x161e22, { r: 0.85 })); pavimento.rotation.x = -Math.PI / 2;
  // Acima do subleito com folga, para não sumir na distância
  pavimento.position.set(INI_OBRA, 0.07, EIXO_Z); pavimento.receiveShadow = true; cena.add(pavimento);
  // Sinalização horizontal da pista nova, pintada na entrega
  var faixasNovas = new THREE.Group(); cena.add(faixasNovas);
  for (var fn = 0; fn < 11; fn++){
    var fz = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.14), basico(0xF0D2A4, 0.6)); fz.rotation.x = -Math.PI / 2; fz.position.set(INI_OBRA + 1.5 + fn * 3.2, 0.08, EIXO_Z); faixasNovas.add(fz);
  }
  [EIXO_Z - 3.2, EIXO_Z + 3.2].forEach(function(z){ var b = new THREE.Mesh(new THREE.PlaneGeometry(PONTE_X - 4 - INI_OBRA, 0.12), basico(0xffffff, 0.5)); b.rotation.x = -Math.PI / 2; b.position.set((INI_OBRA + PONTE_X - 4) / 2, 0.08, z); faixasNovas.add(b); });
  faixasNovas.visible = false;
  // Taludes de terra ao lado do subleito
  [EIXO_Z - 4.6, EIXO_Z + 4.6].forEach(function(z, i){
    var t = caixa(FIM_OBRA - INI_OBRA, 0.7, 1.6, mTerra, (INI_OBRA + FIM_OBRA) / 2, 0.2, z); t.rotation.x = i ? 0.35 : -0.35;
  });
  // Marcos de quilômetro
  var kmTx = [];
  [[-20, 'KM 0'], [10, 'KM 6'], [30, 'KM 11']].forEach(function(k){
    var g = new THREE.Group(); g.position.set(k[0], 0, EIXO_Z - 4.2); cena.add(g);
    cilindro(0.06, 0.06, 1.6, mat(0xdfe6e8, { r: 0.4, m: 0.6 }), 0, 0.8, 0, g);
    var tx = textoTex(256, 128); kmTx.push(tx);
    kit.aoCarregarFonte(function(){ var c = tx.ctx; c.fillStyle = '#1f6b3f'; c.fillRect(0, 0, 256, 128); c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(6, 6, 244, 116); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, k[1], 128, 66, 230, '800', 60, '#ffffff'); tx.tex.needsUpdate = true; });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: tx.tex })); m.position.set(0, 1.7, 0.05); g.add(m);
  });
  // Postes de iluminação no trecho pronto (acendem na entrega)
  var postes = [];
  for (var pi = 0; pi < 8; pi++){
    var px = -38 + pi * 10;   // os do trecho novo só aparecem na entrega
    var pg = new THREE.Group(); pg.position.set(px, 0, EIXO_Z - 4.6); pg.rotation.y = Math.PI; cena.add(pg);   // lado oposto ao desvio
    cilindro(0.08, 0.12, 6, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 0, 3, 0, pg);
    caixa(1.4, 0.08, 0.08, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), 0, 6, -0.6, pg).rotation.y = Math.PI / 2;
    var lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0.25, toneMapped: false }));
    lamp.position.set(0, 5.9, -1.2); pg.add(lamp);
    var cone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cone.position.set(0, 3.1, -1.2); pg.add(cone);
    postes.push({ g: pg, lamp: lamp, cone: cone, x: px, novo: px > INI_OBRA });
  }

  /* ── Rio e ponte (obra de arte) ── */
  var rio = plano(7, 80, new THREE.MeshPhysicalMaterial({ color: 0x1d5866, roughness: 0.15, metalness: 0.2, clearcoat: 1, transparent: true, opacity: 0.92 }), PONTE_X, 0.035, 0);
  var mConcreto = mat(0xa6b0b3, { r: 0.85 });
  [PONTE_X - 2.2, PONTE_X + 2.2].forEach(function(x){
    caixa(1.1, 3, 5.6, mConcreto, x, 1.5, EIXO_Z);
    caixa(1.6, 0.4, 7, mConcreto, x, 3.1, EIXO_Z);
  });
  var tabuleiroA = caixa(4.6, 0.45, 7.2, mConcreto, PONTE_X - 3.3, 3.5, EIXO_Z);
  var tabuleiroB = caixa(4.6, 0.45, 7.2, mConcreto, PONTE_X + 1.2, 3.5, EIXO_Z);
  var guardaPonte = [];
  [EIXO_Z - 3.5, EIXO_Z + 3.5].forEach(function(z){ guardaPonte.push(caixa(9.4, 0.7, 0.2, mConcreto, PONTE_X - 1, 4.05, z)); });
  // Cimbramento (escoras) sob o vão que ainda está sendo concretado
  var cimbramento = new THREE.Group(); cena.add(cimbramento);
  for (var ci = 0; ci < 4; ci++) for (var cj = 0; cj < 3; cj++) cilindro(0.05, 0.05, 3.2, mat(COR.aco, { r: 0.3, m: 0.9 }), PONTE_X + 0.2 + ci * 0.9, 1.7, EIXO_Z - 2.4 + cj * 2.4, cimbramento, 6);
  // Rampas de terra ligando a estrada ao tabuleiro
  [[PONTE_X - 6.8, -0.48], [PONTE_X + 4.8, 0.48]].forEach(function(r){ var rp = caixa(4.4, 0.5, 7, mTerraClara, r[0], 1.75, EIXO_Z); rp.rotation.z = r[1]; });

  /* ── Escavadeira hidráulica carregando o basculante ── */
  var esc = new THREE.Group(); esc.position.set(ESCAV[0], 0, ESCAV[2]); cena.add(esc);
  [-1.05, 1.05].forEach(function(z){
    var est = caixaRedonda(3.6, 0.7, 0.6, 0.28, mat(0x24292c, { r: 0.8, m: 0.4 })); est.position.set(0, 0.38, z); esc.add(est);
  });
  var superior = new THREE.Group(); superior.position.y = 0.9; esc.add(superior);
  var corpoEsc = caixaRedonda(2.8, 1, 2.2, 0.18, mAmarelo); corpoEsc.position.set(-0.4, 0.55, 0); superior.add(corpoEsc);
  var cabEsc = caixaRedonda(1.1, 1.3, 1, 0.12, mAmarelo); cabEsc.position.set(0.55, 1.55, 0.55); superior.add(cabEsc);
  var vidroEsc = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), mVidro); vidroEsc.position.set(1.12, 1.6, 0.55); vidroEsc.rotation.y = Math.PI / 2; superior.add(vidroEsc);
  adesivo(superior, 1.6, 0.5, -0.6, 0.6, 1.12);
  caixa(0.9, 0.9, 2, mat(0x24292c, { r: 0.7, m: 0.4 }), -1.7, 0.75, 0, superior);   // contrapeso
  var lanca = new THREE.Group(); lanca.position.set(0.9, 1, -0.25); superior.add(lanca);
  var lancaM = caixa(0.32, 0.38, 3.6, mAmarelo, 0, 0, 0, lanca); lancaM.rotation.x = 0; lancaM.position.set(1.7, 0, 0); lancaM.rotation.set(0, Math.PI / 2, 0);
  var braco = new THREE.Group(); braco.position.set(3.4, 0, 0); lanca.add(braco);
  var bracoM = caixa(0.26, 0.3, 2.6, mAmarelo, 0, 0, 0, braco); bracoM.rotation.y = Math.PI / 2; bracoM.position.set(1.2, 0, 0);
  var cacamba = new THREE.Group(); cacamba.position.set(2.5, 0, 0); braco.add(cacamba);
  var cacM = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 16, 1, true, 0, Math.PI), mat(0x3a3f42, { r: 0.6, m: 0.6 }));
  cacM.rotation.x = Math.PI / 2; cacM.rotation.z = Math.PI; cacM.position.set(0.3, -0.2, 0); cacM.castShadow = true; cacamba.add(cacM);
  var montesTerra = [];
  [[ESCAV[0] - 1, ESCAV[2] - 4.5, 2.2], [ESCAV[0] + 2.5, ESCAV[2] - 5, 1.6]].forEach(function(m){
    var mt = new THREE.Mesh(new THREE.ConeGeometry(m[2], m[2] * 0.9, 18), mTerra); mt.position.set(m[0], m[2] * 0.45, m[1]); mt.castShadow = true; mt.receiveShadow = true; cena.add(mt); montesTerra.push(mt);
  });

  // Caminhão basculante (o parado ao lado da escavadeira e o que manobra de ré)
  function basculante(){
    var g = new THREE.Group(); cena.add(g);
    caixa(5.6, 0.3, 1.5, mat(0x1b2226, { r: 0.6, m: 0.5 }), 0, 0.7, 0, g);
    var cab = caixaRedonda(1.5, 1.8, 2.1, 0.28, mat(0xf2f4f5, { r: 0.25, m: 0.35 })); cab.position.set(2.1, 1.75, 0); g.add(cab);
    var pb = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), mVidro); pb.position.set(2.88, 2.1, 0); pb.rotation.y = Math.PI / 2; g.add(pb);
    adesivo(g, 1.1, 0.35, 2.05, 1.55, 1.08); adesivo(g, 1.1, 0.35, 2.05, 1.55, -1.08, Math.PI);
    var cac = new THREE.Group(); cac.position.set(-2.3, 0.9, 0); g.add(cac);
    var caixaC = caixaRedonda(3.6, 1.3, 2.2, 0.08, mAmarelo); caixaC.position.set(1.8, 0.65, 0); cac.add(caixaC);
    var carga = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.8, 14), mTerra); carga.scale.set(1.4, 1, 0.9); carga.position.set(1.8, 1.55, 0); cac.add(carga);
    var rodas = [];
    [-1.6, -0.7, 2.1].forEach(function(x){ [-0.9, 0.9].forEach(function(z){ rodas.push(roda(g, x, 0.5, z, 0.5)); }); });
    var giroflex = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffa21a, toneMapped: false }));
    giroflex.position.set(2, 2.75, 0); g.add(giroflex);
    return { g: g, cac: cac, rodas: rodas, giroflex: giroflex, carga: carga };
  }
  var bascParado = basculante(); bascParado.g.position.set(ESCAV[0] + 6.2, 0, ESCAV[2] - 0.5); bascParado.g.rotation.y = Math.PI;
  var bascRe = basculante(); bascRe.g.position.set(RE[0], 0, RE[2]);

  /* ── Motoniveladora e rolo compactador espalhando a base ── */
  var moto = new THREE.Group(); cena.add(moto);
  caixa(5, 0.35, 0.6, mAmarelo, 0, 1.35, 0, moto);
  var cabMoto = caixaRedonda(1.3, 1.5, 1.6, 0.15, mAmarelo); cabMoto.position.set(-1.5, 2.1, 0); moto.add(cabMoto);
  var vMoto = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.9), mVidro); vMoto.position.set(-0.83, 2.25, 0); vMoto.rotation.y = Math.PI / 2; moto.add(vMoto);
  caixa(0.15, 0.5, 2.6, mat(0x3a3f42, { r: 0.5, m: 0.7 }), 0.3, 0.5, 0, moto).rotation.y = 0.35;   // lâmina
  [[-2, -0.95], [-2, 0.95], [-1.1, -0.95], [-1.1, 0.95], [2.2, -0.8], [2.2, 0.8]].forEach(function(r){ roda(moto, r[0], 0.55, r[1], 0.55, 0.36); });
  var rolo = new THREE.Group(); cena.add(rolo);
  var tamborRolo = cilindro(0.8, 0.8, 2, mat(0x3a3f42, { r: 0.5, m: 0.7 }), 1.3, 0.8, 0, rolo, 24); tamborRolo.rotation.x = Math.PI / 2;
  var corpoRolo = caixaRedonda(2.2, 1.2, 1.7, 0.2, mAmarelo); corpoRolo.position.set(-0.5, 1.3, 0); rolo.add(corpoRolo);
  var tetoRolo = caixa(1.4, 0.1, 1.5, mAmarelo, -0.7, 2.6, 0, rolo);
  [[-0.1, -0.7], [-1.3, -0.7], [-0.1, 0.7], [-1.3, 0.7]].forEach(function(p){ cilindro(0.04, 0.04, 0.8, mat(0x24292c), p[0], 2.2, p[1], rolo, 6); });
  [-0.85, 0.85].forEach(function(z){ roda(rolo, -1.1, 0.55, z, 0.6, 0.3); });

  /* ── Vala com escoramento ── */
  // Vala rasa à vista: paredes de terra de 1 m, monte de material escavado do lado de fora e tubos esperando
  var vala = new THREE.Group(); vala.position.set(VALA[0], 0, VALA[2]); cena.add(vala);
  var fundoVala = new THREE.Mesh(new THREE.PlaneGeometry(11, 1.5), mat(0x241b14, { r: 1 })); fundoVala.rotation.x = -Math.PI / 2; fundoVala.position.y = 0.04; vala.add(fundoVala);
  [-1, 1].forEach(function(lado){
    caixa(11, 1, 0.3, mat(0x4a3a2a, { r: 1 }), 0, 0.5, lado * 0.9, vala);                       // parede da vala
    // Leira de material escavado: meio cilindro deitado ao longo da vala
    var monte = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 10.4, 20), mTerra);   // metade fica enterrada
    monte.rotation.z = Math.PI / 2; monte.position.set(0, 0, lado * 2.05);
    monte.castShadow = true; monte.receiveShadow = true; vala.add(monte);
  });
  // Escoramento: pranchas e estroncas, presente só quando a obra está protegida
  var escoras = new THREE.Group(); vala.add(escoras);
  for (var e = 0; e < 6; e++){
    var x = -4.5 + e * 1.8;
    [-0.68, 0.68].forEach(function(z){ caixa(1.5, 1.05, 0.07, mat(0x8a6a3d, { r: 0.9 }), x, 0.55, z, escoras); });
    var estronca = cilindro(0.06, 0.06, 1.3, mAmarelo, x, 0.75, 0, escoras, 8); estronca.rotation.x = Math.PI / 2;
  }
  // Tubos de concreto da drenagem enfileirados do lado de fora
  for (var tb = 0; tb < 5; tb++){
    var tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 1.3, 22), mat(0x8d979a, { r: 0.85 }));
    tubo.rotation.x = Math.PI / 2; tubo.position.set(VALA[0] - 4 + tb * 1.7, 0.36, VALA[2] - 3.3); tubo.castShadow = true; tubo.receiveShadow = true; cena.add(tubo);
    var boca = new THREE.Mesh(new THREE.CircleGeometry(0.26, 18), mat(0x1c2224, { r: 1 })); boca.position.set(tubo.position.x, 0.36, VALA[2] - 3.3 + 0.66); cena.add(boca);
  }

  /* ── Desvio de trânsito, cones e sinaleiro ── */
  var desvio = plano(110, 3.4, mAsfalto, 0, 0.022, EIXO_Z + 7.2);
  var cones = [];
  for (var cn = 0; cn < 26; cn++){
    var cx = INI_OBRA - 3 + cn * 1.8;
    var cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.62, 14), mat(0xff6a1a, { r: 0.5, e: 0x5a1e00, ei: 0.3 })); cone.position.set(cx, 0.31, EIXO_Z + 5.1); cone.castShadow = true; cena.add(cone);
    var faixaCone = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.08, 14), basico(0xffffff, 0.9)); faixaCone.position.set(cx, 0.36, EIXO_Z + 5.1); cena.add(faixaCone);
    cones.push(cone, faixaCone);
  }
  var placaPS = new THREE.Group(); placaPS.position.set(SINAL[0] + 0.45, 0, SINAL[2]); cena.add(placaPS);
  cilindro(0.03, 0.03, 1.6, mat(0x24292c), 0, 0.8, 0, placaPS, 6);
  var discoPare = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 8), mat(0xd9342b, { r: 0.4, e: 0x5a0d0a, ei: 0.4 })); discoPare.rotation.x = Math.PI / 2; discoPare.position.set(0, 1.7, 0.03); placaPS.add(discoPare);
  // Carros passando pelo desvio
  var carros = [];
  [0xb83a32, 0xdfe6e8, 0x2e6fa8, 0x30363a, 0xe3a21a, 0x5a6e74].forEach(function(cor, i){
    var g = new THREE.Group(); cena.add(g);
    var corpo = caixaRedonda(3.2, 0.7, 1.5, 0.2, mat(cor, { r: 0.3, m: 0.5 })); corpo.position.y = 0.65; g.add(corpo);
    var cab = caixaRedonda(1.7, 0.6, 1.3, 0.2, mVidro); cab.position.set(-0.2, 1.2, 0); g.add(cab);
    [-1, 1].forEach(function(x){ [-0.72, 0.72].forEach(function(z){ var r = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), mat(0x121416, { r: 0.9 })); r.rotation.x = Math.PI / 2; r.position.set(x, 0.3, z); g.add(r); }); });
    g.position.set(-46 + i * 17, 0, EIXO_Z + 7.6 + (i % 2 ? -0.8 : 0.8)); g.userData.v = 5 + i * 0.6; g.userData.dir = i % 2 ? -1 : 1;
    g.userData.zDesvio = g.position.z; g.userData.zPista = EIXO_Z + (i % 2 ? -1.6 : 1.6);   // na entrega o trânsito volta para a pista nova
    if (g.userData.dir < 0) g.rotation.y = Math.PI;
    carros.push(g);
  });

  /* ── Base da obra: contêineres e placa de obra com o nome do cliente ── */
  ['ESCRITÓRIO DA OBRA', 'VESTIÁRIO', 'REFEITÓRIO'].forEach(function(nome, i){
    var ct = new THREE.Group(); ct.position.set(BASE[0] - 3 + i * 3.4, 0, BASE[2] - 3); cena.add(ct);
    var corpo = caixaRedonda(3.1, 2.5, 2.4, 0.06, mat(i ? 0x30747F : 0xf2f4f5, { r: 0.5, m: 0.3 })); corpo.position.y = 1.3; ct.add(corpo);
    var lt = textoTex(512, 96);
    kit.aoCarregarFonte(function(){ var c = lt.ctx; c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, nome, 256, 50, 480, '800', 48, i ? '#F0D2A4' : '#17444C'); lt.tex.needsUpdate = true; });
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true, toneMapped: false })); rot.position.set(0, 2.2, 1.27); ct.add(rot);
  });
  kit.halo(0x30747F, 18, BASE[0], BASE[2], 0.12);
  var placaTx = textoTex(1024, 512);
  var placa = new THREE.Group(); placa.position.set(PLACA[0], 0, PLACA[2]); cena.add(placa);
  [-3.4, 3.4].forEach(function(x){ cilindro(0.12, 0.12, 7, mat(0x9aa7ab, { r: 0.4, m: 0.7 }), x, 3.5, 0, placa); });
  caixa(8, 4.1, 0.2, mat(0x0a1216, { r: 0.4 }), 0, 6.2, -0.05, placa);
  var telaPlaca = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 3.85), new THREE.MeshBasicMaterial({ map: placaTx.tex, toneMapped: false }));
  telaPlaca.position.set(0, 6.2, 0.07); placa.add(telaPlaca);
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
    if (modoAtual === 'verde') desenharPlaca('TRECHO KM 0 AO KM 12', 'LIBERADO', '#5EE0A6', 'entregue ao contratante no prazo');
    else if (modoAtual === 'acidente') desenharPlaca('FRENTE DE ESCAVAÇÃO', 'PARADA', '#FF6B5E', 'investigação e adequação em andamento');
    else if (modoAtual === 'prazo' && placaEstado.perdidos > 0) desenharPlaca('MEDIÇÃO DO MÊS', '−' + placaEstado.perdidos + ' DIAS', '#FF6B5E', 'de frente parada fora da medição');
    else desenharPlaca('FECHAMENTO DA MEDIÇÃO EM', 'D-30', '#F0D2A4', 'cinco frentes em andamento');
  }
  kit.aoCarregarFonte(atualizarPlaca);

  /* ── Pessoas ── */
  var naBase = [];
  for (var nb = 0; nb < 4; nb++) naBase.push(pessoa(BASE[0] - 3 + nb * 1.2, BASE[2] + 0.4, COR.colete));
  var atrasDoCaminhao = pessoa(RE[0] - 5.4, RE[2] + 0.6, COR.colete);
  var naVala = pessoa(VALA[0] + 1, VALA[2], COR.colete);
  var naVala2 = pessoa(VALA[0] - 2, VALA[2] + 0.1, COR.colete);
  var sinaleiro = pessoa(SINAL[0], SINAL[2], COR.colete); sinaleiro.rotation.y = 0;
  var naPonte = pessoa(PONTE_X - 3, EIXO_Z - 1, COR.colete); naPonte.position.y = 3.73; naPonte.userData.base.y = 3.73;
  var topografo = pessoa(26, EIXO_Z - 2.6, COR.terc);
  var viajante = pessoa(BASE[0] + 2, BASE[2] + 3.4, COR.colete);

  /* ── Estado próprio do cenário ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, tempo = 0, escoradoAlvo = 0, escorado = 0;

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      var c = kit.R.clinica.pos;
      return modo === 'virada' || modo === 'clinica' ? [c[0], c[2] + 7.6] : modo === 'verde' ? [10, EIXO_Z + 2.4] : [BASE[0] + 2, BASE[2] + 3.4];
    },
    modosRisco: ['frentes', 'maquina', 'vala', 'transito', 'acidente', 'prazo'],
    alertas: {
      frentes:  [PONTE_X - 3, 8, EIXO_Z - 1, 3.8],
      maquina:  [RE[0] - 5.4, 4.2, RE[2] + 0.6, 0.08],
      vala:     [VALA[0] + 1, 4.4, VALA[2], 0.1],
      transito: [SINAL[0], 4.2, SINAL[2], 0.08],
      acidente: [VALA[0] + 1, 4.4, VALA[2], 0.1]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([new THREE.Vector3(BASE[0] + 2, 0.3, BASE[2] + 3.4), new THREE.Vector3(-15, 0.3, 3.5), new THREE.Vector3(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([new THREE.Vector3(-9, 0.3, 1.6), new THREE.Vector3(0, 0.3, EIXO_Z + 1), new THREE.Vector3(10, 0.3, EIXO_Z + 2.4)])
    },
    fogos: [12, EIXO_Z],

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
      // Trecho liberado: máquinas e sinalização de obra saem de cena
      var emObra = modo !== 'verde';
      [esc, bascParado.g, bascRe.g, moto, rolo, placaPS, sinaleiro, topografo].forEach(function(o){ o.visible = emObra; });
      montesTerra.forEach(function(m){ m.visible = emObra; });
      cones.forEach(function(c){ c.visible = emObra; });
      naVala.visible = naVala2.visible = modo !== 'verde';
      atualizarPlaca();
    },

    placar: function(n){ placaEstado.perdidos = n; atualizarPlaca(); },

    quadro: function(dt, k, relogio, modo){
      tempo += dt;
      // Pavimento avança com a obra; a ponte fecha o vão na entrega
      obra += (obraAlvo - obra) * k * 0.6;
      var pave = Math.max(0.01, obra * (PONTE_X - 4 - INI_OBRA));
      pavimento.scale.x = pave;
      var pronta = obraAlvo >= 1;
      tabuleiroB.visible = pronta || obra > 0.7;
      faixasNovas.visible = pronta && obra > 0.97;
      cimbramento.visible = !pronta;
      guardaPonte.forEach(function(g){ g.visible = pronta; });

      // Escavadeira: cava, gira até o caminhão e descarrega, em ciclo
      var ciclo = (tempo * 0.16) % 1, giroAlvo = ciclo < 0.45 ? 0 : ciclo < 0.55 ? 2.6 * (ciclo - 0.45) / 0.1 : ciclo < 0.8 ? 2.6 : 2.6 * (1 - (ciclo - 0.8) / 0.2);
      superior.rotation.y = -giroAlvo;
      var cav = ciclo < 0.45 ? Math.sin(ciclo / 0.45 * Math.PI) : 0;
      lanca.rotation.z = 0.5 - cav * 0.55 + (ciclo >= 0.45 && ciclo < 0.85 ? 0.2 : 0);
      braco.rotation.z = -1.4 + cav * 0.75;
      cacamba.rotation.z = ciclo > 0.6 && ciclo < 0.8 ? -1.2 * Math.sin((ciclo - 0.6) / 0.2 * Math.PI) : 0.6 * cav;

      // Caminhão de ré com giroflex piscando
      // Recua na direção de quem está no ponto cego e volta
      var vai = Math.sin(tempo * 0.35) * 0.5 + 0.5;
      var xAnt = bascRe.g.position.x;
      bascRe.g.position.x = RE[0] - vai * 2.2;
      var dx = bascRe.g.position.x - xAnt;
      bascRe.rodas.forEach(function(r){ r.rotation.z -= dx / 0.5; });
      var pisca = (Math.sin(tempo * 9) > 0) ? 1 : 0.15;
      bascRe.giroflex.material.color.setRGB(1, 0.63 * pisca + 0.1, 0.1 * pisca);
      bascParado.giroflex.material.color.setRGB(1, 0.63 * (1 - pisca) + 0.1, 0.1);
      bascParado.cac.rotation.z = ciclo > 0.85 ? Math.sin((ciclo - 0.85) / 0.15 * Math.PI) * 0.15 : 0;

      // Motoniveladora e rolo indo e voltando na frente de base
      var vaiM = Math.sin(tempo * 0.12);
      moto.position.set(24 + vaiM * 5, 0, EIXO_Z - 1.6);
      rolo.position.set(20 + Math.sin(tempo * 0.12 + 1.2) * 5, 0, EIXO_Z + 1.8);
      tamborRolo.rotation.y += dt * 1.2;

      // Escoramento aparece quando a obra está protegida
      escorado += (escoradoAlvo - escorado) * k;
      escoras.visible = escorado > 0.5;

      // Trânsito no desvio
      carros.forEach(function(c){
        c.position.z += ((modo === 'verde' ? c.userData.zPista : c.userData.zDesvio) - c.position.z) * k * 0.5;
        c.position.x += c.userData.v * c.userData.dir * dt;
        if (c.position.x > 52) c.position.x = -52;
        if (c.position.x < -52) c.position.x = 52;
      });
      discoPare.material.color.setHex(Math.sin(tempo * 0.4) > 0 ? 0xd9342b : 0x2fa866);
      discoPare.material.emissive.setHex(Math.sin(tempo * 0.4) > 0 ? 0x5a0d0a : 0x0d4a26);

      // Luz da entrega: postes do trecho liberado
      luzes += (luzesAlvo - luzes) * k * 0.6;
      postes.forEach(function(p){ p.lamp.material.opacity = 0.25 + luzes * 0.75; p.cone.material.opacity = luzes * 0.06; });
    }
  };
};
/* ── FIM BLOCO ── */
