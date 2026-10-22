/* Hub de preparação: o vendedor informa CNPJ e/ou site, revisa os dados, escolhe ICP e subtipo
   e gera o link personalizado da apresentação. Abre quando a URL não tem ?r=. */

/* ═══ BLOCO: CATALOGO ═══ */
// 6 ICPs × 3 subtipos. roteiro = arquivo em roteiros/ (null = ainda em produção).
// cnae: prefixos de CNAE que levam a esse subtipo; rat: alíquota estimada para a calculadora.
var CATALOGO = [
  { id: 'construcao', nome: 'Construção', ic: '▲', rat: 3, subtipos: [
    { id: 'edificacoes', nome: 'Edificações e incorporação', cena: 'Torre subindo e grua', roteiro: null, cnae: ['41'] },
    { id: 'infraestrutura', nome: 'Infraestrutura e terraplenagem', cena: 'Estrada, escavadeira e ponte', roteiro: null, cnae: ['42', '4313'] },
    { id: 'especializadas', nome: 'Especializadas e esportiva', cena: 'Fábrica, caminhão e estádio', roteiro: 'construcao-esportiva', cnae: ['43'] }
  ] },
  { id: 'comercio', nome: 'Comércio', ic: '◆', rat: 2, subtipos: [
    { id: 'materiais', nome: 'Materiais de construção', cena: 'Loja, pátio e empilhadeira', roteiro: null, cnae: ['4741', '4742', '4743', '4744'] },
    { id: 'supermercados', nome: 'Supermercados', cena: 'Loja, açougue e câmara fria', roteiro: null, cnae: ['4711', '4712', '472'] },
    { id: 'atacado', nome: 'Atacado e distribuição', cena: 'Depósito e frota de entrega', roteiro: null, cnae: ['46', '45'] }
  ] },
  { id: 'terceirizados', nome: 'Serviços terceirizados', ic: '●', rat: 3, subtipos: [
    { id: 'facilities', nome: 'Facilities (limpeza e vigilância)', cena: 'Postos em prédios de clientes', roteiro: null, cnae: ['81', '80', '78'] },
    { id: 'residuos', nome: 'Resíduos e ambiental', cena: 'Caminhão de coleta e central', roteiro: null, cnae: ['37', '38', '39'] },
    { id: 'alimentacao', nome: 'Alimentação coletiva', cena: 'Cozinha industrial e refeitório', roteiro: null, cnae: ['5620', '5611'] }
  ] },
  { id: 'profissionais', nome: 'Serviços profissionais', ic: '■', rat: 1, subtipos: [
    { id: 'provedores', nome: 'Provedores de internet', cena: 'Torre, poste e equipe de campo', roteiro: null, cnae: ['61'] },
    { id: 'contabilidades', nome: 'Contabilidades', cena: 'Escritório e carteira de clientes', roteiro: null, cnae: ['6920'] },
    { id: 'engenharia', nome: 'Engenharia e consultorias', cena: 'Escritório e visitas técnicas', roteiro: null, cnae: ['71', '70', '72', '74', '62', '63', '69'] }
  ] },
  { id: 'industria', nome: 'Indústria', ic: '⬢', rat: 3, subtipos: [
    { id: 'usinagem', nome: 'Manutenção e usinagem', cena: 'Tornos, prensas e ponte rolante', roteiro: null, cnae: ['25', '28', '29', '33'] },
    { id: 'concreto', nome: 'Concreto e pré-moldados', cena: 'Central de concreto e betoneiras', roteiro: null, cnae: ['23'] },
    { id: 'graficas', nome: 'Gráficas e embalagens', cena: 'Impressoras e linha de acabamento', roteiro: null, cnae: ['17', '18', '22'] }
  ] },
  { id: 'logistica', nome: 'Logística', ic: '➜', rat: 3, subtipos: [
    { id: 'cargas', nome: 'Transporte de cargas', cena: 'Rodovia, frota e pátio', roteiro: null, cnae: ['4930', '50', '51'] },
    { id: 'cd', nome: 'E-commerce e CD', cena: 'Racks, empilhadeiras e docas', roteiro: null, cnae: ['5211', '5212', '5250', '53'] },
    { id: 'mobilidade', nome: 'Mobilidade (estacionamento e fretamento)', cena: 'Estacionamento e ônibus', roteiro: null, cnae: ['5223', '4929', '4922', '4921'] }
  ] }
];
/* ── FIM BLOCO ── */

/* ═══ BLOCO: NEGOCIO_HUB ═══ */
function soDigitos(s){ return String(s || '').replace(/\D/g, ''); }

function formatarCnpj(d){
  d = soDigitos(d).slice(0, 14);
  return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
}

// Dígitos verificadores do CNPJ, para não consultar números digitados errado
function cnpjValido(c){
  c = soDigitos(c);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  function dv(base){
    var pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    var s = 0; for (var i = 0; i < base.length; i++) s += Number(base[i]) * pesos[i];
    var r = s % 11; return r < 2 ? 0 : 11 - r;
  }
  return dv(c.slice(0, 12)) === Number(c[12]) && dv(c.slice(0, 13)) === Number(c[13]);
}

// Subtipo sugerido: o prefixo de CNAE mais longo que casar vence
function sugerirSubtipo(cnae){
  var cod = soDigitos(cnae), melhor = null, tam = 0;
  CATALOGO.forEach(function(icp){
    icp.subtipos.forEach(function(st){
      st.cnae.forEach(function(p){
        if (cod.indexOf(p) === 0 && p.length > tam){ melhor = { icp: icp, st: st }; tam = p.length; }
      });
    });
  });
  return melhor;
}

function anosDesde(dataIso){
  if (!dataIso) return null;
  var d = new Date(dataIso), hoje = new Date();
  var a = hoje.getFullYear() - d.getFullYear();
  if (hoje < new Date(hoje.getFullYear(), d.getMonth(), d.getDate())) a--;
  return a > 0 ? a : null;
}

function dominioDe(site){
  var s = String(site || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  return s.split(/[/?#]/)[0].toLowerCase();
}

function montarLink(cfg){
  var q = new URLSearchParams();
  q.set('r', cfg.roteiro);
  q.set('empresa', cfg.nome);
  if (cfg.func) q.set('func', cfg.func);
  if (cfg.anos) q.set('anos', cfg.anos);
  if (cfg.rat) q.set('rat', cfg.rat);
  if (cfg.site) q.set('site', cfg.site);
  if (cfg.cidade) q.set('cidade', cfg.cidade);
  return location.origin + location.pathname + '?' + q.toString();
}
/* ── FIM BLOCO ── */

/* ═══ BLOCO: ESTADO_HUB ═══ */
var hub = { dados: null, icp: null, st: null, rat: null };
/* ── FIM BLOCO ── */

/* ═══ BLOCO: RENDER_HUB ═══ */
function renderHub(){
  document.body.classList.add('modo-hub');
  document.title = 'DMG Ocupacional · Preparar apresentação';
  var h = '<div class="hub">' +
    '<header class="hub-topo"><img class="logo-dmg" src="assets/logo-dmg.png" alt="DMG Ocupacional"><span>Preparar apresentação</span></header>' +
    '<div class="hub-grade">' +
      '<section class="hub-cliente glass">' +
        '<div class="eyebrow">1 · Quem é o cliente?</div>' +
        '<h2>Comece pelo <span class="grad">CNPJ</span>.</h2>' +
        '<p class="hub-dica">Nome, ramo, cidade e tempo de empresa vêm da Receita. Você ajusta o que precisar.</p>' +
        '<label class="hub-rot" for="h-cnpj">CNPJ</label>' +
        '<div class="hub-busca"><input id="h-cnpj" type="text" inputmode="numeric" placeholder="00.000.000/0000-00" autocomplete="off"><button class="btn gold" type="button" id="h-buscar">Buscar</button></div>' +
        '<p class="hub-status" id="h-status"></p>' +
        '<div class="hub-ficha" id="h-ficha"></div>' +
        '<label class="hub-rot" for="h-site">Site <small>opcional, traz o logo</small></label>' +
        '<div class="hub-site"><img id="h-favicon" alt=""><input id="h-site" type="text" placeholder="empresa.com.br" autocomplete="off"></div>' +
        '<div class="hub-campos">' +
          '<div><label class="hub-rot" for="h-nome">Nome na apresentação</label><input id="h-nome" type="text" placeholder="Como o cliente é chamado"></div>' +
          '<div><label class="hub-rot" for="h-func">Colaboradores</label><input id="h-func" type="text" inputmode="numeric" placeholder="220"></div>' +
          '<div><label class="hub-rot" for="h-anos">Anos de empresa</label><input id="h-anos" type="text" inputmode="numeric" placeholder="—"></div>' +
        '</div>' +
        '<label class="hub-rot">RAT para a calculadora <small id="h-rat-nota">estimado pelo ramo, confirme</small></label>' +
        '<div class="chips" id="h-rats">' + [1, 2, 3].map(function(r){ return '<button class="chip" type="button" data-rat="' + r + '">' + r + '%</button>'; }).join('') + '</div>' +
      '</section>' +
      '<section class="hub-icps">' +
        '<div class="eyebrow">2 · Qual história contar?</div>' +
        '<h2>Escolha o <span class="grad">ICP e o subtipo</span>.</h2>' +
        '<div class="icp-grade" id="h-icps"></div>' +
      '</section>' +
    '</div>' +
    '<footer class="hub-barra glass" id="h-barra"></footer>' +
  '</div>';
  $('deck').innerHTML = h;
  renderIcps();
  renderBarra();
}

function renderIcps(){
  var sug = hub.dados && hub.dados.sugestao;
  $('h-icps').innerHTML = CATALOGO.map(function(icp){
    var ativo = hub.icp === icp.id;
    return '<article class="icp glass' + (ativo ? ' on' : '') + '">' +
      '<div class="icp-cab"><span class="icp-ic">' + icp.ic + '</span><b>' + icp.nome + '</b>' +
      (sug && sug.icp.id === icp.id ? '<em class="icp-sug">sugerido pelo CNAE</em>' : '') + '</div>' +
      '<div class="icp-subs">' + icp.subtipos.map(function(st){
        var on = hub.st === st.id && ativo, pronto = !!st.roteiro;
        return '<button type="button" class="sub' + (on ? ' on' : '') + (pronto ? '' : ' breve') + '" data-icp="' + icp.id + '" data-st="' + st.id + '"' + (pronto ? '' : ' disabled') + '>' +
          '<span>' + st.nome + '</span><small>' + (pronto ? st.cena : 'Em produção') + '</small></button>';
      }).join('') + '</div></article>';
  }).join('');
}

function configAtual(){
  var icp = CATALOGO.filter(function(i){ return i.id === hub.icp; })[0];
  var st = icp && icp.subtipos.filter(function(s){ return s.id === hub.st; })[0];
  return {
    icp: icp, st: st, roteiro: st && st.roteiro,
    nome: $('h-nome').value.trim(), func: numero($('h-func').value) || null, anos: numero($('h-anos').value) || null,
    rat: hub.rat, site: dominioDe($('h-site').value), cidade: hub.dados ? hub.dados.cidade : ''
  };
}

function renderBarra(){
  var c = configAtual(), falta = [];
  if (!c.nome) falta.push('o nome do cliente');
  if (!c.roteiro) falta.push('um subtipo');
  var link = falta.length ? '' : montarLink(c);
  $('h-barra').innerHTML = falta.length
    ? '<span class="hub-falta">Falta escolher ' + falta.join(' e ') + '.</span>'
    : '<div class="hub-resumo"><b>' + escaparHtml(c.nome) + '</b><span>' + c.icp.nome + ' · ' + c.st.nome + (c.func ? ' · ' + c.func + ' colaboradores' : '') + '</span></div>' +
      '<input class="hub-link" id="h-link" type="text" readonly value="' + escaparHtml(link) + '">' +
      '<button class="btn" type="button" id="h-copiar">Copiar link</button>' +
      '<a class="btn gold" id="h-abrir" href="' + escaparHtml(link) + '">Abrir apresentação →</a>';
  try { localStorage.setItem('dmg-hub-ultimo', JSON.stringify({ cnpj: $('h-cnpj').value, site: $('h-site').value, nome: c.nome, func: c.func, anos: c.anos, rat: c.rat, icp: hub.icp, st: hub.st })); } catch (e) {}
}

function renderFicha(d){
  $('h-ficha').innerHTML = '<div class="ficha"><b>' + escaparHtml(d.razao) + '</b>' +
    '<span>' + escaparHtml(d.cnaeTxt) + '</span>' +
    '<span>' + escaparHtml(d.cidade) + (d.anos ? ' · ' + d.anos + ' anos' : '') + (d.porte && d.porte !== 'DEMAIS' ? ' · ' + escaparHtml(d.porte.toLowerCase()) : '') + '</span></div>';
}

function marcarRat(r){
  hub.rat = r;
  document.querySelectorAll('#h-rats .chip').forEach(function(b){ b.classList.toggle('on', Number(b.dataset.rat) === r); });
}
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EVENTOS_HUB ═══ */
function iniciarHub(){
  renderHub();
  var cnpj = $('h-cnpj');

  cnpj.addEventListener('input', function(){ cnpj.value = formatarCnpj(cnpj.value); });
  cnpj.addEventListener('keydown', function(e){ if (e.key === 'Enter') buscar(); });
  $('h-buscar').addEventListener('click', buscar);

  function buscar(){
    var c = soDigitos(cnpj.value), st = $('h-status');
    if (!cnpjValido(c)){ st.className = 'hub-status red'; st.textContent = 'CNPJ inválido. Confira os 14 dígitos.'; return; }
    st.className = 'hub-status'; st.textContent = 'Consultando a Receita…';
    fetch('https://brasilapi.com.br/api/cnpj/v1/' + c)
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(j){
        var cidade = (j.municipio || '').toLowerCase().replace(/(^|\s)\S/g, function(m){ return m.toUpperCase(); }) + (j.uf ? '/' + j.uf : '');
        var d = {
          razao: j.razao_social, fantasia: j.nome_fantasia, cnae: String(j.cnae_fiscal || ''),
          cnaeTxt: (j.cnae_fiscal ? String(j.cnae_fiscal).replace(/^(\d{4})(\d)(\d{2})$/, '$1-$2/$3') + ' · ' : '') + (j.cnae_fiscal_descricao || ''),
          cidade: cidade, anos: anosDesde(j.data_inicio_atividade), porte: j.porte || ''
        };
        d.sugestao = sugerirSubtipo(d.cnae);
        hub.dados = d;
        $('h-nome').value = nomeCurto(d.fantasia || d.razao);
        if (d.anos) $('h-anos').value = d.anos;
        renderFicha(d);
        if (d.sugestao){
          hub.icp = d.sugestao.icp.id;
          hub.st = d.sugestao.st.roteiro ? d.sugestao.st.id : null;
          marcarRat(d.sugestao.icp.rat);
          st.className = 'hub-status green';
          st.textContent = 'Encontrado. Sugestão: ' + d.sugestao.icp.nome + ' · ' + d.sugestao.st.nome + (d.sugestao.st.roteiro ? '' : ' (ainda em produção, escolha outro subtipo)') + '.';
        } else {
          st.className = 'hub-status warn';
          st.textContent = 'Encontrado. O CNAE não bate com nenhum ICP: escolha o subtipo mais próximo.';
        }
        renderIcps(); renderBarra();
      })
      .catch(function(){
        st.className = 'hub-status red';
        st.textContent = 'Não consegui consultar agora. Preencha o nome e os dados à mão.';
      });
  }

  $('h-site').addEventListener('input', function(){
    var dom = dominioDe($('h-site').value), img = $('h-favicon');
    if (dom.indexOf('.') > 0){ img.src = 'https://www.google.com/s2/favicons?sz=64&domain=' + encodeURIComponent(dom); img.classList.add('on'); }
    else img.classList.remove('on');
    renderBarra();
  });
  ['h-nome', 'h-func', 'h-anos'].forEach(function(id){ $(id).addEventListener('input', renderBarra); });
  $('h-rats').addEventListener('click', function(e){ var b = e.target.closest('.chip'); if (b){ marcarRat(Number(b.dataset.rat)); renderBarra(); } });

  $('h-icps').addEventListener('click', function(e){
    var b = e.target.closest('.sub'); if (!b || b.disabled) return;
    hub.icp = b.dataset.icp; hub.st = b.dataset.st;
    if (!hub.rat){ marcarRat(CATALOGO.filter(function(i){ return i.id === hub.icp; })[0].rat); }
    renderIcps(); renderBarra();
  });

  $('h-barra').addEventListener('click', function(e){
    if (e.target.id !== 'h-copiar') return;
    var campo = $('h-link');
    (navigator.clipboard ? navigator.clipboard.writeText(campo.value) : Promise.reject())
      .catch(function(){ campo.select(); document.execCommand('copy'); })
      .then(function(){ e.target.textContent = 'Copiado ✓'; setTimeout(function(){ e.target.textContent = 'Copiar link'; }, 1600); });
  });

  // Retoma o último preparo deste navegador
  try {
    var u = JSON.parse(localStorage.getItem('dmg-hub-ultimo') || 'null');
    if (u){
      cnpj.value = u.cnpj || ''; $('h-site').value = u.site || ''; $('h-nome').value = u.nome || '';
      $('h-func').value = u.func || ''; $('h-anos').value = u.anos || '';
      hub.icp = u.icp; hub.st = u.st; if (u.rat) marcarRat(u.rat);
      $('h-site').dispatchEvent(new Event('input'));
      renderIcps(); renderBarra();
    }
  } catch (e) {}
}

iniciarHub();
/* ── FIM BLOCO ── */
