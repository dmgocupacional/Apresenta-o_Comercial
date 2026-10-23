/* Roteiro: Construção · Especializadas · Construção esportiva (modelo: Recoma).
   Só dados. {empresa} é trocado pelo nome do cliente em todo texto. */
window.ROTEIRO = {
  id: 'construcao-esportiva',
  icp: 'Construção',
  subtipo: 'Construção esportiva',
  cenario: 'esportiva',
  empresaPadrao: { nome: 'Recoma', func: 220, anos: 45 },
  chaveLocal: 'dmg-recoma-kanban',

  /* ═══ BLOCO: SLIDES ═══ */
  slides: [
    { tipo: 'capa', cena: 'capa',
      eyebrow: 'Proposta de saúde e segurança do trabalho',
      titulo: '{anos} anos construindo onde o Brasil compete.<br><span class="grad">Quem protege quem constrói?</span>',
      sub: 'Pista, quadra, arquibancada, estádio. Cada entrega da {empresa} tem uma data de inauguração e uma equipe por trás. Esta é a história de uma delas.',
      stats: [{ n: '{anos}', l: 'Anos de {empresa}' }, { n: '{func}', l: 'Pessoas em campo' }, { n: 27, l: 'Estados possíveis' }] },

    { tipo: 'mapa', cena: 'fundo', cap: '01', eyebrow: 'Situação',
      titulo: 'Uma fábrica. Obras no país inteiro. <span class="grad">Uma data que não se move.</span>',
      lede: 'A {empresa} é diferente de uma construtora comum. Ela fabrica o próprio piso, leva a própria equipe e monta em qualquer estado, com inauguração já marcada.',
      itens: [
        { b: 'Fábrica própria', s: 'Máquinas, resinas, borracha e adesivos. Risco químico e mecânico todo dia.' },
        { b: 'Equipe que viaja', s: 'Mão de obra própria montando longe da sede, semanas fora de casa.' },
        { b: 'Prazo de evento', s: 'Campeonato, abertura, jogo. A data é do cliente, não da obra.' }
      ] },

    { tipo: 'dor', cena: 'fabrica', cap: '02', tag: 'Dor 1 de 4 · Fábrica',
      titulo: 'Antes de virar pista, <span class="grad-red">o piso passa pelas mãos de alguém.</span>',
      lede: 'Na linha de produção estão a extrusora, a prensa, a resina de poliuretano, o solvente e o granulado de borracha. É o risco que ninguém vê na inauguração e que aparece primeiro numa perícia.',
      lista: [
        'Exposição a agentes químicos sem medição em LTCAT vira passivo de insalubridade e de aposentadoria especial.',
        'Máquina sem risco inventariado no PGR é a primeira coisa que a fiscalização pede.',
        'Audiometria e espirometria fora do PCMSO deixam o trabalhador sem acompanhamento.'
      ] },

    { tipo: 'dor', cena: 'viagem', cap: '03', tag: 'Dor 2 de 4 · Mobilização',
      titulo: 'O caminhão saiu. <span class="grad-red">O ASO ficou para trás.</span>',
      lede: 'A obra abre em outro estado na segunda-feira. Parte da equipe é recém-contratada, parte está com exame vencendo no meio da montagem. Ninguém quer descobrir isso no portão do cliente.',
      lista: [
        'O cliente barra quem chega sem documentação, e a equipe fica parada a 1.000 km de casa.',
        'Exame que vence durante a obra deixa a pessoa irregular para a função no meio do serviço.'
      ],
      custo: 'Diária, hospedagem e transporte de uma equipe que não pode trabalhar. E o dia não volta.' },

    { tipo: 'dor', cena: 'altura', cap: '04', tag: 'Dor 3 de 4 · Altura e içamento',
      titulo: 'Arquibancada, torre de luz, placar. <span class="grad-red">Tudo é lá em cima.</span>',
      lede: 'Montagem de arquibancada retrátil, torre de iluminação e cobertura juntam trabalho em altura (NR-35), içamento de carga e canteiro de construção (NR-18) na mesma frente.',
      lista: [
        '"Apto" genérico, sem os exames definidos no PCMSO para altura, não sustenta a empresa se alguém cai.',
        'Treinamento de NR-35 vencido tira o trabalhador da frente na hora da inspeção.'
      ] },

    { tipo: 'dor', cena: 'terceiros', cap: '05', tag: 'Dor 4 de 4 · Terceiros locais',
      titulo: 'O reforço foi contratado na cidade. <span class="grad-red">A responsabilidade veio de São Paulo.</span>',
      lede: 'Em obra longe da sede é comum completar a equipe com mão de obra local. Se essa pessoa entra sem ASO, sem treinamento e sem ficha de EPI, quem responde é a contratante.',
      lista: [
        'A documentação de terceiros espalhada em e-mail e WhatsApp não aparece quando o fiscal pede.',
        'Acidente com terceiro sem fluxo definido vira um problema jurídico seu.'
      ] },

    { tipo: 'linha', cena: 'acidente', cap: '06', eyebrow: 'Implicação · O dia em que acontece',
      titulo: 'Um acidente não termina<br><span class="grad-red">no dia do acidente.</span>',
      lede: 'Ele abre uma cadeia de eventos que alcança a obra, a folha e o jurídico, e volta meses depois.',
      pontos: [
        { q: 'Dia 0', b: 'Queda na arquibancada', s: 'A frente para. O cliente pergunta quando a montagem volta.', ini: true },
        { q: 'Dia 1', b: 'CAT e S-2210', s: 'Prazo curto. Erro de classificação conta contra a empresa.' },
        { q: 'Dia 16', b: 'Benefício no INSS', s: 'O evento passa a compor o cálculo do FAP.' },
        { q: 'Meses depois', b: 'Ação trabalhista', s: 'A defesa depende de ASO, PGR, treinamento e EPI.' },
        { q: 'Ano + 2', b: 'FAP sobe', s: 'Alíquota maior todo mês, sobre toda a folha.' }
      ] },

    { tipo: 'calc', cena: 'fundo', cap: '07', eyebrow: 'Implicação · Na folha',
      titulo: 'Quanto o histórico de acidentes <span class="grad">custa na folha?</span>',
      lede: 'O RAT vem do CNAE e você não escolhe. O FAP vem do histórico de acidentes e afastamentos, e é o único fator que a gestão de SST consegue mover.',
      notaRat: 'Confirmar pelo CNAE preponderante da {empresa}.' },

    { tipo: 'prazo', cena: 'prazo', cap: '08', eyebrow: 'Implicação · Na inauguração',
      titulo: 'O evento tem data. <span class="grad-red">O atraso tem nome.</span>',
      lede: 'Marque o que já aconteceu ou pode acontecer numa obra de 30 dias e veja onde a entrega vai parar.' },

    { tipo: 'virada', cena: 'virada', cap: '09', eyebrow: 'E se fosse diferente?',
      titulo: 'E se a equipe embarcasse <span class="grad">já protegida?</span>',
      ledes: [
        'Exame certo para o risco, documento no prazo, laudo que se sustenta e terceiro conferido antes de entrar. Antes do primeiro dia de obra, e não depois do primeiro problema.',
        'Siga o trabalhador. Ele vai passar pela DMG antes de chegar ao estádio, e o prédio vai subir com ele, <b>andar por andar</b>.'
      ],
      pill: 'Próximo: térreo da clínica' },

    { tipo: 'andar', andar: 0, num: 'Térreo',
      titulo: 'Mobilização <span class="grad">antes do embarque.</span>',
      resolve: 'o caminhão saiu e o ASO ficou para trás',
      passos: [
        { b: 'ASO liberado em D+1', s: 'Exame feito hoje, ASO disponível no dia seguinte. Admissional em lote com agenda dedicada para a turma inteira antes da saída.' },
        { b: 'Validade que cobre a obra inteira', s: 'Antes de embarcar, checamos se algum exame vence durante a montagem e antecipamos o periódico.' },
        { b: 'Pasta da equipe pronta para o cliente', s: 'ASO, treinamentos e fichas de EPI organizados por obra, para enviar ao contratante antes da chegada.' }
      ],
      entrega: { k: 'D+1', s: 'do exame ao ASO na mão. Ninguém barrado no portão do cliente por falta de documento.' } },

    { tipo: 'andar', andar: 1, num: '1º andar',
      titulo: 'Apto <span class="grad">para o risco real.</span>',
      resolve: 'arquibancada, torre de luz e placar',
      passos: [
        { b: 'Bateria definida por função no PCMSO', s: 'Montador de arquibancada, eletricista de torre e operador de fábrica não fazem o mesmo exame.' },
        { b: 'Aptidão específica para altura e espaço confinado', s: 'O ASO registra a aptidão para NR-35 e NR-33, com a avaliação clínica e os exames complementares que o médico define.' },
        { b: 'Controle de validade por trabalhador', s: 'Alerta antes do vencimento de exames e treinamentos, para ninguém ficar irregular no meio da obra.' }
      ],
      entrega: { k: 'ASO', s: 'que se sustenta numa perícia, e não um "apto" genérico.' } },

    { tipo: 'andar', andar: 2, num: '2º andar',
      titulo: 'Engenharia <span class="grad">na fábrica e na obra.</span>',
      resolve: 'máquina, resina e solvente sem laudo',
      passos: [
        { b: 'PGR da fábrica e PGR por obra', s: 'O inventário de riscos reflete a linha de produção e cada canteiro, e não um modelo genérico.' },
        { b: 'LTCAT com medição em campo', s: 'Ruído, agentes químicos da produção do piso e poeira medidos por engenheiro de segurança, base para a defesa em insalubridade.' },
        { b: 'Vistoria e plano de ação', s: 'Visita técnica na fábrica e nas frentes ativas, com prioridades e responsáveis.' }
      ],
      entrega: { k: '1', s: 'laudo por realidade, assinado por quem esteve lá.' } },

    { tipo: 'andar', andar: 3, num: '3º andar',
      titulo: 'eSocial, FAP <span class="grad">e terceiros sob controle.</span>',
      resolve: 'reforço local sem documento e FAP subindo',
      passos: [
        { b: 'Eventos S-2210, S-2220 e S-2240 no prazo', s: 'CAT, monitoramento de saúde e condições ambientais enviados a partir do que foi feito, sem retrabalho.' },
        { b: 'Leitura anual do FAP', s: 'Conferimos os eventos que compõem o índice e apoiamos a contestação quando cabe.' },
        { b: 'Conferência de terceiros por obra', s: 'ASO, NRs e EPI do reforço local conferidos antes da entrada, num lugar só.' }
      ],
      entrega: { k: '100%', s: 'dos terceiros conferidos antes de pisar no canteiro.' } },

    { tipo: 'andar', andar: 4, num: '4º andar',
      titulo: 'Quem viaja <span class="grad">também cansa.</span>',
      resolve: 'semanas longe de casa sob pressão de prazo',
      passos: [
        { b: 'Riscos psicossociais no PGR (NR-1)', s: 'Jornada estendida, distância da família e pressão de inauguração entram no inventário com método reconhecido.' },
        { b: 'Treinamentos com registro', s: 'NR-35, NR-18 e integração de segurança com certificado e controle de reciclagem.' },
        { b: 'Leitura de afastamentos', s: 'Acompanhamos CIDs e retornos para agir antes que o padrão vire FAP.' }
      ],
      entrega: { k: 'NR-1', s: 'em dia com a exigência psicossocial e equipe que volta inteira.' } },

    { tipo: 'andar', andar: 5, num: '5º andar', extra: 'painel',
      titulo: 'Tudo da {empresa} <span class="grad">numa tela só.</span>',
      resolve: 'documento em e-mail, planilha e WhatsApp',
      passos: [
        { b: 'O RH agenda direto na agenda da clínica', s: 'Sem ligação e sem e-mail. Escolhe a obra, o colaborador e o exame, e o horário fica reservado.' },
        { b: 'Ficha 360 de cada colaborador', s: 'ASOs, exames, treinamentos, atestados e CAT, com a validade de cada item contra a obra em que ele está.' },
        { b: 'Indicadores por obra e por terceiro', s: 'ASOs a vencer, absenteísmo, turnover e conformidade de cada empreiteira em tempo real.' }
      ],
      fonte: 'O mesmo modelo de portal que a DMG montou para o Grupo Vigent. Dados da demonstração são ilustrativos.' },

    { tipo: 'andar', andar: 6, num: 'Cobertura', extra: 'parceria',
      titulo: 'Um benefício <span class="grad">que viaja junto.</span>',
      resolve: 'adoeceu longe de casa e sem a quem recorrer',
      passos: [
        { b: 'Telemedicina pelo app DIM+', s: 'Consulta por vídeo de qualquer cidade da obra, para o colaborador e para a família.' },
        { b: 'Cartão de desconto em farmácias', s: 'Cartão Vidalink no app, com localizador de farmácias perto de onde a equipe está.' },
        { b: 'Rede DIMEG e clube de descontos', s: 'Consultas e exames com desconto na rede própria, com mais de 100 mil atendimentos por ano, e clube de vantagens.' }
      ],
      parceria: 'Sete andares. Uma parceria.' },

    { tipo: 'entregue', cena: 'entregue', cap: '10', eyebrow: 'Recompensa · O estádio no dia marcado',
      titulo: 'Mesma obra. Mesma equipe. <span class="grad-ok">Entregue no prazo.</span>',
      lista: [
        'A equipe embarcou apta, com validade que cobre a obra inteira.',
        'A fábrica tem PGR e LTCAT que refletem a linha de produção.',
        'O reforço local foi conferido antes de entrar.',
        'O eSocial saiu no prazo e o FAP é acompanhado todo ano.',
        'O RH acompanha tudo no painel, e a equipe leva telemedicina e farmácia no bolso.'
      ],
      lede: 'A inauguração acontece. E o nome da {empresa} aparece na arquibancada, não no processo.' },

    { tipo: 'prova', cena: 'fundo', cap: '11', eyebrow: 'Quem já constrói com a DMG',
      titulo: 'Construtoras que <span class="grad">já operam com a gente.</span>' },

    { tipo: 'kanban', cena: 'fundo', titulo: 'Onde a {empresa} <span class="grad">está hoje?</span>' },
    { tipo: 'radar', cena: 'fundo' },

    { tipo: 'cta', cena: 'final', eyebrow: 'Próximo passo',
      titulo: 'O radar mostrou onde. <span class="grad">A vistoria mostra quanto.</span>',
      passos: [
        { b: 'Diagnóstico', s: 'Aprofundamos o radar com os documentos atuais.' },
        { b: 'Vistoria', s: 'Engenheiro na fábrica e na próxima obra.' },
        { b: 'Onboarding', s: 'Equipe, terceiros e eSocial migrados.' },
        { b: 'Próxima obra', s: 'Primeira mobilização já com a DMG.' }
      ],
      botao: 'Agendar vistoria da fábrica →',
      whatsapp: 'Quero agendar a vistoria da fábrica da {empresa} com a DMG' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: DIAGNOSTICO ═══ */
  eixos: [
    { id: 'mob',   nome: 'Mobilização',      acao: 'Admissional em lote, validade que cobre a obra e pasta da equipe pronta para o cliente.' },
    { id: 'fab',   nome: 'Fábrica e laudos', acao: 'PGR da fábrica e por obra, e LTCAT com medição de agentes químicos e ruído.' },
    { id: 'alt',   nome: 'Altura e içamento', acao: 'Bateria por função no PCMSO e aptidão NR-35/NR-33 com controle de validade.' },
    { id: 'esoc',  nome: 'eSocial e FAP',    acao: 'S-2210/2220/2240 no prazo e leitura anual do FAP com contestação quando cabe.' },
    { id: 'terc',  nome: 'Terceiros',        acao: 'Conferência documental do reforço local antes da entrada, por obra.' },
    { id: 'psico', nome: 'NR-1 psicossocial', acao: 'Inventário psicossocial considerando viagem, jornada e pressão de prazo.' }
  ],
  cartoes: [
    { e: 'mob',   t: 'Equipe recém-contratada faz o ASO antes de embarcar' },
    { e: 'mob',   t: 'Validade dos exames é checada contra a duração da obra' },
    { e: 'mob',   t: 'Documentação da equipe chega ao cliente antes da equipe' },
    { e: 'fab',   t: 'PGR da fábrica reflete a linha de produção atual' },
    { e: 'fab',   t: 'LTCAT tem medição de agentes químicos e ruído' },
    { e: 'fab',   t: 'Audiometria e espirometria constam no PCMSO da fábrica' },
    { e: 'alt',   t: 'ASO registra aptidão para altura (NR-35)' },
    { e: 'alt',   t: 'Exames do PCMSO diferenciam montador, eletricista e operador' },
    { e: 'alt',   t: 'Treinamentos NR-35/NR-18 com controle de reciclagem' },
    { e: 'esoc',  t: 'S-2240 atualizado a cada obra ou mudança de risco' },
    { e: 'esoc',  t: 'S-2220 e S-2210 enviados no prazo' },
    { e: 'esoc',  t: 'FAP conferido todo ano e contestado quando cabe' },
    { e: 'terc',  t: 'Reforço local tem ASO e NRs conferidos antes de entrar' },
    { e: 'terc',  t: 'Documentação de terceiros centralizada por obra' },
    { e: 'terc',  t: 'Acidente com terceiro tem fluxo definido' },
    { e: 'psico', t: 'Riscos psicossociais inventariados no PGR' },
    { e: 'psico', t: 'Viagem e jornada estendida avaliadas como fator de risco' },
    { e: 'psico', t: 'Afastamentos por saúde mental acompanhados' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: IMPLICACAO ═══ */
  calc: { rat: 3, salario: 3200, fap: 1.5 },
  prazo: {
    dias: 30,
    padrao: { aso: true },
    eventos: [
      { id: 'aso',  t: 'Equipe barrada sem ASO no portão do cliente', s: 'Remarcação e exame na cidade da obra', dias: 3 },
      { id: 'nr35', t: 'Treinamento de NR-35 vencido na inspeção',    s: 'Frente de altura parada até reciclar', dias: 2 },
      { id: 'fisc', t: 'Fiscalização interdita a frente de trabalho', s: 'Adequação e pedido de desinterdição', dias: 5 },
      { id: 'acid', t: 'Acidente com afastamento',                     s: 'Investigação, CAT e reposição de equipe', dias: 4 }
    ],
    legenda: ['Montagem', 'Parada por SST', 'Inauguração', 'Depois do evento'],
    rotuloEntrega: 'Entrega da obra',
    msgAtraso: 'A montagem termina {n} dia{s} depois da inauguração.',
    msgAtrasoResto: 'Ou a equipe vira noites com hora extra, ou o evento abre com a obra incompleta.',
    msgOk: 'Entrega no dia {dias}.',
    msgOkResto: 'É este o calendário que a gestão de SST protege.',
    fonte: 'Cenário ilustrativo, com durações de referência para cada tipo de ocorrência.'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: SOLUCAO ═══ */
  // Benefícios exibidos na fachada de cada andar da clínica (o último é a placa de parceria)
  beneficios: [
    { andar: 'TÉRREO · MOBILIZAÇÃO', itens: ['ASO liberado em D+1', 'Validade que cobre a obra inteira', 'Pasta pronta para o cliente'] },
    { andar: '1º ANDAR · EXAMES', itens: ['Bateria por função no PCMSO', 'Aptidão NR-35 e NR-33 no ASO', 'Alerta antes de vencer'] },
    { andar: '2º ANDAR · ENGENHARIA', itens: ['PGR da fábrica e de cada obra', 'LTCAT com medição em campo', 'Plano de ação com responsáveis'] },
    { andar: '3º ANDAR · eSOCIAL E FAP', itens: ['S-2210, S-2220 e S-2240 no prazo', 'FAP lido e contestado', 'Terceiros conferidos na entrada'] },
    { andar: '4º ANDAR · PESSOAS E NR-1', itens: ['Psicossocial no PGR (NR-1)', 'Treinamentos com certificado', 'Afastamentos acompanhados'] },
    { andar: '5º ANDAR · PAINEL EXCLUSIVO', itens: ['RH agenda direto na clínica', 'Ficha 360 de cada colaborador', 'Indicadores por obra ao vivo'] },
    { andar: 'COBERTURA · PARCERIA', parceria: true, rodape: 'parceiros na saúde de quem constrói · benefício DIM+ para a equipe' }
  ],

  // Dados da demonstração do painel exclusivo (ilustrativos)
  painel: {
    abas: [
      { id: 'geral', ic: '◧', t: 'Visão geral' }, { id: 'agenda', ic: '◷', t: 'Agenda' },
      { id: 'obras', ic: '⌂', t: 'Obras', badge: 1 }, { id: 'colab', ic: '◉', t: 'Colaborador 360' },
      { id: 'terc', ic: '⇄', t: 'Terceiros', badge: 2 }
    ],
    rotuloObras: 'Obras e frentes ativas', colunaObra: 'Obra', filtros: ['Todas as obras', 'Fábrica', 'Outubro'],
    kpis: [
      { t: 'Ativos', v: '{func}', s: 'em 5 frentes' }, { t: 'ASOs a vencer', v: '14', s: 'próximos 30 dias', c: 'warn' },
      { t: 'ASO em D+1', v: '98%', s: 'últimos 90 dias', c: 'green' }, { t: 'Absenteísmo', v: '2,1%', s: 'mês atual' },
      { t: 'Turnover', v: '3,4%', s: 'média mensal' }, { t: 'Terceiros conformes', v: '94%', s: '4 empreiteiras', c: 'green' }
    ],
    preview: [{ v: '{func}', l: 'ativos' }, { v: '14', l: 'a vencer', c: 'warn' }, { v: '94%', l: 'conformes', c: 'green' }],
    meses: [['Mai', 31], ['Jun', 44], ['Jul', 38], ['Ago', 52], ['Set', 47], ['Out', 61]],
    alertas: [
      { c: 'r', t: 'Quadras · Curitiba: 3 terceiros sem NR-35', q: 'hoje' },
      { c: '', t: '6 ASOs periódicos vencem durante a obra de Recife', q: 'antecipar' },
      { c: '', t: 'Audiometria da fábrica: 9 pendentes', q: 'agendar' },
      { c: 'g', t: 'Turma Goiânia: 12 admissionais liberados em D+1', q: 'ontem' }
    ],
    obras: [
      { n: 'Arquibancada retrátil', c: 'Rio de Janeiro/RJ', e: 46, conf: 0.99, st: 'Montagem', tag: 'ok' },
      { n: 'Arena multiuso', c: 'Goiânia/GO', e: 38, conf: 0.96, st: 'Montagem', tag: 'ok' },
      { n: 'Pista de atletismo', c: 'Recife/PE', e: 22, conf: 0.88, st: 'Mobilizando', tag: 'n' },
      { n: 'Quadras poliesportivas', c: 'Curitiba/PR', e: 17, conf: 0.72, st: 'Atenção', tag: 'r' },
      { n: 'Fábrica', c: 'Sede', e: 97, conf: 0.93, st: 'Operação', tag: 'ok' }
    ],
    terceiros: [
      { n: 'Montagens Alfa', o: 'Arena multiuso', p: 12, aso: 12, nr: 12, epi: 12 },
      { n: 'Elétrica Beta', o: 'Arquibancada retrátil', p: 8, aso: 8, nr: 8, epi: 7 },
      { n: 'Serviços Gama', o: 'Quadras poliesportivas', p: 9, aso: 9, nr: 6, epi: 9 },
      { n: 'Pinturas Delta', o: 'Pista de atletismo', p: 5, aso: 4, nr: 5, epi: 5 }
    ],
    agenda: [
      { d: 0, h: 0, k: 'adm', t: 'Admissional · 6', s: 'Turma Recife' }, { d: 0, h: 2, k: 'per', t: 'Periódico · 3', s: 'Fábrica' },
      { d: 1, h: 1, k: 'adm', t: 'Admissional · 6', s: 'Turma Recife' }, { d: 2, h: 0, k: 'per', t: 'Audiometria · 9', s: 'Fábrica' },
      { d: 2, h: 3, k: 'dem', t: 'Demissional · 2', s: 'Arena Goiânia' }, { d: 3, h: 1, k: '', t: 'Retorno ao trabalho', s: 'Arquibancada RJ' },
      { d: 4, h: 0, k: 'per', t: 'NR-35 · 5', s: 'Quadras Curitiba' }, { d: 4, h: 2, k: 'adm', t: 'Admissional · 4', s: 'Reforço Goiânia' }
    ],
    colab: {
      ini: 'CM', n: 'Carlos M.', f: 'Montador de arquibancada', o: 'Arquibancada retrátil · Rio de Janeiro/RJ',
      chips: ['Apto NR-35', 'Apto içamento', 'DIM+ ativo'], fimObra: 'termina em 34 dias',
      linha: [
        { t: 'ASO admissional · Apto', d: 'Liberado em D+1', a: '' }, { t: 'Treinamento NR-35', d: 'Certificado registrado', a: '' },
        { t: 'Telemedicina pelo app DIM+', d: 'Atendido em viagem', a: '' }, { t: 'Audiometria periódica', d: 'Vence em 18 dias', a: 'at' }
      ],
      val: [{ t: 'ASO periódico', r: 212, tot: 365 }, { t: 'NR-35', r: 41, tot: 730 }, { t: 'Audiometria', r: 18, tot: 365 }, { t: 'NR-18 integração', r: 300, tot: 365 }]
    }
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CONTEXTO ═══ */
  cidades: [
    { n: 'São Paulo', lon: -46.6, lat: -23.5, base: true },
    { n: 'Rio', lon: -43.2, lat: -22.9 }, { n: 'BH', lon: -43.9, lat: -19.9 },
    { n: 'Brasília', lon: -47.9, lat: -15.8 }, { n: 'Salvador', lon: -38.5, lat: -13 },
    { n: 'Recife', lon: -34.9, lat: -8 }, { n: 'Fortaleza', lon: -38.5, lat: -3.7 },
    { n: 'Manaus', lon: -60, lat: -3.1 }, { n: 'Belém', lon: -48.5, lat: -1.4 },
    { n: 'Porto Alegre', lon: -51.2, lat: -30 }, { n: 'Cuiabá', lon: -56.1, lat: -15.6 }
  ],
  parceiros: [
    { setor: 'Construção de edifícios · Grau de risco 3', nome: 'Estrela Engenharia', texto: 'Plano SST Flex com unidades em Cotia, Sorocaba e Piracicaba: uma gestão só para obras em cidades diferentes.' },
    { setor: 'Construção de edifícios · Grau de risco 3', nome: 'Vigent Construções', texto: 'Atendimento por obra, incluindo a do Aeroporto de Guarulhos, e avaliação psicossocial da NR-1.' }
  ],
  // Ato da narrativa SPIN mostrado no HUD, por cena
  ato: {
    capa: 'Abertura', fabrica: 'Problema', viagem: 'Problema', altura: 'Problema', terceiros: 'Problema',
    acidente: 'Implicação', prazo: 'Implicação', virada: 'Necessidade', entregue: 'Recompensa', final: 'Próximo passo'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CAMERA ═══ */
  // Câmera e estado do mundo 3D por cena. obra = progresso da obra do cliente (0–1); torre = andares visíveis.
  // As cenas andar-N da clínica são geradas pelo kit 3D a partir de clinica.pos.
  clinica: { pos: [-9, 0, -6], escala: 1.35 },
  cenas: {
    capa:      { pos: [44, 22, 40],   alvo: [18, 3, -10],  obra: 0.55, torre: 0, modo: 'neutro' },
    fabrica:   { pos: [-12, 9, 18],   alvo: [-29, 3, 0],   obra: 0.55, torre: 0, modo: 'fabrica' },
    viagem:    { pos: [-13, 4.5, 19], alvo: [-15, 1.5, 7], obra: 0.55, torre: 0, modo: 'viagem' },
    altura:    { pos: [-4, 10, 7.5],  alvo: [2.5, 5, -3],  obra: 0.55, torre: 0, modo: 'altura' },
    terceiros: { pos: [29, 7.5, 21],  alvo: [21, 1.2, 4],  obra: 0.55, torre: 0, modo: 'terceiros' },
    acidente:  { pos: [6, 9, 12],     alvo: [1.5, 2, -2],  obra: 0.55, torre: 0, modo: 'acidente' },
    prazo:     { pos: [19, 11, 12],   alvo: [19.5, 10, -30], obra: 0.55, torre: 0, modo: 'prazo' },
    virada:    { pos: [2, 9, 20],     alvo: [-9, 3, -3],   obra: 0.55, torre: 0, modo: 'virada' },
    entregue:  { pos: [46, 24, 42],   alvo: [18, 2, -12],  obra: 1,    torre: 7, modo: 'verde' },
    fundo:     { pos: [6, 34, 52],    alvo: [0, 2, 0],     obra: 0.55, torre: 0, modo: 'neutro' },
    final:     { pos: [40, 30, 52],   alvo: [4, 3, -2],    obra: 1,    torre: 7, modo: 'verde' }
  }
  /* ── FIM BLOCO ── */
};
