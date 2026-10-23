/* Kit 3D comum a todos os cenários: renderizador, luz, materiais, pessoas, alerta de risco,
   partículas, fogos e a torre da clínica DMG que sobe andar a andar.
   O cenário do roteiro (CENARIOS[R.cenario]) constrói o mundo do cliente em cima deste kit. */

/* ═══ BLOCO: CENA_3D ═══ */
var Cena = (function(){
  var R = window.ROTEIRO;
  var ok = typeof THREE !== 'undefined' && (function(){
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); }
    catch (e) { return false; }
  })();
  if (!ok) return { ir: function(){}, placar: function(){}, desenharPaineis: function(){} };

  var COR = {
    concreto: 0x6f7f84, piso: 0x08141a, aco: 0xD6B17D, vidro: 0x8fd3dc, pista: 0xa4442f, grama: 0x1f6b3f,
    capacete: 0xF4F5F6, ouro: 0xD6B17D, risco: 0xFF5A4A, ok: 0x4BE39C, colete: 0xff7a1a, terc: 0x4f5a60, ciano: 0x6FE3EC
  };
  var NAND = R.beneficios.length;
  var ESC_TORRE = R.clinica.escala;
  var POS_CLINICA = R.clinica.pos;

  // Cenas da clínica: câmera frontal acompanhando cada andar
  for (var na = 0; na < NAND; na++){
    R.cenas['andar-' + na] = {
      pos: [POS_CLINICA[0] + 5, (1.9 + na * 2.6) * ESC_TORRE, POS_CLINICA[2] + 21.5],
      alvo: [POS_CLINICA[0], (1.4 + na * 2.6) * ESC_TORRE, POS_CLINICA[2]],
      obra: 0.6 + na * 0.06, torre: na + 1, modo: 'clinica', andar: na
    };
  }

  var palco = $('palco');
  var cena = new THREE.Scene();
  cena.fog = new THREE.FogExp2(0x0C1B22, 0.014);
  var cam = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
  var rend = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  rend.setPixelRatio(Math.min(devicePixelRatio, 2));
  rend.setSize(innerWidth, innerHeight);
  rend.outputEncoding = THREE.sRGBEncoding;
  rend.toneMapping = THREE.ACESFilmicToneMapping;
  rend.toneMappingExposure = 0.95;
  rend.shadowMap.enabled = true;
  rend.shadowMap.type = THREE.PCFSoftShadowMap;
  palco.appendChild(rend.domElement);

  // ── Luz ──
  cena.add(new THREE.HemisphereLight(0x9fd6dc, 0x0a1418, 0.5));
  var sol = new THREE.DirectionalLight(0xffe6c4, 1.05);
  sol.position.set(-20, 34, 22); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  var sc = sol.shadow.camera; sc.left = -50; sc.right = 50; sc.top = 40; sc.bottom = -40; sc.far = 120;
  sol.shadow.bias = -0.0005; sol.shadow.normalBias = 0.04; cena.add(sol);
  var contra = new THREE.DirectionalLight(0x6fe3ec, 0.45); contra.position.set(30, 12, -30); cena.add(contra);
  var luzRisco = new THREE.PointLight(COR.risco, 0, 24, 2); cena.add(luzRisco);
  var luzClinica = new THREE.PointLight(0xffd9a0, 0, 24, 2); luzClinica.position.set(POS_CLINICA[0], 5, POS_CLINICA[2] + 6); cena.add(luzClinica);

  /* ── Fábricas de malha ── */
  function mat(cor, o){
    o = o || {};
    return new THREE.MeshStandardMaterial({ color: cor, roughness: o.r === undefined ? 0.75 : o.r, metalness: o.m || 0,
      emissive: o.e || 0x000000, emissiveIntensity: o.ei || 0, transparent: o.op !== undefined, opacity: o.op === undefined ? 1 : o.op });
  }
  function basico(cor, op, add){
    return new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: op, toneMapped: false, depthWrite: !add,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide });
  }
  function caixa(w, h, d, m, x, y, z, pai){
    var b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true;
    (pai || cena).add(b); return b;
  }
  function cilindro(rt, rb, h, m, x, y, z, pai, seg){
    var c = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 12), m);
    c.position.set(x, y, z); c.castShadow = true; (pai || cena).add(c); return c;
  }
  function caixaRedonda(w, h, d, r, m){
    var sh = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    sh.moveTo(x, y - r); sh.lineTo(x + W, y - r); sh.quadraticCurveTo(x + W + r, y - r, x + W + r, y);
    sh.lineTo(x + W + r, y + H); sh.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r);
    sh.lineTo(x, y + H + r); sh.quadraticCurveTo(x - r, y + H + r, x - r, y + H);
    sh.lineTo(x - r, y); sh.quadraticCurveTo(x - r, y - r, x, y - r);
    var geo = new THREE.ExtrudeGeometry(sh, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.6, bevelSegments: 4, curveSegments: 8 });
    geo.translate(0, 0, -(d - 2 * r) / 2);
    var mesh = new THREE.Mesh(geo, m); mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
  }
  function texHalo(){
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var HALO = texHalo();
  function halo(cor, tam, x, z, op){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(tam, tam), new THREE.MeshBasicMaterial({ map: HALO, color: cor, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, z); cena.add(m); return m;
  }
  function textoTex(w, h){
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
    return { canvas: c, ctx: c.getContext('2d'), tex: t };
  }
  function cantos(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  // Textos de canvas que dependem da fonte Sora: cada cenário registra seus redesenhos aqui
  var redesenhos = [];
  function aoCarregarFonte(fn){ redesenhos.push(fn); fn(); }

  /* ── Chão e grade ── */
  var piso = new THREE.Mesh(new THREE.PlaneGeometry(260, 200), mat(COR.piso, { r: 0.9 }));
  piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; cena.add(piso);
  var grade = new THREE.GridHelper(160, 80, 0x2a5862, 0x13313a);
  grade.material.transparent = true; grade.material.opacity = 0.18; grade.position.y = 0.01; cena.add(grade);
  var haloClinica = halo(0xD6B17D, 20, POS_CLINICA[0], POS_CLINICA[2] + 2, 0.0);

  /* ── Pessoas ── */
  var todos = [];
  function pessoa(x, z, corColete){
    // Figura humana com silhueta torneada (lathe), articulações e EPI completo
    var g = new THREE.Group();
    var mPele = mat(0xc99a78, { r: 0.65 }), mCalca = mat(0x1d3640, { r: 0.8 }), mBota = mat(0x2a1d16, { r: 0.6 });
    var mColete = mat(corColete, { r: 0.45, e: corColete, ei: 0.1 }), mFaixa = mat(0xe8f1f2, { r: 0.2, m: 0.6, e: 0xffffff, ei: 0.25 });
    var mCapacete = mat(COR.capacete, { r: 0.25, m: 0.1 });
    var pernas = [];
    [-0.095, 0.095].forEach(function(px){
      var piv = new THREE.Group(); piv.position.set(px, 0.86, 0); g.add(piv);
      var coxa = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.8, 14), mCalca); coxa.position.y = -0.4; piv.add(coxa);
      var bota = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), mBota); bota.scale.set(1, 0.6, 1.6); bota.position.set(0, -0.82, 0.04); piv.add(bota);
      pernas.push(piv);
    });
    var perfil = [[0.001, 0], [0.16, 0.02], [0.19, 0.12], [0.205, 0.3], [0.215, 0.44], [0.19, 0.52], [0.09, 0.58], [0.001, 0.6]]
      .map(function(p){ return new THREE.Vector2(p[0], p[1]); });
    var tronco = new THREE.Mesh(new THREE.LatheGeometry(perfil, 24), mColete);
    tronco.scale.z = 0.72; tronco.position.y = 0.84; g.add(tronco);
    [0.98, 1.1].forEach(function(fy){
      var faixa = new THREE.Mesh(new THREE.CylinderGeometry(0.212, 0.212, 0.035, 24, 1, true), mFaixa);
      faixa.scale.z = 0.73; faixa.position.y = fy; g.add(faixa);
    });
    var bracos = [];
    [-1, 1].forEach(function(ld){
      var piv = new THREE.Group(); piv.position.set(ld * 0.235, 1.34, 0); piv.rotation.z = ld * 0.12; piv.userData.membro = true; g.add(piv);
      var ombro = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), mColete); piv.add(ombro);
      var braco = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.048, 0.62, 12), mCalca); braco.position.y = -0.32; piv.add(braco);
      var luva = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), mat(0xd6a23c, { r: 0.7 })); luva.position.y = -0.66; piv.add(luva);
      bracos.push(piv);
    });
    var pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 12), mPele); pescoco.position.y = 1.47; g.add(pescoco);
    var cab = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), mPele); cab.scale.set(1, 1.12, 1.05); cab.position.y = 1.6; g.add(cab);
    var casco = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mCapacete); casco.scale.set(1, 0.85, 1.12); casco.position.y = 1.65; g.add(casco);
    var aba = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.018, 24), mCapacete); aba.scale.set(1, 1, 1.15); aba.position.set(0, 1.65, 0.02); g.add(aba);
    var crista = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 6, 24, Math.PI), mCapacete); crista.rotation.y = Math.PI / 2; crista.position.y = 1.66; g.add(crista);
    var anel = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 40), basico(COR.ciano, 0.9));
    anel.rotation.x = -Math.PI / 2; anel.position.y = 0.04; g.add(anel);
    g.traverse(function(o){ if (o.isMesh && o !== anel) o.castShadow = true; });
    g.scale.setScalar(0.92);
    g.position.set(x, 0, z);
    g.userData = { anel: anel, fase: Math.random() * 6, base: new THREE.Vector3(x, 0, z), pernas: pernas, bracos: bracos, ult: new THREE.Vector3(x, 0, z) };
    g.rotation.y = (Math.random() - 0.5) * 0.8;
    cena.add(g); todos.push(g); return g;
  }

  /* ── Clínica DMG: torre que sobe andar a andar ── */
  var torre = new THREE.Group(); torre.position.set(POS_CLINICA[0], 0, POS_CLINICA[2]); torre.scale.setScalar(ESC_TORRE); cena.add(torre);
  caixa(7.8, 0.15, 6.8, mat(0x2a3e44, { r: 0.6 }), 0, 0.08, 0, torre);
  var contornoBase = new THREE.Mesh(new THREE.RingGeometry(4.6, 4.75, 4, 1), basico(0xD6B17D, 0.6));
  contornoBase.rotation.x = -Math.PI / 2; contornoBase.rotation.z = Math.PI / 4; contornoBase.scale.set(1.15, 1, 1); contornoBase.position.y = 0.2; torre.add(contornoBase);
  var andares = [];
  var mVidro = new THREE.MeshPhysicalMaterial({ color: COR.vidro, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.2, clearcoat: 1 });
  var mAco = mat(COR.aco, { r: 0.35, m: 0.8 });
  for (var a = 0; a < NAND; a++){
    var ag = new THREE.Group(); ag.position.y = a * 2.6;
    caixa(7.4, 0.25, 6.4, mat(0xe6ecee, { r: 0.4 }), 0, 0.12, 0, ag);
    var vid = new THREE.Mesh(new THREE.BoxGeometry(7, 2.35, 6), mVidro); vid.position.y = 1.42; ag.add(vid);
    var teto = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.08, 5.6), basico(0xffd9a0, 0.15)); teto.position.y = 2.45; ag.add(teto);
    var miolo = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.2, 5.4), basico(0xffcf8a, 0.03, true)); miolo.position.y = 1.4; ag.add(miolo);
    // Mobiliário interno simples: balcão e divisória
    caixa(2.4, 0.9, 0.6, mat(0xD6B17D, { r: 0.4, m: 0.5 }), -1.6, 0.7, -1.6, ag);
    caixa(0.08, 2.1, 3, mat(0xffffff, { op: 0.35 }), 1.2, 1.3, -1, ag);
    var rt = textoTex(1280, 420);
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 2.1), new THREE.MeshBasicMaterial({ map: rt.tex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    rot.position.set(0, 1.35, 3.12); rot.userData.tx = rt; ag.add(rot);
    ag.scale.y = 0.001; ag.visible = false;
    torre.add(ag);
    andares.push({ g: ag, teto: teto, miolo: miolo, rot: rot });
  }
  // Painel de vidro com os benefícios de cada andar; a cobertura mostra a parceria DMG × cliente
  var imgLogo = new Image();
  function desenharPaineis(){
    andares.forEach(function(a, i){
      var tx = a.rot.userData.tx, c = tx.ctx, b = R.beneficios[i];
      c.clearRect(0, 0, 1280, 420);
      var gr = c.createLinearGradient(0, 0, 1280, 420);
      gr.addColorStop(0, 'rgba(12,27,34,.88)'); gr.addColorStop(1, 'rgba(23,68,76,.78)');
      cantos(c, 8, 8, 1264, 404, 34); c.fillStyle = gr; c.fill();
      c.lineWidth = 4; c.strokeStyle = 'rgba(214,177,125,.85)'; c.stroke();
      c.textBaseline = 'middle'; c.textAlign = 'left';
      c.fillStyle = '#D6B17D'; c.font = '800 34px Sora, sans-serif'; c.fillText(pers(b.andar), 60, 64);
      if (b.parceria){
        c.textAlign = 'center';
        if (imgLogo.complete && imgLogo.naturalWidth) c.drawImage(imgLogo, 120, 120, 460, 198);
        c.fillStyle = 'rgba(255,255,255,.5)'; c.font = '300 90px Sora, sans-serif'; c.fillText('×', 660, 222);
        var nome = EMPRESA.nome.toUpperCase(), tam = 96;
        c.font = '800 ' + tam + 'px Sora, sans-serif';
        while (c.measureText(nome).width > 520 && tam > 40){ tam -= 4; c.font = '800 ' + tam + 'px Sora, sans-serif'; }
        c.fillStyle = '#FFFFFF'; c.fillText(nome, 960, 212);
        c.fillStyle = '#A8D8DB'; c.font = '600 30px Sora, sans-serif'; c.fillText(pers(b.rodape || ''), 640, 362);
      } else {
        b.itens.forEach(function(t, k){
          var y = 150 + k * 92;
          c.beginPath(); c.arc(84, y, 26, 0, Math.PI * 2); c.fillStyle = '#5EE0A6'; c.fill();
          c.strokeStyle = '#0C1B22'; c.lineWidth = 7; c.beginPath(); c.moveTo(72, y + 1); c.lineTo(81, y + 10); c.lineTo(97, y - 9); c.stroke();
          c.fillStyle = '#FFFFFF'; c.font = '700 50px Sora, sans-serif'; c.fillText(pers(t), 136, y + 2);
        });
      }
      tx.tex.needsUpdate = true;
    });
  }
  imgLogo.onload = desenharPaineis; imgLogo.src = 'assets/logo-dmg.png';
  aoCarregarFonte(desenharPaineis);
  var cobertura = caixa(7.6, 0.4, 6.6, mat(0xD6B17D, { r: 0.3, m: 0.7 }), 0, NAND * 2.6 + 0.2, 0, torre);
  cobertura.visible = false;
  var lc = textoTex(1024, 160);
  lc.ctx.fillStyle = '#F0D2A4'; lc.ctx.font = '800 96px Sora, sans-serif'; lc.ctx.textAlign = 'center'; lc.ctx.textBaseline = 'middle';
  aoCarregarFonte(function(){ lc.ctx.clearRect(0, 0, 1024, 160); lc.ctx.fillText('DMG OCUPACIONAL', 512, 82); lc.tex.needsUpdate = true; });
  var letClinica = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1), new THREE.MeshBasicMaterial({ map: lc.tex, transparent: true, opacity: 0, toneMapped: false }));
  letClinica.position.set(0, NAND * 2.6 + 1.2, 3.2); torre.add(letClinica);
  // Guindaste de montagem da torre (só enquanto sobe)
  var grua2 = new THREE.Group(); grua2.position.set(-4.8, 0, -3.8); torre.add(grua2);
  // (montada depois que o kit de peças existe — ver montarGrua2)
  var scanner = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.04, 8, 48), basico(COR.ciano, 1));
  scanner.rotation.x = Math.PI / 2; scanner.visible = false; cena.add(scanner);

  /* ── Alerta de risco ── */
  var alerta = new THREE.Group();
  var nucleo = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({ color: COR.risco, toneMapped: false }));
  alerta.add(nucleo);
  var feixe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.8, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: COR.risco, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  feixe.position.y = -4.7; alerta.add(feixe);
  var ondaAlerta = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48), basico(COR.risco, 0.6, true));
  ondaAlerta.rotation.x = -Math.PI / 2; cena.add(ondaAlerta);
  cena.add(alerta);

  /* ── Partículas: fluxo, poeira e fogos ── */
  var NFL = 120, fluxoGeo = new THREE.BufferGeometry(), fluxoPos = new Float32Array(NFL * 3), fluxoT = [];
  for (var fp = 0; fp < NFL; fp++) fluxoT.push(Math.random());
  fluxoGeo.setAttribute('position', new THREE.BufferAttribute(fluxoPos, 3));
  var fluxo = new THREE.Points(fluxoGeo, new THREE.PointsMaterial({ color: COR.ouro, size: 0.24, map: HALO, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  cena.add(fluxo);
  var NP = 600, poGeo = new THREE.BufferGeometry(), poPos = new Float32Array(NP * 3);
  for (var q = 0; q < NP; q++){ poPos[q * 3] = (Math.random() - 0.5) * 100; poPos[q * 3 + 1] = Math.random() * 28; poPos[q * 3 + 2] = (Math.random() - 0.5) * 60; }
  poGeo.setAttribute('position', new THREE.BufferAttribute(poPos, 3));
  var poeira = new THREE.Points(poGeo, new THREE.PointsMaterial({ color: 0xa8d8db, size: 0.08, map: HALO, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  cena.add(poeira);
  var NFG = 260, fgGeo = new THREE.BufferGeometry(), fgPos = new Float32Array(NFG * 3), fgVel = [], fogosVida = 0;
  fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPos, 3));
  var fogos = new THREE.Points(fgGeo, new THREE.PointsMaterial({ color: 0xF0D2A4, size: 0.35, map: HALO, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  cena.add(fogos);

  /* ── Peças de engenharia comuns a todos os cenários (padrão de qualidade: forma real, sem atalho) ── */
  var EIXO_Y = new THREE.Vector3(0, 1, 0);
  // Barra cilíndrica entre dois pontos (treliça, tirante, cabo, escora)
  function barra(a, b, r, m, pai, seg){
    var dir = new THREE.Vector3().subVectors(b, a), comp = dir.length();
    var c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, comp, seg || 6), m);
    c.position.copy(a).addScaledVector(dir, 0.5);
    c.quaternion.setFromUnitVectors(EIXO_Y, dir.normalize());
    c.castShadow = true; (pai || cena).add(c); return c;
  }
  // Funde as malhas de um grupo em uma malha por material (treliças e estruturas de muitas barras: 1 draw call)
  function fundir(grupo){
    grupo.updateMatrixWorld(true);
    var inv = new THREE.Matrix4().copy(grupo.matrixWorld).invert(), baldes = {}, rel = new THREE.Matrix4();
    grupo.traverse(function(o){
      if (!o.isMesh || o.isInstancedMesh) return;
      var b = baldes[o.material.uuid] || (baldes[o.material.uuid] = { m: o.material, geos: [], sombra: o.castShadow });
      var g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      rel.multiplyMatrices(inv, o.matrixWorld); g.applyMatrix4(rel); b.geos.push(g);
    });
    var filhos = grupo.children.slice(); filhos.forEach(function(c){ grupo.remove(c); });
    Object.keys(baldes).forEach(function(k){
      var b = baldes[k], total = 0;
      b.geos.forEach(function(g){ total += g.attributes.position.count; });
      var pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), off = 0;
      b.geos.forEach(function(g){
        pos.set(g.attributes.position.array, off * 3);
        if (g.attributes.normal) nor.set(g.attributes.normal.array, off * 3);
        off += g.attributes.position.count; g.dispose();
      });
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      var m = new THREE.Mesh(geo, b.m); m.castShadow = b.sombra; m.receiveShadow = true; grupo.add(m);
    });
    return grupo;
  }
  // Treliça espacial de seção quadrada ao longo de +y: banzos nos cantos e diagonais em zigue-zague nas 4 faces
  function trelica(comp, larg, m, o){
    o = o || {};
    var g = new THREE.Group(), h = larg / 2, passo = o.passo || larg, rb = o.rb || larg * 0.05, rd = o.rd || rb * 0.6;
    var topo = o.afina === undefined ? 1 : o.afina;   // afinamento na ponta (lança de guindaste)
    function canto(i, y){ var s = 1 + (topo - 1) * (y / comp); var cx = (i === 0 || i === 3) ? -h : h, cz = i < 2 ? -h : h; return new THREE.Vector3(cx * s, y, cz * s); }
    for (var i = 0; i < 4; i++) barra(canto(i, 0), canto(i, comp), rb, m, g, 6);
    var n = Math.max(1, Math.round(comp / passo));
    for (var k = 0; k < n; k++){
      var y0 = comp * k / n, y1 = comp * (k + 1) / n;
      for (var f = 0; f < 4; f++){
        var a = f, b = (f + 1) % 4;
        if (k % 2) barra(canto(a, y0), canto(b, y1), rd, m, g, 5); else barra(canto(b, y0), canto(a, y1), rd, m, g, 5);
        barra(canto(a, y1), canto(b, y1), rd * 0.9, m, g, 5);   // travessa horizontal
      }
    }
    return fundir(g);
  }
  // Fita de superfície que segue um traçado 3D (pista, faixa pintada, desvio): normal sempre no plano xz
  function fita(pontos, larg, m, desl){
    var n = pontos.length, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = [], acum = 0;
    desl = desl || 0;
    for (var i = 0; i < n; i++){
      var p = pontos[i], q = pontos[Math.min(n - 1, i + 1)], o = pontos[Math.max(0, i - 1)];
      var tx = q.x - o.x, tz = q.z - o.z, l = Math.sqrt(tx * tx + tz * tz) || 1, nx = -tz / l, nz = tx / l;
      if (i) acum += p.distanceTo(pontos[i - 1]);
      var e = desl - larg / 2, d = desl + larg / 2;
      pos.set([p.x + nx * e, p.y, p.z + nz * e, p.x + nx * d, p.y, p.z + nz * d], i * 6);
      uv.set([acum / larg, 0, acum / larg, 1], i * 4);
      if (i < n - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);   // face para cima
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    var mesh = new THREE.Mesh(geo, m); mesh.receiveShadow = true; cena.add(mesh); return mesh;
  }
  // Textura procedural repetível (concreto, terra armada, concreto projetado, chapa)
  function texturaProc(tam, desenho, rep){
    var c = document.createElement('canvas'); c.width = c.height = tam;
    desenho(c.getContext('2d'), tam);
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding;
    if (rep) t.repeat.set(rep[0], rep[1]);
    t.anisotropy = 4; return t;
  }
  function granulado(g, tam, base, var_, n){
    g.fillStyle = base; g.fillRect(0, 0, tam, tam);
    for (var i = 0; i < n; i++){
      var v = (Math.random() - 0.5) * var_;
      g.fillStyle = 'rgba(' + (v > 0 ? '255,255,255,' : '0,0,0,') + Math.abs(v) + ')';
      var s = 1 + Math.random() * 3; g.fillRect(Math.random() * tam, Math.random() * tam, s, s);
    }
  }
  // Carro de passeio com silhueta real (capô, para-brisa, teto e porta-malas), rodas com aro e faróis acesos
  var GEO_CARRO = null;
  function carro(cor){
    if (!GEO_CARRO){
      var lat = new THREE.Shape();
      lat.moveTo(-2.1, 0.32); lat.lineTo(-2.14, 0.62); lat.quadraticCurveTo(-2.12, 0.86, -1.9, 0.9);
      lat.lineTo(1.25, 0.86); lat.quadraticCurveTo(1.95, 0.82, 2.12, 0.66); lat.lineTo(2.16, 0.36);
      lat.quadraticCurveTo(2.1, 0.26, 1.9, 0.26); lat.lineTo(-1.9, 0.26); lat.quadraticCurveTo(-2.08, 0.26, -2.1, 0.32);
      var corpoG = new THREE.ExtrudeGeometry(lat, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3, curveSegments: 8 });
      corpoG.translate(0, 0, -0.75);
      var est = new THREE.Shape();
      est.moveTo(-1.62, 0.88); est.lineTo(-1.15, 1.3); est.quadraticCurveTo(-1.0, 1.36, -0.75, 1.37); est.lineTo(0.28, 1.37);
      est.quadraticCurveTo(0.5, 1.36, 0.62, 1.28); est.lineTo(1.18, 0.88);
      var estG = new THREE.ExtrudeGeometry(est, { depth: 1.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2, curveSegments: 6 });
      estG.translate(0, 0, -0.65);
      var teto = new THREE.Shape();
      teto.moveTo(-1.08, 1.34); teto.quadraticCurveTo(-0.95, 1.4, -0.72, 1.41); teto.lineTo(0.26, 1.41); teto.quadraticCurveTo(0.46, 1.4, 0.56, 1.34); teto.lineTo(-1.08, 1.34);
      var tetoG = new THREE.ExtrudeGeometry(teto, { depth: 1.26, bevelEnabled: false }); tetoG.translate(0, 0, -0.63);
      GEO_CARRO = { corpo: corpoG, estufa: estG, teto: tetoG,
        pneu: new THREE.CylinderGeometry(0.33, 0.33, 0.24, 20), aro: new THREE.CylinderGeometry(0.21, 0.21, 0.29, 14),
        farol: new THREE.BoxGeometry(0.06, 0.12, 0.34), lanterna: new THREE.BoxGeometry(0.06, 0.12, 0.38) };
    }
    var G = GEO_CARRO, g = new THREE.Group(), mats = [];
    function mm(m){ mats.push(m); return m; }
    var mCorpo = mm(mat(cor, { r: 0.28, m: 0.55 }));
    var mVid = mm(new THREE.MeshPhysicalMaterial({ color: 0x0b2129, metalness: 0.5, roughness: 0.06, clearcoat: 1 }));
    var mPneu = mm(mat(0x101214, { r: 0.92 })), mAro = mm(mat(0xc7d0d3, { r: 0.25, m: 0.9 }));
    var mFarol = mm(new THREE.MeshBasicMaterial({ color: 0xfff4dc, toneMapped: false })), mLant = mm(new THREE.MeshBasicMaterial({ color: 0xff2a1f, toneMapped: false }));
    var corpo = new THREE.Mesh(G.corpo, mCorpo); g.add(corpo);
    g.add(new THREE.Mesh(G.estufa, mVid)); g.add(new THREE.Mesh(G.teto, mCorpo));
    [-1.38, 1.32].forEach(function(x){ [-0.8, 0.8].forEach(function(z){
      var p = new THREE.Mesh(G.pneu, mPneu); p.rotation.x = Math.PI / 2; p.position.set(x, 0.33, z); g.add(p);
      var a = new THREE.Mesh(G.aro, mAro); a.rotation.x = Math.PI / 2; a.position.set(x, 0.33, z); g.add(a);
    }); });
    [-0.55, 0.55].forEach(function(z){
      var f = new THREE.Mesh(G.farol, mFarol); f.position.set(2.2, 0.6, z); g.add(f);
      var l = new THREE.Mesh(G.lanterna, mLant); l.position.set(-2.2, 0.66, z); g.add(l);
    });
    g.traverse(function(o){ if (o.isMesh){ o.castShadow = true; } });
    mats.forEach(function(m){ m.transparent = true; });
    g.userData.mats = mats;
    g.userData.opacidade = function(op){ mats.forEach(function(m){ m.opacity = op; m.depthWrite = op > 0.98; }); g.visible = op > 0.01; };
    return g;
  }
  // Roda de veículo pesado: pneu em anel (banda + flancos) e aro rebaixado — sem faces coplanares
  function roda(pai, x, y, z, r, larg, mAro){
    var g = new THREE.Group(); g.position.set(x, y, z); pai.add(g);
    var w = larg || 0.4;
    var perfilPneu = [[r * 0.56, -w / 2], [r * 0.86, -w / 2 - 0.01], [r, -w / 2 + 0.06], [r, w / 2 - 0.06], [r * 0.86, w / 2 + 0.01], [r * 0.56, w / 2]].map(function(q){ return new THREE.Vector2(q[0], q[1]); });
    var pneu = new THREE.Mesh(new THREE.LatheGeometry(perfilPneu, 24), new THREE.MeshStandardMaterial({ color: 0x121416, roughness: 0.95, side: THREE.DoubleSide })); pneu.rotation.x = Math.PI / 2; g.add(pneu);
    var aro = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.56, r * 0.56, w * 0.9, 18), mAro || mat(0xc7d0d3, { r: 0.3, m: 0.9 })); aro.rotation.x = Math.PI / 2; g.add(aro);
    [-1, 1].forEach(function(s){ var miolo = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.18, r * 0.2, 0.08, 10), mat(0xdfe6e8, { r: 0.15, m: 1 })); miolo.rotation.x = Math.PI / 2; miolo.position.z = s * (w * 0.45 + 0.04); g.add(miolo); });
    g.traverse(function(o){ if (o.isMesh) o.castShadow = true; }); return g;
  }
  // Andaime tubular fachadeiro: montantes, longarinas, travessas, diagonais, pranchas, guarda-corpo com rodapé,
  // sapatas e escada interna. Eixo longo em +x, profundidade em +z (face de trabalho em z = largura).
  function andaime(baias, niveis, o){
    o = o || {};
    var L = o.baia || 2, W = o.largura || 1.2, H = o.altNivel || 2, r = 0.026;
    var mT = o.mTubo || mat(0xb9c4c7, { r: 0.35, m: 0.85 }), mP = o.mPrancha || mat(0x8a6a3d, { r: 0.85 }), mRod = mat(0xf2b81f, { r: 0.6 });
    var g = new THREE.Group(), fixo = new THREE.Group(), guardaTopo = new THREE.Group(); g.add(fixo); g.add(guardaTopo);
    var comp = baias * L, alt = niveis * H, i, n;
    for (i = 0; i <= baias; i++) [0, W].forEach(function(z){
      barra(new THREE.Vector3(i * L, 0.05, z), new THREE.Vector3(i * L, alt + 1.05, z), r, mT, fixo, 8);
      caixa(0.18, 0.02, 0.18, mT, i * L, 0.01, z, fixo);                  // sapata
    });
    for (n = 1; n <= niveis; n++){
      var y = n * H;
      [0, W].forEach(function(z){ barra(new THREE.Vector3(0, y, z), new THREE.Vector3(comp, y, z), r, mT, fixo, 8); });
      for (i = 0; i <= baias; i++) barra(new THREE.Vector3(i * L, y, 0), new THREE.Vector3(i * L, y, W), r, mT, fixo, 8);
      for (i = 0; i < baias; i++){
        for (var p = 0; p < 3; p++) caixa(L - 0.04, 0.04, W / 3 - 0.03, mP, i * L + L / 2, y + 0.04, W / 6 + p * W / 3, fixo);
        // diagonal de contraventamento na face externa, alternando o sentido
        var a0 = new THREE.Vector3(i * L, y - H, W), a1 = new THREE.Vector3((i + 1) * L, y, W);
        if (i % 2) { a0.x += L; a1.x -= L; }
        barra(a0, a1, r * 0.8, mT, fixo, 6);
      }
      // guarda-corpo (0,5 m e 1,0 m) e rodapé na face de trabalho; o do último nível fica separado
      var alvo = n === niveis ? guardaTopo : fixo;
      [0.5, 1.0].forEach(function(h){ barra(new THREE.Vector3(0, y + h, W + 0.05), new THREE.Vector3(comp, y + h, W + 0.05), r * 0.9, mT, alvo, 8); });
      caixa(comp, 0.15, 0.02, mRod, comp / 2, y + 0.135, W + 0.06, alvo);
      // fechamento lateral nas cabeceiras
      [0, comp].forEach(function(x){ [0.5, 1.0].forEach(function(h){ barra(new THREE.Vector3(x, y + h, 0), new THREE.Vector3(x, y + h, W), r * 0.9, mT, fixo, 8); }); });
    }
    // escada de acesso na primeira baia
    [0.35, 0.75].forEach(function(z){ barra(new THREE.Vector3(0.3, 0.05, z), new THREE.Vector3(0.3, alt, z), 0.02, mRod, fixo, 6); });
    for (var d = 0.3; d < alt; d += 0.3) barra(new THREE.Vector3(0.3, d, 0.35), new THREE.Vector3(0.3, d, 0.75), 0.015, mRod, fixo, 5);
    fundir(fixo); fundir(guardaTopo);
    g.traverse(function(o){ o.userData.oco = true; });   // estrutura vazada: gente trabalha dentro dela
    g.userData = { guardaTopo: guardaTopo, comp: comp, largura: W, altura: alt };
    return g;
  }
  // Torna um grupo "desvanecível": materiais próprios e transparentes, para entrar e sair de cena sem salto
  function desvanecivel(grupo){
    var mats = [];
    grupo.traverse(function(o){ if (o.isMesh){ o.material = o.material.clone(); o.material.transparent = true; mats.push(o.material); } });
    grupo.userData.opacidade = function(op){ mats.forEach(function(m){ m.opacity = op; m.depthWrite = op > 0.98; }); grupo.visible = op > 0.01; };
    return grupo;
  }
  // EPI visível no trabalhador: abafador, máscara PFF2, óculos e cinto paraquedista
  function epi(p, itens){
    var g = new THREE.Group(); p.add(g);
    if (itens.indexOf('abafador') >= 0){
      var mAb = mat(0xd9342b, { r: 0.45 });
      [-1, 1].forEach(function(s){ var c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), mAb); c.rotation.z = Math.PI / 2; c.position.set(s * 0.128, 1.6, 0); g.add(c); });
      var arco = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.012, 6, 20, Math.PI), mat(0x2a2f32, { r: 0.5 })); arco.position.set(0, 1.6, 0); g.add(arco);
    }
    if (itens.indexOf('mascara') >= 0){ var m = caixaRedonda(0.12, 0.085, 0.06, 0.025, mat(0xf2f4f5, { r: 0.7 })); m.position.set(0, 1.545, 0.1); g.add(m); }
    if (itens.indexOf('oculos') >= 0){ var o = caixaRedonda(0.2, 0.05, 0.035, 0.015, new THREE.MeshPhysicalMaterial({ color: 0x9fd6dc, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.6, clearcoat: 1 })); o.position.set(0, 1.625, 0.112); g.add(o); }
    if (itens.indexOf('cinto') >= 0){
      var mC = mat(0xf2b81f, { r: 0.6 });
      [-1, 1].forEach(function(s){ var al = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 6, 20), mC); al.scale.set(0.55, 1, 0.75); al.rotation.y = Math.PI / 2; al.position.set(s * 0.08, 1.17, 0); g.add(al); });
      var cint = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.02, 6, 24), mC); cint.rotation.x = Math.PI / 2; cint.scale.y = 0.75; cint.position.y = 0.9; g.add(cint);
    }
    g.traverse(function(o){ if (o.isMesh) o.castShadow = true; });
    return g;
  }
  // Árvores instanciadas (copa cônica ou arredondada) — vegetação sem custo de malha por árvore
  function arvores(lista){
    if (!lista.length) return;
    var n = lista.length, dummy = new THREE.Object3D(), cor = new THREE.Color();
    var tronco = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.16, 1, 6), mat(0x3b2a1e, { r: 0.95 }), n);
    var copaA = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1, 9), mat(0xffffff, { r: 0.9 }), n);
    var copaB = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mat(0xffffff, { r: 0.9 }), n);
    lista.forEach(function(a, i){
      var h = a.h || 4, conica = a.tipo !== 'redonda';
      dummy.position.set(a.x, a.y + h * 0.2, a.z); dummy.rotation.set(0, Math.random() * 6, 0); dummy.scale.set(1, h * 0.4, 1); dummy.updateMatrix(); tronco.setMatrixAt(i, dummy.matrix);
      cor.setHSL(0.25 + Math.random() * 0.08, 0.35 + Math.random() * 0.2, 0.12 + Math.random() * 0.08).convertSRGBToLinear();
      if (conica){
        dummy.position.set(a.x, a.y + h * 0.62, a.z); dummy.scale.set(h * 0.27, h * 0.78, h * 0.27); dummy.updateMatrix(); copaA.setMatrixAt(i, dummy.matrix); copaA.setColorAt(i, cor);
        dummy.scale.set(0, 0, 0); dummy.updateMatrix(); copaB.setMatrixAt(i, dummy.matrix); copaB.setColorAt(i, cor);
      } else {
        dummy.position.set(a.x, a.y + h * 0.66, a.z); dummy.scale.set(h * 0.32, h * 0.3, h * 0.32); dummy.updateMatrix(); copaB.setMatrixAt(i, dummy.matrix); copaB.setColorAt(i, cor);
        dummy.scale.set(0, 0, 0); dummy.updateMatrix(); copaA.setMatrixAt(i, dummy.matrix); copaA.setColorAt(i, cor);
      }
    });
    [tronco, copaA, copaB].forEach(function(m){ m.castShadow = true; m.receiveShadow = true; cena.add(m); });
  }

  /* ── Cenário do cliente ── */
  var kit = {
    THREE: THREE, cena: cena, cam: cam, COR: COR, HALO: HALO,
    mat: mat, basico: basico, caixa: caixa, cilindro: cilindro, caixaRedonda: caixaRedonda,
    halo: halo, textoTex: textoTex, cantos: cantos, pessoa: pessoa, aoCarregarFonte: aoCarregarFonte, R: R,
    barra: barra, trelica: trelica, fundir: fundir, fita: fita, texturaProc: texturaProc, granulado: granulado, carro: carro, arvores: arvores, roda: roda, epi: epi, andaime: andaime, desvanecivel: desvanecivel
  };
  // Grua de montagem da clínica: torre treliçada, lança, contralança com contrapeso e cabo com gancho
  (function montarGrua2(){
    var mG = mat(0xD6B17D, { r: 0.4, m: 0.6 });
    var torreG = trelica(20, 0.9, mG); grua2.add(torreG);
    var lancaG = trelica(9, 0.7, mG); lancaG.rotation.z = -Math.PI / 2; lancaG.position.set(0, 20.4, 0); grua2.add(lancaG);
    var contra = trelica(3.6, 0.7, mG); contra.rotation.z = Math.PI / 2; contra.position.set(0, 20.4, 0); grua2.add(contra);
    caixa(1.2, 0.9, 0.9, mat(0x5a6266, { r: 0.8 }), -3, 20.2, 0, grua2);
    var cab = caixaRedonda(0.9, 0.9, 0.9, 0.12, mat(0xf2f4f5, { r: 0.3 })); cab.position.set(0.9, 19.7, 0.6); grua2.add(cab);
    barra(new THREE.Vector3(0, 23, 0), new THREE.Vector3(8.6, 20.8, 0), 0.03, mat(0x2a2f32), grua2);
    barra(new THREE.Vector3(0, 23, 0), new THREE.Vector3(-3.4, 20.8, 0), 0.03, mat(0x2a2f32), grua2);
    var ponta = trelica(2.6, 0.5, mG, { afina: 0.3 }); ponta.position.set(0, 20.6, 0); grua2.add(ponta);
    barra(new THREE.Vector3(6.2, 20.1, 0), new THREE.Vector3(6.2, 13, 0), 0.02, mat(0x2a2f32), grua2);
    caixa(0.3, 0.4, 0.3, mat(0xffb020, { r: 0.4, m: 0.5 }), 6.2, 12.8, 0, grua2);
  })();
  var mundo = CENARIOS[R.cenario](kit);
  // Gancho de inspeção para a auditoria automática de colisões (scripts de QA)
  window.__cena3d = { cena: cena, mundo: mundo, THREE: THREE, rend: rend };
  // Contrato do cenário: viajante, destinoViajante(modo), alertas{modo:[x,y,z,yOnda]}, modosRisco[],
  // fluxo{ida, volta}, fogos[x,z], aplicarModo(modo), quadro(dt, k, relogio, modo), placar(n)

  function dispararFogos(){
    var c = mundo.fogos;
    for (var i = 0; i < NFG; i++){
      var burst = i % 4, bx = c[0] + [-8, 8, -4, 5][burst], by = 16 + burst, bz = c[1] + [-4, -6, 6, 4][burst];
      fgPos[i * 3] = bx; fgPos[i * 3 + 1] = by; fgPos[i * 3 + 2] = bz;
      var th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), sp = 4 + Math.random() * 3;
      fgVel[i] = [Math.sin(ph) * Math.cos(th) * sp, Math.cos(ph) * sp, Math.sin(ph) * Math.sin(th) * sp];
    }
    fgGeo.attributes.position.needsUpdate = true; fogos.material.opacity = 1; fogosVida = 2.4;
  }

  /* ── Pós-processamento ── */
  var composer = null;
  if (THREE.EffectComposer && THREE.UnrealBloomPass){
    composer = new THREE.EffectComposer(rend);
    composer.addPass(new THREE.RenderPass(cena, cam));
    composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.55, 0.5, 0.9));
  }

  /* ── Estado de animação ── */
  var alvoPos = new THREE.Vector3(44, 20, 40), alvoLook = new THREE.Vector3(16, 3, -2), look = alvoLook.clone();
  cam.position.set(70, 50, 80);
  var modo = 'neutro', torreAlvo = 0, andarAtivo = -1, relogio = 0, rodando = true, cenaAtual = null;
  var corAnel = new THREE.Color(COR.ciano), corAlvo = new THREE.Color(COR.ciano);

  function aplicarModo(){
    var risco = mundo.modosRisco.indexOf(modo) >= 0;
    corAlvo.setHex(modo === 'verde' ? COR.ok : risco ? COR.risco : COR.ciano);
    var ap = mundo.alertas[modo];
    alerta.visible = ondaAlerta.visible = !!ap;
    if (ap){ alerta.position.set(ap[0], ap[1], ap[2]); ondaAlerta.position.set(ap[0], ap[3], ap[2]); }
    luzRisco.position.copy(alerta.position);
    document.body.classList.toggle('alarme', modo === 'acidente');
    fluxo.visible = ['virada', 'clinica', 'verde'].indexOf(modo) >= 0;
    scanner.visible = modo === 'clinica';
    grua2.visible = modo === 'clinica';
    if (modo === 'verde') dispararFogos();
    mundo.aplicarModo(modo, cenaAtual);
  }

  function ir(nome){
    var c = R.cenas[nome] || R.cenas.capa;
    var largo = innerWidth > 980 && nome !== 'fundo';
    var desvio = largo ? (c.modo === 'clinica' ? 4.2 : 6) : 0;
    alvoPos.set(c.pos[0] - desvio * 0.5, c.pos[1], c.pos[2] + (largo ? 0 : 10));
    alvoLook.set(c.alvo[0] - desvio, c.alvo[1], c.alvo[2]);
    modo = c.modo; torreAlvo = c.torre; cenaAtual = c;
    andarAtivo = c.andar === undefined ? (c.torre === NAND ? NAND : -1) : c.andar;
    aplicarModo();
  }

  var ult = performance.now(), tmp = new THREE.Vector3();
  function quadro(agora){
    if (!rodando) return;
    requestAnimationFrame(quadro);
    agora = agora || performance.now();
    // O timestamp do rAF pode chegar um pouco antes de performance.now(): dt negativo quebraria as curvas
    var dt0 = Math.max(0, Math.min(0.05, (agora - ult) / 1000)); ult = agora;
    // QA: a auditoria automática pode avançar a simulação em vários passos por quadro (renderizador por software)
    var passos = window.__qaPassos || 1;
    for (var ps = 0; ps < passos; ps++) atualizar(passos > 1 ? 0.05 : dt0);
    if (composer) composer.render(); else rend.render(cena, cam);
  }
  function atualizar(dt){
    relogio += dt;
    var k = 1 - Math.pow(0.12, dt);   // suavização independente do fps

    tmp.set(Math.sin(relogio * 0.25) * 0.6, Math.sin(relogio * 0.33) * 0.3, 0).add(alvoPos);
    cam.position.lerp(tmp, k * 0.9);
    look.lerp(alvoLook, k);
    cam.lookAt(look);

    corAnel.lerp(corAlvo, k);
    todos.forEach(function(pp){
      var u = pp.userData, s = Math.sin(relogio * 3 + u.fase);
      u.anel.material.color.copy(corAnel); u.anel.material.opacity = 0.7 + s * 0.25;
      u.anel.scale.setScalar(0.95 + s * 0.08);
    });

    // Torre da clínica
    andares.forEach(function(an, i){
      var mostra = i < torreAlvo;
      an.g.visible = an.g.scale.y > 0.01 || mostra;
      an.g.scale.y += ((mostra ? 1 : 0.001) - an.g.scale.y) * k * 0.8;
      var lig = andarAtivo === NAND ? 0.85 : i === andarAtivo ? 1 : mostra ? 0.22 : 0;
      an.teto.material.opacity += (lig * 0.9 - an.teto.material.opacity) * k;
      an.miolo.material.opacity += (lig * 0.2 - an.miolo.material.opacity) * k;
      an.rot.material.opacity += ((i === andarAtivo || andarAtivo === NAND ? 1 : mostra ? 0.45 : 0) - an.rot.material.opacity) * k;
    });
    var completa = torreAlvo >= NAND;
    cobertura.visible = andares[NAND - 1].g.scale.y > 0.9;
    letClinica.material.opacity += ((completa ? 1 : torreAlvo > 0 ? 0.25 : 0) - letClinica.material.opacity) * k;
    luzClinica.intensity = torreAlvo > 0 ? 1.4 : 0;
    luzClinica.position.y = (Math.max(0, andarAtivo === NAND ? 3 : andarAtivo) * 2.6 + 1.6) * ESC_TORRE;
    haloClinica.material.opacity += ((torreAlvo > 0 ? 0.35 : 0.05) - haloClinica.material.opacity) * k;
    contornoBase.material.opacity = torreAlvo === 0 ? 0.35 + Math.sin(relogio * 2) * 0.25 : 0.15;

    // Mundo do cliente
    mundo.quadro(dt, k, relogio, modo);

    // Trabalhador protagonista
    // O destino pode ser um ponto [x, z] ou uma rota [[x, z], ...] que contorna tapumes, postes e veículos
    var viajante = mundo.viajante, dest = mundo.destinoViajante(modo), uv = viajante.userData;
    if (Array.isArray(dest[0])){
      if (uv.rotaModo !== modo){
        // Entra na rota pelo ponto mais próximo de onde está
        uv.rotaModo = modo; uv.rotaI = 0; var melhor = 1e9;
        dest.forEach(function(p, i){ var d = Math.hypot(p[0] - viajante.position.x, p[1] - viajante.position.z); if (d < melhor){ melhor = d; uv.rotaI = i; } });
      }
      var wp = dest[Math.min(uv.rotaI, dest.length - 1)], dxw = wp[0] - viajante.position.x, dzw = wp[1] - viajante.position.z, dw = Math.hypot(dxw, dzw);
      var passo = Math.min(dw, 3.2 * dt);
      if (dw > 1e-4){ viajante.position.x += dxw / dw * passo; viajante.position.z += dzw / dw * passo; }
      if (dw < 0.15 && uv.rotaI < dest.length - 1) uv.rotaI++;
    } else {
      uv.rotaModo = null;
      viajante.position.x += (dest[0] - viajante.position.x) * k * 0.35;
      viajante.position.z += (dest[1] - viajante.position.z) * k * 0.35;
    }
    // Passada: braços e pernas balançam conforme a velocidade de cada pessoa
    todos.forEach(function(pp){
      var u = pp.userData, vel = pp.position.distanceTo(u.ult) / Math.max(dt, 0.001);
      if (vel > 0.15) pp.rotation.y = Math.atan2(pp.position.x - u.ult.x, pp.position.z - u.ult.z);
      u.ult.copy(pp.position);
      var amp = Math.min(0.6, vel * 0.35), fase = relogio * 7 + u.fase;
      u.pernas[0].rotation.x = Math.sin(fase) * amp; u.pernas[1].rotation.x = -Math.sin(fase) * amp;
      u.bracos[0].rotation.x = -Math.sin(fase) * amp * 0.8; u.bracos[1].rotation.x = Math.sin(fase) * amp * 0.8;
      if (amp < 0.02) u.bracos[0].rotation.x = Math.sin(relogio * 1.2 + u.fase) * 0.05;
      // Pose fixa (segurando ferramenta, bloco, placa): braços no ângulo pedido
      if (u.pose){ u.bracos[0].rotation.x = u.pose[0]; u.bracos[1].rotation.x = u.pose[1]; if (u.pose.length > 2){ u.bracos[0].rotation.z = u.pose[2]; u.bracos[1].rotation.z = -u.pose[2]; } }
    });
    scanner.position.set(viajante.position.x, 0.2 + (Math.sin(relogio * 2) + 1) * 0.75, viajante.position.z);

    // Alerta
    nucleo.rotation.y += dt * 2;
    feixe.material.opacity = 0.12 + Math.sin(relogio * 6) * 0.08;
    var onda = (relogio * 0.8) % 1;
    ondaAlerta.scale.setScalar(1 + onda * 4); ondaAlerta.material.opacity = (1 - onda) * 0.6;
    luzRisco.intensity = alerta.visible ? 3 + Math.sin(relogio * 6) * 2 : 0;

    // Fluxo dourado: cliente → clínica → cliente
    if (fluxo.visible){
      var curva = modo === 'verde' ? mundo.fluxo.volta : mundo.fluxo.ida;
      for (var i = 0; i < NFL; i++){
        fluxoT[i] = (fluxoT[i] + dt * 0.1) % 1;
        var pt = curva.getPoint(fluxoT[i]);
        fluxoPos[i * 3] = pt.x + Math.sin(i) * 0.3;
        fluxoPos[i * 3 + 1] = pt.y + Math.sin(relogio * 2 + i) * 0.15 + 0.1;
        fluxoPos[i * 3 + 2] = pt.z + Math.cos(i) * 0.3;
      }
      fluxoGeo.attributes.position.needsUpdate = true;
    }
    // Fogos
    if (fogosVida > 0){
      fogosVida -= dt;
      for (var j = 0; j < NFG; j++){
        fgVel[j][1] -= 4 * dt;
        fgPos[j * 3] += fgVel[j][0] * dt; fgPos[j * 3 + 1] += fgVel[j][1] * dt; fgPos[j * 3 + 2] += fgVel[j][2] * dt;
      }
      fgGeo.attributes.position.needsUpdate = true;
      fogos.material.opacity = Math.max(0, fogosVida / 2.4);
      if (fogosVida <= 0 && modo === 'verde') setTimeout(function(){ if (modo === 'verde') dispararFogos(); }, 1800);
    }
    poeira.rotation.y += dt * 0.01;
  }
  requestAnimationFrame(quadro);

  addEventListener('resize', function(){
    cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix();
    rend.setSize(innerWidth, innerHeight);
    if (composer) composer.setSize(innerWidth, innerHeight);
  });
  document.addEventListener('visibilitychange', function(){
    rodando = !document.hidden;
    if (rodando){ ult = performance.now(); requestAnimationFrame(quadro); }
  });
  // Textos do canvas dependem da fonte Sora carregada
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ redesenhos.forEach(function(fn){ fn(); }); });

  return { ir: ir, placar: function(n){ mundo.placar(n); }, desenharPaineis: desenharPaineis, nAndares: NAND };
})();
/* ── FIM BLOCO ── */
