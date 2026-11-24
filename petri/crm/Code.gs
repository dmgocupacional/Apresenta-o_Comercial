/**
 * PETRI CRM — motor de prospecção (Google Apps Script, conta do comercial da Petri)
 * Planilha = banco · Gmail = envio e leitura de respostas · Agenda do Franco = reuniões
 */


// ═══ BLOCO: CONSTANTES ═══
const ABAS = {
  CONFIG: 'Config', LEADS: 'Leads', IMPORTAR: 'Importar', NICHOS: 'Nichos',
  SEQ: 'Sequencias', ENVIOS: 'Envios', LOG: 'Log'
};


const ETAPAS = ['Novo', 'Em sequência', 'Respondeu', 'Reunião agendada', 'Reunião realizada',
  'Proposta', 'Ganho', 'Perdido', 'Sem resposta', 'Descartado'];
const ETAPAS_ATIVAS = ['Novo', 'Em sequência'];


const COLS_LEADS = ['id', 'empresa', 'contato', 'cargo', 'email', 'telefone', 'cidade', 'nicho',
  'score', 'etapa', 'passo', 'proximo_envio', 'thread_id', 'ultimo_envio', 'ultima_resposta',
  'reuniao_em', 'criado_em', 'obs'];
const COLS_IMPORTAR = ['empresa', 'contato', 'cargo', 'email', 'telefone', 'cidade', 'nicho', 'score', 'obs'];
const COLS_NICHOS = ['id', 'nome', 'dor', 'clientes', 'gancho'];
const COLS_SEQ = ['nicho', 'passo', 'dia', 'assunto', 'corpo'];
const COLS_ENVIOS = ['data', 'lead_id', 'email', 'passo', 'thread_id', 'status'];


const LABEL = 'PETRI/Prospecção';
const RX_OPTOUT = /(remov|descadastr|n[aã]o tenho interesse|sem interesse|n[aã]o me envie|parar de receber|unsubscribe|n[aã]o temos interesse)/i;
const RX_POSITIVO = /(agendar|agenda|vamos conversar|podemos conversar|tenho interesse|temos interesse|reuni[aã]o|me liga|pode me ligar|dispon[ií]vel|bora|vamos marcar|marcar uma)/i;
const RX_BOUNCE_FROM = /(mailer-daemon|postmaster)/i;


const CONFIG_PADRAO = [
  ['REMETENTE_NOME', 'Petri Engenharia', 'Nome que aparece como remetente'],
  ['ASSINATURA', 'Franco Petrilli<br>Sócio-fundador · PETRI Engenharia<br>Fundações e contenções · petriprojetos.com.br', 'Assinatura HTML dos e-mails'],
  ['AGENDA_FRANCO', '', 'E-mail da agenda do Franco (a conta do comercial precisa ver todos os detalhes)'],
  ['LINK_AGENDA', '', 'Link da página de agendamento do Franco (obrigatório para enviar)'],
  ['LIMITE_DIA', '20', 'Quantidade padrão do campo ao lado de "Rodar o dia" (0 = sem limite). Ajustável na tela a cada execução.'],
  ['ENVIO_AUTOMATICO', 'NAO', 'SIM = roda o dia sozinho às 9h em dias úteis'],
  ['DIAS_SEM_RESPOSTA', '4', 'Dias após o último passo para marcar "Sem resposta"']
];


const NICHOS_PADRAO = [
  ['volume', 'Incorporação de volume / MCMV', 'custo de fundação por unidade repetido em dezenas de terrenos', 'Tenda, MRV, Direcional e Cury', 'revisar a fundação padrão reduz o R$ por unidade em toda a carteira'],
  ['altopadrao', 'Médio e alto padrão vertical', 'subsolos profundos, contenção junto a vizinhos e prazo de escavação', 'Tecnisa e obras como Edify One, Ópera Haus e GS1 Rebouças', 'contenção e subsolo compatibilizados antes da obra, sem aditivo'],
  ['logistica', 'Galpões logísticos, data centers e industrial', 'grandes áreas de terraplenagem, piso industrial e prazo agressivo', 'GLP, Scala e Ambev', 'terraplenagem e fundação otimizadas para entregar no prazo do inquilino'],
  ['energia', 'Energia e infraestrutura (EPC)', 'fundação de subestação e tracker solar com cronograma de leilão', 'EPCs de transmissão e geração', 'fundações de subestação e tracker dimensionadas com segurança e sem sobra'],
  ['canais', 'Projetistas, gerenciadoras e executoras', 'geotecnia decidida tarde e retrabalho de compatibilização', 'escritórios parceiros', 'parceria técnica e troca de indicação'],
  ['varejo', 'Varejo alimentar em expansão', 'lojas e CDs novos com prazo de inauguração fixo', 'redes em expansão', 'fundação e terraplenagem de loja/CD sem atrasar a inauguração']
];


const SEQ_PADRAO = [
  ['*', 1, 0, 'Fundação {{empresa}}',
    '<p>Olá {{primeiro_nome}}, tudo bem?</p><p>Sou o Franco, da PETRI Engenharia. Fazemos projeto de fundações e contenções comparando alternativas antes da obra, em vez de seguir o primeiro caminho que aparece.</p><p>Em {{nicho_nome}} o ponto que mais pesa costuma ser {{dor}}. Atendemos {{clientes}} justamente nisso: {{gancho}}.</p><p>Faz sentido conversarmos 30 minutos sobre os próximos empreendimentos da {{empresa}}?</p><p>{{assinatura}}</p>'],
  ['*', 2, 3, '',
    '<p>{{primeiro_nome}}, um exemplo concreto: num empreendimento parecido com os da {{empresa}}, a revisão da fundação antes da obra trocou a solução original por uma alternativa mais enxuta, com a mesma segurança e menos concreto e aço.</p><p>Se tiver algum terreno com sondagem pronta, posso fazer uma leitura rápida e sem custo.</p><p>{{assinatura}}</p>'],
  ['*', 3, 7, '',
    '<p>{{primeiro_nome}}, para facilitar: deixo aqui a agenda do Franco para escolher o melhor horário de 30 minutos, com Meet.</p><p><a href="{{link_agenda}}">Escolher horário</a></p><p>{{assinatura}}</p>'],
  ['*', 4, 12, '',
    '<p>{{primeiro_nome}}, uma dica que tem evitado dor de cabeça em obra: antes de fechar a fundação, vale checar se a sondagem cobre a profundidade e a malha que o projeto vai exigir. Muita alteração de última hora nasce daí.</p><p>Se quiser, revisamos a sondagem do próximo terreno da {{empresa}} junto com o seu time.</p><p>{{assinatura}}</p>'],
  ['*', 5, 18, '',
    '<p>{{primeiro_nome}}, imagino que a agenda esteja cheia, então devo encerrar por aqui?</p><p>Se fundação e contenção entrarem na pauta mais adiante, é só responder este e-mail ou escolher um horário: <a href="{{link_agenda}}">agenda do Franco</a>.</p><p>{{assinatura}}</p>']
];


const RESPOSTA_POSITIVA = '<p>Ótimo, {{primeiro_nome}}! Escolha o melhor horário aqui na agenda do Franco (30 min, com Meet): <a href="{{link_agenda}}">{{link_agenda}}</a></p><p>{{assinatura}}</p>';
const RESPOSTA_NEUTRA = '<p>Obrigado pelo retorno, {{primeiro_nome}}.</p><p>[ajuste a resposta antes de enviar]</p><p>Se preferir, a agenda do Franco está aqui: <a href="{{link_agenda}}">{{link_agenda}}</a></p><p>{{assinatura}}</p>';
// ── FIM BLOCO ──


// ═══ BLOCO: HELPERS ═══
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function aba_(nome) { return ss_().getSheetByName(nome); }


function log_(msg) {
  const sh = aba_(ABAS.LOG);
  if (sh) sh.appendRow([new Date(), msg]);
}


/** Lê uma aba como lista de objetos; _row guarda a linha real da planilha. */
function ler_(nome, comoTexto) {
  const sh = aba_(nome);
  if (!sh || sh.getLastRow() < 2) return [];
  // comoTexto: lê o que aparece na célula (e-mails viram "chip" de pessoa no Sheets e getValues pode vir vazio)
  const v = comoTexto ? sh.getDataRange().getDisplayValues() : sh.getDataRange().getValues();
  const h = v[0];
  return v.slice(1).map((r, i) => {
    const o = { _row: i + 2 };
    h.forEach((k, j) => { o[k] = r[j]; });
    return o;
  });
}


function atualizar_(nome, row, campos) {
  const sh = aba_(nome);
  const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  Object.keys(campos).forEach(k => {
    const c = h.indexOf(k);
    if (c >= 0) sh.getRange(row, c + 1).setValue(campos[k]);
  });
}


function config_() {
  const cfg = {};
  ler_(ABAS.CONFIG).forEach(r => { cfg[r.chave] = String(r.valor || '').trim(); });
  return cfg;
}


function hoje_() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function somaDias_(d, n) { const x = new Date(d); x.setDate(x.getDate() + Number(n)); return x; }
function diaUtil_(d) { const w = d.getDay(); return w !== 0 && w !== 6; }


function proximoUtil_(d) {
  let x = new Date(d);
  while (!diaUtil_(x)) x = somaDias_(x, 1);
  return x;
}


function primeiroNome_(nome) {
  const p = String(nome || '').trim().split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : 'tudo bem';
}


function nichosMap_() {
  const m = {};
  ler_(ABAS.NICHOS).forEach(n => { m[n.id] = n; });
  return m;
}


function preencher_(txt, lead, nicho, cfg) {
  const n = nicho || {};
  const vars = {
    primeiro_nome: primeiroNome_(lead.contato), contato: lead.contato || '', empresa: lead.empresa || '',
    cargo: lead.cargo || '', cidade: lead.cidade || '', nicho_nome: n.nome || 'obras como as suas',
    dor: n.dor || 'a fundação decidida tarde', clientes: n.clientes || 'grandes construtoras',
    gancho: n.gancho || 'comparar alternativas antes da obra', link_agenda: cfg.LINK_AGENDA || '',
    assinatura: cfg.ASSINATURA || ''
  };
  return String(txt || '').replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}


/** Passos do nicho; cai na sequência padrão (*) quando o nicho não tem a sua. */
function passosDoNicho_(seq, nicho) {
  let p = seq.filter(s => s.nicho === nicho);
  if (!p.length) p = seq.filter(s => s.nicho === '*');
  return p.sort((a, b) => a.passo - b.passo);
}


function label_() { return GmailApp.getUserLabelByName(LABEL) || GmailApp.createLabel(LABEL); }
function meuEmail_() { return Session.getEffectiveUser().getEmail().toLowerCase(); }
function emailDe_(from) { const m = String(from).match(/<([^>]+)>/); return (m ? m[1] : String(from)).trim().toLowerCase(); }
// ── FIM BLOCO ──


// ═══ BLOCO: ENVIO ═══
function rodarDia(qtd) {
  const cfg = config_();
  if (!cfg.LINK_AGENDA) return { ok: false, msg: 'Preencha LINK_AGENDA na aba Config antes de enviar.' };
  // qtd vem do campo da tela; vazio usa Config; 0 = sem limite (manda toda a fila)
  const escolhido = (qtd === undefined || qtd === null || qtd === '') ? Number(cfg.LIMITE_DIA) : Number(qtd);
  const limite = escolhido > 0 ? escolhido : Infinity;
  const seq = ler_(ABAS.SEQ);
  const nichos = nichosMap_();
  const hoje = hoje_();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { ok: false, msg: 'Já existe um envio em andamento.' };
  let enviados = 0, erros = 0;
  try {
    const fila = ler_(ABAS.LEADS)
      .filter(l => ETAPAS_ATIVAS.indexOf(l.etapa) >= 0 && l.email && (!l.proximo_envio || new Date(l.proximo_envio) <= hoje))
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    for (const lead of fila) {
      if (enviados >= limite) break;
      const passos = passosDoNicho_(seq, lead.nicho);
      const idx = Number(lead.passo) || 0;
      const p = passos[idx];
      if (!p) continue;
      if (idx === 0 && malaAtiva_(cfg)) continue; // 1º toque vai pela mala direta → BLOCO: MALA-DIRETA
      try {
        const html = preencher_(p.corpo, lead, nichos[lead.nicho], cfg);
        let threadId = lead.thread_id;
        if (idx === 0 || !threadId) {
          const assunto = preencher_(p.assunto || passos[0].assunto, lead, nichos[lead.nicho], cfg);
          const msg = GmailApp.createDraft(lead.email, assunto, '', { htmlBody: html, name: cfg.REMETENTE_NOME }).send();
          const th = msg.getThread();
          threadId = th.getId();
          th.addLabel(label_());
        } else {
          const th = GmailApp.getThreadById(threadId);
          th.getMessages()[0].reply('', { htmlBody: html, name: cfg.REMETENTE_NOME });
        }
        const prox = passos[idx + 1] ? proximoUtil_(somaDias_(hoje, passos[idx + 1].dia - p.dia)) : '';
        atualizar_(ABAS.LEADS, lead._row, {
          etapa: 'Em sequência', passo: idx + 1, thread_id: threadId, ultimo_envio: new Date(), proximo_envio: prox
        });
        aba_(ABAS.ENVIOS).appendRow([new Date(), lead.id, lead.email, idx + 1, threadId, 'enviado']);
        enviados++;
        Utilities.sleep(4000 + Math.floor(Math.random() * 6000)); // espaçamento entre envios reduz risco de spam
      } catch (e) {
        erros++;
        aba_(ABAS.ENVIOS).appendRow([new Date(), lead.id, lead.email, idx + 1, lead.thread_id || '', 'erro: ' + e.message]);
      }
    }
  } finally {
    lock.releaseLock();
  }
  const msg = enviados + ' e-mail(s) enviados' + (erros ? ', ' + erros + ' erro(s) — veja a aba Envios' : '') + '.';
  log_('Rodar o dia: ' + msg);
  return { ok: true, msg: msg };
}
// ── FIM BLOCO ──


// ═══ BLOCO: MALA-DIRETA ═══
// 1º toque sai pela mala direta do Gmail (Workspace); passos 2+ seguem pelo rodarDia, na mesma conversa.
const ABA_MALA = 'MalaDireta';
const COLS_MALA = ['email', 'primeiro_nome', 'contato', 'empresa', 'cidade', 'nicho_nome', 'dor', 'clientes', 'gancho', 'lead_id', 'status'];


function malaAtiva_(cfg) { return String(cfg.MALA_DIRETA || '').toUpperCase() === 'SIM'; }
function limparEmail_(e) { return String(e || '').replace(/^mailto:/i, '').trim().toLowerCase(); }


/** Monta a aba MalaDireta com os próximos leads novos (passo 0), por score. Não envia nada. */
function prepararMalaDireta(qtd) {
  const cfg = config_();
  const n = Number(qtd) > 0 ? Number(qtd) : (Number(cfg.LIMITE_DIA) || 50);
  const nichos = nichosMap_();
  const pend = ler_(ABA_MALA, true).filter(r => r.status === 'pronto');
  if (pend.length) return { ok: false, msg: pend.length + ' lead(s) da mala direta anterior ainda sem registro. Rode "Registrar mala direta" antes.' };
  const leads = ler_(ABAS.LEADS, true)
    .filter(l => l.etapa === 'Novo' && !(Number(l.passo) > 0) && limparEmail_(l.email))
    .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
    .slice(0, n);
  const linhas = leads.map(l => {
    const ni = nichos[l.nicho] || {};
    return [limparEmail_(l.email), primeiroNome_(l.contato) || 'pessoal', l.contato || '', l.empresa || '', l.cidade || '',
      ni.nome || 'obras como as suas', ni.dor || 'a fundação decidida tarde', ni.clientes || 'grandes construtoras',
      ni.gancho || 'comparar alternativas antes da obra', l.id, 'pronto'];
  });
  let sh = aba_(ABA_MALA);
  if (!sh) sh = ss_().insertSheet(ABA_MALA);
  sh.clear();
  sh.getRange(1, 1, 1, COLS_MALA.length).setValues([COLS_MALA]).setFontWeight('bold').setBackground('#F3E4DA').setFontColor('#2F2926');
  sh.setFrozenRows(1);
  if (linhas.length) sh.getRange(2, 1, linhas.length, COLS_MALA.length).setValues(linhas);
  const msg = linhas.length + ' lead(s) prontos na aba ' + ABA_MALA + ' para a mala direta do Gmail.';
  log_('Mala direta preparada: ' + msg);
  return { ok: true, msg: msg };
}


/** Depois do envio pela mala direta: acha cada e-mail enviado, grava thread e agenda o passo 2. */
function registrarMalaDireta() {
  const seq = ler_(ABAS.SEQ);
  const porId = {};
  ler_(ABAS.LEADS, true).forEach(l => { porId[String(l.id)] = l; });
  const sh = aba_(ABA_MALA);
  const rows = ler_(ABA_MALA, true);
  const hoje = hoje_();
  const colStatus = COLS_MALA.indexOf('status') + 1;
  let ok = 0, falta = 0;
  rows.forEach(r => {
    if (r.status !== 'pronto') return;
    const lead = porId[String(r.lead_id)];
    if (!lead) { sh.getRange(r._row, colStatus).setValue('lead não encontrado'); falta++; return; }
    const th = GmailApp.search('in:sent to:' + r.email + ' newer_than:7d', 0, 1)[0];
    if (!th) { falta++; return; }
    th.addLabel(label_());
    const passos = passosDoNicho_(seq, lead.nicho);
    const prox = passos[1] ? proximoUtil_(somaDias_(hoje, passos[1].dia - passos[0].dia)) : '';
    atualizar_(ABAS.LEADS, lead._row, { etapa: 'Em sequência', passo: 1, thread_id: th.getId(), ultimo_envio: th.getLastMessageDate(), proximo_envio: prox });
    aba_(ABAS.ENVIOS).appendRow([new Date(), lead.id, r.email, 1, th.getId(), 'enviado (mala direta)']);
    sh.getRange(r._row, colStatus).setValue('registrado');
    ok++;
  });
  const msg = ok + ' registrado(s)' + (falta ? ', ' + falta + ' ainda sem e-mail enviado encontrado' : '') + '.';
  log_('Mala direta: ' + msg);
  return { ok: true, msg: msg };
}
// ── FIM BLOCO ──


// ═══ BLOCO: RESPOSTAS ═══
function checarRespostas() {
  const cfg = config_();
  const eu = meuEmail_();
  const nichos = nichosMap_();
  let positivas = 0, neutras = 0, optout = 0;
  ler_(ABAS.LEADS).filter(l => l.etapa === 'Em sequência' && l.thread_id).forEach(lead => {
    let th;
    try { th = GmailApp.getThreadById(lead.thread_id); } catch (e) { return; }
    if (!th) return;
    const ultimoEnvio = lead.ultimo_envio ? new Date(lead.ultimo_envio) : new Date(0);
    const resp = th.getMessages().filter(m => emailDe_(m.getFrom()) !== eu && m.getDate() > somaDias_(ultimoEnvio, -60));
    if (!resp.length) return;
    const m = resp[resp.length - 1];
    if (RX_BOUNCE_FROM.test(m.getFrom())) {
      atualizar_(ABAS.LEADS, lead._row, { etapa: 'Descartado', obs: 'E-mail inválido (bounce)', proximo_envio: '' });
      return;
    }
    const texto = m.getPlainBody().split(/\n(>|Em .+escreveu:|On .+wrote:)/)[0];
    const campos = { ultima_resposta: m.getDate(), proximo_envio: '' };
    if (RX_OPTOUT.test(texto)) {
      campos.etapa = 'Descartado'; campos.obs = 'Pediu para não receber';
      optout++;
    } else if (RX_POSITIVO.test(texto)) {
      m.reply('', { htmlBody: preencher_(RESPOSTA_POSITIVA, lead, nichos[lead.nicho], cfg), name: cfg.REMETENTE_NOME });
      campos.etapa = 'Respondeu'; campos.obs = 'Resposta positiva — link da agenda enviado';
      positivas++;
    } else {
      m.createDraftReply('', { htmlBody: preencher_(RESPOSTA_NEUTRA, lead, nichos[lead.nicho], cfg), name: cfg.REMETENTE_NOME });
      campos.etapa = 'Respondeu'; campos.obs = 'Resposta neutra — rascunho no Gmail para revisar';
      neutras++;
    }
    atualizar_(ABAS.LEADS, lead._row, campos);
  });
  const bounces = checarBounces_();
  marcarSemResposta_(cfg);
  return { ok: true, msg: positivas + ' positiva(s), ' + neutras + ' neutra(s), ' + optout + ' opt-out, ' + bounces + ' bounce(s).' };
}


/** Bounces chegam em thread própria do mailer-daemon; casa pelo e-mail citado no corpo. */
function checarBounces_() {
  const leads = ler_(ABAS.LEADS).filter(l => l.etapa === 'Em sequência');
  if (!leads.length) return 0;
  let n = 0;
  GmailApp.search('from:(mailer-daemon OR postmaster) newer_than:3d', 0, 50).forEach(th => {
    const corpo = th.getMessages().map(m => m.getPlainBody()).join(' ').toLowerCase();
    leads.forEach(l => {
      if (l.email && corpo.indexOf(String(l.email).toLowerCase()) >= 0) {
        atualizar_(ABAS.LEADS, l._row, { etapa: 'Descartado', obs: 'E-mail inválido (bounce)', proximo_envio: '' });
        n++;
      }
    });
  });
  return n;
}


function marcarSemResposta_(cfg) {
  const dias = Number(cfg.DIAS_SEM_RESPOSTA) || 4;
  const seq = ler_(ABAS.SEQ);
  const hoje = hoje_();
  ler_(ABAS.LEADS).forEach(l => {
    if (l.etapa !== 'Em sequência' || l.proximo_envio || !l.ultimo_envio) return;
    const total = passosDoNicho_(seq, l.nicho).length;
    if (Number(l.passo) >= total && somaDias_(new Date(l.ultimo_envio), dias) <= hoje) {
      atualizar_(ABAS.LEADS, l._row, { etapa: 'Sem resposta' });
    }
  });
}
// ── FIM BLOCO ──


// ═══ BLOCO: AGENDA ═══
function checarAgenda() {
  const cfg = config_();
  if (!cfg.AGENDA_FRANCO) return { ok: false, msg: 'AGENDA_FRANCO vazio na Config.' };
  const cal = CalendarApp.getCalendarById(cfg.AGENDA_FRANCO);
  if (!cal) return { ok: false, msg: 'Agenda do Franco não acessível: ele precisa compartilhar com esta conta.' };
  const agora = new Date();
  const eventos = cal.getEvents(somaDias_(agora, -30), somaDias_(agora, 90));
  const porEmail = {};
  eventos.forEach(ev => ev.getGuestList().forEach(g => { porEmail[g.getEmail().toLowerCase()] = ev; }));
  let novas = 0;
  ler_(ABAS.LEADS).forEach(l => {
    const ev = porEmail[String(l.email || '').toLowerCase()];
    if (!ev || ['Proposta', 'Ganho', 'Perdido'].indexOf(l.etapa) >= 0) return;
    const etapa = ev.getEndTime() < agora ? 'Reunião realizada' : 'Reunião agendada';
    if (l.etapa !== etapa) {
      atualizar_(ABAS.LEADS, l._row, { etapa: etapa, reuniao_em: ev.getStartTime(), proximo_envio: '' });
      if (etapa === 'Reunião agendada') novas++;
    }
  });
  return { ok: true, msg: novas + ' reunião(ões) nova(s) na agenda.' };
}
// ── FIM BLOCO ──


// ═══ BLOCO: IMPORTAÇÃO ═══
function importarLeads() {
  const imp = aba_(ABAS.IMPORTAR);
  const linhas = ler_(ABAS.IMPORTAR, true).filter(r => r.email || r.empresa);
  if (!linhas.length) return { ok: true, msg: 'Aba Importar vazia.' };
  const existentes = {};
  ler_(ABAS.LEADS).forEach(l => { if (l.email) existentes[String(l.email).toLowerCase()] = true; });
  const leads = aba_(ABAS.LEADS);
  const nichos = nichosMap_();
  let novos = 0, dup = 0, semEmail = 0;
  const base = Date.now();
  const saida = [];
  linhas.forEach((r, i) => {
    const email = String(r.email || '').replace(/^mailto:/i, '').trim().toLowerCase();
    if (!email || email.indexOf('@') < 0) { semEmail++; return; }
    if (existentes[email]) { dup++; return; }
    existentes[email] = true;
    const nicho = nichos[r.nicho] ? r.nicho : String(r.nicho || '').toLowerCase();
    saida.push(['L' + (base + i).toString(36), r.empresa, r.contato, r.cargo, email, r.telefone, r.cidade,
      nicho, Number(r.score) || 50, 'Novo', 0, '', '', '', '', '', new Date(), r.obs || '']);
    novos++;
  });
  if (saida.length) leads.getRange(leads.getLastRow() + 1, 1, saida.length, COLS_LEADS.length).setValues(saida);
  if (imp.getLastRow() > 1) imp.getRange(2, 1, imp.getLastRow() - 1, imp.getLastColumn()).clearContent();
  const msg = novos + ' novo(s), ' + dup + ' duplicado(s), ' + semEmail + ' sem e-mail.';
  log_('Importação: ' + msg);
  return { ok: true, msg: msg };
}
// ── FIM BLOCO ──


// ═══ BLOCO: ROTINAS AUTOMÁTICAS ═══
function rotinaAutomatica() {
  try { checarRespostas(); } catch (e) { log_('Erro respostas: ' + e.message); }
  try { checarAgenda(); } catch (e) { log_('Erro agenda: ' + e.message); }
}


function rotinaDiaria() {
  if (config_().ENVIO_AUTOMATICO !== 'SIM' || !diaUtil_(new Date())) return;
  rodarDia();
}
// ── FIM BLOCO ──


// ═══ BLOCO: WEB APP (API DA TELA) ═══
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PETRI CRM')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


function limpar_(o) {
  const r = {};
  Object.keys(o).forEach(k => {
    if (k === '_row') return;
    r[k] = o[k] instanceof Date ? o[k].toISOString() : o[k];
  });
  return r;
}


function dados() {
  const cfg = config_();
  return {
    leads: ler_(ABAS.LEADS).map(limpar_),
    envios: ler_(ABAS.ENVIOS).slice(-500).map(limpar_),
    nichos: ler_(ABAS.NICHOS).map(limpar_),
    seq: ler_(ABAS.SEQ).map(limpar_),
    etapas: ETAPAS,
    config: { LIMITE_DIA: cfg.LIMITE_DIA, LINK_AGENDA: cfg.LINK_AGENDA, AGENDA_FRANCO: cfg.AGENDA_FRANCO, ENVIO_AUTOMATICO: cfg.ENVIO_AUTOMATICO },
    importar: Math.max(0, (aba_(ABAS.IMPORTAR).getLastRow() || 1) - 1)
  };
}


function moverEtapa(id, etapa) {
  if (ETAPAS.indexOf(etapa) < 0) return { ok: false, msg: 'Etapa inválida.' };
  const l = ler_(ABAS.LEADS).find(x => x.id === id);
  if (!l) return { ok: false, msg: 'Lead não encontrado.' };
  const campos = { etapa: etapa };
  if (ETAPAS_ATIVAS.indexOf(etapa) < 0) campos.proximo_envio = '';
  atualizar_(ABAS.LEADS, l._row, campos);
  return { ok: true, msg: 'Movido para ' + etapa + '.' };
}


function salvarObs(id, obs) {
  const l = ler_(ABAS.LEADS).find(x => x.id === id);
  if (!l) return { ok: false, msg: 'Lead não encontrado.' };
  atualizar_(ABAS.LEADS, l._row, { obs: obs });
  return { ok: true, msg: 'Observação salva.' };
}


function salvarPasso(nicho, passo, dia, assunto, corpo) {
  const sh = aba_(ABAS.SEQ);
  const s = ler_(ABAS.SEQ).find(x => x.nicho === nicho && Number(x.passo) === Number(passo));
  if (s) atualizar_(ABAS.SEQ, s._row, { dia: Number(dia), assunto: assunto, corpo: corpo });
  else sh.appendRow([nicho, Number(passo), Number(dia), assunto, corpo]);
  return { ok: true, msg: 'Passo ' + passo + ' salvo para ' + nicho + '.' };
}


function previaLead(id) {
  const cfg = config_();
  const lead = ler_(ABAS.LEADS).find(x => x.id === id);
  if (!lead) return [];
  const nichos = nichosMap_();
  const passos = passosDoNicho_(ler_(ABAS.SEQ), lead.nicho);
  return passos.map(p => ({
    passo: p.passo, dia: p.dia,
    assunto: preencher_(p.assunto || passos[0].assunto, lead, nichos[lead.nicho], cfg),
    html: preencher_(p.corpo, lead, nichos[lead.nicho], cfg)
  }));
}


function acaoRodarDia(qtd) { return rodarDia(qtd); }


// Carga em lote vinda do Claude (linhas no formato COLS_IMPORTAR) → aba Importar → importarLeads()
function acaoImportarLinhas(linhas) {
  if (!Array.isArray(linhas) || !linhas.length) return { ok: false, msg: 'Nenhuma linha recebida.' };
  const imp = aba_(ABAS.IMPORTAR);
  const n = COLS_IMPORTAR.length;
  const dados = linhas.map(r => COLS_IMPORTAR.map((_, i) => r[i] === undefined ? '' : r[i])).filter(r => r.length === n);
  imp.getRange(imp.getLastRow() + 1, 1, dados.length, n).setValues(dados);
  return importarLeads();
}
function acaoImportar() { return importarLeads(); }
function acaoSincronizar() {
  const a = checarRespostas(), b = checarAgenda();
  return { ok: true, msg: a.msg + ' ' + b.msg };
}
// ── FIM BLOCO ──


// ═══ BLOCO: SETUP ═══
function onOpen() {
  SpreadsheetApp.getUi().createMenu('PETRI CRM')
    .addItem('▶ Rodar o dia', 'rodarDia')
    .addItem('⇣ Importar leads', 'importarLeads')
    .addItem('✉ Preparar mala direta', 'prepararMalaDireta')
    .addItem('✓ Registrar mala direta', 'registrarMalaDireta')
    .addItem('↻ Verificar respostas e agenda', 'rotinaAutomatica')
    .addSeparator()
    .addItem('Instalar / reparar estrutura', 'setup')
    .addToUi();
}


function criarAba_(nome, cols, linhas) {
  let sh = aba_(nome);
  if (!sh) sh = ss_().insertSheet(nome);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold')
      .setBackground('#F3E4DA').setFontColor('#2F2926');
    sh.setFrozenRows(1);
    if (linhas && linhas.length) sh.getRange(2, 1, linhas.length, cols.length).setValues(linhas);
  }
  return sh;
}


function setup() {
  criarAba_(ABAS.CONFIG, ['chave', 'valor', 'descricao'], CONFIG_PADRAO);
  criarAba_(ABAS.LEADS, COLS_LEADS);
  criarAba_(ABAS.IMPORTAR, COLS_IMPORTAR);
  criarAba_(ABAS.NICHOS, COLS_NICHOS, NICHOS_PADRAO);
  criarAba_(ABAS.SEQ, COLS_SEQ, SEQ_PADRAO);
  criarAba_(ABAS.ENVIOS, COLS_ENVIOS);
  criarAba_(ABAS.LOG, ['data', 'msg']);
  const padrao = ss_().getSheetByName('Página1') || ss_().getSheetByName('Sheet1');
  if (padrao && padrao.getLastRow() === 0 && ss_().getSheets().length > 1) ss_().deleteSheet(padrao);


  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('rotinaAutomatica').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('rotinaDiaria').timeBased().atHour(9).everyDays(1).create();
  ScriptApp.newTrigger('onOpen').forSpreadsheet(ss_()).onOpen().create();
  label_();
  log_('Setup concluído');
  return 'ok';
}
// ── FIM BLOCO ──
