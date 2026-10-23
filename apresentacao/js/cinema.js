/* Cinema: tudo o que transforma a maquete em imagem de cinema, comum a todos os cenários.
   - Atmosfera: céu físico com hora do dia (entardecer dourado → hora azul na entrega), sol baixo com sombras longas,
     mapa de ambiente para reflexos PBR, névoa da cor do horizonte, estrelas.
   - Mundo: chão natural (gramado, terra, capim seco) com variação em grande escala, mata ao redor,
     morros e silhueta de cidade no horizonte (janelas acendem ao anoitecer).
   - Lente: oclusão ambiente (SSAO), foco seletivo (bokeh) nas cenas de assunto, tilt-shift de maquete nas
     cenas de visão geral, bloom, gradação de cor por clima da cena, vinheta, aberração cromática e grão.
   - Qualidade adaptativa: mede o computador e liga o que ele aguenta (força com ?q=alto|medio|baixo). */

/* ═══ BLOCO: CINEMA ═══ */
window.Cinema = (function(){
  function suave(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  function ruido(x, z){ return Math.sin(x * 0.021 + z * 0.013) * 0.5 + Math.sin(x * 0.047 - z * 0.031 + 1.7) * 0.35 + Math.sin(x * 0.11 + z * 0.093 + 4.1) * 0.15; }

  /* ── Atmosfera: céu, sol, luz de preenchimento, névoa e mapa de ambiente ── */
  function atmosfera(THREE, cena, rend){
    rend.toneMappingExposure = 0.74;
    var ceu = new THREE.Sky(); ceu.scale.setScalar(700); cena.add(ceu);
    var U = ceu.material.uniforms;
    U.turbidity.value = 7.5; U.rayleigh.value = 1.9; U.mieCoefficient.value = 0.0055; U.mieDirectionalG.value = 0.86;
    var AZIM = THREE.MathUtils.degToRad(232);   // sol baixo a oeste-sudoeste: luz lateral quente e sombras longas
    var dirSol = new THREE.Vector3();
    var sol = new THREE.DirectionalLight(0xffc48a, 2.6);
    sol.castShadow = true; sol.shadow.mapSize.set(4096, 4096);
    var sc = sol.shadow.camera; sc.left = -75; sc.right = 75; sc.top = 60; sc.bottom = -60; sc.near = 1; sc.far = 260;
    sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.05; sol.shadow.radius = 2;
    cena.add(sol); cena.add(sol.target); sol.target.position.set(10, 0, -4);
    var hemi = new THREE.HemisphereLight(0xbcd7ff, 0x4b3f30, 0.55); cena.add(hemi);
    var preench = new THREE.DirectionalLight(0x8fb4ff, 0.35); preench.position.set(60, 30, -60); cena.add(preench);
    cena.fog = new THREE.FogExp2(0xcdbba4, 0.0036);

    // Estrelas para a hora azul
    var N = 900, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3);
    for (var i = 0; i < N; i++){
      var th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 0.42, r = 600;
      p[i * 3] = Math.cos(th) * Math.sin(ph) * r; p[i * 3 + 1] = Math.cos(ph) * r; p[i * 3 + 2] = Math.sin(th) * Math.sin(ph) * r;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    var estrelas = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    cena.add(estrelas);

    // Mapas de ambiente pré-calculados (dia dourado e hora azul): reflexos PBR coerentes com o céu
    var pmrem = new THREE.PMREMGenerator(rend);
    function ambiente(elev){
      var s = new THREE.Scene(), c = new THREE.Sky(); c.scale.setScalar(50); s.add(c);
      ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG'].forEach(function(k){ c.material.uniforms[k].value = U[k].value; });
      c.material.uniforms.sunPosition.value.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), AZIM);
      var t = pmrem.fromScene(s, 0.02).texture; c.material.dispose(); return t;
    }
    var envDia = ambiente(17), envNoite = ambiente(-1.5);
    cena.environment = envDia;

    var cDiaNevoa = new THREE.Color(0xcdbba4), cNoiteNevoa = new THREE.Color(0x26344c), tmp = new THREE.Color();
    var hora = 0, horaAlvo = 0;
    function aplicar(){
      var elev = 17 - hora * 19.5;   // de 15° (entardecer) a −2,5° (hora azul)
      dirSol.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), AZIM);
      U.sunPosition.value.copy(dirSol);
      sol.position.copy(sol.target.position).addScaledVector(dirSol, 160);
      var dia = 1 - suave(hora * 1.25);
      sol.intensity = 3.0 * dia + 0.05;
      sol.color.setHSL(0.08, 0.9, 0.62 + 0.08 * dia);
      hemi.intensity = 0.85 - 0.05 * dia;
      hemi.color.setHex(0xc8dcff).lerp(tmp.setHex(0x5f78b8), 1 - dia); hemi.groundColor.setHex(0x5a4a38).lerp(tmp.setHex(0x1e2638), 1 - dia);
      preench.intensity = 0.22 + 0.13 * dia;
      cena.fog.color.copy(cDiaNevoa).lerp(cNoiteNevoa, suave(hora));
      cena.fog.density = 0.0036 + 0.0024 * hora;
      U.rayleigh.value = 1.9 + hora * 1.1;
      rend.toneMappingExposure = 0.74 + hora * 0.66;
      estrelas.material.opacity = suave((hora - 0.55) / 0.45) * 0.85;
      cena.environment = hora > 0.55 ? envNoite : envDia;
    }
    aplicar();
    return {
      sol: sol, hemi: hemi, ceu: ceu,
      noite: function(sim){ horaAlvo = sim ? 1 : 0; },
      hora: function(){ return hora; },
      atualizar: function(dt){
        if (Math.abs(horaAlvo - hora) > 0.001){ hora += (horaAlvo - hora) * (1 - Math.pow(0.35, dt)); aplicar(); }
      }
    };
  }

  /* ── Mundo ao redor: chão natural, mata e horizonte com morros e cidade ── */
  function mundo(THREE, cena, area){
    // area = { x0, x1, z0, z1 }: retângulo do cenário (sem mata nem morro dentro)
    var TAM = 1100, SEG = 220;
    var geo = new THREE.PlaneGeometry(TAM, TAM, SEG, SEG); geo.rotateX(-Math.PI / 2);
    var pos = geo.attributes.position, cor = new Float32Array(pos.count * 3), c = new THREE.Color();
    var cGrama = new THREE.Color(0x3d6a28), cSeco = new THREE.Color(0x8a8a4a), cTerra = new THREE.Color(0x8a5a3c), cEscuro = new THREE.Color(0x24451c);
    for (var i = 0; i < pos.count; i++){
      var x = pos.getX(i), z = pos.getZ(i), n = ruido(x, z), n2 = ruido(x * 3.1 + 40, z * 2.7 - 15);
      c.copy(cGrama).lerp(cSeco, suave((n + 0.3) * 1.2) * 0.45).lerp(cEscuro, suave(n2 - 0.1) * 0.5);
      // dentro do cenário o chão é terra batida de obra
      var dentro = x > area.x0 && x < area.x1 && z > area.z0 && z < area.z1;
      if (dentro) c.lerp(cTerra, 0.55 + 0.25 * n2);
      c.convertSRGBToLinear(); cor[i * 3] = c.r; cor[i * 3 + 1] = c.g; cor[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cor, 3));
    var det = document.createElement('canvas'); det.width = det.height = 512;
    var gx = det.getContext('2d'); gx.fillStyle = '#808080'; gx.fillRect(0, 0, 512, 512);
    for (var k = 0; k < 26000; k++){ var v = 90 + Math.random() * 90 | 0; gx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; gx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5); }
    var tex = new THREE.CanvasTexture(det); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(160, 160); tex.anisotropy = 8;
    var chao = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, map: tex, roughness: 1, color: 0xd0d0d0 }));
    chao.receiveShadow = true; chao.position.y = -0.005; cena.add(chao);

    // Mata no entorno (fora do cenário), instanciada
    var lista = [];
    for (var t = 0; t < 4000 && lista.length < 650; t++){
      var ang = Math.random() * Math.PI * 2, rr = 90 + Math.pow(Math.random(), 0.7) * 260;
      var tx = Math.cos(ang) * rr + 10, tz = Math.sin(ang) * rr - 5;
      if (tx > area.x0 - 25 && tx < area.x1 + 25 && tz > area.z0 - 25 && tz < area.z1 + 25) continue;
      if (ruido(tx * 1.7, tz * 1.7) < -0.05) continue;   // capões de mata, não plantio uniforme
      lista.push([tx, tz, 4 + Math.random() * 6, Math.random() < 0.6]);
    }
    var n = lista.length, d = new THREE.Object3D(), cc = new THREE.Color();
    var tronco = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.2, 1, 6), new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 1 }), n);
    var copa = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), n);
    lista.forEach(function(a, i){
      var h = a[2];
      d.position.set(a[0], h * 0.2, a[1]); d.rotation.set(0, 0, 0); d.scale.set(1, h * 0.4, 1); d.updateMatrix(); tronco.setMatrixAt(i, d.matrix);
      d.position.set(a[0], h * (a[3] ? 0.62 : 0.7), a[1]); d.rotation.set(0, Math.random() * 6, 0);
      d.scale.set(h * (a[3] ? 0.34 : 0.26), h * (a[3] ? 0.32 : 0.5), h * (a[3] ? 0.34 : 0.26)); d.updateMatrix(); copa.setMatrixAt(i, d.matrix);
      cc.setHSL(0.24 + Math.random() * 0.08, 0.35 + Math.random() * 0.2, 0.13 + Math.random() * 0.09).convertSRGBToLinear(); copa.setColorAt(i, cc);
    });
    [tronco, copa].forEach(function(m){ m.castShadow = true; m.receiveShadow = true; cena.add(m); });

    // Morros no horizonte (a névoa os pinta com a cor do céu)
    var mMorro = new THREE.MeshStandardMaterial({ color: 0x3d5a3a, roughness: 1, flatShading: true });
    for (var m = 0; m < 46; m++){
      var a2 = m / 46 * Math.PI * 2 + Math.random() * 0.08, r2 = 380 + Math.random() * 120, hh = 30 + Math.random() * 70;
      var morro = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mMorro);
      morro.scale.set(60 + Math.random() * 80, hh, 50 + Math.random() * 60); morro.position.set(Math.cos(a2) * r2, -2, Math.sin(a2) * r2); cena.add(morro);
    }
    // Silhueta de cidade a nordeste, com janelas que acendem na hora azul
    var jan = document.createElement('canvas'); jan.width = 64; jan.height = 128;
    var jx = jan.getContext('2d'); jx.fillStyle = '#000'; jx.fillRect(0, 0, 64, 128);
    for (var y = 4; y < 128; y += 8) for (var x = 4; x < 64; x += 8) if (Math.random() < 0.55){ jx.fillStyle = Math.random() < 0.8 ? '#ffd08a' : '#bfe4ff'; jx.fillRect(x, y, 4, 4); }
    var tJan = new THREE.CanvasTexture(jan); tJan.wrapS = tJan.wrapT = THREE.RepeatWrapping;
    var mPredio = new THREE.MeshStandardMaterial({ color: 0x4a5560, roughness: 0.6, metalness: 0.2, emissive: 0xffffff, emissiveMap: tJan, emissiveIntensity: 0 });
    var NP = 140, predios = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mPredio, NP);
    for (var b = 0; b < NP; b++){
      var a3 = THREE.MathUtils.degToRad(-75 + Math.random() * 70), r3 = 240 + Math.random() * 110, hb = 12 + Math.pow(Math.random(), 2) * 70;
      d.position.set(Math.cos(a3) * r3, hb / 2, Math.sin(a3) * r3); d.rotation.set(0, Math.random() * 3, 0);
      d.scale.set(10 + Math.random() * 14, hb, 10 + Math.random() * 14); d.updateMatrix(); predios.setMatrixAt(b, d.matrix);
    }
    cena.add(predios);
    return { chao: chao, janelasCidade: function(v){ mPredio.emissiveIntensity = v * 0.9; } };
  }

  /* ── Lente: pós-processamento cinematográfico ── */
  var GRADE = {
    uniforms: {
      tDiffuse: { value: null }, tempo: { value: 0 }, satur: { value: 1.06 }, contraste: { value: 1.06 },
      tinta: { value: null }, sombra: { value: null }, vinheta: { value: 0.3 }, grao: { value: 0.028 }, aberr: { value: 0.00035 }, res: { value: null }
    },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform float tempo, satur, contraste, vinheta, grao, aberr; uniform vec3 tinta, sombra; uniform vec2 res; varying vec2 vUv;',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
      'void main(){',
      '  vec2 d = vUv - 0.5; float r2 = dot(d, d);',
      '  vec3 c; c.r = texture2D(tDiffuse, vUv + d * aberr * 4.0 * r2 * 8.0).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv - d * aberr * 4.0 * r2 * 8.0).b;',
      '  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));',
      '  c = mix(vec3(l), c, satur);',
      '  c = (c - 0.5) * contraste + 0.5;',
      '  c *= tinta; c += sombra * (1.0 - smoothstep(0.0, 0.45, l));',
      '  c *= 1.0 - vinheta * smoothstep(0.15, 0.85, r2 * 2.2);',
      '  c += (hash(vUv * res + tempo * 61.0) - 0.5) * grao;',
      '  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);',
      '}'
    ].join('\n')
  };
  var CLIMAS = {
    neutro:  { satur: 1.12, contraste: 1.08, tinta: [1.01, 1.0, 0.97], sombra: [0.0, 0.012, 0.03] },
    risco:   { satur: 0.82, contraste: 1.12, tinta: [0.94, 1.0, 1.05], sombra: [0.0, 0.02, 0.04] },
    acidente:{ satur: 0.68, contraste: 1.16, tinta: [1.08, 0.93, 0.92], sombra: [0.03, 0.0, 0.0] },
    clinica: { satur: 1.06, contraste: 1.05, tinta: [1.04, 1.0, 0.95], sombra: [0.0, 0.012, 0.02] },
    verde:   { satur: 1.15, contraste: 1.08, tinta: [1.06, 1.0, 0.93], sombra: [0.0, 0.01, 0.04] }
  };

  function lente(THREE, rend, cena, cam){
    var w = innerWidth, h = innerHeight;
    var rt = rend.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget
      ? new THREE.WebGLMultisampleRenderTarget(w * rend.getPixelRatio(), h * rend.getPixelRatio(), { format: THREE.RGBAFormat, encoding: THREE.sRGBEncoding })
      : undefined;
    if (rt) rt.samples = 4;
    var composer = new THREE.EffectComposer(rend, rt);
    composer.addPass(new THREE.RenderPass(cena, cam));
    var ssao = null;
    if (THREE.SSAOPass){
      ssao = new THREE.SSAOPass(cena, cam, w, h); ssao.kernelRadius = 0.9; ssao.minDistance = 0.0008; ssao.maxDistance = 0.04;
      composer.addPass(ssao);
    }
    var bokeh = THREE.BokehPass ? new THREE.BokehPass(cena, cam, { focus: 30, aperture: 0.00009, maxblur: 0.006, width: w, height: h }) : null;
    if (bokeh) composer.addPass(bokeh);
    var tiltH = THREE.HorizontalTiltShiftShader ? new THREE.ShaderPass(THREE.HorizontalTiltShiftShader) : null;
    var tiltV = THREE.VerticalTiltShiftShader ? new THREE.ShaderPass(THREE.VerticalTiltShiftShader) : null;
    if (tiltH){ composer.addPass(tiltH); composer.addPass(tiltV); }
    var bloom = new THREE.UnrealBloomPass(new THREE.Vector2(w, h), 0.3, 0.5, 0.94); composer.addPass(bloom);
    GRADE.uniforms.tinta.value = new THREE.Vector3(1, 1, 1); GRADE.uniforms.sombra.value = new THREE.Vector3(0, 0, 0); GRADE.uniforms.res.value = new THREE.Vector2(w, h);
    var grade = new THREE.ShaderPass(GRADE); composer.addPass(grade);
    var G = grade.uniforms;

    // Qualidade: forçada por ?q= ou medida nos primeiros quadros
    var forcada = new URLSearchParams(location.search).get('q'), nivel = forcada || 'medio', amostras = [], decidido = !!forcada;
    function aplicarNivel(){
      if (ssao) ssao.enabled = nivel === 'alto';
      rend.setPixelRatio(Math.min(devicePixelRatio, nivel === 'baixo' ? 1 : nivel === 'medio' ? 1.5 : 2));
      composer.setSize(innerWidth, innerHeight);
    }
    aplicarNivel();

    var estilo = 'foco', alvoClima = CLIMAS.neutro, foco = 30, focoAlvo = 30, bloomBase = 0.5, tempo = 0;
    function ligarEstilo(){
      var maquete = estilo === 'maquete';
      if (bokeh) bokeh.enabled = !maquete && nivel !== 'baixo';
      if (tiltH){ tiltH.enabled = tiltV.enabled = maquete; }
    }
    ligarEstilo();
    return {
      nivel: function(){ return nivel; },
      // estilo 'maquete' (tilt-shift de miniatura) nas visões gerais; 'foco' (profundidade de campo) nas cenas de assunto
      plano: function(st, clima, distanciaFoco){ estilo = st; alvoClima = CLIMAS[clima] || CLIMAS.neutro; focoAlvo = distanciaFoco; ligarEstilo(); },
      bloom: function(v){ bloomBase = v; },
      atualizar: function(dt){
        tempo += dt; G.tempo.value = tempo % 100;
        var k = 1 - Math.pow(0.2, dt);
        G.satur.value += (alvoClima.satur - G.satur.value) * k;
        G.contraste.value += (alvoClima.contraste - G.contraste.value) * k;
        G.tinta.value.x += (alvoClima.tinta[0] - G.tinta.value.x) * k; G.tinta.value.y += (alvoClima.tinta[1] - G.tinta.value.y) * k; G.tinta.value.z += (alvoClima.tinta[2] - G.tinta.value.z) * k;
        G.sombra.value.x += (alvoClima.sombra[0] - G.sombra.value.x) * k; G.sombra.value.y += (alvoClima.sombra[1] - G.sombra.value.y) * k; G.sombra.value.z += (alvoClima.sombra[2] - G.sombra.value.z) * k;
        foco += (focoAlvo - foco) * k;
        if (bokeh) bokeh.uniforms.focus.value = foco;
        if (tiltH){ tiltH.uniforms.h.value = 0.55 / innerWidth; tiltV.uniforms.v.value = 0.55 / innerHeight; tiltH.uniforms.r.value = tiltV.uniforms.r.value = 0.56; }
        bloom.strength = bloomBase;
        if (!decidido && dt > 0){
          amostras.push(dt);
          if (amostras.length === 90){
            var media = amostras.slice(20).reduce(function(a, b){ return a + b; }, 0) / 70, fps = 1 / media;
            nivel = fps > 50 ? 'alto' : fps > 28 ? 'medio' : 'baixo'; decidido = true; aplicarNivel(); ligarEstilo();
          }
        }
      },
      render: function(){ composer.render(); },
      setSize: function(W, H){ composer.setSize(W, H); G.res.value.set(W, H); if (ssao) ssao.setSize(W, H); }
    };
  }

  /* ── Travelling: trajetória curva entre planos, com aceleração e frenagem suaves ── */
  function travelling(THREE){
    var de = new THREE.Vector3(), para = new THREE.Vector3(), ctrl = new THREE.Vector3(), olharDe = new THREE.Vector3(), olharPara = new THREE.Vector3();
    var t = 1, dur = 2, ativo = false;
    function ease(x){ return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    return {
      iniciar: function(posAtual, olharAtual, posAlvo, olharAlvo){
        de.copy(posAtual); para.copy(posAlvo); olharDe.copy(olharAtual); olharPara.copy(olharAlvo);
        var dist = de.distanceTo(para);
        // ponto de controle: no meio do caminho, levantado e afastado do assunto — a câmera "sobrevoa" em vez de deslizar
        ctrl.copy(de).add(para).multiplyScalar(0.5);
        var fora = ctrl.clone().sub(olharPara).setY(0); if (fora.lengthSq() > 1e-4) fora.normalize();
        ctrl.addScaledVector(fora, dist * 0.18); ctrl.y += dist * 0.22;
        dur = Math.max(1.6, Math.min(3.4, 1.2 + dist / 22)); t = 0; ativo = dist > 0.5;
      },
      passo: function(dt, pos, olhar){
        if (!ativo) return false;
        t = Math.min(1, t + dt / dur); var e = ease(t), u = 1 - e;
        pos.set(u * u * de.x + 2 * u * e * ctrl.x + e * e * para.x, u * u * de.y + 2 * u * e * ctrl.y + e * e * para.y, u * u * de.z + 2 * u * e * ctrl.z + e * e * para.z);
        olhar.copy(olharDe).lerp(olharPara, ease(Math.min(1, t * 1.15)));
        if (t >= 1) ativo = false;
        return true;
      },
      ativo: function(){ return ativo; }
    };
  }

  return { atmosfera: atmosfera, mundo: mundo, lente: lente, travelling: travelling, suave: suave };
})();
/* ── FIM BLOCO ── */
