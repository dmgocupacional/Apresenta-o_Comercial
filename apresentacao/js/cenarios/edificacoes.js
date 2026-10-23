/* Cenário: edificações e incorporação — torre residencial subindo, grua, elevador cremalheira,
   tapume e placa de obra com o nome do cliente, contêineres de vivência, área de corte com poeira,
   caminhão betoneira na rua e stand de vendas. A torre fica pronta e acesa na entrega das chaves. */

/* ═══ BLOCO: CENARIO_EDIFICACOES ═══ */
CENARIOS.edificacoes = function(kit){
  var THREE = kit.THREE, cena = kit.cena, COR = kit.COR, mat = kit.mat, basico = kit.basico, caixa = kit.caixa,
      cilindro = kit.cilindro, caixaRedonda = kit.caixaRedonda, textoTex = kit.textoTex, pessoa = kit.pessoa, HALO = kit.HALO,
      barra = kit.barra, trelica = kit.trelica, roda = kit.roda;
  var V = function(x, y, z){ return new THREE.Vector3(x, y, z); };
  var MARCA = EMPRESA.nome.toUpperCase();
  var TORRE = [15, 0, -4];                 // centro da torre em obra
  var NPAV = 12, HPAV = 1.6;               // pavimentos e pé-direito
  var LAJE = 6 * HPAV + 0.22;              // última laje concretada com a obra em 55%
  var LARG = 10, PROF = 8;
  var PORTAO = [10.5, 0, 9];
  var FILA_TERC = [14.2, 0, 10.45];        // fila de terceiros na calçada, ao lado da passagem do portão
  var VIVENCIA = [1, 0, -11];
  var CORTE = [4, 0, 0.5];
  var STAND = [-27, 0, 1];
  var CORES_ETAPA = { fundacao: 0xc9862d, estrutura: COR.colete, alvenaria: 0x2e86c1, acabamento: 0x8e5bd6 };

  // Escreve texto centralizado num canvas, reduzindo a fonte até caber na largura
  function escrever(c, txt, x, y, larguraMax, peso, tam, cor){
    c.fillStyle = cor; c.font = peso + ' ' + tam + 'px Sora, sans-serif';
    while (c.measureText(txt).width > larguraMax && tam > 18){ tam -= 2; c.font = peso + ' ' + tam + 'px Sora, sans-serif'; }
    c.fillText(txt, x, y);
  }

  /* ── Rua e calçada ── */
  var rua = new THREE.Mesh(new THREE.PlaneGeometry(110, 4.2), kit.asfalto([40, 1.5]));
  rua.rotation.x = -Math.PI / 2; rua.position.set(0, 0.02, 13.4); rua.receiveShadow = true; cena.add(rua);
  for (var f = 0; f < 30; f++){
    var fx = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.12), basico(0xF0D2A4, 0.5));
    fx.rotation.x = -Math.PI / 2; fx.position.set(-48 + f * 3.4, 0.03, 13.4); cena.add(fx);
  }
  var calcada = new THREE.Mesh(new THREE.PlaneGeometry(110, 1.6), mat(0x9a978e, { r: 0.85 }));
  calcada.rotation.x = -Math.PI / 2; calcada.position.set(0, 0.03, 10.6); calcada.receiveShadow = true; cena.add(calcada);
  // Meio-fio e postes de iluminação pública
  caixa(110, 0.16, 0.16, mat(0x8d979a, { r: 0.85 }), 0, 0.08, 11.42);
  [-36, -24, -12, 18, 30, 42].forEach(function(x){
    var pg = new THREE.Group(); pg.position.set(x, 0, 10.0); cena.add(pg);
    cilindro(0.08, 0.12, 6.4, mat(0x6f7c80, { r: 0.4, m: 0.7 }), 0, 3.2, 0, pg, 12);
    var braco = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 6, 16, Math.PI / 2), mat(0x6f7c80, { r: 0.4, m: 0.7 })); braco.rotation.y = -Math.PI / 2; braco.position.set(0, 5.6, 0.8); pg.add(braco);
    var lum = caixaRedonda(0.32, 0.12, 0.7, 0.04, mat(0x3a4245, { r: 0.4, m: 0.6 })); lum.position.set(0, 6.42, 1.3); pg.add(lum);
    var lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.5), new THREE.MeshBasicMaterial({ color: 0xfff1d0, toneMapped: false, side: THREE.DoubleSide })); lamp.rotation.x = Math.PI / 2; lamp.position.set(0, 6.35, 1.3); pg.add(lamp);
  });
  // Terreno do canteiro, levemente mais claro
  var terreno = new THREE.Mesh(new THREE.PlaneGeometry(30, 25), mat(0x7a5c42, { r: 1 }));   // terra batida do canteiro
  terreno.rotation.x = -Math.PI / 2; terreno.position.set(15, 0.015, -3.5); terreno.receiveShadow = true; cena.add(terreno);
  var haloObra = kit.halo(0x6FE3EC, 40, TORRE[0], TORRE[2], 0.08);

  /* ── Torre em obra ── */
  var torre = new THREE.Group(); torre.position.set(TORRE[0], 0, TORRE[2]); cena.add(torre);
  var mLaje = mat(0x9aa6a9, { r: 0.85 }), mPilar = mat(0x7d898c, { r: 0.9 });
  var mFachada = mat(0x8d999e, { r: 0.7 }), mFaixaFach = mat(0xD6B17D, { r: 0.35, m: 0.6 });
  var mJanela = new THREE.MeshStandardMaterial({ color: 0x14323a, roughness: 0.15, metalness: 0.6, emissive: 0xffa94d, emissiveIntensity: 0 });
  var mJanelaApagada = new THREE.MeshStandardMaterial({ color: 0x0f262d, roughness: 0.12, metalness: 0.7 });
  // Na entrega, só parte dos apartamentos acende: fica com cara de prédio habitado
  function janelaMat(){ return Math.random() < 0.68 ? mJanela : mJanelaApagada; }
  var mGuarda = mat(0xff4a3a, { r: 0.5, e: 0x661410, ei: 0.2 }), mGuardaB = mat(0xf4f5f6, { r: 0.5 });
  var pavs = [];
  for (var p = 0; p < NPAV; p++){
    var pg = new THREE.Group(); pg.position.y = p * HPAV; torre.add(pg);
    // Estrutura: laje e pilares
    caixa(LARG + 0.4, 0.22, PROF + 0.4, mLaje, 0, 0.11, 0, pg);
    [[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]].forEach(function(q){
      caixa(0.34, HPAV - 0.22, 0.34, mPilar, q[0] * (LARG / 2 - 0.3), 0.22 + (HPAV - 0.22) / 2, q[1] * (PROF / 2 - 0.3), pg);
    });
    // Fachada pronta: paredes com janelas em fita (aparece com a evolução da obra)
    var fach = new THREE.Group(); pg.add(fach);
    [[0, PROF / 2 + 0.02, 0], [0, -PROF / 2 - 0.02, Math.PI]].forEach(function(lado){
      var parede = caixa(LARG, HPAV - 0.22, 0.12, mFachada, 0, 0.22 + (HPAV - 0.22) / 2, lado[1], fach);
      parede.rotation.y = lado[2];
      for (var j = 0; j < 5; j++){
        var jan = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), janelaMat());
        jan.position.set(-LARG / 2 + 1.05 + j * 2, 0.95, lado[1] + (lado[1] > 0 ? 0.08 : -0.08));
        if (lado[1] < 0) jan.rotation.y = Math.PI;
        fach.add(jan);
        // Varanda com guarda-corpo de vidro em cada janela da frente
        if (lado[1] > 0){
          caixa(1.7, 0.07, 0.42, mLaje, jan.position.x, 0.26, lado[1] + 0.25, fach);
          var vidro = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.42), basico(0x3d6a74, 0.12));
          vidro.position.set(jan.position.x, 0.5, lado[1] + 0.46); fach.add(vidro);
        }
      }
    });
    [[LARG / 2 + 0.02, Math.PI / 2], [-LARG / 2 - 0.02, -Math.PI / 2]].forEach(function(lado){
      var lat = caixa(PROF, HPAV - 0.22, 0.12, mFachada, lado[0], 0.22 + (HPAV - 0.22) / 2, 0, fach);
      lat.rotation.y = lado[1];
      // Janelas também nas laterais, para a torre não virar um bloco cego de longe
      for (var jl = 0; jl < 3; jl++){
        var janL = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.85), janelaMat());
        janL.position.set(lado[0] + (lado[0] > 0 ? 0.08 : -0.08), 0.95, -PROF / 2 + 1.5 + jl * 2.5);
        janL.rotation.y = lado[0] > 0 ? Math.PI / 2 : -Math.PI / 2;
        fach.add(janL);
      }
    });
    caixa(LARG + 0.5, 0.1, PROF + 0.5, mFaixaFach, 0, HPAV - 0.05, 0, fach);
    // Obra crua: guarda-corpo vermelho e branco na periferia da laje (NR-18)
    var guarda = new THREE.Group(); pg.add(guarda);
    [0.55, 1.05].forEach(function(gy, gi){
      caixa(LARG + 0.4, 0.05, 0.05, gi ? mGuarda : mGuardaB, 0, 0.22 + gy, PROF / 2 + 0.15, guarda);
      caixa(LARG + 0.4, 0.05, 0.05, gi ? mGuarda : mGuardaB, 0, 0.22 + gy, -PROF / 2 - 0.15, guarda);
      caixa(0.05, 0.05, PROF + 0.4, gi ? mGuarda : mGuardaB, LARG / 2 + 0.15, 0.22 + gy, 0, guarda);
    });
    for (var gx = -2; gx <= 2; gx++) caixa(0.05, 1.1, 0.05, mGuardaB, gx * 2.5, 0.77, PROF / 2 + 0.15, guarda);
    pg.scale.y = 0.001; pg.visible = false;
    pavs.push({ g: pg, fach: fach, guarda: guarda });
  }
  // Bandeja de proteção (plataforma inclinada) que sobe junto com a estrutura
  var bandeja = new THREE.Group(); torre.add(bandeja);
  var tela = new THREE.Mesh(new THREE.PlaneGeometry(LARG + 3, 1.6), new THREE.MeshStandardMaterial({ color: 0x2f8a63, roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  tela.rotation.x = -Math.PI / 2 + 0.45; tela.position.set(0, 0, PROF / 2 + 0.8); bandeja.add(tela);
  // Coroa com o nome do cliente (aparece pronta na entrega)
  var coroaTx = textoTex(1024, 192);
  kit.aoCarregarFonte(function(){
    var c = coroaTx.ctx; c.clearRect(0, 0, 1024, 192); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 512, 96, 980, '800', 120, '#F0D2A4'); coroaTx.tex.needsUpdate = true;
  });
  var coroa = new THREE.Group(); coroa.position.y = NPAV * HPAV; torre.add(coroa);
  caixa(LARG + 0.6, 0.5, PROF + 0.6, mFaixaFach, 0, 0.25, 0, coroa);
  caixa(LARG - 2, 1.2, PROF - 2, mat(0x2c4249, { r: 0.6, m: 0.3 }), 0, 1.1, 0, coroa);
  var placaCoroa = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.5), new THREE.MeshBasicMaterial({ map: coroaTx.tex, transparent: true, toneMapped: false }));
  placaCoroa.position.set(0, 1.4, PROF / 2 - 0.95); coroa.add(placaCoroa);
  coroa.visible = false;

  /* ── Elevador cremalheira: mastro em seções treliçadas ancoradas na estrutura ── */
  var mMastro = mat(0xF2B957, { r: 0.4, m: 0.6 });
  var mastro = new THREE.Group(); mastro.position.set(TORRE[0] + LARG / 2 + 1.2, 0, TORRE[2] + 1.5); cena.add(mastro);
  caixa(2.4, 0.3, 2.2, mat(0x8d979a, { r: 0.85 }), 0.6, 0.15, 0, mastro);   // base de concreto
  var secoes = [];
  for (var sc = 0; sc < 15; sc++){
    var sec = trelica(1.5, 0.55, mMastro, { passo: 0.75 }); sec.position.y = 0.3 + sc * 1.5; mastro.add(sec);
    if (sc % 2 === 1){   // ancoragem na laje a cada 3 m
      var anc = new THREE.Group(); anc.position.y = 0.3 + sc * 1.5 + 0.8; sec.parent.add(anc);
      barra(V(-0.3, 0, 0.25), V(-1.15, 0, 0.6), 0.03, mMastro, anc); barra(V(-0.3, 0, -0.25), V(-1.15, 0, -0.6), 0.03, mMastro, anc);
      secoes.push({ g: sec, anc: anc });
    } else secoes.push({ g: sec });
  }
  var cabineElev = new THREE.Group(); mastro.add(cabineElev);
  caixa(1.5, 2.1, 1.4, mat(0x3d5a62, { r: 0.5, m: 0.4 }), 1.1, 1.05, 0, cabineElev);
  var porta = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.8), new THREE.MeshStandardMaterial({ color: 0xbfc8cb, metalness: 0.7, roughness: 0.4, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  porta.rotation.y = Math.PI / 2; porta.position.set(1.86, 1.0, 0); cabineElev.add(porta);
  caixa(0.06, 1.5, 1.0, basico(0xffd9a0, 0.22), 1.82, 1, 0, cabineElev);
  [[0.4, -0.65], [1.8, -0.65], [0.4, 0.65], [1.8, 0.65]].forEach(function(p){ caixa(0.04, 0.9, 0.04, mMastro, p[0], 2.55, p[1], cabineElev); });
  caixa(1.5, 0.04, 0.04, mMastro, 1.1, 3.0, 0.65, cabineElev); caixa(1.5, 0.04, 0.04, mMastro, 1.1, 3.0, -0.65, cabineElev);

  /* ── Grua torre: mastro treliçado, lança e contralança, tirantes, carrinho e carga içada ── */
  var mAco = mat(0xE8B41F, { r: 0.4, m: 0.55 }), mCaboG = mat(0x1d2124, { r: 0.6, m: 0.6 });
  var grua = new THREE.Group(); grua.position.set(TORRE[0] + 9, 0, TORRE[2] - 8); cena.add(grua);
  caixa(3.2, 0.7, 3.2, mat(0x8d979a, { r: 0.85 }), 0, 0.35, 0, grua);   // fundação
  var mastroG = trelica(29.6, 1.3, mAco, { passo: 1.3 }); mastroG.position.y = 0.7; grua.add(mastroG);
  var giro = new THREE.Group(); giro.position.y = 30.3; grua.add(giro);
  cilindro(0.95, 0.95, 0.45, mat(0x3a4245, { r: 0.5, m: 0.7 }), 0, 0.1, 0, giro, 24);
  var picoG = trelica(5.2, 1.0, mAco, { afina: 0.25, passo: 1.0 }); picoG.position.y = 0.4; giro.add(picoG);
  var lancaGr = trelica(26, 1.0, mAco, { passo: 1.3, afina: 0.7 }); lancaGr.rotation.z = Math.PI / 2; lancaGr.position.y = 0.95; giro.add(lancaGr);
  var contraGr = trelica(8.5, 1.0, mAco, { passo: 1.4 }); contraGr.rotation.z = -Math.PI / 2; contraGr.position.y = 0.95; giro.add(contraGr);
  for (var lst = 0; lst < 4; lst++) caixa(0.55, 1.5, 1.6, mat(0x8d979a, { r: 0.85 }), 5.6 + lst * 0.62, 0.5, 0, giro);   // lastro
  caixa(1.6, 1.0, 1.2, mat(0x3a4245, { r: 0.6, m: 0.4 }), 3.6, 1.6, 0, giro);   // guincho
  var cabGr = caixaRedonda(1.3, 1.4, 1.2, 0.12, mat(0xf2f4f5, { r: 0.3 })); cabGr.position.set(-0.6, 0.3, 1.25); giro.add(cabGr);
  var vGr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.5, roughness: 0.05, clearcoat: 1 }));
  vGr.position.set(-1.26, 0.35, 1.25); vGr.rotation.y = -Math.PI / 2; giro.add(vGr);
  [-0.3, 0.3].forEach(function(z){
    barra(V(0, 5.5, z), V(-16, 1.45, z * 0.5), 0.035, mCaboG, giro);
    barra(V(0, 5.5, z), V(8.4, 1.45, z * 0.5), 0.035, mCaboG, giro);
  });
  var R_CARRO = -14;
  var carrinho = caixa(0.9, 0.35, 1.1, mat(0x3a4245, { r: 0.5, m: 0.7 }), R_CARRO, 0.3, 0, giro);
  var caboG = cilindro(0.025, 0.025, 1, mCaboG, R_CARRO, 0, 0, giro, 6); caboG.userData.oco = true;
  var cargaG = new THREE.Group(); cargaG.position.set(R_CARRO, -10.2, 0); giro.add(cargaG);
  var moitaoG = caixaRedonda(0.4, 0.55, 0.3, 0.08, mat(0xffb020, { r: 0.4, m: 0.5 })); moitaoG.position.y = 1.75; cargaG.add(moitaoG);
  var gancho = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 16, Math.PI * 1.4), mat(0xdfe6e8, { r: 0.3, m: 0.9 })); gancho.position.y = 1.36; cargaG.add(gancho);
  [[-0.6, -0.5], [0.6, -0.5], [-0.6, 0.5], [0.6, 0.5]].forEach(function(p){ barra(V(0, 1.3, 0), V(p[0], 0.15, p[1]), 0.012, mCaboG, cargaG); });

  /* ── Tapume com a marca do cliente ── */
  var tapTx = textoTex(1024, 192);
  kit.aoCarregarFonte(function(){
    var c = tapTx.ctx;
    var gr = c.createLinearGradient(0, 0, 1024, 0); gr.addColorStop(0, '#17444C'); gr.addColorStop(1, '#0f2f36');
    c.fillStyle = gr; c.fillRect(0, 0, 1024, 192);
    c.fillStyle = '#D6B17D'; c.fillRect(0, 168, 1024, 24);
    c.textAlign = 'left'; c.textBaseline = 'middle';
    escrever(c, MARCA, 40, 78, 600, '800', 84, '#FFFFFF');
    c.textAlign = 'right'; escrever(c, 'obra segura · DMG Ocupacional', 990, 120, 380, '600', 30, '#A8D8DB');
    tapTx.tex.needsUpdate = true;
  });
  var mTapume = new THREE.MeshStandardMaterial({ map: tapTx.tex, roughness: 0.7 });
  var mTapumeVerso = mat(0x17444C, { r: 0.8 });
  function tapume(x1, z1, x2, z2){
    var dx = x2 - x1, dz = z2 - z1, comp = Math.hypot(dx, dz), n = Math.max(1, Math.round(comp / 5.2));
    for (var i = 0; i < n; i++){
      var t0 = (i + 0.5) / n, w = comp / n - 0.08;
      var painel = new THREE.Mesh(new THREE.BoxGeometry(w, 2.2, 0.08), [mTapumeVerso, mTapumeVerso, mTapumeVerso, mTapumeVerso, mTapume, mTapumeVerso]);
      painel.position.set(x1 + dx * t0, 1.1, z1 + dz * t0);
      painel.rotation.y = -Math.atan2(dz, dx);
      painel.castShadow = true; painel.receiveShadow = true; cena.add(painel);
    }
  }
  tapume(0, 9, 8.3, 9); tapume(12.8, 9, 30, 9);
  tapume(30, -16, 0, -16); tapume(30, 9, 30, -16); tapume(0, -16, 0, 9);

  /* ── Placa de obra: nome do cliente e contagem para a entrega das chaves ── */
  var placaTx = textoTex(1024, 512);
  var placa = new THREE.Group(); placa.position.set(3.2, 0, 10.2); cena.add(placa);
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
    escrever(c, 'Residencial em construção', 512, 120, 900, '600', 30, '#A8D8DB');
    escrever(c, rotulo, 512, 210, 900, '700', 38, 'rgba(255,255,255,.62)');
    escrever(c, valor, 512, 320, 960, '800', 130, cor);
    escrever(c, rodape, 512, 440, 900, '600', 32, 'rgba(255,255,255,.55)');
    c.strokeStyle = cor; c.lineWidth = 8; c.strokeRect(6, 6, 1012, 500);
    placaTx.tex.needsUpdate = true;
  }
  var placaEstado = { perdidos: 1 }, modoAtual = 'neutro';
  function atualizarPlaca(){
    if (modoAtual === 'verde') desenharPlaca('ENTREGA DAS CHAVES', 'ENTREGUE', '#5EE0A6', 'no prazo prometido ao comprador');
    else if (modoAtual === 'acidente') desenharPlaca('FRENTE DE ESTRUTURA', 'EMBARGADA', '#FF6B5E', 'investigação e adequação em andamento');
    else if (modoAtual === 'prazo' && placaEstado.perdidos > 0) desenharPlaca('ENTREGA DAS CHAVES', '+' + placaEstado.perdidos + ' DIAS', '#FF6B5E', 'depois da data prometida');
    else desenharPlaca('ENTREGA DAS CHAVES EM', 'D-30', '#F0D2A4', 'acabamento em andamento');
  }
  kit.aoCarregarFonte(atualizarPlaca);

  /* ── Contêineres de vivência: chapa corrugada, porta, janela, ar-condicionado e degrau ── */
  ['VESTIÁRIO', 'REFEITÓRIO', 'ALMOXARIFADO'].forEach(function(nome, i){
    var ct = new THREE.Group(); ct.position.set(VIVENCIA[0] + 1 + i * 3.4, 0, VIVENCIA[2]); cena.add(ct);
    var corC = i === 1 ? 0xf2f4f5 : 0x30747F;
    var corpo = caixaRedonda(3.1, 2.5, 2.4, 0.06, mat(corC, { r: 0.5, m: 0.3 })); corpo.position.y = 1.3; ct.add(corpo);
    for (var nv = -1.2; nv <= 1.21; nv += 0.3) caixa(0.04, 2.3, 0.02, mat(corC, { r: 0.6, m: 0.3 }), nv, 1.3, 1.215, ct);
    caixa(0.85, 1.95, 0.04, mat(0x1b2226, { r: 0.5, m: 0.5 }), 0.85, 1.03, 1.235, ct);
    caixa(0.05, 0.05, 0.08, mat(0xdfe6e8, { r: 0.2, m: 1 }), 0.55, 1.05, 1.27, ct);
    var jan = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.5, roughness: 0.05, clearcoat: 1 })); jan.position.set(-0.7, 1.55, 1.26); ct.add(jan);
    caixa(0.6, 0.42, 0.32, mat(0xe8ecee, { r: 0.4 }), -0.7, 2.12, 1.38, ct);
    caixa(1.2, 0.18, 0.9, mat(0x5a6266, { r: 0.8, m: 0.4 }), 0.85, 0.09, 1.7, ct);
    var lt = textoTex(512, 96);
    kit.aoCarregarFonte(function(){ var c = lt.ctx; c.clearRect(0, 0, 512, 96); c.textAlign = 'center'; c.textBaseline = 'middle'; escrever(c, nome, 256, 50, 480, '800', 54, i === 1 ? '#17444C' : '#F0D2A4'); lt.tex.needsUpdate = true; });
    var rot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.45), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true, toneMapped: false }));
    rot.position.set(0, 2.38, 1.27); ct.add(rot);
  });

  /* ── Área de corte de blocos: cortadora de bancada com coifa, paletes de bloco de concreto, quadro elétrico ── */
  var corte = new THREE.Group(); corte.position.set(CORTE[0], 0, CORTE[2]); cena.add(corte);
  var mAcoC = mat(0x3a4a50, { r: 0.45, m: 0.75 }), mBloco = mat(0xa7aeaf, { r: 0.95 });
  // Bloco de concreto estrutural 14 × 19 × 39 cm com dois furos verticais
  var sB = new THREE.Shape(); sB.moveTo(-0.195, -0.07); sB.lineTo(0.195, -0.07); sB.lineTo(0.195, 0.07); sB.lineTo(-0.195, 0.07); sB.lineTo(-0.195, -0.07);
  [-0.095, 0.095].forEach(function(cx){ var h = new THREE.Path(); h.moveTo(cx - 0.07, -0.04); h.lineTo(cx - 0.07, 0.04); h.lineTo(cx + 0.07, 0.04); h.lineTo(cx + 0.07, -0.04); h.lineTo(cx - 0.07, -0.04); sB.holes.push(h); });
  var GEO_BLOCO = new THREE.ExtrudeGeometry(sB, { depth: 0.19, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1 });
  GEO_BLOCO.rotateX(-Math.PI / 2);   // furos na vertical; base em y = 0
  kit.GEO_BLOCO = GEO_BLOCO;
  // Palete de madeira: tábuas de cima, longarinas e tábuas de base
  var mMadeira = mat(0x9a7448, { r: 0.85 });
  function palete(pai, x, z){
    var g = new THREE.Group(); g.position.set(x, 0, z); pai.add(g);
    for (var t = 0; t < 7; t++) caixa(1.2, 0.025, 0.1, mMadeira, 0, 0.135, -0.45 + t * 0.15, g);
    [-0.45, 0, 0.45].forEach(function(lz){ caixa(1.2, 0.09, 0.1, mMadeira, 0, 0.075, lz, g); });
    [-0.5, 0, 0.5].forEach(function(lx){ caixa(0.1, 0.025, 1.0, mMadeira, lx, 0.012, 0, g); });
    return g;
  }
  // Pilhas em amarração (camadas alternadas), instanciadas: muitos blocos, um draw call
  var posBlocos = [];
  [[-1.9, 1.15, 4], [-0.5, 1.4, 3]].forEach(function(pl){
    palete(corte, pl[0], pl[1]);
    for (var cam = 0; cam < pl[2]; cam++) for (var fil = 0; fil < 6; fil++) for (var col = 0; col < 3; col++){
      if (cam === pl[2] - 1 && fil > 3 && col > 0) continue;   // última camada incompleta: já estão usando
      var gira = cam % 2 === 1;
      posBlocos.push(gira ? [pl[0] - 0.45 + fil * 0.16 + 0.05, 0.15 + cam * 0.19, pl[1] - 0.39 + col * 0.39, Math.PI / 2] : [pl[0] - 0.39 + col * 0.39, 0.15 + cam * 0.19, pl[1] - 0.4 + fil * 0.16, 0]);
    }
  });
  var blocosI = new THREE.InstancedMesh(GEO_BLOCO, mBloco, posBlocos.length), dB = new THREE.Object3D();
  posBlocos.forEach(function(b, i){ dB.position.set(b[0], b[1], b[2]); dB.rotation.set(0, b[3], 0); dB.updateMatrix(); blocosI.setMatrixAt(i, dB.matrix); });
  blocosI.castShadow = true; blocosI.receiveShadow = true; corte.add(blocosI);
  // Cortadora de bancada: estrutura tubular, bandeja d'água, carro deslizante, disco, coifa e motor
  var bancada = new THREE.Group(); bancada.position.set(0.6, 0, -0.2); corte.add(bancada);
  [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].forEach(function(p){ caixa(0.05, 0.8, 0.05, mAcoC, p[0], 0.4, p[1], bancada); });
  [-0.35, 0.35].forEach(function(z){ caixa(1.45, 0.05, 0.05, mAcoC, 0, 0.3, z, bancada); });
  caixa(1.5, 0.14, 0.78, mat(0x2b3438, { r: 0.6, m: 0.6 }), 0, 0.85, 0, bancada);     // bandeja
  [-0.18, 0.18].forEach(function(z){ caixa(1.5, 0.03, 0.03, mat(0xc7d0d3, { r: 0.25, m: 0.9 }), 0, 0.935, z, bancada); });   // trilhos
  var carro = new THREE.Group(); carro.position.y = 0.95; bancada.add(carro);
  caixa(0.62, 0.04, 0.5, mat(0x4f5a5e, { r: 0.5, m: 0.7 }), 0, 0.02, 0, carro);
  var blocoCorte = new THREE.Mesh(GEO_BLOCO, mBloco); blocoCorte.position.set(0, 0.04, 0); blocoCorte.castShadow = true; carro.add(blocoCorte);
  // Braço da serra: coluna traseira, cabeçote com disco diamantado e coifa sobre o disco
  caixa(0.08, 0.75, 0.08, mAcoC, 0.0, 1.28, -0.36, bancada);
  caixa(0.08, 0.08, 0.45, mAcoC, 0.0, 1.62, -0.17, bancada);
  var disco = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.012, 36), mat(0xc4ccce, { r: 0.4, m: 0.55 }));
  disco.rotation.x = Math.PI / 2; disco.position.set(0.0, 1.32, 0.0); bancada.add(disco);
  var coifa = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.08, 24, 1, true, Math.PI * 0.5, Math.PI), new THREE.MeshStandardMaterial({ color: 0xd9342b, roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide }));
  coifa.rotation.x = Math.PI / 2; coifa.position.set(0.0, 1.32, 0.0); coifa.castShadow = true; bancada.add(coifa);
  [-1, 1].forEach(function(s){ var tampa = new THREE.Mesh(new THREE.CircleGeometry(0.235, 24, 0, Math.PI), coifa.material); tampa.position.set(0, 1.32, s * 0.04); bancada.add(tampa); });
  var motor = cilindro(0.13, 0.13, 0.3, mat(0x2e6fa8, { r: 0.4, m: 0.6 }), 0.0, 1.38, -0.26, bancada, 18); motor.rotation.x = Math.PI / 2;
  caixa(0.2, 0.08, 0.2, mat(0x1c1c1c), 0.0, 1.55, -0.26, bancada);
  // Quadro elétrico com DR, em poste, e extensão pelo chão até o motor
  var quadro = new THREE.Group(); quadro.position.set(-2.6, 0, -1.4); corte.add(quadro);
  caixa(0.1, 1.9, 0.1, mat(0x5a4a33, { r: 0.9 }), 0, 0.95, 0, quadro);
  caixa(0.5, 0.65, 0.2, mat(0xdfe6e8, { r: 0.4, m: 0.3 }), 0, 1.4, 0.15, quadro);
  var raio = new THREE.Mesh(new THREE.CircleGeometry(0.09, 3), new THREE.MeshBasicMaterial({ color: 0xffc400 })); raio.position.set(0, 1.5, 0.26); quadro.add(raio);
  var caminhoCabo = new THREE.CatmullRomCurve3([V(-2.6, 1.15, -1.25), V(-2.55, 0.02, -1.1), V(-1.4, 0.02, -0.9), V(0.0, 0.02, -0.75), V(0.55, 0.02, -0.6), V(0.6, 0.3, -0.55), V(0.6, 1.38, -0.46)]);
  var cabo = new THREE.Mesh(new THREE.TubeGeometry(caminhoCabo, 60, 0.018, 6), mat(0xe8a21a, { r: 0.6 })); cabo.castShadow = true; cabo.userData.oco = true; corte.add(cabo);
  // Pó assentado no chão em volta da bancada
  var poChao = new THREE.Mesh(new THREE.CircleGeometry(1.8, 32), new THREE.MeshStandardMaterial({ color: 0x9a948a, roughness: 1, transparent: true, opacity: 0.35, depthWrite: false }));
  poChao.rotation.x = -Math.PI / 2; poChao.position.set(0.9, 0.022, 0); corte.add(poChao);
  var NPO = 320, poGeo = new THREE.BufferGeometry(), poPos = new Float32Array(NPO * 3), poVida = [];
  for (var q = 0; q < NPO; q++){ poVida.push(Math.random()); }
  poGeo.setAttribute('position', new THREE.BufferAttribute(poPos, 3));
  var poMat = new THREE.PointsMaterial({ color: 0x9c9384, size: 0.34, map: HALO, transparent: true, opacity: 0.4, depthWrite: false });
  var poeiraCorte = new THREE.Points(poGeo, poMat); poeiraCorte.position.copy(bancada.position); corte.add(poeiraCorte);
  // Carga da grua: palete com blocos amarrado nos quatro estropos
  palete(cargaG, 0, 0).position.y = 0.0;
  var cargaBl = new THREE.InstancedMesh(GEO_BLOCO, mBloco, 18), dC = new THREE.Object3D();
  for (var cb = 0; cb < 18; cb++){ dC.position.set(-0.39 + (cb % 3) * 0.39, 0.15 + Math.floor(cb / 9) * 0.19, -0.4 + Math.floor((cb % 9) / 3) * 0.4); dC.updateMatrix(); cargaBl.setMatrixAt(cb, dC.matrix); }
  cargaBl.castShadow = true; cargaG.add(cargaBl);

  /* ── Caminhão betoneira na rua ── */
  var betoneira = new THREE.Group(); cena.add(betoneira);
  var mCab = mat(0xf2f4f5, { r: 0.25, m: 0.35 }), mCromo = mat(0xdfe6e8, { r: 0.12, m: 1 }), mOuro = mat(0xD6B17D, { r: 0.25, m: 0.85 });
  var mVidroCam = new THREE.MeshPhysicalMaterial({ color: 0x0e2a33, metalness: 0.6, roughness: 0.05, clearcoat: 1 });
  caixa(6.4, 0.3, 1.2, mat(0x1b2226, { r: 0.6, m: 0.5 }), -0.3, 0.88, 0, betoneira);
  caixa(0.3, 0.32, 2.3, mat(0x1b2226, { r: 0.5, m: 0.6 }), 3.05, 0.72, 0, betoneira);                 // para-choque
  caixa(0.06, 0.75, 1.6, mat(0x2a3033, { r: 0.4, m: 0.7 }), 2.93, 1.35, 0, betoneira);                // grade
  cilindro(0.28, 0.28, 0.8, mCromo, 1.1, 0.95, 1.0, betoneira, 18).rotation.z = Math.PI / 2;          // tanque
  cilindro(0.38, 0.38, 1.0, mat(0x3d6a74, { r: 0.4, m: 0.5 }), 0.85, 2.15, 0, betoneira, 18).rotation.x = Math.PI / 2;   // caixa d'água
  var bica = caixa(1.1, 0.08, 0.42, mat(0x5a6266, { r: 0.6, m: 0.6 }), -3.7, 1.25, 0, betoneira); bica.rotation.z = 0.5;
  var cabB = caixaRedonda(1.6, 1.8, 2.1, 0.3, mCab); cabB.position.set(2.1, 1.75, 0); betoneira.add(cabB);
  var pb2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), mVidroCam); pb2.position.set(2.92, 2.1, 0); pb2.rotation.y = Math.PI / 2; betoneira.add(pb2);
  var perfilTambor = [[0.05, -2.1], [0.55, -1.7], [1.05, -0.8], [1.15, 0.1], [0.95, 1.1], [0.45, 1.9], [0.2, 2.1]]
    .map(function(v){ return new THREE.Vector2(v[0], v[1]); });
  // O grupo inclina o tambor; o tambor gira no próprio eixo dentro dele
  var tamborG = new THREE.Group(); tamborG.rotation.z = Math.PI / 2 - 0.22; tamborG.position.set(-0.9, 2.05, 0); betoneira.add(tamborG);
  var tambor = new THREE.Mesh(new THREE.LatheGeometry(perfilTambor, 28), mOuro);
  tambor.castShadow = true; tamborG.add(tambor);
  var faixaT = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.06, 8, 32), mat(0x17444C, { r: 0.5 })); faixaT.rotation.y = Math.PI / 2; tambor.add(faixaT);
  var rodasB = [];
  [-2.6, -1.55, 2.1].forEach(function(x){ [-0.92, 0.92].forEach(function(z){ rodasB.push(roda(betoneira, x, 0.52, z, 0.52, x < 0 ? 0.6 : 0.38, mCromo)); }); });
  [-0.92, 0.92].forEach(function(z){ caixa(1.05, 0.06, 0.6, mat(0x1b2226, { r: 0.6 }), 2.1, 1.1, z, betoneira); });
  [0.7, -0.7].forEach(function(z){
    var farol = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), basico(0xfff1c9, 1)); farol.scale.set(0.4, 0.7, 1.4); farol.position.set(2.92, 1.1, z); betoneira.add(farol);
  });
  betoneira.position.set(-40, 0, 14.2);

  /* ── Stand de vendas e decorado ── */
  var stand = new THREE.Group(); stand.position.set(STAND[0], 0, STAND[2]); cena.add(stand);
  caixa(11, 0.3, 8, mat(0x2a3e44, { r: 0.6 }), 0, 0.15, 0, stand);
  var vidroStand = new THREE.MeshPhysicalMaterial({ color: 0x8fd3dc, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.28, clearcoat: 1 });
  var caixaVidro = new THREE.Mesh(new THREE.BoxGeometry(9, 3.2, 6), vidroStand); caixaVidro.position.y = 1.9; stand.add(caixaVidro);
  var interiorStand = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3, 5.6), basico(0xffcf8a, 0.08, true)); interiorStand.position.y = 1.9; stand.add(interiorStand);
  caixa(10.4, 0.35, 7.4, mat(0xe6ecee, { r: 0.4 }), 0, 3.65, 0, stand);
  caixa(2.4, 0.9, 0.6, mat(0xD6B17D, { r: 0.4, m: 0.5 }), -2, 0.75, -1, stand);
  caixa(3, 0.8, 1.8, mat(0x30747F, { r: 0.6 }), 2.2, 0.7, -0.5, stand);
  var standTx = textoTex(1024, 192);
  kit.aoCarregarFonte(function(){
    var c = standTx.ctx; c.clearRect(0, 0, 1024, 192); c.textAlign = 'center'; c.textBaseline = 'middle';
    escrever(c, MARCA, 512, 74, 960, '800', 90, '#F0D2A4'); escrever(c, 'STAND DE VENDAS · DECORADO', 512, 150, 900, '600', 34, '#A8D8DB');
    standTx.tex.needsUpdate = true;
  });
  var letStand = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.5), new THREE.MeshBasicMaterial({ map: standTx.tex, transparent: true, toneMapped: false }));
  letStand.position.set(0, 4.7, 3.75); stand.add(letStand);
  [-4.6, 4.6].forEach(function(x){
    cilindro(0.05, 0.05, 6, mat(0xdfe6e8, { r: 0.2, m: 1 }), x, 3, 4.6, stand);
    var band = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.2), mat(0xD6B17D, { r: 0.6 })); band.position.set(x + 0.47, 4.6, 4.6); stand.add(band);
  });
  kit.halo(0xD6B17D, 22, STAND[0], STAND[2], 0.12);

  /* ── Pessoas ── */
  var portaria = [];
  var etapas = ['fundacao', 'estrutura', 'alvenaria', 'acabamento', 'estrutura', 'alvenaria'];
  etapas.forEach(function(e, i){ portaria.push(pessoa(FILA_TERC[0] - 1.05 + (i % 3) * 1.05, FILA_TERC[2] - 0.48 + Math.floor(i / 3) * 0.95, i === 4 ? COR.terc : CORES_ETAPA[e])); });
  var fila = [];
  for (var fi = 0; fi < 5; fi++) fila.push(pessoa(VIVENCIA[0] + 0.5 + fi * 1.1, VIVENCIA[2] + 3.0, fi % 2 ? COR.colete : CORES_ETAPA.alvenaria));
  // Operador da cortadora: empurra o carro com o bloco, com abafador, máscara PFF2 e óculos
  var cortador = pessoa(CORTE[0] + 0.6 - 1.15, CORTE[2] - 0.2 + 0.05, COR.colete);
  cortador.rotation.y = Math.PI / 2; cortador.userData.pose = [-0.95, -0.95, 0.12];
  kit.epi(cortador, ['abafador', 'mascara', 'oculos']);
  var naLaje = pessoa(TORRE[0] - 2.5, TORRE[2] + PROF / 2 - 0.65, CORES_ETAPA.estrutura);
  var noTopo = pessoa(TORRE[0] + 2, TORRE[2] - 1, CORES_ETAPA.estrutura);
  kit.epi(naLaje, ['cinto']); kit.epi(noTopo, ['cinto']);
  var viajante = pessoa(PORTAO[0], 10.9, COR.colete);

  /* ── Estado próprio do cenário ── */
  var obra = 0, obraAlvo = 0.55, luzes = 0, luzesAlvo = 0, betT = 0, tempo = 0, poeiraAlvo = 0.3, poeiraNivel = 0.3;
  var luzObra = new THREE.PointLight(0xfff2d8, 0, 50, 1.5); luzObra.position.set(TORRE[0], 22, TORRE[2] + 10); cena.add(luzObra);

  function alturaLaje(){ return Math.max(1, Math.round(obra * NPAV)) * HPAV; }

  return {
    viajante: viajante,
    destinoViajante: function(modo){
      var c = kit.R.clinica.pos;
      // Rotas pela calçada: contornam tapume, placa, postes e a fila de terceiros
      var calc = 10.9, cli = [c[0], c[2] + 7.6];
      if (modo === 'virada' || modo === 'clinica') return [[PORTAO[0], calc], [cli[0], calc], cli];
      if (modo === 'verde') return [cli, [cli[0], calc], [PORTAO[0], calc], [PORTAO[0], PORTAO[2] - 3]];
      return [cli, [cli[0], calc], [PORTAO[0], calc]];
    },
    modosRisco: ['terceiros', 'altura', 'mobilizacao', 'poeira', 'acidente', 'prazo'],
    alertas: {
      terceiros:   [FILA_TERC[0], 4.4, FILA_TERC[2], 0.08],
      altura:      [TORRE[0] - 2.5, LAJE + 3.2, TORRE[2] + PROF / 2, LAJE + 0.05],
      mobilizacao: [VIVENCIA[0] + 2.7, 4.6, VIVENCIA[2] + 3.0, 0.08],
      poeira:      [CORTE[0], 3.8, CORTE[2], 0.08],
      acidente:    [TORRE[0] - 2.5, 4, TORRE[2] + PROF / 2 + 1.6, 0.08]
    },
    fluxo: {
      ida: new THREE.CatmullRomCurve3([V(PORTAO[0], 0.3, 10.9), V(1, 0.3, 10.9), V(-9, 0.3, 1.6)]),
      volta: new THREE.CatmullRomCurve3([V(-9, 0.3, 1.6), V(1, 0.3, 10.9), V(PORTAO[0], 0.3, 10.9), V(PORTAO[0], 0.3, PORTAO[2] - 3)])
    },
    fogos: [TORRE[0], TORRE[2]],
    auditoria: function(){ cabineElev.userData.semApoio = cargaG.userData.semApoio = true; return { moveis: [betoneira, cabineElev, cargaG], pessoas: portaria.concat(fila, [cortador, naLaje, noTopo, viajante]) }; },

    aplicarModo: function(modo, c){
      modoAtual = modo;
      obraAlvo = c ? c.obra : 0.55;
      luzesAlvo = modo === 'verde' ? 1 : 0;
      poeiraAlvo = modo === 'poeira' ? 1 : modo === 'verde' ? 0 : 0.3;
      var caiu = modo === 'acidente';
      naLaje.rotation.z = caiu ? 1.35 : 0;
      naLaje.position.y = caiu ? 0.3 : LAJE;
      naLaje.position.z = caiu ? TORRE[2] + PROF / 2 + 1.6 : TORRE[2] + PROF / 2 - 0.65;
      naLaje.visible = modo !== 'verde';
      noTopo.visible = modo !== 'verde';
      fila.forEach(function(pp){ pp.visible = modo !== 'verde'; });
      // Obra entregue: elevador de obra desmontado e área de corte desmobilizada
      mastro.visible = corte.visible = cortador.visible = modo !== 'verde';
      atualizarPlaca();
    },

    placar: function(n){ placaEstado.perdidos = n; atualizarPlaca(); },

    quadro: function(dt, k, relogio, modo){
      tempo += dt;
      // Torre: estrutura sobe com a obra; a fachada vem três pavimentos atrás, e tudo fecha na entrega
      obra += (obraAlvo - obra) * k * 0.6;
      var est = obra * NPAV, fechados = obraAlvo >= 1 ? NPAV : Math.max(0, est - 3);
      pavs.forEach(function(pv, i){
        var mostra = i < est;
        pv.g.visible = pv.g.scale.y > 0.01 || mostra;
        pv.g.scale.y += ((mostra ? 1 : 0.001) - pv.g.scale.y) * k;
        var pronto = i < fechados;
        pv.fach.visible = pronto; pv.guarda.visible = !pronto;
      });
      var topo = Math.min(NPAV, Math.ceil(est));
      bandeja.position.y += (Math.max(1, topo - 2) * HPAV - bandeja.position.y) * k;
      bandeja.visible = obraAlvo < 1;
      coroa.visible = obraAlvo >= 1 && pavs[NPAV - 1].g.scale.y > 0.9;
      noTopo.position.y = Math.max(0, topo - 1) * HPAV + 0.22;
      // Mastro do elevador acompanha a estrutura (seções montadas até 2 m acima da última laje)
      var hMastro = topo * HPAV + 2;
      secoes.forEach(function(sc, i){ var vis = 0.3 + i * 1.5 < hMastro; sc.g.visible = vis; if (sc.anc) sc.anc.visible = vis && 0.3 + i * 1.5 < topo * HPAV; });
      cabineElev.position.y = 0.3 + (Math.sin(tempo * 0.35) * 0.5 + 0.5) * Math.max(0, topo * HPAV - 2.2);

      // Grua gira devagar e a carga sobe e desce
      grua.visible = obraAlvo < 1;
      giro.rotation.y = Math.sin(relogio * 0.15) * 0.9;
      cargaG.position.y = -10.2 + Math.sin(relogio * 0.5) * 2.4;
      var topoCabo = 0.12, fimCabo = cargaG.position.y + 2.0;
      caboG.scale.y = topoCabo - fimCabo; caboG.position.y = (topoCabo + fimCabo) / 2;

      // Luzes da entrega
      luzes += (luzesAlvo - luzes) * k * 0.6;
      mJanela.emissiveIntensity = luzes * 1.1;
      luzObra.intensity = luzes * 2;
      haloObra.material.opacity = 0.08 + luzes * 0.25;

      // Serra e poeira de sílica
      poeiraNivel += (poeiraAlvo - poeiraNivel) * k;
      disco.rotation.y += dt * 40;
      // Carro vai e volta: o bloco passa sob o disco (corte) e retorna
      var curso = Math.sin(tempo * 0.9);
      carro.position.x = -0.3 + curso * 0.32;
      // Pluma de pó: sai do ponto de corte para trás e para cima, abrindo em leque com o vento
      for (var i = 0; i < NPO; i++){
        poVida[i] = (poVida[i] + dt * (0.22 + (i % 7) * 0.035)) % 1;
        var v = poVida[i], a = i * 2.399;
        // nuvem densa junto ao disco que se abre e sobe com a distância
        var abre = Math.pow(v, 0.7);
        poPos[i * 3] = 0.12 + v * 2.4 + Math.cos(a) * abre * 0.7;
        poPos[i * 3 + 1] = 1.2 + v * 1.6 + Math.sin(a * 1.3) * abre * 0.45 + Math.sin(tempo * 2 + i) * 0.05;
        poPos[i * 3 + 2] = Math.sin(a) * abre * 0.8 - v * 0.5;
      }
      poGeo.attributes.position.needsUpdate = true;
      poMat.opacity = 0.55 * poeiraNivel;   // tom escuro para não estourar no bloom
      poMat.size = 0.22 + 0.18 * poeiraNivel;
      poMat.color.setHex(modo === 'poeira' ? 0xb08a80 : 0x9c9384);

      // Betoneira circulando pela rua com o tambor girando
      betT = modo === 'verde' ? betT + (0.45 - betT) * k * 0.3 : (relogio * 0.025) % 1;
      var xAnt = betoneira.position.x;
      betoneira.position.x = -48 + betT * 96;
      var dx = betoneira.position.x - xAnt, gr = Math.abs(dx) < 1 ? dx / 0.49 : 0;
      rodasB.forEach(function(r){ r.rotation.z -= gr; });
      tambor.rotation.y += dt * 1.8;
    }
  };
};
/* ── FIM BLOCO ── */
