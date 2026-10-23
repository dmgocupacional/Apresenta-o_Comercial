/* Núcleo compartilhado: helpers, personalização da empresa e registro de cenários.
   Carregado antes do roteiro, do kit 3D e do motor. */

/* ═══ BLOCO: HELPERS ═══ */
function $(id){ return document.getElementById(id); }
function moeda(v){ return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); }
function numero(txt){ var n = parseInt(String(txt).replace(/[^0-9]/g, ''), 10); return isNaN(n) ? 0 : n; }
function pad(n){ return n < 10 ? '0' + n : String(n); }
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

// Anima texto numérico de um valor ao outro
function contar(el, de, ate, ms, fmt){
  var ini = null;
  function passo(ts){
    if (ini === null) ini = ts;
    var p = Math.min(1, (ts - ini) / ms);
    el.textContent = fmt(de + (ate - de) * easeOut(p));
    if (p < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

function escaparHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}
/* ── FIM BLOCO ── */

/* ═══ BLOCO: EMPRESA ═══ */
// Nome comercial curto a partir da razão social: corta sufixos societários e normaliza a caixa
function nomeCurto(razao){
  var s = String(razao || '').trim()
    .replace(/[,.]/g, ' ')
    .replace(/\b(LTDA|EIRELI|ME|EPP|S\/?A|SA|SLU|MEI|LIMITADA)\b/gi, ' ')
    .replace(/\s+/g, ' ').trim();
  var palavras = s.split(' ');
  if (palavras.length > 3) palavras = palavras.slice(0, 2);   // nome longo vira as duas primeiras palavras
  var minusc = ['de', 'da', 'do', 'das', 'dos', 'e'];
  // A Receita grava sem acento: devolve o acento das palavras mais comuns em nomes de empresa
  var ACENTOS = { consorcio: 'consórcio', construcoes: 'construções', construcao: 'construção', comercio: 'comércio', servicos: 'serviços',
                  servico: 'serviço', industria: 'indústria', logistica: 'logística', saude: 'saúde', tecnica: 'técnica', eletrica: 'elétrica',
                  hidraulica: 'hidráulica', mecanica: 'mecânica', distribuicao: 'distribuição', alimentacao: 'alimentação', sao: 'são',
                  informatica: 'informática', jose: 'josé', joao: 'joão', sebastiao: 'sebastião', antonio: 'antônio', paraiso: 'paraíso', telecomunicacoes: 'telecomunicações', manutencao: 'manutenção', pavimentacao: 'pavimentação',
                  terraplenagem: 'terraplenagem', incorporacao: 'incorporação', solucoes: 'soluções', medicos: 'médicos', clinica: 'clínica' };
  return palavras.map(function(p, i){
    var l = p.toLowerCase();
    if (ACENTOS[l]) l = ACENTOS[l];
    if (i > 0 && minusc.indexOf(l) >= 0) return l;
    // Sigla (DMG, GSO, JX) fica em maiúsculas; palavra curta comum (Via, São, Sul) não
    var curtaComum = ['via', 'são', 'sul', 'sol', 'mar', 'rio', 'paz', 'luz', 'boa', 'bom', 'eco', 'max', 'top', 'ouro', 'lar', 'casa'].indexOf(l) >= 0;
    return p.length <= 3 && p === p.toUpperCase() && !curtaComum ? p : l.charAt(0).toUpperCase() + l.slice(1);
  }).join(' ');
}

// A empresa da apresentação vem da URL (?empresa=, ?func=, ?anos=, ?rat=, ?site=, ?cidade=) com padrão definido no roteiro
var EMPRESA = (function(){
  var q = new URLSearchParams(location.search);
  var site = (q.get('site') || '').toLowerCase();
  return {
    nome: q.get('empresa') ? nomeCurto(q.get('empresa')) : null,
    func: q.get('func') ? numero(q.get('func')) : null,
    anos: q.get('anos') ? numero(q.get('anos')) : null,
    rat: [1, 2, 3].indexOf(numero(q.get('rat'))) >= 0 ? numero(q.get('rat')) : null,
    site: /^[a-z0-9.-]+\.[a-z]{2,}$/.test(site) ? site : null,   // só domínio, sem caminho
    cidade: q.get('cidade') || null
  };
})();

// Nomes que pedem artigo masculino ("o Consórcio", "do Grupo"); o padrão é feminino ("a construtora", "da empresa")
var MASCULINOS = ['consorcio', 'consórcio', 'grupo', 'instituto', 'escritorio', 'escritório', 'hospital', 'laboratorio', 'laboratório',
                  'supermercado', 'mercado', 'atacadao', 'atacadão', 'atacado', 'posto', 'banco', 'centro', 'colegio', 'colégio', 'condominio', 'condomínio'];
function nomeMasculino(){
  var p = String(EMPRESA.nome || '').split(' ')[0].toLowerCase();
  return MASCULINOS.indexOf(p) >= 0;
}
var ARTIGO_M = { a: 'o', da: 'do', na: 'no', pela: 'pelo', 'à': 'ao', A: 'O', Da: 'Do', Na: 'No', Pela: 'Pelo', 'À': 'Ao' };

// Substitui {empresa}, {EMPRESA}, {func} (colaboradores), {anos} (anos de empresa) e {cidade}; ajusta o artigo antes do nome
function pers(txt){
  if (txt == null) return '';
  if (nomeMasculino()) txt = String(txt).replace(/\b(a|da|na|pela|A|Da|Na|Pela)\s+\{empresa\}/g, function(m, art){ return ARTIGO_M[art] + ' {empresa}'; }).replace(/(^|\s)(à|À)\s+\{empresa\}/g, function(m, esp, art){ return esp + ARTIGO_M[art] + ' {empresa}'; });
  return String(txt).replace(/\{empresa\}/g, EMPRESA.nome).replace(/\{EMPRESA\}/g, EMPRESA.nome.toUpperCase())
    .replace(/\{func\}/g, EMPRESA.func).replace(/\{anos\}/g, EMPRESA.anos).replace(/\{cidade\}/g, EMPRESA.cidade || '');
}
/* ── FIM BLOCO ── */

// Logo do cliente a partir do domínio do site (ícone do site, servido pelo Google)
function logoCliente(){ return EMPRESA.site ? 'https://www.google.com/s2/favicons?sz=128&domain=' + encodeURIComponent(EMPRESA.site) : null; }

/* ═══ BLOCO: REGISTRO_CENARIOS ═══ */
// Cada arquivo em js/cenarios/ registra aqui uma função construtora: CENARIOS[id] = function(kit){ ... }
var CENARIOS = {};
/* ── FIM BLOCO ── */
