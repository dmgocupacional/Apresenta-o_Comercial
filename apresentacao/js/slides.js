/* Montagem dos slides a partir do roteiro. Cada tipo de slide tem um template;
   todo texto passa por pers() para receber o nome da empresa. Roda antes do kit 3D e do motor. */

/* ═══ BLOCO: PREPARACAO ═══ */
(function(){
  var R = window.ROTEIRO;
  if (!EMPRESA.nome) EMPRESA.nome = R.empresaPadrao.nome;
  if (!EMPRESA.func) EMPRESA.func = R.empresaPadrao.func;
  if (!EMPRESA.anos) EMPRESA.anos = R.empresaPadrao.anos;
  if (EMPRESA.rat) R.calc.rat = EMPRESA.rat;
  document.title = 'DMG Ocupacional · ' + EMPRESA.nome;
})();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: TEMPLATES ═══ */
var Slides = (function(){
  var R = window.ROTEIRO;
  var NAND = R.beneficios.length;

  function cap(n){ return n ? '<span class="cap">' + n + '</span>' : ''; }
  function d(i){ return i > 0 ? ' d' + Math.min(i, 6) : ''; }
  function lista(itens, ini, ok){
    return '<ul class="lista' + (ok ? ' ok' : '') + '">' + itens.map(function(t, i){
      return '<li class="glass rv' + d(Math.min(ini + i, 5)) + '">' + pers(t) + '</li>';
    }).join('') + '</ul>';
  }
  // Riscos da dor e NRs que mantêm o trabalhador apto (opcional no roteiro: s.riscos, s.nrs)
  function exigencias(s){
    if (!s.nrs) return '';
    return '<div class="exig glass rv d5">' +
      '<div class="exig-l"><small>Riscos envolvidos</small><div class="exig-riscos">' + (s.riscos || []).map(function(r){ return '<i>' + pers(r) + '</i>'; }).join('') + '</div></div>' +
      '<div class="exig-l"><small>O que mantém o trabalhador apto</small><div class="exig-nrs">' + s.nrs.map(function(n){
        return '<span><b>' + n.n + '</b>' + pers(n.t) + '</span>';
      }).join('') + '</div></div></div>';
  }
  function secao(s, classes, corpo, extra){
    return '<section class="slide' + (classes ? ' ' + classes : '') + '" data-cena="' + s.cena + '"' + (extra || '') + '>' + corpo + '</section>';
  }

  var T = {
    capa: function(s){
      return secao(s, '', '<div class="col">' +
        '<div class="marca rv"><div class="selo">D</div>DMG<span>OCUPACIONAL</span><em>×' + (logoCliente() ? ' <img class="logo-cli" src="' + logoCliente() + '" alt="">' : '') + ' ' + escaparHtml(EMPRESA.nome.toUpperCase()) + '</em></div>' +
        '<div class="eyebrow rv d1">' + pers(s.eyebrow) + '</div>' +
        '<h1 class="rv d2">' + pers(s.titulo) + '</h1>' +
        '<p class="capa-sub rv d3">' + pers(s.sub) + '</p>' +
        '<div class="stats rv d4">' + s.stats.map(function(st){
          var n = pers(String(st.n));
          return '<div class="stat"><div class="n grad" data-conta="' + numero(n) + '"' + (st.pre ? ' data-pre="' + st.pre + '"' : '') + (st.suf ? ' data-suf="' + st.suf + '"' : '') + '>0</div><div class="l">' + pers(st.l) + '</div></div>';
        }).join('') + '</div></div>');
    },

    mapa: function(s){
      return secao(s, '', '<div class="wide">' + cap(s.cap) + '<div class="mapa-wrap"><div>' +
        '<div class="eyebrow rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        '<div class="tripe">' + s.itens.map(function(it, i){
          return '<div class="glass rv' + d(3 + i) + '"><span class="ic">' + pad(i + 1) + '</span><div><b>' + pers(it.b) + '</b><span>' + pers(it.s) + '</span></div></div>';
        }).join('') + '</div></div>' +
        '<div class="mapa glass rv d3" id="mapa"></div></div></div>');
    },

    // Etapas da obra: quem entra em cada fase, o risco que traz e a troca de equipe
    etapas: function(s){
      return secao(s, 'topo', '<div class="wide">' + cap(s.cap) +
        '<div class="eyebrow rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        '<div class="etapas"><div class="et-trilho"><i></i></div>' + s.etapas.map(function(e, i){
          return '<div class="etapa glass">' +
            '<span class="et-n">' + pad(i + 1) + '</span><b>' + pers(e.n) + '</b><small class="et-p">' + e.p + '</small>' +
            '<span class="et-quem">' + pers(e.quem) + '</span>' +
            '<div class="et-riscos">' + e.riscos.map(function(r){ return '<i>' + r + '</i>'; }).join('') + '</div>' +
            (e.troca ? '<span class="et-troca">↻ ' + pers(e.troca) + '</span>' : '') + '</div>';
        }).join('') + '</div>' +
        (s.rodape ? '<div class="custo rv d6"><div><small>O que isso significa</small><span>' + pers(s.rodape) + '</span></div></div>' : '') +
        '</div>');
    },

    dor: function(s){
      return secao(s, '', '<div class="col">' + cap(s.cap) +
        '<div class="dor-tag rv"><i></i>' + pers(s.tag) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        lista(s.lista, 3) + exigencias(s) +
        (s.custo ? '<div class="custo rv d5"><div><small>O que isso custa</small><span>' + pers(s.custo) + '</span></div></div>' : '') +
        '</div>');
    },

    linha: function(s){
      return secao(s, '', '<div class="wide">' + cap(s.cap) +
        '<div class="eyebrow red rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        '<div class="tl"><div class="tl-trilho"><i></i></div>' + s.pontos.map(function(p){
          return '<div class="tl-p glass' + (p.ini ? ' ini' : '') + '"><span class="tl-q">' + p.q + '</span><b>' + pers(p.b) + '</b><small>' + pers(p.s) + '</small></div>';
        }).join('') + '</div></div>');
    },

    calc: function(s){
      var c = R.calc;
      return secao(s, 'topo', '<div class="wide">' + cap(s.cap) +
        '<div class="eyebrow red rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        '<div class="calc"><div class="calc-in glass rv d3">' +
          '<div class="campo"><label for="cf-func">Colaboradores</label><div class="inp"><input id="cf-func" type="text" inputmode="numeric" value="' + EMPRESA.func + '"><span>pessoas</span></div></div>' +
          '<div class="campo"><label for="cf-sal">Salário médio mensal</label><div class="inp"><span>R$</span><input id="cf-sal" type="text" inputmode="numeric" value="' + c.salario.toLocaleString('pt-BR') + '"></div>' +
            '<p class="nota">Folha anual estimada (13 salários): <b id="cf-folha">—</b></p></div>' +
          '<div class="campo"><label>RAT do CNAE</label><div class="chips" id="cf-rats">' + [1, 2, 3].map(function(r){
            return '<button class="chip' + (r === c.rat ? ' on' : '') + '" type="button" data-rat="' + r + '">' + r + '%</button>';
          }).join('') + '</div><p class="nota">' + pers(s.notaRat) + '</p></div>' +
          '<div class="campo"><label for="cf-fap">FAP <b class="gold" id="cf-fap-v">' + c.fap.toFixed(2).replace('.', ',') + '</b></label>' +
            '<input id="cf-fap" class="range" type="range" min="0.5" max="2" step="0.05" value="' + c.fap + '"></div>' +
        '</div><div class="calc-out glass rv d4">' +
          '<svg class="gauge" viewBox="0 0 360 200" role="img" aria-label="Medidor do FAP"><defs>' +
            '<linearGradient id="g-arco" x1="0" x2="1"><stop offset="0" stop-color="#5EE0A6"/><stop offset=".33" stop-color="#D6B17D"/><stop offset=".66" stop-color="#F2B957"/><stop offset="1" stop-color="#FF6B5E"/></linearGradient>' +
            '<filter id="brilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
            '<path d="M40 170 A140 140 0 0 1 320 170" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="22" stroke-linecap="round"/>' +
            '<path d="M40 170 A140 140 0 0 1 320 170" fill="none" stroke="url(#g-arco)" stroke-width="10" stroke-linecap="round" filter="url(#brilho)"/>' +
            '<g id="g-ticks"></g><g class="agulha" id="g-agulha"><line x1="180" y1="170" x2="180" y2="52" stroke="#fff" stroke-width="3" stroke-linecap="round" filter="url(#brilho)"/></g>' +
            '<circle cx="180" cy="170" r="11" fill="#0C1B22" stroke="#D6B17D" stroke-width="3"/></svg>' +
          '<div class="gauge-lbl"><div class="k">Contribuição anual RAT × FAP</div><div class="n" id="cf-anual">—</div><div class="m" id="cf-mensal">—</div></div>' +
          '<div class="comp">' +
            '<div class="comp-l"><span class="t">FAP 0,50</span><div class="trilha"><i class="f-ok" id="cf-b1"></i></div><span class="v" id="cf-v1">—</span></div>' +
            '<div class="comp-l"><span class="t">FAP 1,00</span><div class="trilha"><i class="f-md" id="cf-b2"></i></div><span class="v" id="cf-v2">—</span></div>' +
            '<div class="comp-l"><span class="t gold" id="cf-b3l">Simulado</span><div class="trilha"><i class="f-vc" id="cf-b3"></i></div><span class="v red" id="cf-v3">—</span></div>' +
          '</div><div class="delta" id="cf-delta">—</div></div></div>' +
        '<p class="fonte">Simulação sobre parâmetros informados. O FAP real é divulgado por estabelecimento pelo Ministério da Previdência Social.</p></div>');
    },

    prazo: function(s){
      var P = R.prazo, L = P.legenda;
      return secao(s, 'topo', '<div class="wide">' + cap(s.cap) +
        '<div class="eyebrow red rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="lede rv d2">' + pers(s.lede) + '</p>' +
        '<div class="prazo"><div class="eventos rv d3" id="eventos"></div><div class="cal glass rv d4">' +
          '<div class="cal-top"><div><small>' + pers(P.rotuloEntrega) + '</small><div class="n" id="pz-dia">Dia ' + P.dias + '</div></div><div><small>Dias perdidos</small><div class="n red" id="pz-perd">0</div></div></div>' +
          '<div class="grade" id="pz-grade"></div>' +
          '<div class="cal-leg"><span><i class="a"></i>' + L[0] + '</span><span><i class="b"></i>' + L[1] + '</span><span><i class="c"></i>' + L[2] + '</span><span><i class="d"></i>' + L[3] + '</span></div>' +
          '<p class="cal-msg" id="pz-msg"></p></div></div>' +
        '<p class="fonte">' + pers(P.fonte) + '</p></div>');
    },

    virada: function(s){
      return secao(s, '', '<div class="col">' + cap(s.cap) +
        '<div class="eyebrow rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        s.ledes.map(function(t, i){ return '<p class="lede rv' + d(2 + i) + '">' + pers(t) + '</p>'; }).join('') +
        '<span class="pill glass rv' + d(2 + s.ledes.length) + '"><i></i>' + pers(s.pill) + '</span></div>');
    },

    andar: function(s){
      s.cena = 'andar-' + s.andar;
      var extra = '';
      if (s.extra === 'painel'){
        extra = '<button class="tela-prev glass rv d6" type="button" id="abrir-painel">' +
          '<span class="tp-barra"><i></i><i></i><i></i><em>Painel exclusivo · ' + escaparHtml(EMPRESA.nome) + '</em></span>' +
          '<span class="tp-corpo">' + R.painel.preview.map(function(p){
            return '<span class="tp-k"><b' + (p.c ? ' class="' + p.c + '"' : '') + '>' + pers(p.v) + '</b>' + p.l + '</span>';
          }).join('') + '</span><span class="tp-cta">Abrir o painel ao vivo →</span></button>';
      } else if (s.extra === 'parceria'){
        extra = '<div class="parceria glass rv d6"><img class="logo-dmg" alt="DMG Ocupacional"><span class="x">×</span>' + (logoCliente() ? '<img class="logo-cli grande" src="' + logoCliente() + '" alt="">' : '') + '<span class="parc-cliente">' + escaparHtml(EMPRESA.nome.toUpperCase()) + '</span><small>' + pers(s.parceria) + '</small></div>';
      }
      return secao(s, 'andar-slide', '<div class="torre-ind" aria-hidden="true"></div><div class="col">' +
        '<div class="andar-cab rv"><span class="andar-num">' + s.num + '</span><span class="andar-de">Andar ' + (s.andar + 1) + ' de ' + NAND + '</span></div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<div class="resolve rv d2">Resolve: <s>' + pers(s.resolve) + '</s></div>' +
        '<ol class="passos-a">' + s.passos.map(function(p, i){
          return '<li class="glass rv' + d(3 + i) + '"><div><b>' + pers(p.b) + '</b><span>' + pers(p.s) + '</span></div></li>';
        }).join('') + '</ol>' +
        (s.entrega ? '<div class="entrega rv d6"><small>' + escaparHtml(pers('O que a {empresa} ganha')) + '</small><span class="k">' + s.entrega.k + '</span><span>' + pers(s.entrega.s) + '</span></div>' : '') +
        extra + (s.fonte ? '<p class="fonte rv d6">' + pers(s.fonte) + '</p>' : '') +
        '</div>', ' data-andar="' + s.andar + '"');
    },

    entregue: function(s){
      return secao(s, '', '<div class="col">' + cap(s.cap) +
        '<div class="eyebrow green rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        lista(s.lista, 2, true) +
        '<p class="lede rv d6">' + pers(s.lede) + '</p></div>');
    },

    prova: function(s){
      return secao(s, 'topo', '<div class="wide">' + cap(s.cap) +
        '<div class="eyebrow rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<div class="parceiros" id="parceiros"></div>' +
        '<div class="numeros">' +
          '<div class="num glass rv d4"><div class="n grad" data-conta="25" data-pre="+">0</div><div class="l">anos de experiência em SST</div></div>' +
          '<div class="num glass rv d4"><div class="n grad" data-conta="50" data-pre="+">0</div><div class="l">empresas atendidas pela DMG Ocupacional</div></div>' +
          '<div class="num glass rv d5"><div class="n grad" data-conta="4" data-pre="0">0</div><div class="l">unidades próprias: Osasco, Itapevi, Carapicuíba e Cajamar</div></div>' +
        '</div></div>');
    },

    kanban: function(s){
      return secao(s, 'topo', '<div class="wide"><div class="kb-topo"><div>' +
        (s.cap ? cap(s.cap) : '') + '<div class="eyebrow rv">' + pers(s.eyebrow || 'Diagnóstico ao vivo') + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<p class="kb-dica rv d2">Arraste cada cartão para a coluna que descreve a realidade de vocês. No tablet: toque no cartão e depois na coluna. "Não sei" também é resposta, e conta.</p></div>' +
        '<div class="kb-prog rv d2"><div class="t"><span>Classificados</span><b id="kb-n">0 / ' + R.cartoes.length + '</b></div><div class="trilha"><i id="kb-barra"></i></div></div></div>' +
        '<div class="kb rv d3" id="kb">' +
          '<div class="kb-col pend" data-st="pend"><h4><em>A classificar</em><span></span></h4></div>' +
          '<div class="kb-col" data-st="ok"><h4><em>Em dia</em><span></span></h4></div>' +
          '<div class="kb-col" data-st="parcial"><h4><em>Parcial</em><span></span></h4></div>' +
          '<div class="kb-col" data-st="nao"><h4><em>Não temos</em><span></span></h4></div>' +
          '<div class="kb-col" data-st="naosei"><h4><em>Não sei</em><span></span></h4></div>' +
        '</div><div class="acoes"><button class="btn gold" type="button" id="kb-gerar">Gerar radar →</button><button class="btn" type="button" id="kb-reset">Recomeçar</button></div></div>',
        ' id="s-kanban"');
    },

    radar: function(s){
      return secao(s, 'topo', '<div class="wide"><div class="eyebrow rv">Radar de exposição em SST</div>' +
        '<div class="cliente rv d1"><input id="rd-cliente" type="text" value="' + escaparHtml(EMPRESA.nome) + '" aria-label="Nome da empresa"></div>' +
        '<div class="rd"><div class="rd-g glass rv d2" id="rd-svg"></div><div class="rv d3">' +
          '<div class="rd-topo"><div class="anel"><svg viewBox="0 0 120 120">' +
            '<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9"/>' +
            '<circle class="arco" id="rd-arco" cx="60" cy="60" r="52" fill="none" stroke="#D6B17D" stroke-width="9" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7"/>' +
          '</svg><div class="v"><div><b id="rd-nota">0</b><small>de 100</small></div></div></div>' +
          '<div><div class="nivel" id="rd-nivel">—</div><p class="rd-leitura" id="rd-leitura"></p></div></div>' +
          '<ul class="prio" id="rd-prio"></ul><p class="rd-vazio" id="rd-vazio"></p>' +
          '<div class="acoes"><button class="btn gold" type="button" id="rd-pdf">Baixar diagnóstico (PDF)</button><button class="btn" type="button" id="rd-voltar">← Ajustar respostas</button></div>' +
          '<p class="so-impressao">DMG Ocupacional · Diagnóstico preliminar de SST gerado em reunião comercial. Não substitui o diagnóstico técnico com vistoria em campo. comercial@dmgocupacional.com · +55 11 97569-1076</p>' +
        '</div></div></div>', ' id="s-radar"');
    },

    cta: function(s){
      return secao(s, '', '<div class="col">' +
        '<div class="eyebrow rv">' + pers(s.eyebrow) + '</div>' +
        '<h2 class="rv d1">' + pers(s.titulo) + '</h2>' +
        '<div class="passos">' + s.passos.map(function(p, i){
          return '<div class="passo glass rv' + d(2 + Math.floor(i / 2)) + '"><small>' + pad(i + 1) + '</small><b>' + pers(p.b) + '</b><span>' + pers(p.s) + '</span></div>';
        }).join('') + '</div>' +
        '<a class="btn gold rv d4" href="https://wa.me/5511975691076?text=' + encodeURIComponent(pers(s.whatsapp)) + '" target="_blank" rel="noopener">' + pers(s.botao) + '</a>' +
        '<div class="contatos rv d5"><div><small>WhatsApp</small>+55 11 97569-1076</div><div><small>E-mail</small>comercial@dmgocupacional.com</div><div><small>Site</small>dmgocupacional.com</div></div></div>');
    }
  };

  function montar(){
    $('deck').innerHTML = R.slides.map(function(s){ return T[s.tipo](s); }).join('');
    // Rótulos do painel exclusivo
    $('pnl-url').textContent = '🔒 portal.dmgocupacional.com/' + EMPRESA.nome.toLowerCase().replace(/[^a-z0-9]+/g, '');
    $('pnl-marca-txt').textContent = 'Portal do RH · ' + EMPRESA.nome;
    $('pnl-user-txt').textContent = 'RH ' + EMPRESA.nome;
    $('pnl-load-txt').textContent = 'Carregando painel da ' + EMPRESA.nome + '…';
    $('count').textContent = '01 / ' + pad(R.slides.length);
  }

  montar();
  return { montar: montar };
})();
/* ── FIM BLOCO ── */
