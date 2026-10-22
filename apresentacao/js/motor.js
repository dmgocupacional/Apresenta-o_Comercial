/* Motor da apresentação: regras de negócio (FAP, atraso, radar), render dos componentes,
   eventos e controlador de navegação. Lê tudo de window.ROTEIRO; não conhece nenhum cliente. */

/* ═══ BLOCO: CONSTANTES ═══ */
var R = window.ROTEIRO;
var PESO = { ok: 1, parcial: 0.5, naosei: 0.15, nao: 0, pend: 0.15 };
var EIXOS = R.eixos, CARTOES = R.cartoes, PAINEL = R.painel, CIDADES = R.cidades, PARCEIROS = R.parceiros;
var EVENTOS_PRAZO = R.prazo.eventos, DIAS_OBRA = R.prazo.dias;
var NAND = R.beneficios.length;
var ATO = (function(){
  var a = {}; Object.keys(R.ato).forEach(function(k){ a[k] = R.ato[k]; });
  for (var i = 0; i < NAND; i++) a['andar-' + i] = 'Solução';
  return a;
})();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: ESTADO ═══ */
var estado = { slide: 0, kanban: {}, selecionado: null, eventos: (function(){ var e = {}; Object.keys(R.prazo.padrao || {}).forEach(function(k){ e[k] = R.prazo.padrao[k]; }); return e; })() };
/* ── FIM BLOCO ── */

/* ═══ BLOCO: NEGOCIO ═══ */
function calcularFap(func, salario, rat, fap){
  var folha = func * salario * 13;
  var base = folha * (rat / 100);
  return { folha: folha, melhor: base * 0.5, neutro: base, atual: base * fap };
}

function calcularAtraso(ativos){
  var perdidos = EVENTOS_PRAZO.reduce(function(s, e){ return s + (ativos[e.id] ? e.dias : 0); }, 0);
  return { perdidos: perdidos, entrega: DIAS_OBRA + perdidos, estouro: perdidos };
}

function calcularRadar(kanban){
  var porEixo = {};
  EIXOS.forEach(function(e){ porEixo[e.id] = { soma: 0, n: 0, ruins: [] }; });
  var classificados = 0;
  CARTOES.forEach(function(c, i){
    var st = kanban[i] || 'pend';
    if (st !== 'pend') classificados++;
    var p = porEixo[c.e];
    p.soma += PESO[st]; p.n++;
    if (st !== 'ok' && st !== 'parcial') p.ruins.push(c.t);
  });
  var eixos = EIXOS.map(function(e){
    var p = porEixo[e.id];
    return { id: e.id, nome: e.nome, acao: e.acao, valor: p.soma / p.n, ruins: p.ruins };
  });
  var media = eixos.reduce(function(s, e){ return s + e.valor; }, 0) / eixos.length;
  var prioridades = eixos.slice().sort(function(a, b){ return a.valor - b.valor; })
                         .filter(function(e){ return e.valor < 0.75; }).slice(0, 3);
  var nivel = media >= 0.75 ? { t: 'Exposição baixa', c: 'green', cor: '#5EE0A6' }
            : media >= 0.45 ? { t: 'Exposição moderada', c: 'warn', cor: '#F2B957' }
            : { t: 'Exposição alta', c: 'red', cor: '#FF6B5E' };
  var leitura = media >= 0.75 ? 'Base sólida. O ganho está em manter a rotina e acompanhar o FAP.'
              : media >= 0.45 ? 'Há obrigações cumpridas, mas lacunas que uma fiscalização ou perícia encontrariam.'
              : 'As lacunas estão justamente nos pontos que mais pesam em fiscalização, acidente e processo.';
  return { eixos: eixos, nota: Math.round(media * 100), prioridades: prioridades, classificados: classificados, nivel: nivel, leitura: leitura };
}

// Projeta lon/lat num plano simples para o mapa de rotas
function projetar(lon, lat){ return [(lon + 64) * 13, (1 - lat) * 11.5]; }
/* ── FIM BLOCO ── */

/* ═══ BLOCO: RENDER ═══ */
function renderMapa(){
  var base = CIDADES.filter(function(c){ return c.base; })[0];
  var b = projetar(base.lon, base.lat);
  var s = '<svg viewBox="0 0 420 400" role="img" aria-label="Rotas de obras pelo Brasil"><defs>' +
    '<linearGradient id="g-rota" x1="0" x2="1"><stop offset="0" stop-color="#6FE3EC"/><stop offset="1" stop-color="#F0D2A4"/></linearGradient>' +
    '<pattern id="g-pontos" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="rgba(168,216,219,.14)"/></pattern></defs>' +
    '<rect width="420" height="400" fill="url(#g-pontos)" rx="12"/>';
  CIDADES.forEach(function(c){
    if (c.base) return;
    var p = projetar(c.lon, c.lat);
    var mx = (b[0] + p[0]) / 2, my = (b[1] + p[1]) / 2 - Math.hypot(p[0] - b[0], p[1] - b[1]) * 0.35;
    s += '<path class="rota" d="M' + b[0] + ' ' + b[1] + ' Q' + mx + ' ' + my + ' ' + p[0] + ' ' + p[1] + '"/>';
  });
  CIDADES.forEach(function(c){
    var p = projetar(c.lon, c.lat);
    if (c.base){
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="16" fill="#6FE3EC" opacity=".18"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#6FE3EC"/>';
      s += '<text x="' + (p[0] - 14) + '" y="' + (p[1] + 30) + '" text-anchor="end" font-family="Sora" font-size="11" font-weight="800" fill="#6FE3EC">Fábrica e equipe</text>';
    } else {
      s += '<circle class="cid-halo" cx="' + p[0] + '" cy="' + p[1] + '" r="9"/><circle class="cid" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5"/>';
      s += '<text x="' + (p[0] + 7) + '" y="' + (p[1] - 6) + '" font-family="Sora" font-size="9" font-weight="600" fill="rgba(255,255,255,.55)">' + c.n + '</text>';
    }
  });
  s += '</svg><div class="mapa-leg"><span><i class="lf"></i>Origem da equipe</span><span><i class="lo"></i>Obra possível (ilustrativo)</span></div>';
  $('mapa').innerHTML = s;
}

function renderTicks(){
  var html = '';
  [0.5, 1.0, 1.5, 2.0].forEach(function(v){
    var a = Math.PI + (v - 0.5) / 1.5 * Math.PI;
    var x1 = 180 + Math.cos(a) * 118, y1 = 170 + Math.sin(a) * 118;
    var x2 = 180 + Math.cos(a) * 106, y2 = 170 + Math.sin(a) * 106;
    var xl = 180 + Math.cos(a) * 90,  yl = 170 + Math.sin(a) * 90;
    html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="rgba(255,255,255,.35)" stroke-width="2"/>';
    html += '<text x="' + xl + '" y="' + (yl + 4) + '" text-anchor="middle" font-family="Sora" font-size="11" font-weight="700" fill="rgba(255,255,255,.5)">' + v.toFixed(2).replace('.', ',') + '</text>';
  });
  $('g-ticks').innerHTML = html;
}

var ultimoAnual = 0;
function renderCalc(r, fap){
  $('cf-folha').textContent = moeda(r.folha);
  $('cf-fap-v').textContent = fap.toFixed(2).replace('.', ',');
  $('g-agulha').style.transform = 'rotate(' + ((fap - 0.5) / 1.5 * 180 - 90) + 'deg)';
  contar($('cf-anual'), ultimoAnual, r.atual, 600, moeda);
  ultimoAnual = r.atual;
  $('cf-mensal').textContent = moeda(r.atual / 12) + ' por mês';
  var max = Math.max(r.melhor, r.neutro, r.atual) || 1;
  $('cf-b1').style.width = (r.melhor / max * 100) + '%';
  $('cf-b2').style.width = (r.neutro / max * 100) + '%';
  $('cf-b3').style.width = (r.atual / max * 100) + '%';
  $('cf-v1').textContent = moeda(r.melhor);
  $('cf-v2').textContent = moeda(r.neutro);
  $('cf-v3').textContent = moeda(r.atual);
  $('cf-b3l').textContent = 'FAP ' + fap.toFixed(2).replace('.', ',');
  var d = r.atual - r.melhor, el = $('cf-delta');
  el.classList.toggle('positivo', d <= 0);
  el.innerHTML = d > 0
    ? '<b>' + moeda(d) + '</b> por ano acima do melhor cenário · ' + moeda(d * 3) + ' em 3 anos'
    : 'Este é o melhor cenário possível para esta folha.';
}

function renderPrazo(r){
  $('eventos').innerHTML = EVENTOS_PRAZO.map(function(e){
    return '<button type="button" class="evento glass' + (estado.eventos[e.id] ? ' on' : '') + '" data-ev="' + e.id + '">' +
      '<span class="ck"></span><div><b>' + pers(e.t) + '</b><small>' + pers(e.s) + '</small></div><em>+' + e.dias + 'd</em></button>';
  }).join('');
  var total = Math.max(DIAS_OBRA, r.entrega), html = '', perdRest = r.perdidos;
  // Distribui os dias perdidos ao longo da montagem; o que sobra empurra a entrega
  var passo = r.perdidos ? Math.floor(DIAS_OBRA / (r.perdidos + 1)) : 0;
  for (var i = 1; i <= Math.ceil(total / 7) * 7; i++){
    var cls = 'dia', txt = '';
    if (i <= total){
      txt = i;
      if (i === DIAS_OBRA) cls += ' inaug';
      else if (i > DIAS_OBRA) cls += ' estouro';
      else if (perdRest > 0 && passo && i % passo === 0){ cls += ' perdido'; perdRest--; }
      else cls += ' obra';
      if (i === total && i > DIAS_OBRA) cls += ' perdido';
    }
    html += '<div class="' + cls + '">' + txt + '</div>';
  }
  $('pz-grade').innerHTML = html;
  contar($('pz-perd'), 0, r.perdidos, 500, function(v){ return Math.round(v); });
  $('pz-dia').textContent = 'Dia ' + r.entrega;
  $('pz-dia').className = 'n ' + (r.perdidos ? 'red' : 'green');
  var P = R.prazo;
  $('pz-msg').innerHTML = r.perdidos
    ? '<span class="red">' + pers(P.msgAtraso).replace('{n}', r.perdidos).replace('{s}', r.perdidos > 1 ? 's' : '') + '</span> ' + pers(P.msgAtrasoResto)
    : '<span class="green">' + pers(P.msgOk).replace('{dias}', DIAS_OBRA) + '</span> ' + pers(P.msgOkResto);
  Cena.placar(r.perdidos);
}

function renderKanban(){
  var cols = document.querySelectorAll('.kb-col');
  cols.forEach(function(col){
    Array.prototype.slice.call(col.querySelectorAll('.card')).forEach(function(c){ c.remove(); });
  });
  var cont = {}, feitos = 0;
  CARTOES.forEach(function(c, i){
    var st = estado.kanban[i] || 'pend';
    if (st !== 'pend') feitos++;
    cont[st] = (cont[st] || 0) + 1;
    var el = document.createElement('div');
    el.className = 'card' + (estado.selecionado === i ? ' sel' : '');
    el.draggable = true;
    el.dataset.i = i;
    var eixo = EIXOS.filter(function(e){ return e.id === c.e; })[0];
    el.innerHTML = '<small>' + eixo.nome + '</small>' + c.t;
    document.querySelector('.kb-col[data-st=' + st + ']').appendChild(el);
  });
  cols.forEach(function(col){ col.querySelector('h4 span').textContent = cont[col.dataset.st] || 0; });
  $('kb-n').textContent = feitos + ' / ' + CARTOES.length;
  $('kb-barra').style.width = (feitos / CARTOES.length * 100) + '%';
}

function renderRadar(r){
  var cx = 280, cy = 230, R = 165, n = r.eixos.length;
  function ponto(i, v){
    var a = -Math.PI / 2 + i * 2 * Math.PI / n;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
  }
  function corDe(v){ return v >= 0.75 ? '#5EE0A6' : v >= 0.45 ? '#F2B957' : '#FF6B5E'; }
  var s = '<svg viewBox="0 0 560 460" role="img" aria-label="Radar de exposição em SST"><defs>' +
    '<radialGradient id="rg-area"><stop offset="0" stop-color="#F0D2A4" stop-opacity=".55"/><stop offset="1" stop-color="#D6B17D" stop-opacity=".12"/></radialGradient>' +
    '<radialGradient id="rg-fundo"><stop offset="0" stop-color="#30747F" stop-opacity=".25"/><stop offset="1" stop-color="#30747F" stop-opacity="0"/></radialGradient>' +
    '<filter id="rg-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs><circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#rg-fundo)"/>';
  [0.25, 0.5, 0.75, 1].forEach(function(f, k){
    var pts = r.eixos.map(function(e, i){ return ponto(i, f).join(','); }).join(' ');
    s += '<polygon points="' + pts + '" fill="none" stroke="rgba(168,216,219,' + (k === 3 ? .3 : .12) + ')" stroke-width="1"' + (k < 3 ? ' stroke-dasharray="3 5"' : '') + '/>';
    var pl = ponto(0, f);
    s += '<text x="' + (pl[0] + 6) + '" y="' + (pl[1] + 3) + '" font-family="Sora" font-size="9" fill="rgba(255,255,255,.35)">' + (f * 100) + '</text>';
  });
  r.eixos.forEach(function(e, i){
    var p = ponto(i, 1), l = ponto(i, 1.17);
    s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="rgba(168,216,219,.14)"/>';
    var anc = Math.abs(l[0] - cx) < 10 ? 'middle' : (l[0] > cx ? 'start' : 'end');
    s += '<text x="' + l[0] + '" y="' + (l[1] - 2) + '" text-anchor="' + anc + '" font-family="Sora" font-size="13" font-weight="700" fill="#F4F5F6">' + e.nome + '</text>';
    s += '<text x="' + l[0] + '" y="' + (l[1] + 15) + '" text-anchor="' + anc + '" font-family="Sora" font-size="12" font-weight="800" fill="' + corDe(e.valor) + '">' + Math.round(e.valor * 100) + '%</text>';
  });
  s += '<polygon id="rd-area" fill="url(#rg-area)" stroke="#F0D2A4" stroke-width="2.5" stroke-linejoin="round" filter="url(#rg-glow)"/>';
  r.eixos.forEach(function(e){
    s += '<circle class="rd-pt" r="6" fill="' + corDe(e.valor) + '" stroke="#0C1B22" stroke-width="2" filter="url(#rg-glow)"/>';
  });
  s += '</svg>';
  $('rd-svg').innerHTML = s;

  // Polígono desenhado a partir do centro
  var area = $('rd-area'), pts = document.querySelectorAll('.rd-pt'), ini = null;
  function passo(ts){
    if (ini === null) ini = ts;
    var p = easeOut(Math.min(1, (ts - ini) / 1300));
    area.setAttribute('points', r.eixos.map(function(e, i){ return ponto(i, Math.max(e.valor, 0.04) * p).join(','); }).join(' '));
    r.eixos.forEach(function(e, i){
      var q = ponto(i, Math.max(e.valor, 0.04) * p);
      pts[i].setAttribute('cx', q[0]); pts[i].setAttribute('cy', q[1]);
    });
    if (p < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);

  var circ = 326.7;
  $('rd-arco').setAttribute('stroke', r.nivel.cor);
  $('rd-arco').style.strokeDashoffset = circ;
  setTimeout(function(){ $('rd-arco').style.strokeDashoffset = circ * (1 - r.nota / 100); }, 60);
  contar($('rd-nota'), 0, r.nota, 1600, function(v){ return Math.round(v); });
  $('rd-nivel').textContent = r.nivel.t;
  $('rd-nivel').className = 'nivel ' + r.nivel.c;
  $('rd-leitura').textContent = r.leitura;

  $('rd-prio').innerHTML = r.prioridades.map(function(e, k){
    var lac = e.ruins[0] ? 'Lacuna: "' + e.ruins[0] + '".<br>' : '';
    return '<li class="glass"><span class="ix">' + (k + 1) + '</span><div><b>' + e.nome + '<em>' + Math.round(e.valor * 100) + '%</em></b>' +
           '<span>' + lac + 'Como a DMG resolve: ' + e.acao + '</span>' +
           '<div class="mini"><i style="width:' + Math.max(4, e.valor * 100) + '%"></i></div></div></li>';
  }).join('');
  $('rd-vazio').textContent = r.classificados < CARTOES.length
    ? (CARTOES.length - r.classificados) + ' cartões não foram classificados e contam como "não sei".' : '';
}

function renderPainel(aba){
  var P = PAINEL, h = '';
  $('pnl-nav').innerHTML = P.abas.map(function(a){
    return '<button type="button" class="pnl-item' + (a.id === aba ? ' on' : '') + '" data-aba="' + a.id + '"><i>' + a.ic + '</i>' + a.t + (a.badge ? '<em>' + a.badge + '</em>' : '') + '</button>';
  }).join('');
  function topo(t, sub){ return '<div class="pv-topo"><div><h3>' + t + '</h3><small>' + sub + '</small></div><div class="pv-filtro">' + P.filtros.map(function(f, i){ return '<span' + (i ? '' : ' class="on"') + '>' + pers(f) + '</span>'; }).join('') + '</div></div>'; }
  function conf(v){ var c = v >= 0.95 ? 'f-ok' : v >= 0.85 ? 'f-md' : 'f-vc'; return '<div class="pv-conf"><div class="trilha"><i class="' + c + '" style="width:' + Math.round(v * 100) + '%"></i></div><span>' + Math.round(v * 100) + '%</span></div>'; }
  if (aba === 'geral'){
    h += topo('Bom dia, RH ' + escaparHtml(EMPRESA.nome), 'Atualizado agora · ' + P.obras.length + ' frentes ativas');
    h += '<div class="pv-kpis">' + P.kpis.map(function(k, i){
      return '<div class="pv-kpi" style="animation-delay:' + (i * 0.06) + 's"><small>' + k.t + '</small><b class="' + (k.c || '') + '">' + pers(k.v) + '</b><span>' + k.s + '</span></div>';
    }).join('') + '</div>';
    var max = Math.max.apply(null, P.meses.map(function(m){ return m[1]; }));
    h += '<div class="pv-grid"><div class="pv-card"><h4>Exames realizados por mês <em>+30% no semestre</em></h4><div class="pv-barras">' +
      P.meses.map(function(m, i){ return '<div><b>' + m[1] + '</b><i class="' + (i === P.meses.length - 1 ? 'atual' : '') + '" style="height:' + (m[1] / max * 100) + '%;animation-delay:' + (i * 0.08) + 's"></i><small>' + m[0] + '</small></div>'; }).join('') +
      '</div></div><div class="pv-card"><h4>Precisa de atenção <em>' + P.alertas.length + '</em></h4><ul class="pv-alertas">' +
      P.alertas.map(function(a){ return '<li class="' + a.c + '"><span>' + a.t + '</span><em>' + a.q + '</em></li>'; }).join('') + '</ul></div></div>';
  } else if (aba === 'agenda'){
    h += topo('Agenda da semana', 'Agendado pelo RH, já na agenda da clínica DMG');
    var dias = ['Seg 26', 'Ter 27', 'Qua 28', 'Qui 29', 'Sex 30'], horas = ['07:30', '09:00', '10:30', '14:00'];
    h += '<div class="pv-card"><div class="pv-sem"><div></div>' + dias.map(function(d){ return '<div class="h">' + d + '</div>'; }).join('');
    horas.forEach(function(hr, hi){
      h += '<div class="hora">' + hr + '</div>';
      for (var d = 0; d < 5; d++){
        var ev = P.agenda.filter(function(e){ return e.d === d && e.h === hi; })[0];
        h += '<div class="cel">' + (ev ? '<div class="pv-ev ' + ev.k + '" style="animation-delay:' + ((d + hi) * 0.05) + 's"><b>' + ev.t + '</b>' + ev.s + '</div>' : '') + '</div>';
      }
    });
    h += '</div></div>';
  } else if (aba === 'obras'){
    h += topo(P.rotuloObras, P.obras.reduce(function(s, o){ return s + o.e; }, 0) + ' pessoas distribuídas');
    h += '<div class="pv-card"><table class="pv-tab"><thead><tr><th>' + P.colunaObra + '</th><th>Equipe</th><th>Conformidade SST</th><th>Status</th></tr></thead><tbody>' +
      P.obras.map(function(o, i){ return '<tr style="animation-delay:' + (i * 0.06) + 's"><td><b>' + o.n + '</b><small>' + o.c + '</small></td><td>' + o.e + '</td><td>' + conf(o.conf) + '</td><td><span class="pv-tag ' + o.tag + '">' + o.st + '</span></td></tr>'; }).join('') +
      '</tbody></table></div>';
  } else if (aba === 'colab'){
    var c = P.colab;
    h += topo('Colaborador 360', 'Tudo de uma pessoa, em uma tela');
    h += '<div class="pv-360"><div class="pv-card pv-perfil"><div class="pv-av">' + c.ini + '</div><b>' + c.n + '</b><small>' + c.f + '</small><small>' + c.o + '</small><div class="pv-chips">' +
      c.chips.map(function(x){ return '<span class="pv-tag ok">' + x + '</span>'; }).join('') + '</div></div>' +
      '<div class="pv-card"><h4>Validade contra a obra <em>' + c.fimObra + '</em></h4><div class="pv-val">' +
      c.val.map(function(v){ var p = v.r / v.tot, cl = v.r < 30 ? 'f-vc' : v.r < 60 ? 'f-md' : 'f-ok';
        return '<div><span>' + v.t + '</span><div class="trilha"><i class="' + cl + '" style="width:' + Math.round(p * 100) + '%"></i></div><em class="' + (v.r < 30 ? 'red' : '') + '">' + v.r + ' dias</em></div>'; }).join('') +
      '</div><h4 class="pv-h4-esp">Linha do tempo</h4><ul class="pv-linha">' +
      c.linha.map(function(l){ return '<li class="' + l.a + '"><b>' + l.t + '</b><small>' + l.d + '</small></li>'; }).join('') + '</ul></div></div>';
  } else if (aba === 'terc'){
    h += topo('Terceiros por obra', 'Conferidos antes de entrar no canteiro');
    function cel(ok, tot){ return '<span class="pv-tag ' + (ok === tot ? 'ok' : 'r') + '">' + ok + '/' + tot + '</span>'; }
    h += '<div class="pv-card"><table class="pv-tab"><thead><tr><th>Empreiteira</th><th>Pessoas</th><th>ASO</th><th>NR-35 / NR-18</th><th>Ficha de EPI</th></tr></thead><tbody>' +
      P.terceiros.map(function(t, i){ return '<tr style="animation-delay:' + (i * 0.06) + 's"><td><b>' + t.n + '</b><small>' + t.o + '</small></td><td>' + t.p + '</td><td>' + cel(t.aso, t.p) + '</td><td>' + cel(t.nr, t.p) + '</td><td>' + cel(t.epi, t.p) + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
  }
  $('pnl-conteudo').innerHTML = h;
  $('pnl-conteudo').scrollTop = 0;
}

function renderParceiros(){
  $('parceiros').innerHTML = PARCEIROS.map(function(p, i){
    return '<div class="parc glass rv d' + (i + 2) + '"><small>' + p.setor + '</small><h3>' + p.nome + '</h3><p>' + p.texto + '</p></div>';
  }).join('');
}

function renderTorreInd(){
  document.querySelectorAll('.andar-slide').forEach(function(s){
    var atual = Number(s.dataset.andar), html = '';
    for (var i = 0; i < NAND; i++) html += '<i class="' + (i < atual ? 'feito' : i === atual ? 'atual' : '') + '"></i>';
    s.querySelector('.torre-ind').innerHTML = html;
  });
}

function animarNumeros(slide){
  slide.querySelectorAll('[data-conta]').forEach(function(el){
    var pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    contar(el, 0, Number(el.dataset.conta), 1400, function(v){
      var n = Math.round(v);
      return (pre === '0' ? (n < 10 ? '0' : '') : pre) + n + suf;
    });
  });
}
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EVENTOS_CALC ═══ */
if ($('cf-fap')) (function(){
  var rat = R.calc.rat;
  function atualizar(){
    var fap = parseFloat($('cf-fap').value);
    renderCalc(calcularFap(numero($('cf-func').value), numero($('cf-sal').value), rat, fap), fap);
  }
  $('cf-fap').addEventListener('input', atualizar);
  $('cf-func').addEventListener('input', atualizar);
  $('cf-sal').addEventListener('input', atualizar);
  $('cf-sal').addEventListener('blur', function(){ $('cf-sal').value = numero($('cf-sal').value).toLocaleString('pt-BR'); });
  document.querySelectorAll('#cf-rats .chip').forEach(function(b){
    b.addEventListener('click', function(){
      rat = Number(b.dataset.rat);
      document.querySelectorAll('#cf-rats .chip').forEach(function(o){ o.classList.toggle('on', o === b); });
      atualizar();
    });
  });
  renderTicks();
  atualizar();
})();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EVENTOS_PRAZO ═══ */
if ($('eventos')){
$('eventos').addEventListener('click', function(e){
  var b = e.target.closest('.evento'); if (!b) return;
  estado.eventos[b.dataset.ev] = !estado.eventos[b.dataset.ev];
  renderPrazo(calcularAtraso(estado.eventos));
});
renderPrazo(calcularAtraso(estado.eventos));
}
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EVENTOS_KANBAN ═══ */
if ($('kb')) (function(){
  var CHAVE = R.chaveLocal + '-' + EMPRESA.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try { estado.kanban = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (e) { estado.kanban = {}; }
  try { var cli = localStorage.getItem(CHAVE + '-cliente'); if (cli) $('rd-cliente').value = cli; } catch (e) {}

  function salvar(){ try { localStorage.setItem(CHAVE, JSON.stringify(estado.kanban)); } catch (e) {} }
  function mover(i, st){
    if (st === 'pend') delete estado.kanban[i]; else estado.kanban[i] = st;
    estado.selecionado = null; salvar(); renderKanban();
  }

  var kb = $('kb');
  kb.addEventListener('dragstart', function(e){
    var c = e.target.closest('.card'); if (!c) return;
    e.dataTransfer.setData('text/plain', c.dataset.i); c.classList.add('arrastando');
  });
  kb.addEventListener('dragend', function(e){
    var c = e.target.closest('.card'); if (c) c.classList.remove('arrastando');
    kb.querySelectorAll('.kb-col').forEach(function(col){ col.classList.remove('alvo'); });
  });
  kb.addEventListener('dragover', function(e){
    var col = e.target.closest('.kb-col'); if (!col) return;
    e.preventDefault();
    kb.querySelectorAll('.kb-col').forEach(function(o){ o.classList.toggle('alvo', o === col); });
  });
  kb.addEventListener('drop', function(e){
    var col = e.target.closest('.kb-col'); if (!col) return;
    e.preventDefault();
    mover(Number(e.dataTransfer.getData('text/plain')), col.dataset.st);
  });
  kb.addEventListener('click', function(e){
    var c = e.target.closest('.card');
    if (c){
      var i = Number(c.dataset.i);
      estado.selecionado = estado.selecionado === i ? null : i;
      renderKanban(); e.stopPropagation(); return;
    }
    var col = e.target.closest('.kb-col');
    if (col && estado.selecionado !== null) mover(estado.selecionado, col.dataset.st);
  });

  $('kb-reset').addEventListener('click', function(){ estado.kanban = {}; salvar(); renderKanban(); });
  $('kb-gerar').addEventListener('click', function(){ Deck.ir(Deck.indice('s-radar')); });
  $('rd-voltar').addEventListener('click', function(){ Deck.ir(Deck.indice('s-kanban')); });
  $('rd-pdf').addEventListener('click', function(){ window.print(); });
  $('rd-cliente').addEventListener('input', function(){
    try { localStorage.setItem(CHAVE + '-cliente', $('rd-cliente').value); } catch (e) {}
  });
  renderKanban();
})();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EVENTOS_PAINEL ═══ */
var Painel = (function(){
  var aberto = false, t = null;
  function abrir(){
    aberto = true;
    $('pnl').classList.add('on'); $('pnl').setAttribute('aria-hidden', 'false');
    $('pnl-load').classList.remove('fora');
    renderPainel('geral');
    clearTimeout(t); t = setTimeout(function(){ $('pnl-load').classList.add('fora'); }, 900);
  }
  function fechar(){ aberto = false; $('pnl').classList.remove('on'); $('pnl').setAttribute('aria-hidden', 'true'); }
  if ($('abrir-painel')) $('abrir-painel').addEventListener('click', abrir);
  $('fechar-painel').addEventListener('click', fechar);
  $('pnl').addEventListener('click', function(e){ if (e.target === $('pnl')) fechar(); });
  $('pnl-nav').addEventListener('click', function(e){ var b = e.target.closest('.pnl-item'); if (b) renderPainel(b.dataset.aba); });
  return { aberto: function(){ return aberto; }, fechar: fechar };
})();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: INICIALIZACAO ═══ */
if ($('mapa')) renderMapa();
document.querySelectorAll('.logo-dmg').forEach(function(img){ img.src = 'assets/logo-dmg.png'; });
if ($('parceiros')) renderParceiros();
renderTorreInd();
/* ── FIM BLOCO ── */

/* ═══ BLOCO: CONTROLLER ═══ */
var Deck = (function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var total = slides.length, trava = false;
  var dots = $('dots');
  slides.forEach(function(s, i){
    var b = document.createElement('button');
    b.className = 'dot'; b.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
    b.addEventListener('click', function(){ ir(i); });
    dots.appendChild(b);
  });

  function indice(id){ return slides.indexOf($(id)); }

  function ir(i){
    if (i < 0 || i >= total) return;
    slides[estado.slide].classList.remove('on');
    estado.slide = i;
    var s = slides[i];
    s.classList.add('on'); s.scrollTop = 0;
    Array.prototype.forEach.call(dots.children, function(d, k){ d.classList.toggle('on', k === i); });
    $('count').textContent = pad(i + 1) + ' / ' + pad(total);
    $('prog').style.width = ((i + 1) / total * 100) + '%';
    var nome = s.dataset.cena;
    $('hud-ato').textContent = ATO[nome] || 'Diagnóstico';
    document.body.classList.toggle('cena-fundo', nome === 'fundo');
    if (s.id === 's-radar') renderRadar(calcularRadar(estado.kanban));
    animarNumeros(s);
    Cena.ir(nome);
    if (history.replaceState) history.replaceState(null, '', '#slide-' + pad(i + 1));
  }

  function interativo(el){ return Painel.aberto() || (el && el.closest && el.closest('input,button,.kb,a,.pnl')); }

  document.addEventListener('keydown', function(e){
    if (Painel.aberto()){ if (e.key === 'Escape') Painel.fechar(); return; }   // → BLOCO: EVENTOS_PAINEL
    if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].indexOf(e.key) >= 0){ e.preventDefault(); ir(estado.slide + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) >= 0){ e.preventDefault(); ir(estado.slide - 1); }
  });
  addEventListener('wheel', function(e){
    if (trava || Math.abs(e.deltaY) < 20 || interativo(e.target)) return;
    var s = slides[estado.slide];
    if (s.scrollHeight > s.clientHeight + 4){
      var fim = s.scrollTop + s.clientHeight >= s.scrollHeight - 4;
      if ((e.deltaY > 0 && !fim) || (e.deltaY < 0 && s.scrollTop > 4)) return;
    }
    trava = true; ir(estado.slide + (e.deltaY > 0 ? 1 : -1));
    setTimeout(function(){ trava = false; }, 900);
  }, { passive: true });
  var tx = 0, ty = 0;
  addEventListener('touchstart', function(e){ tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  addEventListener('touchend', function(e){
    if (interativo(e.target)) return;
    var dx = tx - e.changedTouches[0].clientX, dy = ty - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 55) ir(estado.slide + (dx > 0 ? 1 : -1));
  }, { passive: true });

  var m = /^#slide-(\d+)$/.exec(location.hash || '');
  var ini = m ? Math.min(Math.max(parseInt(m[1], 10) - 1, 0), total - 1) : 0;
  slides[0].classList.add('on');
  ir(ini);
  return { ir: ir, indice: indice };
})();
/* ── FIM BLOCO ── */
