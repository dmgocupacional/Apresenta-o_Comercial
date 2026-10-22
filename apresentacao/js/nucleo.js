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
  return palavras.map(function(p, i){
    var l = p.toLowerCase();
    if (i > 0 && minusc.indexOf(l) >= 0) return l;
    return p.length <= 3 && p === p.toUpperCase() ? p : l.charAt(0).toUpperCase() + l.slice(1);
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

// Substitui {empresa}, {EMPRESA}, {func} (colaboradores) e {anos} (anos de empresa) em textos do roteiro
function pers(txt){
  if (txt == null) return '';
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
