/* Roteiro: Construção · Edificações e incorporação (torre residencial, entrega das chaves).
   Só dados. {empresa}, {func}, {anos} e {cidade} viram os dados do cliente. */
window.ROTEIRO = {
  id: 'construcao-edificacoes',
  icp: 'Construção',
  subtipo: 'Edificações e incorporação',
  cenario: 'edificacoes',
  empresaPadrao: { nome: 'Construtora Exemplo', func: 180, anos: 20 },
  chaveLocal: 'dmg-edificacoes-kanban',

  /* ═══ BLOCO: SLIDES ═══ */
  slides: [
    { tipo: 'capa', cena: 'capa',
      eyebrow: 'Proposta de saúde e segurança do trabalho',
      titulo: 'Cada andar que sobe<br><span class="grad">tem gente pendurada nele.</span>',
      sub: 'A {empresa} vende uma data: a entrega das chaves. Entre o lançamento e esse dia, centenas de pessoas passam pelo canteiro. Esta é a história de uma torre.',
      stats: [{ n: '{anos}', l: 'Anos de {empresa}' }, { n: '{func}', l: 'Pessoas no canteiro' }, { n: 5, l: 'Etapas, 5 equipes' }] },

    { tipo: 'etapas', cena: 'fundo', cap: '01', eyebrow: 'Situação',
      titulo: 'Uma obra, cinco obras. <span class="grad">Cada etapa traz uma equipe nova.</span>',
      lede: 'Na incorporação, o canteiro troca de gente a cada fase. Quem fez a fundação não fica para o acabamento, e cada empreiteiro chega com seus próprios riscos e documentos.',
      etapas: [
        { n: 'Fundação', p: 'até 15% da obra', quem: 'Estaqueamento e escavação, com máquina pesada e operador.', riscos: ['Escavação', 'Ruído', 'Máquina'], troca: 'empreiteira de fundação' },
        { n: 'Estrutura', p: '15% a 45%', quem: 'Forma, armação e concretagem andar a andar.', riscos: ['Altura', 'Periferia de laje', 'Grua'], troca: 'equipe de estrutura' },
        { n: 'Alvenaria', p: '45% a 65%', quem: 'Blocos, cortes e fachada, com o elevador de obra em uso o dia todo.', riscos: ['Sílica', 'Balancim', 'Cremalheira'], troca: 'equipe de alvenaria' },
        { n: 'Instalações', p: '55% a 80%', quem: 'Elétrica, hidráulica e gás, quase sempre terceirizadas.', riscos: ['Eletricidade', 'Confinado', 'Terceiros'], troca: 'várias empreiteiras' },
        { n: 'Acabamento', p: '80% a 100%', quem: 'Pisos, pintura e esquadrias, no aperto do prazo de entrega.', riscos: ['Química', 'Ritmo', 'Pico de equipe'], troca: 'pico de contratações' }
      ],
      rodape: 'Cada troca é uma nova leva de admissionais, treinamentos, fichas de EPI e eventos de eSocial. Se uma única etapa atrasa a documentação, a obra inteira para no portão.' },

    { tipo: 'dor', cena: 'terceiros', cap: '02', tag: 'Dor 1 de 4 · Empreiteiros',
      titulo: 'O empreiteiro é dele. <span class="grad-red">A obra e o risco são da {empresa}.</span>',
      lede: 'Na portaria da obra, cada etapa traz uma turma: a da fundação sai, a da estrutura entra, a do acabamento chega no pico. Se alguém de um empreiteiro entra sem ASO, treinamento ou EPI, a responsabilidade chega à construtora.',
      lista: [
        'Documentação de cada empreiteira em e-mail, pasta e WhatsApp: ninguém sabe quem está apto naquele dia.',
        'A fiscalização autua a obra, e não o empreiteiro que trouxe a pessoa.',
        'Acidente com terceiro vira processo contra quem contratou.'
      ] },

    { tipo: 'dor', cena: 'altura', cap: '03', tag: 'Dor 2 de 4 · Altura e equipamentos',
      titulo: 'A laje sobe toda semana. <span class="grad-red">A proteção precisa subir junto.</span>',
      lede: 'Periferia de laje, bandeja, grua e elevador cremalheira: a fase de estrutura junta trabalho em altura (NR-35), canteiro de construção (NR-18) e máquinas com operador habilitado na mesma semana.',
      lista: [
        'Queda de altura está entre as principais causas de acidente grave na construção civil.',
        '"Apto" genérico, sem os exames que o PCMSO define para altura e operação de equipamento, não sustenta a empresa numa perícia.',
        'Operador de grua ou de cremalheira com exame ou treinamento vencido para a frente na inspeção.'
      ] },

    { tipo: 'dor', cena: 'mobilizacao', cap: '04', tag: 'Dor 3 de 4 · Rotatividade',
      titulo: 'Entra gente toda segunda. <span class="grad-red">Sai gente toda sexta.</span>',
      lede: 'Na construção a rotatividade é alta. Cada admissão precisa de ASO antes do primeiro dia; cada desligamento, de demissional, PPP e evento no eSocial. No pico do acabamento isso vira dezenas de pessoas por semana.',
      lista: [
        'Turma esperando exame no vestiário é diária paga sem produção.',
        'Demissional esquecido vira passivo e evento em atraso no eSocial.'
      ],
      custo: 'Cada dia de equipe parada na portaria empurra o cronograma, e o cronograma da {empresa} termina numa data prometida ao comprador.' },

    { tipo: 'dor', cena: 'poeira', cap: '05', tag: 'Dor 4 de 4 · Poeira e ruído',
      titulo: 'O corte do bloco <span class="grad-red">fica no pulmão de alguém.</span>',
      lede: 'Serra de bloco, porcelanato, betoneira e martelete. A poeira com sílica e o ruído do canteiro precisam estar medidos no laudo de cada obra, e não copiados de outra.',
      lista: [
        'LTCAT sem medição em campo vira passivo de insalubridade e aposentadoria especial.',
        'PGR genérico, igual para todas as obras, não reflete o canteiro que o fiscal está vendo.',
        'Audiometria e espirometria fora do PCMSO deixam o trabalhador sem acompanhamento.'
      ] },

    { tipo: 'linha', cena: 'acidente', cap: '06', eyebrow: 'Implicação · O dia em que acontece',
      titulo: 'Um acidente não termina<br><span class="grad-red">no dia do acidente.</span>',
      lede: 'Ele abre uma cadeia de eventos que alcança a obra, o comprador, a folha e o jurídico, e volta meses depois.',
      pontos: [
        { q: 'Dia 0', b: 'Queda da periferia da laje', s: 'A frente de estrutura para. A fiscalização pode embargar o andar.', ini: true },
        { q: 'Dia 1', b: 'CAT e S-2210', s: 'Prazo curto. Erro de classificação conta contra a empresa.' },
        { q: 'Dia 16', b: 'Benefício no INSS', s: 'O evento passa a compor o cálculo do FAP.' },
        { q: 'Meses depois', b: 'Ação trabalhista', s: 'A defesa depende de ASO, PGR, treinamento e EPI, inclusive do terceiro.' },
        { q: 'Ano + 2', b: 'FAP sobe', s: 'Alíquota maior todo mês, sobre toda a folha da {empresa}.' }
      ] },

    { tipo: 'calc', cena: 'fundo', cap: '07', eyebrow: 'Implicação · Na folha',
      titulo: 'Quanto o histórico de acidentes <span class="grad">custa na folha?</span>',
      lede: 'O RAT vem do CNAE e você não escolhe. O FAP vem do histórico de acidentes e afastamentos, e é o único fator que a gestão de SST consegue mover.',
      notaRat: 'Confirmar pelo CNAE preponderante da {empresa}.' },

    { tipo: 'prazo', cena: 'prazo', cap: '08', eyebrow: 'Implicação · Na entrega das chaves',
      titulo: 'O comprador tem uma data. <span class="grad-red">O atraso tem nome.</span>',
      lede: 'Marque o que pode acontecer no último mês antes da entrega e veja onde as chaves vão parar.' },

    { tipo: 'virada', cena: 'virada', cap: '09', eyebrow: 'E se fosse diferente?',
      titulo: 'E se cada etapa entrasse <span class="grad">já protegida?</span>',
      ledes: [
        'Empreiteiro conferido na portaria, exame certo para a altura, laudo da obra que se sustenta e evento no prazo. Antes da etapa começar, e não depois do primeiro problema.',
        'Siga o trabalhador. Ele vai passar pela DMG antes de subir na laje, e o prédio da clínica vai subir com ele, <b>andar por andar</b>.'
      ],
      pill: 'Próximo: térreo da clínica' },

    { tipo: 'andar', andar: 0, num: 'Térreo',
      titulo: 'Mobilização <span class="grad">no ritmo da obra.</span>',
      resolve: 'entra gente toda segunda, sai gente toda sexta',
      passos: [
        { b: 'ASO liberado em D+1', s: 'Exame feito hoje, ASO disponível no dia seguinte. Admissional em lote para a turma de cada etapa, com agenda reservada.' },
        { b: 'Demissional e PPP sem esquecimento', s: 'Quem sai do canteiro sai com exame, PPP e evento no eSocial, mesmo no pico de rotatividade.' },
        { b: 'Pasta da turma por etapa', s: 'ASO, treinamentos e ficha de EPI organizados por obra e por fase, prontos para a portaria.' }
      ],
      entrega: { k: 'D+1', s: 'do exame ao ASO na mão. A turma nova não espera no vestiário.' } },

    { tipo: 'andar', andar: 1, num: '1º andar',
      titulo: 'Apto <span class="grad">para a laje e para a máquina.</span>',
      resolve: 'periferia de laje, grua e cremalheira',
      passos: [
        { b: 'Bateria definida por função no PCMSO', s: 'Armador, carpinteiro de forma, operador de grua e guincheiro não fazem o mesmo exame.' },
        { b: 'Aptidão para altura e espaço confinado', s: 'O ASO registra a aptidão para NR-35 e NR-33, com avaliação clínica e os complementares que o médico define.' },
        { b: 'Validade controlada por trabalhador', s: 'Alerta antes do vencimento de exames e treinamentos, para ninguém ficar irregular no meio da estrutura.' }
      ],
      entrega: { k: 'ASO', s: 'que se sustenta numa perícia, e não um "apto" genérico.' } },

    { tipo: 'andar', andar: 2, num: '2º andar',
      titulo: 'Engenharia <span class="grad">em cada canteiro.</span>',
      resolve: 'poeira, ruído e laudo copiado de outra obra',
      passos: [
        { b: 'PGR por obra', s: 'O inventário de riscos acompanha a fase do canteiro, da fundação ao acabamento.' },
        { b: 'LTCAT com medição em campo', s: 'Ruído, poeira com sílica e agentes químicos do acabamento medidos por engenheiro de segurança.' },
        { b: 'Vistoria e plano de ação', s: 'Visita técnica nas obras ativas, com prioridades e responsáveis por frente.' }
      ],
      entrega: { k: '1', s: 'laudo por obra, assinado por quem esteve no canteiro.' } },

    { tipo: 'andar', andar: 3, num: '3º andar',
      titulo: 'eSocial, FAP <span class="grad">e empreiteiros sob controle.</span>',
      resolve: 'empreiteiro sem documento e FAP subindo',
      passos: [
        { b: 'Eventos S-2210, S-2220 e S-2240 no prazo', s: 'CAT, monitoramento de saúde e condições ambientais enviados a partir do que foi feito, sem retrabalho.' },
        { b: 'Leitura anual do FAP', s: 'Conferimos os eventos que compõem o índice e apoiamos a contestação quando cabe.' },
        { b: 'Conferência de empreiteiros por obra', s: 'ASO, NRs e EPI de cada terceiro conferidos antes da entrada, num lugar só.' }
      ],
      entrega: { k: '100%', s: 'dos terceiros conferidos antes de passar pela portaria.' } },

    { tipo: 'andar', andar: 4, num: '4º andar',
      titulo: 'Gente que <span class="grad">volta para casa inteira.</span>',
      resolve: 'pressão de prazo e afastamento sem leitura',
      passos: [
        { b: 'Riscos psicossociais no PGR (NR-1)', s: 'Ritmo de entrega, jornada estendida e pressão do acabamento entram no inventário com método reconhecido.' },
        { b: 'Treinamentos com registro', s: 'Integração, NR-18, NR-35 e operação de equipamentos com certificado e controle de reciclagem.' },
        { b: 'Leitura de afastamentos', s: 'Acompanhamos CIDs e retornos para agir antes que o padrão vire FAP.' }
      ],
      entrega: { k: 'NR-1', s: 'em dia com a exigência psicossocial.' } },

    { tipo: 'andar', andar: 5, num: '5º andar', extra: 'painel',
      titulo: 'Todas as obras da {empresa} <span class="grad">numa tela só.</span>',
      resolve: 'documento de empreiteiro em e-mail, planilha e WhatsApp',
      passos: [
        { b: 'O RH agenda direto na agenda da clínica', s: 'Escolhe a obra, a etapa e o colaborador, e o horário fica reservado.' },
        { b: 'Ficha 360 de cada colaborador', s: 'ASOs, exames, treinamentos, atestados e CAT, com a validade contra a obra em que ele está.' },
        { b: 'Conformidade por obra e por empreiteira', s: 'Quem está apto hoje em cada canteiro, e quem não pode passar da portaria.' }
      ],
      fonte: 'O mesmo modelo de portal que a DMG montou para o Grupo Vigent. Dados da demonstração são ilustrativos.' },

    { tipo: 'andar', andar: 6, num: 'Cobertura', extra: 'parceria',
      titulo: 'Um benefício <span class="grad">para quem constrói.</span>',
      resolve: 'adoeceu e não tem a quem recorrer',
      passos: [
        { b: 'Telemedicina pelo app DIM+', s: 'Consulta por vídeo para o colaborador e para a família, sem sair do canteiro.' },
        { b: 'Cartão de desconto em farmácias', s: 'Cartão Vidalink no app, com localizador de farmácias perto de casa ou da obra.' },
        { b: 'Rede DIMEG e clube de descontos', s: 'Consultas e exames com desconto na rede própria, com mais de 100 mil atendimentos por ano, e clube de vantagens.' }
      ],
      parceria: 'Sete andares. Uma parceria.' },

    { tipo: 'entregue', cena: 'entregue', cap: '10', eyebrow: 'Recompensa · A entrega das chaves',
      titulo: 'Mesma torre. Mesmas etapas. <span class="grad-ok">Chaves entregues no prazo.</span>',
      lista: [
        'Cada turma entrou na obra com ASO em D+1 e validade conferida.',
        'Os empreiteiros passaram pela portaria com documentação em dia.',
        'A obra tem PGR e LTCAT com a poeira e o ruído medidos no canteiro.',
        'O eSocial saiu no prazo e o FAP é acompanhado todo ano.',
        'O RH vê todas as obras no painel, e a equipe leva telemedicina e farmácia no bolso.'
      ],
      lede: 'O comprador recebe as chaves. E o nome da {empresa} aparece na fachada, não no processo.' },

    { tipo: 'prova', cena: 'fundo', cap: '11', eyebrow: 'Quem já constrói com a DMG',
      titulo: 'Construtoras que <span class="grad">já operam com a gente.</span>' },

    { tipo: 'kanban', cena: 'fundo', titulo: 'Onde a {empresa} <span class="grad">está hoje?</span>' },
    { tipo: 'radar', cena: 'fundo' },

    { tipo: 'cta', cena: 'final', eyebrow: 'Próximo passo',
      titulo: 'O radar mostrou onde. <span class="grad">A vistoria mostra quanto.</span>',
      passos: [
        { b: 'Diagnóstico', s: 'Aprofundamos o radar com os documentos atuais.' },
        { b: 'Vistoria', s: 'Engenheiro nas obras ativas.' },
        { b: 'Onboarding', s: 'Equipe, empreiteiros e eSocial migrados.' },
        { b: 'Próxima etapa', s: 'Primeira turma já mobilizada com a DMG.' }
      ],
      botao: 'Agendar vistoria das obras →',
      whatsapp: 'Quero agendar a vistoria das obras da {empresa} com a DMG' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: DIAGNOSTICO ═══ */
  eixos: [
    { id: 'mob',   nome: 'Mobilização',       acao: 'Admissional em lote por etapa, ASO em D+1 e demissional com PPP sem esquecimento.' },
    { id: 'terc',  nome: 'Empreiteiros',      acao: 'Conferência documental de cada terceiro antes da portaria, por obra e por etapa.' },
    { id: 'alt',   nome: 'Altura e máquinas', acao: 'Bateria por função no PCMSO e aptidão NR-35/NR-33 com controle de validade.' },
    { id: 'amb',   nome: 'Laudos da obra',    acao: 'PGR por obra e LTCAT com medição de ruído e poeira com sílica em campo.' },
    { id: 'esoc',  nome: 'eSocial e FAP',     acao: 'S-2210/2220/2240 no prazo e leitura anual do FAP com contestação quando cabe.' },
    { id: 'psico', nome: 'NR-1 psicossocial', acao: 'Inventário psicossocial considerando ritmo de entrega e jornada.' }
  ],
  cartoes: [
    { e: 'mob',   t: 'Turma nova faz o ASO antes do primeiro dia de obra' },
    { e: 'mob',   t: 'Demissional e PPP saem para todo desligamento' },
    { e: 'mob',   t: 'Conseguimos admitir uma turma inteira em poucos dias' },
    { e: 'terc',  t: 'ASO e NRs de empreiteiro conferidos na portaria' },
    { e: 'terc',  t: 'Documentação de terceiros centralizada por obra' },
    { e: 'terc',  t: 'Acidente com terceiro tem fluxo definido' },
    { e: 'alt',   t: 'ASO registra aptidão para altura (NR-35)' },
    { e: 'alt',   t: 'Operador de grua e cremalheira com exame e treinamento em dia' },
    { e: 'alt',   t: 'Treinamentos NR-18/NR-35 com controle de reciclagem' },
    { e: 'amb',   t: 'Cada obra ativa tem PGR próprio' },
    { e: 'amb',   t: 'LTCAT tem medição de ruído e poeira com sílica' },
    { e: 'amb',   t: 'Audiometria e espirometria constam no PCMSO' },
    { e: 'esoc',  t: 'S-2240 atualizado a cada obra ou mudança de fase' },
    { e: 'esoc',  t: 'S-2220 e S-2210 enviados no prazo' },
    { e: 'esoc',  t: 'FAP conferido todo ano e contestado quando cabe' },
    { e: 'psico', t: 'Riscos psicossociais inventariados no PGR' },
    { e: 'psico', t: 'Ritmo de entrega e jornada avaliados como fator de risco' },
    { e: 'psico', t: 'Afastamentos por saúde mental acompanhados' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: IMPLICACAO ═══ */
  calc: { rat: 3, salario: 3200, fap: 1.5 },
  prazo: {
    dias: 30,
    padrao: { term: true },
    eventos: [
      { id: 'term', t: 'Turma de acabamento barrada sem ASO na portaria', s: 'Remarcação dos exames e reposição da equipe', dias: 2 },
      { id: 'grua', t: 'Grua ou cremalheira parada na inspeção', s: 'Operador com exame ou treinamento vencido', dias: 3 },
      { id: 'emba', t: 'Embargo de frente por falta de proteção', s: 'Adequação da periferia e pedido de liberação', dias: 5 },
      { id: 'acid', t: 'Acidente com afastamento', s: 'Investigação, CAT e reposição de equipe', dias: 4 }
    ],
    legenda: ['Obra', 'Parada por SST', 'Entrega das chaves', 'Depois da data'],
    rotuloEntrega: 'Entrega das chaves',
    msgAtraso: 'As chaves saem {n} dia{s} depois da data prometida.',
    msgAtrasoResto: 'Ou o acabamento vira hora extra, ou o comprador recebe a notícia do atraso.',
    msgOk: 'Chaves no dia {dias}.',
    msgOkResto: 'É este o calendário que a gestão de SST protege.',
    fonte: 'Cenário ilustrativo do último mês de obra, com durações de referência para cada tipo de ocorrência.'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: SOLUCAO ═══ */
  beneficios: [
    { andar: 'TÉRREO · MOBILIZAÇÃO', itens: ['ASO liberado em D+1', 'Demissional e PPP sem esquecer', 'Pasta da turma por etapa'] },
    { andar: '1º ANDAR · EXAMES', itens: ['Bateria por função no PCMSO', 'Aptidão NR-35 e NR-33 no ASO', 'Operador de grua em dia'] },
    { andar: '2º ANDAR · ENGENHARIA', itens: ['PGR de cada obra', 'LTCAT com poeira e ruído medidos', 'Plano de ação por frente'] },
    { andar: '3º ANDAR · eSOCIAL E FAP', itens: ['S-2210, S-2220 e S-2240 no prazo', 'FAP lido e contestado', 'Empreiteiros conferidos'] },
    { andar: '4º ANDAR · PESSOAS E NR-1', itens: ['Psicossocial no PGR (NR-1)', 'Treinamentos com certificado', 'Afastamentos acompanhados'] },
    { andar: '5º ANDAR · PAINEL EXCLUSIVO', itens: ['RH agenda direto na clínica', 'Ficha 360 de cada colaborador', 'Conformidade por obra'] },
    { andar: 'COBERTURA · PARCERIA', parceria: true, rodape: 'parceiros na saúde de quem constrói · benefício DIM+ para a equipe' }
  ],

  painel: {
    abas: [
      { id: 'geral', ic: '◧', t: 'Visão geral' }, { id: 'agenda', ic: '◷', t: 'Agenda' },
      { id: 'obras', ic: '⌂', t: 'Obras', badge: 1 }, { id: 'colab', ic: '◉', t: 'Colaborador 360' },
      { id: 'terc', ic: '⇄', t: 'Empreiteiros', badge: 2 }
    ],
    rotuloObras: 'Obras e etapas', colunaObra: 'Obra', filtros: ['Todas as obras', 'Estrutura', 'Outubro'],
    kpis: [
      { t: 'Ativos', v: '{func}', s: 'em 4 obras' }, { t: 'ASOs a vencer', v: '11', s: 'próximos 30 dias', c: 'warn' },
      { t: 'ASO em D+1', v: '98%', s: 'últimos 90 dias', c: 'green' }, { t: 'Absenteísmo', v: '2,6%', s: 'mês atual' },
      { t: 'Turnover', v: '5,8%', s: 'média mensal' }, { t: 'Empreiteiros conformes', v: '91%', s: '5 empreiteiras', c: 'green' }
    ],
    preview: [{ v: '{func}', l: 'ativos' }, { v: '11', l: 'a vencer', c: 'warn' }, { v: '91%', l: 'conformes', c: 'green' }],
    meses: [['Mai', 42], ['Jun', 51], ['Jul', 38], ['Ago', 63], ['Set', 58], ['Out', 74]],
    alertas: [
      { c: 'r', t: 'Torre B: 4 terceiros da elétrica sem NR-10', q: 'hoje' },
      { c: '', t: 'Operador de grua da Torre A: exame vence em 9 dias', q: 'agendar' },
      { c: '', t: 'Turma de acabamento: 14 admissionais na semana', q: 'reservado' },
      { c: 'g', t: 'Estrutura Torre B: 12 ASOs liberados em D+1', q: 'ontem' }
    ],
    obras: [
      { n: 'Residencial · Torre A', c: 'Osasco/SP · Acabamento', e: 64, conf: 0.97, st: 'Acabamento', tag: 'ok' },
      { n: 'Residencial · Torre B', c: 'Osasco/SP · Estrutura', e: 52, conf: 0.84, st: 'Atenção', tag: 'r' },
      { n: 'Comercial Centro', c: 'Barueri/SP · Alvenaria', e: 38, conf: 0.93, st: 'Alvenaria', tag: 'ok' },
      { n: 'Lançamento Jardins', c: 'Cotia/SP · Fundação', e: 26, conf: 0.9, st: 'Mobilizando', tag: 'n' }
    ],
    terceiros: [
      { n: 'Fundações Alfa', o: 'Lançamento Jardins', p: 14, aso: 14, nr: 14, epi: 14 },
      { n: 'Estrutura Beta', o: 'Residencial · Torre B', p: 22, aso: 22, nr: 19, epi: 22 },
      { n: 'Alvenaria Gama', o: 'Comercial Centro', p: 16, aso: 16, nr: 16, epi: 15 },
      { n: 'Elétrica Delta', o: 'Residencial · Torre B', p: 8, aso: 8, nr: 4, epi: 8 },
      { n: 'Acabamentos Ômega', o: 'Residencial · Torre A', p: 18, aso: 17, nr: 18, epi: 18 }
    ],
    agenda: [
      { d: 0, h: 0, k: 'adm', t: 'Admissional · 8', s: 'Acabamento Torre A' }, { d: 0, h: 2, k: 'per', t: 'Periódico · 5', s: 'Estrutura Torre B' },
      { d: 1, h: 1, k: 'adm', t: 'Admissional · 6', s: 'Acabamento Torre A' }, { d: 2, h: 0, k: 'per', t: 'Audiometria · 7', s: 'Comercial Centro' },
      { d: 2, h: 3, k: 'dem', t: 'Demissional · 4', s: 'Fim da estrutura' }, { d: 3, h: 1, k: '', t: 'Operador de grua', s: 'Torre A' },
      { d: 4, h: 0, k: 'per', t: 'NR-35 · 9', s: 'Estrutura Torre B' }, { d: 4, h: 2, k: 'adm', t: 'Admissional · 6', s: 'Fundação Jardins' }
    ],
    colab: {
      ini: 'JR', n: 'José R.', f: 'Carpinteiro de forma', o: 'Residencial · Torre B · Estrutura',
      chips: ['Apto NR-35', 'Integração NR-18', 'DIM+ ativo'], fimObra: 'etapa termina em 40 dias',
      linha: [
        { t: 'ASO admissional · Apto', d: 'Liberado em D+1', a: '' }, { t: 'Treinamento NR-35', d: 'Certificado registrado', a: '' },
        { t: 'Telemedicina pelo app DIM+', d: 'Atendido no canteiro', a: '' }, { t: 'Audiometria periódica', d: 'Vence em 22 dias', a: 'at' }
      ],
      val: [{ t: 'ASO periódico', r: 190, tot: 365 }, { t: 'NR-35', r: 55, tot: 730 }, { t: 'Audiometria', r: 22, tot: 365 }, { t: 'NR-18 integração', r: 280, tot: 365 }]
    }
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CONTEXTO ═══ */
  cidades: [],
  parceiros: [
    { setor: 'Construção de edifícios · Grau de risco 3', nome: 'Estrela Engenharia', texto: 'Plano SST Flex com unidades em Cotia, Sorocaba e Piracicaba: uma gestão só para obras em cidades diferentes.' },
    { setor: 'Construção de edifícios · Grau de risco 3', nome: 'Vigent Construções', texto: 'Atendimento por obra, incluindo a do Aeroporto de Guarulhos, e avaliação psicossocial da NR-1.' }
  ],
  ato: {
    capa: 'Abertura', terceiros: 'Problema', altura: 'Problema', mobilizacao: 'Problema', poeira: 'Problema',
    acidente: 'Implicação', prazo: 'Implicação', virada: 'Necessidade', entregue: 'Recompensa', final: 'Próximo passo'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CAMERA ═══ */
  clinica: { pos: [-9, 0, -6], escala: 1.35 },
  cenas: {
    capa:        { pos: [34, 17, 46],   alvo: [13, 8, -4],   obra: 0.55, torre: 0, modo: 'neutro' },
    terceiros:   { pos: [22, 5, 26],    alvo: [10, 1.6, 10], obra: 0.55, torre: 0, modo: 'terceiros' },
    altura:      { pos: [24, 15, 14],   alvo: [14, 10, 0],   obra: 0.55, torre: 0, modo: 'altura' },
    mobilizacao: { pos: [-8, 6, 6],     alvo: [3, 1.6, -9],  obra: 0.55, torre: 0, modo: 'mobilizacao' },
    poeira:      { pos: [13, 4.2, 6.5], alvo: [6, 1.6, 0.5], obra: 0.55, torre: 0, modo: 'poeira' },
    acidente:    { pos: [27, 9, 17],    alvo: [15, 4, 0],    obra: 0.55, torre: 0, modo: 'acidente' },
    prazo:       { pos: [8, 7, 34],     alvo: [5, 5.5, 10],  obra: 0.55, torre: 0, modo: 'prazo' },
    virada:      { pos: [2, 9, 22],     alvo: [-9, 3, -3],   obra: 0.55, torre: 0, modo: 'virada' },
    entregue:    { pos: [30, 15, 44],   alvo: [12, 10, -4],   obra: 1,    torre: 7, modo: 'verde' },
    fundo:       { pos: [6, 34, 52],    alvo: [0, 2, 0],     obra: 0.55, torre: 0, modo: 'neutro' },
    final:       { pos: [40, 30, 52],   alvo: [4, 5, -2],    obra: 1,    torre: 7, modo: 'verde' }
  }
  /* ── FIM BLOCO ── */
};
