/* Roteiro: Construção · Infraestrutura e terraplenagem (obra viária, consórcios, frentes lineares).
   Só dados. {empresa}, {func}, {anos} e {cidade} viram os dados do cliente. */
window.ROTEIRO = {
  id: 'construcao-infraestrutura',
  icp: 'Construção',
  subtipo: 'Infraestrutura e terraplenagem',
  cenario: 'infraestrutura',
  empresaPadrao: { nome: 'Consórcio Exemplo', func: 260, anos: 15 },
  chaveLocal: 'dmg-infraestrutura-kanban',

  /* ═══ BLOCO: SLIDES ═══ */
  slides: [
    { tipo: 'capa', cena: 'capa',
      eyebrow: 'Proposta de saúde e segurança do trabalho',
      titulo: 'Doze quilômetros de obra.<br><span class="grad">Cada metro tem alguém nele.</span>',
      sub: 'A {empresa} abre estrada, drena, pavimenta e levanta ponte. A obra é longa, espalhada e medida todo mês. Esta é a história de um trecho.',
      stats: [{ n: '{anos}', l: 'Anos de {empresa}' }, { n: '{func}', l: 'Pessoas nas frentes' }, { n: 12, l: 'Quilômetros de trecho' }] },

    { tipo: 'etapas', cena: 'fundo', cap: '01', eyebrow: 'Situação',
      titulo: 'Uma obra, cinco frentes. <span class="grad">Nenhuma perto da outra.</span>',
      lede: 'Na obra linear, a equipe se espalha por quilômetros. Cada frente tem máquina, risco e encarregado próprios, e a base fica longe de quase todas.',
      etapas: [
        { n: 'Terraplenagem', p: 'KM 0 ao KM 12', quem: 'Escavadeira, motoniveladora, rolo e basculante o dia inteiro.', riscos: ['Máquina pesada', 'Atropelamento', 'Ruído'], troca: 'operadores e motoristas' },
        { n: 'Drenagem', p: 'valas e bueiros', quem: 'Escavação de vala e assentamento de tubos de concreto.', riscos: ['Soterramento', 'Içamento', 'Espaço confinado'], troca: 'equipe de drenagem' },
        { n: 'Pavimentação', p: 'base e asfalto', quem: 'Usina, vibroacabadora e rolo, com massa quente.', riscos: ['Calor', 'Fumos de asfalto', 'Trânsito'], troca: 'equipe de pavimento' },
        { n: 'Obras de arte', p: 'pontes e viadutos', quem: 'Forma, armação e concretagem sobre o rio.', riscos: ['Altura', 'Cimbramento', 'Água'], troca: 'empreiteira de estrutura' },
        { n: 'Sinalização', p: 'pista em operação', quem: 'Pintura, defensas e placas com o trânsito passando ao lado.', riscos: ['Atropelamento', 'Química', 'Noturno'], troca: 'turma noturna' }
      ],
      rodape: 'O encarregado está a quilômetros do RH. Exame vencido, treinamento faltando ou operador sem habilitação só aparecem quando a fiscalização ou o acidente chegam primeiro.' },

    { tipo: 'dor', cena: 'frentes', cap: '02', tag: 'Dor 1 de 4 · Frentes espalhadas',
      titulo: 'A frente está no KM 11. <span class="grad-red">A documentação ficou no KM 0.</span>',
      lede: 'Quem trabalha na ponte raramente passa pela base. Admissão no meio da semana, troca de turma, reforço de empreiteiro: tudo acontece longe de quem controla os documentos da {empresa}.',
      lista: [
        'Ninguém sabe, naquela manhã, quem está apto em cada frente.',
        'O exame vence durante a etapa e a pessoa continua trabalhando irregular.',
        'Empreiteiro coloca gente nova na frente sem passar pela conferência.'
      ] },

    { tipo: 'dor', cena: 'maquina', cap: '03', tag: 'Dor 2 de 4 · Máquina pesada',
      titulo: 'O caminhão dá ré. <span class="grad-red">Alguém está no ponto cego.</span>',
      lede: 'Escavadeira, basculante, motoniveladora e rolo dividem espaço com gente a pé. Operador sem exame adequado à função, sem treinamento e sem controle de jornada é o começo do acidente com máquina.',
      lista: [
        'O PCMSO precisa definir a bateria de exames do operador e do motorista, e o ASO precisa registrá-la.',
        'Operador com exame ou habilitação vencidos para a frente na inspeção.',
        'Atropelamento por máquina em manobra é acidente grave e muito investigado.'
      ] },

    { tipo: 'dor', cena: 'vala', cap: '04', tag: 'Dor 3 de 4 · Escavação',
      titulo: 'A vala tem dois metros. <span class="grad-red">O escoramento ficou para depois.</span>',
      lede: 'Drenagem é vala, tubo e gente lá dentro. Sem escoramento e sem análise de risco da escavação, o barranco cede em segundos. Na NR-18 a regra é clara, e a fiscalização sabe onde olhar.',
      lista: [
        'Soterramento é um dos acidentes mais graves da construção pesada.',
        'Escavação sem procedimento e sem treinamento registrado é embargo na hora.'
      ],
      custo: 'Frente embargada não entra na medição do mês. E a {empresa} recebe pelo que mede.' },

    { tipo: 'dor', cena: 'transito', cap: '05', tag: 'Dor 4 de 4 · Céu aberto e trânsito',
      titulo: 'A pista não fecha. <span class="grad-red">A obra acontece ao lado dos carros.</span>',
      lede: 'Sinaleiro, turma de pintura e equipe de pavimento trabalham com o trânsito passando a um metro. Sol, calor e fumos do asfalto entram no laudo, ou entram no processo.',
      lista: [
        'Calor e fumos de asfalto sem avaliação no LTCAT viram passivo de insalubridade.',
        'Trabalho noturno e jornada estendida precisam aparecer no PGR e no PCMSO.',
        'Atropelamento de sinaleiro é risco previsível, e por isso mesmo indefensável.'
      ] },

    { tipo: 'linha', cena: 'acidente', cap: '06', eyebrow: 'Implicação · O dia em que acontece',
      titulo: 'Um acidente não termina<br><span class="grad-red">no dia do acidente.</span>',
      lede: 'Ele abre uma cadeia de eventos que alcança a frente, o contrato, a folha e o jurídico, e volta meses depois.',
      pontos: [
        { q: 'Dia 0', b: 'Barranco cede na vala', s: 'A frente de drenagem para. O fiscal do contratante quer saber o que houve.', ini: true },
        { q: 'Dia 1', b: 'CAT e S-2210', s: 'Prazo curto. Erro de classificação conta contra a empresa.' },
        { q: 'Dia 16', b: 'Benefício no INSS', s: 'O evento passa a compor o cálculo do FAP.' },
        { q: 'Meses depois', b: 'Ação trabalhista', s: 'A defesa depende de ASO, PGR, procedimento de escavação, treinamento e EPI.' },
        { q: 'Ano + 2', b: 'FAP sobe', s: 'Alíquota maior todo mês, sobre toda a folha da {empresa}.' }
      ] },

    { tipo: 'calc', cena: 'fundo', cap: '07', eyebrow: 'Implicação · Na folha',
      titulo: 'Quanto o histórico de acidentes <span class="grad">custa na folha?</span>',
      lede: 'O RAT vem do CNAE e você não escolhe. O FAP vem do histórico de acidentes e afastamentos, e é o único fator que a gestão de SST consegue mover.',
      notaRat: 'Confirmar pelo CNAE preponderante da {empresa}.' },

    { tipo: 'prazo', cena: 'prazo', cap: '08', eyebrow: 'Implicação · Na medição',
      titulo: 'O contrato paga o que é medido. <span class="grad-red">Frente parada não mede.</span>',
      lede: 'Marque o que pode acontecer num mês de obra e veja quantos dias de serviço ficam fora da medição.' },

    { tipo: 'virada', cena: 'virada', cap: '09', eyebrow: 'E se fosse diferente?',
      titulo: 'E se cada frente começasse <span class="grad">já protegida?</span>',
      ledes: [
        'Operador com exame certo, vala com procedimento, laudo que mede o calor e o fumo, e cada frente sabendo quem está apto. Antes da máquina ligar, e não depois do primeiro problema.',
        'Siga o trabalhador. Ele vai passar pela DMG antes de voltar ao trecho, e o prédio da clínica vai subir com ele, <b>andar por andar</b>.'
      ],
      pill: 'Próximo: térreo da clínica' },

    { tipo: 'andar', andar: 0, num: 'Térreo',
      titulo: 'Mobilização <span class="grad">para frentes distantes.</span>',
      resolve: 'a frente no KM 11 e a documentação no KM 0',
      passos: [
        { b: 'ASO liberado em D+1', s: 'Exame feito hoje, ASO disponível no dia seguinte. Admissional em lote para a turma de cada frente, com agenda reservada.' },
        { b: 'Validade que cobre a etapa', s: 'Checamos se algum exame vence durante a frente e antecipamos o periódico antes de a turma seguir para o trecho.' },
        { b: 'Pasta da frente pronta', s: 'ASO, treinamentos e ficha de EPI organizados por frente, para o encarregado e para o fiscal do contratante.' }
      ],
      entrega: { k: 'D+1', s: 'do exame ao ASO na mão. A turma vai para o trecho no dia certo.' } },

    { tipo: 'andar', andar: 1, num: '1º andar',
      titulo: 'Apto <span class="grad">para a máquina e para a vala.</span>',
      resolve: 'operador sem exame e escavação sem procedimento',
      passos: [
        { b: 'Bateria definida por função no PCMSO', s: 'Operador de escavadeira, motorista de basculante, sinaleiro e armador da ponte não fazem o mesmo exame.' },
        { b: 'Aptidão para altura e espaço confinado', s: 'O ASO registra a aptidão para NR-35 e NR-33 de quem vai para a ponte ou para a galeria.' },
        { b: 'Validade controlada por trabalhador', s: 'Alerta antes do vencimento de exames e treinamentos, para ninguém ficar irregular no meio da frente.' }
      ],
      entrega: { k: 'ASO', s: 'que se sustenta numa perícia, e não um "apto" genérico.' } },

    { tipo: 'andar', andar: 2, num: '2º andar',
      titulo: 'Engenharia <span class="grad">em cada frente.</span>',
      resolve: 'calor, fumo, ruído e vala sem análise',
      passos: [
        { b: 'PGR da obra por frente', s: 'Terraplenagem, drenagem, pavimento, ponte e sinalização com riscos e medidas próprios.' },
        { b: 'LTCAT com medição em campo', s: 'Ruído das máquinas, calor, poeira e fumos de asfalto medidos por engenheiro de segurança.' },
        { b: 'Vistoria e plano de ação', s: 'Visita técnica nas frentes ativas, inclusive escavação e cimbramento, com prioridades e responsáveis.' }
      ],
      entrega: { k: '5', s: 'frentes avaliadas, um laudo que reflete o trecho real.' } },

    { tipo: 'andar', andar: 3, num: '3º andar',
      titulo: 'eSocial, FAP <span class="grad">e empreiteiros sob controle.</span>',
      resolve: 'empreiteiro sem documento e FAP subindo',
      passos: [
        { b: 'Eventos S-2210, S-2220 e S-2240 no prazo', s: 'CAT, monitoramento de saúde e condições ambientais enviados a partir do que foi feito, sem retrabalho.' },
        { b: 'Leitura anual do FAP', s: 'Conferimos os eventos que compõem o índice e apoiamos a contestação quando cabe.' },
        { b: 'Conferência de terceiros por frente', s: 'ASO, NRs e EPI de cada empreiteiro conferidos antes da entrada, num lugar só.' }
      ],
      entrega: { k: '100%', s: 'dos terceiros conferidos antes de entrar no trecho.' } },

    { tipo: 'andar', andar: 4, num: '4º andar',
      titulo: 'Gente que <span class="grad">volta para casa inteira.</span>',
      resolve: 'turno noturno, jornada longa e afastamento sem leitura',
      passos: [
        { b: 'Riscos psicossociais no PGR (NR-1)', s: 'Trabalho noturno, distância da base e pressão da medição entram no inventário com método reconhecido.' },
        { b: 'Treinamentos com registro', s: 'Integração, NR-18, NR-11, NR-35 e escavação com certificado e controle de reciclagem.' },
        { b: 'Leitura de afastamentos', s: 'Acompanhamos CIDs e retornos para agir antes que o padrão vire FAP.' }
      ],
      entrega: { k: 'NR-1', s: 'em dia com a exigência psicossocial.' } },

    { tipo: 'andar', andar: 5, num: '5º andar', extra: 'painel',
      titulo: 'Todas as frentes da {empresa} <span class="grad">numa tela só.</span>',
      resolve: 'encarregado longe do RH e ninguém sabe quem está apto',
      passos: [
        { b: 'O RH agenda direto na agenda da clínica', s: 'Escolhe a frente, a turma e o exame, e o horário fica reservado.' },
        { b: 'Ficha 360 de cada colaborador', s: 'ASOs, exames, treinamentos, atestados e CAT, com a validade contra a frente em que ele está.' },
        { b: 'Conformidade por frente e por empreiteira', s: 'Quem está apto hoje em cada quilômetro, e quem não pode entrar no trecho.' }
      ],
      fonte: 'O mesmo modelo de portal que a DMG montou para o Grupo Vigent. Dados da demonstração são ilustrativos.' },

    { tipo: 'andar', andar: 6, num: 'Cobertura', extra: 'parceria',
      titulo: 'Um benefício <span class="grad">que vai até o trecho.</span>',
      resolve: 'adoeceu longe da base e sem a quem recorrer',
      passos: [
        { b: 'Telemedicina pelo app DIM+', s: 'Consulta por vídeo de qualquer frente, para o colaborador e para a família.' },
        { b: 'Cartão de desconto em farmácias', s: 'Cartão Vidalink no app, com localizador de farmácias perto de onde a turma está.' },
        { b: 'Rede DIMEG e clube de descontos', s: 'Consultas e exames com desconto na rede própria, com mais de 100 mil atendimentos por ano, e clube de vantagens.' }
      ],
      parceria: 'Sete andares. Uma parceria.' },

    { tipo: 'entregue', cena: 'entregue', cap: '10', eyebrow: 'Recompensa · O trecho liberado',
      titulo: 'Mesmo trecho. Mesmas frentes. <span class="grad-ok">Liberado no prazo.</span>',
      lista: [
        'Cada turma foi para o trecho com ASO em D+1 e validade conferida.',
        'Operadores e motoristas com exame e treinamento certos para a função.',
        'A vala teve escoramento e procedimento, e o laudo mediu calor, fumo e ruído.',
        'O eSocial saiu no prazo e o FAP é acompanhado todo ano.',
        'O RH vê todas as frentes no painel, e a turma leva telemedicina e farmácia no bolso.'
      ],
      lede: 'O trecho é entregue e medido. E o nome da {empresa} aparece na placa da obra, não no processo.' },

    { tipo: 'prova', cena: 'fundo', cap: '11', eyebrow: 'Quem já constrói com a DMG',
      titulo: 'Construtoras e consórcios que <span class="grad">já operam com a gente.</span>' },

    { tipo: 'kanban', cena: 'fundo', titulo: 'Onde a {empresa} <span class="grad">está hoje?</span>' },
    { tipo: 'radar', cena: 'fundo' },

    { tipo: 'cta', cena: 'final', eyebrow: 'Próximo passo',
      titulo: 'O radar mostrou onde. <span class="grad">A vistoria mostra quanto.</span>',
      passos: [
        { b: 'Diagnóstico', s: 'Aprofundamos o radar com os documentos atuais.' },
        { b: 'Vistoria', s: 'Engenheiro nas frentes ativas do trecho.' },
        { b: 'Onboarding', s: 'Equipe, empreiteiros e eSocial migrados.' },
        { b: 'Próxima frente', s: 'Primeira turma já mobilizada com a DMG.' }
      ],
      botao: 'Agendar vistoria das frentes →',
      whatsapp: 'Quero agendar a vistoria das frentes de obra da {empresa} com a DMG' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: DIAGNOSTICO ═══ */
  eixos: [
    { id: 'mob',   nome: 'Mobilização',       acao: 'Admissional em lote por frente, ASO em D+1 e validade que cobre a etapa.' },
    { id: 'maq',   nome: 'Máquinas',          acao: 'Bateria por função para operador e motorista, com exame e treinamento controlados.' },
    { id: 'esc',   nome: 'Escavação e altura', acao: 'Procedimento de escavação, aptidão NR-35/NR-33 e treinamento registrado.' },
    { id: 'amb',   nome: 'Laudos das frentes', acao: 'PGR por frente e LTCAT com ruído, calor, poeira e fumos medidos em campo.' },
    { id: 'esoc',  nome: 'eSocial e FAP',     acao: 'S-2210/2220/2240 no prazo e leitura anual do FAP com contestação quando cabe.' },
    { id: 'terc',  nome: 'Terceiros',         acao: 'Conferência documental de cada empreiteiro antes de entrar no trecho.' }
  ],
  cartoes: [
    { e: 'mob',  t: 'Turma nova faz o ASO antes de ir para a frente' },
    { e: 'mob',  t: 'Validade dos exames é checada contra a duração da etapa' },
    { e: 'mob',  t: 'O encarregado sabe quem está apto em cada frente' },
    { e: 'maq',  t: 'Operador e motorista têm bateria própria no PCMSO' },
    { e: 'maq',  t: 'Treinamento de operação de máquina registrado' },
    { e: 'maq',  t: 'Manobra de ré tem procedimento e sinalização' },
    { e: 'esc',  t: 'Escavação de vala tem procedimento e escoramento' },
    { e: 'esc',  t: 'ASO registra aptidão para altura e espaço confinado' },
    { e: 'esc',  t: 'Treinamentos NR-18/NR-35 com controle de reciclagem' },
    { e: 'amb',  t: 'PGR separa os riscos de cada frente' },
    { e: 'amb',  t: 'LTCAT mede calor, ruído e fumos de asfalto' },
    { e: 'amb',  t: 'Audiometria consta no PCMSO de operadores' },
    { e: 'esoc', t: 'S-2240 atualizado a cada frente ou mudança de risco' },
    { e: 'esoc', t: 'S-2220 e S-2210 enviados no prazo' },
    { e: 'esoc', t: 'FAP conferido todo ano e contestado quando cabe' },
    { e: 'terc', t: 'Empreiteiro tem ASO e NRs conferidos antes de entrar' },
    { e: 'terc', t: 'Documentação de terceiros centralizada por frente' },
    { e: 'terc', t: 'Acidente com terceiro tem fluxo definido' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: IMPLICACAO ═══ */
  calc: { rat: 3, salario: 3400, fap: 1.5 },
  prazo: {
    dias: 30,
    padrao: { oper: true },
    eventos: [
      { id: 'oper', t: 'Operador parado sem exame ou treinamento', s: 'Máquina fica no pátio até regularizar', dias: 2 },
      { id: 'maq',  t: 'Fiscalização interdita a máquina', s: 'Adequação e pedido de liberação', dias: 3 },
      { id: 'vala', t: 'Embargo de escavação sem escoramento', s: 'Procedimento, escoramento e nova liberação', dias: 5 },
      { id: 'acid', t: 'Acidente com afastamento', s: 'Investigação, CAT e reposição de equipe', dias: 4 }
    ],
    legenda: ['Frente em serviço', 'Parada por SST', 'Fechamento da medição', 'Fora da medição'],
    rotuloEntrega: 'Serviço completo em',
    msgAtraso: 'A frente chega ao fechamento com {n} dia{s} de serviço fora da medição.',
    msgAtrasoResto: 'É faturamento que não entra no mês, e prazo que aperta o próximo.',
    msgOk: 'Medição cheia no dia {dias}.',
    msgOkResto: 'É este o calendário que a gestão de SST protege.',
    fonte: 'Cenário ilustrativo de um mês de obra, com durações de referência para cada tipo de ocorrência.'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: SOLUCAO ═══ */
  beneficios: [
    { andar: 'TÉRREO · MOBILIZAÇÃO', itens: ['ASO liberado em D+1', 'Validade que cobre a etapa', 'Pasta pronta por frente'] },
    { andar: '1º ANDAR · EXAMES', itens: ['Bateria do operador no PCMSO', 'Aptidão NR-35 e NR-33 no ASO', 'Alerta antes de vencer'] },
    { andar: '2º ANDAR · ENGENHARIA', itens: ['PGR por frente da obra', 'LTCAT com calor e fumos', 'Vistoria de escavação'] },
    { andar: '3º ANDAR · eSOCIAL E FAP', itens: ['S-2210, S-2220 e S-2240 no prazo', 'FAP lido e contestado', 'Empreiteiros conferidos'] },
    { andar: '4º ANDAR · PESSOAS E NR-1', itens: ['Psicossocial no PGR (NR-1)', 'Treinamentos com certificado', 'Afastamentos acompanhados'] },
    { andar: '5º ANDAR · PAINEL EXCLUSIVO', itens: ['RH agenda direto na clínica', 'Ficha 360 de cada colaborador', 'Conformidade por frente'] },
    { andar: 'COBERTURA · PARCERIA', parceria: true, rodape: 'parceiros na saúde de quem constrói · benefício DIM+ para a equipe' }
  ],

  painel: {
    abas: [
      { id: 'geral', ic: '◧', t: 'Visão geral' }, { id: 'agenda', ic: '◷', t: 'Agenda' },
      { id: 'obras', ic: '⌂', t: 'Frentes', badge: 1 }, { id: 'colab', ic: '◉', t: 'Colaborador 360' },
      { id: 'terc', ic: '⇄', t: 'Empreiteiros', badge: 2 }
    ],
    rotuloObras: 'Frentes do trecho', colunaObra: 'Frente', filtros: ['Todas as frentes', 'Drenagem', 'Outubro'],
    kpis: [
      { t: 'Ativos', v: '{func}', s: 'em 5 frentes' }, { t: 'ASOs a vencer', v: '17', s: 'próximos 30 dias', c: 'warn' },
      { t: 'ASO em D+1', v: '97%', s: 'últimos 90 dias', c: 'green' }, { t: 'Absenteísmo', v: '2,4%', s: 'mês atual' },
      { t: 'Operadores aptos', v: '100%', s: '34 operadores', c: 'green' }, { t: 'Empreiteiros conformes', v: '89%', s: '4 empreiteiras', c: 'warn' }
    ],
    preview: [{ v: '{func}', l: 'ativos' }, { v: '17', l: 'a vencer', c: 'warn' }, { v: '100%', l: 'operadores aptos', c: 'green' }],
    meses: [['Mai', 55], ['Jun', 48], ['Jul', 61], ['Ago', 72], ['Set', 66], ['Out', 84]],
    alertas: [
      { c: 'r', t: 'Drenagem KM 4: 3 do empreiteiro sem treinamento de escavação', q: 'hoje' },
      { c: '', t: 'Operador da escavadeira 02: exame vence em 6 dias', q: 'agendar' },
      { c: '', t: 'Pavimentação: avaliação de calor pendente no LTCAT', q: 'vistoria' },
      { c: 'g', t: 'Turma da ponte: 9 admissionais liberados em D+1', q: 'ontem' }
    ],
    obras: [
      { n: 'Terraplenagem', c: 'KM 6 ao KM 12', e: 72, conf: 0.96, st: 'Em serviço', tag: 'ok' },
      { n: 'Drenagem', c: 'KM 2 ao KM 5', e: 48, conf: 0.79, st: 'Atenção', tag: 'r' },
      { n: 'Pavimentação', c: 'KM 0 ao KM 4', e: 56, conf: 0.92, st: 'Em serviço', tag: 'ok' },
      { n: 'Ponte sobre o rio', c: 'KM 11', e: 44, conf: 0.94, st: 'Concretagem', tag: 'ok' },
      { n: 'Sinalização', c: 'Trecho liberado', e: 40, conf: 0.9, st: 'Noturno', tag: 'n' }
    ],
    terceiros: [
      { n: 'Drenagem Alfa', o: 'Drenagem', p: 16, aso: 16, nr: 13, epi: 16 },
      { n: 'Estruturas Beta', o: 'Ponte sobre o rio', p: 22, aso: 22, nr: 22, epi: 21 },
      { n: 'Sinaliza Gama', o: 'Sinalização', p: 12, aso: 11, nr: 12, epi: 12 },
      { n: 'Transportes Delta', o: 'Terraplenagem', p: 18, aso: 18, nr: 18, epi: 18 }
    ],
    agenda: [
      { d: 0, h: 0, k: 'adm', t: 'Admissional · 9', s: 'Turma da ponte' }, { d: 0, h: 2, k: 'per', t: 'Periódico · 6', s: 'Operadores' },
      { d: 1, h: 1, k: 'adm', t: 'Admissional · 5', s: 'Drenagem' }, { d: 2, h: 0, k: 'per', t: 'Audiometria · 11', s: 'Terraplenagem' },
      { d: 2, h: 3, k: 'dem', t: 'Demissional · 3', s: 'Fim da drenagem KM 2' }, { d: 3, h: 1, k: '', t: 'Retorno ao trabalho', s: 'Pavimentação' },
      { d: 4, h: 0, k: 'per', t: 'NR-35 · 8', s: 'Ponte sobre o rio' }, { d: 4, h: 2, k: 'adm', t: 'Admissional · 6', s: 'Sinalização noturna' }
    ],
    colab: {
      ini: 'AS', n: 'Antônio S.', f: 'Operador de escavadeira', o: 'Terraplenagem · KM 8',
      chips: ['Apto operação', 'Treinamento NR-11', 'DIM+ ativo'], fimObra: 'frente termina em 45 dias',
      linha: [
        { t: 'ASO admissional · Apto', d: 'Liberado em D+1', a: '' }, { t: 'Treinamento de operação', d: 'Certificado registrado', a: '' },
        { t: 'Telemedicina pelo app DIM+', d: 'Atendido no trecho', a: '' }, { t: 'Audiometria periódica', d: 'Vence em 15 dias', a: 'at' }
      ],
      val: [{ t: 'ASO periódico', r: 160, tot: 365 }, { t: 'Operação de máquina', r: 300, tot: 730 }, { t: 'Audiometria', r: 15, tot: 365 }, { t: 'NR-18 integração', r: 260, tot: 365 }]
    }
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CONTEXTO ═══ */
  cidades: [],
  parceiros: [
    { setor: 'Grupo Vigent · consórcios viários', nome: 'Vigent Construções', texto: 'Atendimento por obra e por consórcio, incluindo frentes urbanas e a obra do Aeroporto de Guarulhos, com avaliação psicossocial da NR-1.' },
    { setor: 'Construção de edifícios · Grau de risco 3', nome: 'Estrela Engenharia', texto: 'Plano SST Flex com unidades em Cotia, Sorocaba e Piracicaba: uma gestão só para obras em cidades diferentes.' }
  ],
  ato: {
    capa: 'Abertura', frentes: 'Problema', maquina: 'Problema', vala: 'Problema', transito: 'Problema',
    acidente: 'Implicação', prazo: 'Implicação', virada: 'Necessidade', entregue: 'Recompensa', final: 'Próximo passo'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CAMERA ═══ */
  clinica: { pos: [-9, 0, -6], escala: 1.35 },
  cenas: {
    capa:     { pos: [40, 22, 40],  alvo: [12, 2, 0],    obra: 0.55, torre: 0, modo: 'neutro' },
    frentes:  { pos: [22, 14, 22],  alvo: [34, 3, 4],    obra: 0.55, torre: 0, modo: 'frentes' },
    maquina:  { pos: [-7, 4.5, 15],  alvo: [1.5, 1.3, 5.2], obra: 0.55, torre: 0, modo: 'maquina' },
    vala:     { pos: [-2, 8, -1],   alvo: [4, 0.4, -9],  obra: 0.55, torre: 0, modo: 'vala' },
    transito: { pos: [7, 4.5, 22],   alvo: [-1, 1.3, 10.4], obra: 0.55, torre: 0, modo: 'transito' },
    acidente: { pos: [-1, 8.5, -0.5], alvo: [4.5, 0.3, -9],  obra: 0.55, torre: 0, modo: 'acidente' },
    prazo:    { pos: [-12, 7, 26],  alvo: [-15, 5.5, 1.6], obra: 0.55, torre: 0, modo: 'prazo' },
    virada:   { pos: [2, 9, 22],    alvo: [-9, 3, -3],   obra: 0.55, torre: 0, modo: 'virada' },
    entregue: { pos: [4, 13, 28],   alvo: [19, 1, 4],    obra: 1,    torre: 7, modo: 'verde' },
    fundo:    { pos: [6, 34, 52],   alvo: [0, 2, 0],     obra: 0.55, torre: 0, modo: 'neutro' },
    final:    { pos: [40, 30, 52],  alvo: [4, 3, -2],    obra: 1,    torre: 7, modo: 'verde' }
  }
  /* ── FIM BLOCO ── */
};
