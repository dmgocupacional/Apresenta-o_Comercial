/* Roteiro exclusivo: G4 Construtora & Incorporadora (São Gonçalo/RJ) — incorporação Minha Casa Minha Vida
   em alvenaria estrutural. Fonte: site g4incorporadora.com.br (out/2026) e dados da Receita.
   Só dados. {empresa}, {func}, {anos} e {cidade} vêm do link; os fatos da G4 estão no texto. */
window.ROTEIRO = {
  id: 'exclusivo-g4',
  icp: 'Construção',
  subtipo: 'Incorporação econômica · Minha Casa Minha Vida',
  cenario: 'mcmv',
  empresaPadrao: { nome: 'G4 Construtora', func: 128, anos: 13 },
  chaveLocal: 'dmg-g4-kanban',
  marca: { cor: '#FFCD00', escuro: '#020B23' },
  obraNome: 'Residencial Topázio',
  programa: 'Minha Casa Minha Vida',

  /* ═══ BLOCO: SLIDES ═══ */
  slides: [
    { tipo: 'capa', cena: 'capa',
      eyebrow: 'Proposta exclusiva de saúde e segurança do trabalho',
      titulo: 'Colaboradores em primeiro lugar.<br><span class="grad">É o primeiro valor da {empresa}.</span>',
      sub: 'Mais de 400 famílias já moram em um imóvel da {empresa}. Cada chave entregue passou pela mão de pedreiros, armadores, eletricistas e empreiteiros. Esta é a história do Residencial Topázio.',
      stats: [{ n: '{anos}', l: 'Anos de {empresa}' }, { n: '{func}', l: 'Profissionais' }, { n: 400, l: 'Unidades entregues' }] },

    { tipo: 'etapas', cena: 'fundo', cap: '01', eyebrow: 'Situação',
      titulo: 'Construir tão rápido quanto vende. <span class="grad">Cada etapa traz uma equipe nova.</span>',
      lede: 'No Minha Casa Minha Vida, o prazo é curto e a margem também. O Topázio já tem fundação concluída e a construção em andamento, e cada fase troca de gente: quem fez o radier não fica para o acabamento.',
      etapas: [
        { n: 'Fundação', p: 'radier · 100% no Topázio', quem: 'Terraplenagem, forma e concretagem do radier de cada bloco.', riscos: ['Máquina', 'Escavação', 'Concreto'], troca: 'empreiteira de fundação' },
        { n: 'Alvenaria estrutural', p: 'em andamento', quem: 'Bloco de concreto assentado andar a andar, com andaime, guincho e corte de bloco no canteiro.', riscos: ['Altura', 'Sílica', 'Guincho'], troca: 'equipes de alvenaria' },
        { n: 'Lajes', p: 'a cada pavimento', quem: 'Forma, armação e concretagem da laje sobre a alvenaria.', riscos: ['Periferia de laje', 'Içamento', 'Ritmo'], troca: 'equipe de estrutura' },
        { n: 'Instalações', p: 'elétrica e hidráulica', quem: 'Quase sempre por empreiteiro cadastrado, entrando e saindo da obra.', riscos: ['Eletricidade', 'Terceiros', 'Altura'], troca: 'empreiteiros' },
        { n: 'Acabamento', p: 'pico de equipe', quem: 'Revestimento, pintura e esquadrias no aperto da entrega para a Caixa.', riscos: ['Química', 'Ritmo', 'Pico de equipe'], troca: 'pico de contratações' }
      ],
      rodape: 'A {empresa} tem uma página aberta para cadastrar empreiteiros de alvenaria, elétrica, hidráulica, pintura e acabamento. Cada empreiteiro novo é uma leva de admissionais, treinamentos e fichas de EPI que precisam estar em dia no dia em que ele entra.' },

    { tipo: 'dor', cena: 'terceiros', cap: '02', tag: 'Dor 1 de 4 · Empreiteiros',
      titulo: 'O empreiteiro se cadastra no site. <span class="grad-red">O risco não fica no cadastro.</span>',
      lede: 'A {empresa} cresce com parceiros de obra, e isso é ótimo para o prazo. Mas, se alguém de um empreiteiro entra no canteiro sem ASO, sem treinamento ou sem EPI, quem responde é a construtora que contratou.',
      lista: [
        'Documentação de cada empreiteiro em e-mail, pasta e WhatsApp: ninguém sabe quem está apto naquele dia.',
        'A fiscalização autua a obra, e não o empreiteiro que trouxe a pessoa.',
        'Acidente com terceiro vira processo contra quem contratou.'
      ] },

    { tipo: 'dor', cena: 'mobilizacao', cap: '03', tag: 'Dor 2 de 4 · Velocidade',
      titulo: 'Construir tão rápido quanto vende <span class="grad-red">exige gente apta tão rápido quanto contrata.</span>',
      lede: 'Obra rápida é obra com entrada e saída constante de gente. Cada admissão precisa de ASO antes do primeiro dia, e cada desligamento, de demissional, PPP e evento no eSocial. No pico do acabamento, isso vira dezenas de pessoas por semana.',
      lista: [
        'Turma esperando exame no vestiário é diária paga sem produção.',
        'Demissional esquecido vira passivo e evento em atraso no eSocial.'
      ],
      custo: 'No Minha Casa Minha Vida, cada semana parada pesa no cronograma da Caixa e na promessa feita às famílias.' },

    { tipo: 'dor', cena: 'altura', cap: '04', tag: 'Dor 3 de 4 · Alvenaria em altura',
      titulo: 'A parede sobe bloco a bloco. <span class="grad-red">O pedreiro sobe junto com ela.</span>',
      lede: 'Na alvenaria estrutural, o pedreiro trabalha na periferia da laje e no andaime, com o guincho subindo blocos pelos fundos. É trabalho em altura (NR-35) e canteiro de construção (NR-18) todos os dias, em todos os blocos.',
      lista: [
        'Queda de altura está entre as principais causas de acidente grave na construção civil.',
        '"Apto" genérico, sem os exames que o PCMSO define para altura, não sustenta a empresa numa perícia.',
        'Treinamento de NR-35 vencido tira o pedreiro da frente na hora da inspeção.'
      ] },

    { tipo: 'dor', cena: 'poeira', cap: '05', tag: 'Dor 4 de 4 · Poeira e ruído',
      titulo: 'O corte do bloco <span class="grad-red">fica no pulmão de alguém.</span>',
      lede: 'Alvenaria estrutural é corte de bloco o dia inteiro. A poeira com sílica e o ruído da cortadora precisam estar medidos no laudo do Topázio, e não copiados de outra obra.',
      lista: [
        'LTCAT sem medição em campo vira passivo de insalubridade e aposentadoria especial.',
        'A ISO 9001 e o PBQP-H que a {empresa} conquistou pedem processo documentado, e o SST faz parte dessa documentação.',
        'Audiometria e espirometria fora do PCMSO deixam o trabalhador sem acompanhamento.'
      ] },

    { tipo: 'linha', cena: 'acidente', cap: '06', eyebrow: 'Implicação · O dia em que acontece',
      titulo: 'Um acidente não termina<br><span class="grad-red">no dia do acidente.</span>',
      lede: 'Ele abre uma cadeia de eventos que alcança a obra, as famílias que compraram, a folha e o jurídico, e volta meses depois.',
      pontos: [
        { q: 'Dia 0', b: 'Queda do andaime no Bloco B', s: 'A frente de alvenaria para. A fiscalização pode embargar o bloco.', ini: true },
        { q: 'Dia 1', b: 'CAT e S-2210', s: 'Prazo curto. Erro de classificação conta contra a empresa.' },
        { q: 'Dia 16', b: 'Benefício no INSS', s: 'O evento passa a compor o cálculo do FAP.' },
        { q: 'Meses depois', b: 'Ação trabalhista', s: 'A defesa depende de ASO, PGR, treinamento e EPI, inclusive do empreiteiro.' },
        { q: 'Ano + 2', b: 'FAP sobe', s: 'Alíquota maior todo mês, sobre toda a folha da {empresa}.' }
      ] },

    { tipo: 'calc', cena: 'fundo', cap: '07', eyebrow: 'Implicação · Na folha',
      titulo: 'Quanto o histórico de acidentes <span class="grad">custa na folha?</span>',
      lede: 'O RAT vem do CNAE e você não escolhe. O FAP vem do histórico de acidentes e afastamentos, e é o único fator que a gestão de SST consegue mover.',
      notaRat: 'Confirmar pelo CNAE preponderante da {empresa} (incorporação e construção de edifícios).' },

    { tipo: 'prazo', cena: 'prazo', cap: '08', eyebrow: 'Implicação · Na entrega das chaves',
      titulo: 'A família tem uma data. <span class="grad-red">O atraso tem nome.</span>',
      lede: 'Marque o que pode acontecer no último mês antes da entrega do Topázio e veja onde as chaves vão parar.' },

    { tipo: 'virada', cena: 'virada', cap: '09', eyebrow: 'E se fosse diferente?',
      titulo: '"Colaboradores em primeiro lugar." <span class="grad">A {empresa} já escreveu. A DMG ajuda a provar.</span>',
      ledes: [
        'Empreiteiro conferido antes de entrar, pedreiro com exame certo para altura, laudo do Topázio que se sustenta e evento no prazo. Antes de cada etapa começar, e não depois do primeiro problema.',
        'Siga o trabalhador. Ele vai passar pela DMG antes de subir no andaime, e o prédio da clínica vai subir com ele, <b>andar por andar</b>.'
      ],
      pill: 'Próximo: térreo da clínica' },

    { tipo: 'andar', andar: 0, num: 'Térreo',
      titulo: 'Mobilização <span class="grad">no ritmo das vendas.</span>',
      resolve: 'construir tão rápido quanto vende',
      passos: [
        { b: 'Atendimento em São Gonçalo', s: 'Exames na região da obra, pela rede credenciada da DMG, com o mesmo protocolo, o mesmo painel e o prazo de ASO definido em contrato.' },
        { b: 'Demissional e PPP sem esquecimento', s: 'Quem sai do canteiro sai com exame, PPP e evento no eSocial, mesmo no pico de rotatividade.' },
        { b: 'Pasta da turma por etapa', s: 'ASO, treinamentos e ficha de EPI organizados por empreendimento e por fase, prontos para a portaria.' }
      ],
      entrega: { k: 'RJ', s: 'atendido perto da obra, com o padrão DMG e prazo de ASO em contrato.' } },

    { tipo: 'andar', andar: 1, num: '1º andar',
      titulo: 'Apto <span class="grad">para o andaime e para a laje.</span>',
      resolve: 'pedreiro em altura e guincho no fundo do bloco',
      passos: [
        { b: 'Bateria definida por função no PCMSO', s: 'Pedreiro de alvenaria estrutural, armador, guincheiro e eletricista não fazem o mesmo exame.' },
        { b: 'Aptidão para altura no ASO', s: 'O ASO registra a aptidão para NR-35, com avaliação clínica e os complementares que o médico define.' },
        { b: 'Validade controlada por trabalhador', s: 'Alerta antes do vencimento de exames e treinamentos, para ninguém ficar irregular no meio da alvenaria.' }
      ],
      entrega: { k: 'ASO', s: 'que se sustenta numa perícia, e não um "apto" genérico.' } },

    { tipo: 'andar', andar: 2, num: '2º andar',
      titulo: 'Engenharia <span class="grad">em cada empreendimento.</span>',
      resolve: 'poeira de corte de bloco e laudo copiado de outra obra',
      passos: [
        { b: 'PGR por empreendimento', s: 'O inventário de riscos acompanha a fase de cada obra, do radier ao acabamento.' },
        { b: 'LTCAT com medição em campo', s: 'Ruído da cortadora, poeira com sílica e agentes químicos do acabamento medidos por engenheiro de segurança.' },
        { b: 'Documentação pronta para auditoria', s: 'Laudos e registros organizados para conversar com a ISO 9001 e o PBQP-H, e com a ISO 14001 que vem aí.' }
      ],
      entrega: { k: '1', s: 'laudo por empreendimento, assinado por quem esteve no canteiro.' } },

    { tipo: 'andar', andar: 3, num: '3º andar',
      titulo: 'eSocial, FAP <span class="grad">e empreiteiros sob controle.</span>',
      resolve: 'empreiteiro sem documento e FAP subindo',
      passos: [
        { b: 'Eventos S-2210, S-2220 e S-2240 no prazo', s: 'CAT, monitoramento de saúde e condições ambientais enviados a partir do que foi feito, sem retrabalho.' },
        { b: 'Leitura anual do FAP', s: 'Conferimos os eventos que compõem o índice e apoiamos a contestação quando cabe.' },
        { b: 'Conferência dos empreiteiros cadastrados', s: 'ASO, NRs e EPI de cada terceiro conferidos antes da entrada, por empreendimento, num lugar só.' }
      ],
      entrega: { k: '100%', s: 'dos empreiteiros conferidos antes de passar pela portaria.' } },

    { tipo: 'andar', andar: 4, num: '4º andar',
      titulo: 'Gente que <span class="grad">volta para casa inteira.</span>',
      resolve: 'pressão de prazo e afastamento sem leitura',
      passos: [
        { b: 'Riscos psicossociais no PGR (NR-1)', s: 'Ritmo de entrega, jornada estendida e pressão do acabamento entram no inventário com método reconhecido.' },
        { b: 'Treinamentos com registro', s: 'Integração, NR-18, NR-35 e operação de guincho com certificado e controle de reciclagem.' },
        { b: 'Leitura de afastamentos', s: 'Acompanhamos CIDs e retornos para agir antes que o padrão vire FAP.' }
      ],
      entrega: { k: 'NR-1', s: 'em dia com a exigência psicossocial.' } },

    { tipo: 'andar', andar: 5, num: '5º andar', extra: 'painel',
      titulo: 'Todos os empreendimentos da {empresa} <span class="grad">numa tela só.</span>',
      resolve: 'documento de empreiteiro em e-mail, planilha e WhatsApp',
      passos: [
        { b: 'O RH agenda direto na agenda da clínica', s: 'Escolhe o empreendimento, a etapa e o colaborador, e o horário fica reservado.' },
        { b: 'Ficha 360 de cada colaborador', s: 'ASOs, exames, treinamentos, atestados e CAT, com a validade contra a obra em que ele está.' },
        { b: 'Conformidade por obra e por empreiteiro', s: 'Quem está apto hoje no Topázio, e quem não pode passar da portaria.' }
      ],
      fonte: 'O mesmo modelo de portal que a DMG montou para o Grupo Vigent. Dados da demonstração são ilustrativos.' },

    { tipo: 'andar', andar: 6, num: 'Cobertura', extra: 'parceria',
      titulo: 'Um benefício <span class="grad">para quem constrói.</span>',
      resolve: 'adoeceu e não tem a quem recorrer',
      passos: [
        { b: 'Telemedicina pelo app DIM+', s: 'Consulta por vídeo para o colaborador e para a família, de qualquer lugar, sem sair do canteiro.' },
        { b: 'Cartão de desconto em farmácias', s: 'Cartão Vidalink no app, com localizador de farmácias perto de casa ou da obra.' },
        { b: 'Clube de vantagens', s: 'Descontos e benefícios para a equipe e a família, no mesmo app.' }
      ],
      parceria: 'Sete andares. Uma parceria.' },

    { tipo: 'entregue', cena: 'entregue', cap: '10', eyebrow: 'Recompensa · A entrega das chaves',
      titulo: 'Mesmo condomínio. Mesmas etapas. <span class="grad-ok">Chaves entregues no prazo.</span>',
      lista: [
        'Cada turma entrou no Topázio com exame em dia e validade conferida.',
        'Os empreiteiros cadastrados passaram pela portaria com documentação completa.',
        'O empreendimento tem PGR e LTCAT com a poeira e o ruído medidos no canteiro.',
        'O eSocial saiu no prazo, o FAP é acompanhado e a auditoria da ISO encontra tudo no lugar.',
        'O RH vê todas as obras no painel, e a equipe leva telemedicina e farmácia no bolso.'
      ],
      lede: 'As famílias recebem as chaves. E o nome da {empresa} aparece no letreiro do condomínio, não no processo.' },

    { tipo: 'prova', cena: 'fundo', cap: '11', eyebrow: 'Quem já constrói com a DMG',
      titulo: 'Construtoras que <span class="grad">já operam com a gente.</span>' },

    { tipo: 'kanban', cena: 'fundo', titulo: 'Onde a {empresa} <span class="grad">está hoje?</span>' },
    { tipo: 'radar', cena: 'fundo' },

    { tipo: 'cta', cena: 'final', eyebrow: 'Próximo passo',
      titulo: 'O radar mostrou onde. <span class="grad">A vistoria do Topázio mostra quanto.</span>',
      passos: [
        { b: 'Diagnóstico', s: 'Aprofundamos o radar com os documentos atuais.' },
        { b: 'Vistoria', s: 'Engenheiro no Residencial Topázio.' },
        { b: 'Onboarding', s: 'Equipe, empreiteiros e eSocial migrados.' },
        { b: 'Próxima etapa', s: 'Primeira turma já mobilizada com a DMG.' }
      ],
      botao: 'Agendar vistoria do Topázio →',
      whatsapp: 'Quero agendar a vistoria do Residencial Topázio da {empresa} com a DMG' }
  ],
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: DIAGNOSTICO ═══ */
  eixos: [
    { id: 'mob',   nome: 'Mobilização',        acao: 'Admissional em lote por etapa, ASO no prazo do contrato e demissional com PPP sem esquecimento.' },
    { id: 'terc',  nome: 'Empreiteiros',       acao: 'Conferência documental de cada empreiteiro cadastrado antes da portaria, por empreendimento.' },
    { id: 'alt',   nome: 'Altura e guincho',   acao: 'Bateria por função no PCMSO e aptidão NR-35 com controle de validade.' },
    { id: 'amb',   nome: 'Laudos da obra',     acao: 'PGR por empreendimento e LTCAT com medição de ruído e poeira com sílica em campo.' },
    { id: 'esoc',  nome: 'eSocial e FAP',      acao: 'S-2210/2220/2240 no prazo e leitura anual do FAP com contestação quando cabe.' },
    { id: 'psico', nome: 'NR-1 psicossocial',  acao: 'Inventário psicossocial considerando ritmo de entrega e jornada.' }
  ],
  cartoes: [
    { e: 'mob',   t: 'Turma nova faz o ASO antes do primeiro dia de obra' },
    { e: 'mob',   t: 'Demissional e PPP saem para todo desligamento' },
    { e: 'mob',   t: 'Conseguimos admitir uma turma inteira em poucos dias' },
    { e: 'terc',  t: 'ASO e NRs de empreiteiro conferidos na portaria' },
    { e: 'terc',  t: 'Documentação de empreiteiros centralizada por obra' },
    { e: 'terc',  t: 'Acidente com terceiro tem fluxo definido' },
    { e: 'alt',   t: 'ASO registra aptidão para altura (NR-35)' },
    { e: 'alt',   t: 'Guincheiro com exame e treinamento em dia' },
    { e: 'alt',   t: 'Treinamentos NR-18/NR-35 com controle de reciclagem' },
    { e: 'amb',   t: 'Cada empreendimento tem PGR próprio' },
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
  calc: { rat: 3, salario: 2800, fap: 1.5 },
  prazo: {
    dias: 30,
    padrao: { term: true },
    eventos: [
      { id: 'term', t: 'Empreiteiro barrado sem ASO na portaria', s: 'Remarcação dos exames e reposição da equipe', dias: 2 },
      { id: 'nr35', t: 'Pedreiros sem NR-35 retirados do andaime', s: 'Reciclagem e reprogramação da alvenaria', dias: 3 },
      { id: 'emba', t: 'Embargo de bloco por falta de proteção', s: 'Adequação da periferia e pedido de liberação', dias: 5 },
      { id: 'acid', t: 'Acidente com afastamento', s: 'Investigação, CAT e reposição de equipe', dias: 4 }
    ],
    legenda: ['Obra', 'Parada por SST', 'Entrega das chaves', 'Depois da data'],
    rotuloEntrega: 'Entrega das chaves',
    msgAtraso: 'As chaves saem {n} dia{s} depois da data prometida às famílias.',
    msgAtrasoResto: 'Ou o acabamento vira hora extra, ou a família recebe a notícia do atraso.',
    msgOk: 'Chaves no dia {dias}.',
    msgOkResto: 'É este o calendário que a gestão de SST protege.',
    fonte: 'Cenário ilustrativo do último mês de obra, com durações de referência para cada tipo de ocorrência.'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: SOLUCAO ═══ */
  beneficios: [
    { andar: 'TÉRREO · MOBILIZAÇÃO', itens: ['Atendimento em São Gonçalo', 'Demissional e PPP sem esquecer', 'Pasta da turma por etapa'] },
    { andar: '1º ANDAR · EXAMES', itens: ['Bateria por função no PCMSO', 'Aptidão NR-35 no ASO', 'Guincheiro em dia'] },
    { andar: '2º ANDAR · ENGENHARIA', itens: ['PGR de cada empreendimento', 'LTCAT com poeira e ruído medidos', 'Pronto para auditoria ISO'] },
    { andar: '3º ANDAR · eSOCIAL E FAP', itens: ['S-2210, S-2220 e S-2240 no prazo', 'FAP lido e contestado', 'Empreiteiros conferidos'] },
    { andar: '4º ANDAR · PESSOAS E NR-1', itens: ['Psicossocial no PGR (NR-1)', 'Treinamentos com certificado', 'Afastamentos acompanhados'] },
    { andar: '5º ANDAR · PAINEL EXCLUSIVO', itens: ['RH agenda direto na clínica', 'Ficha 360 de cada colaborador', 'Conformidade por obra'] },
    { andar: 'COBERTURA · PARCERIA', parceria: true, rodape: 'colaboradores em primeiro lugar · benefício DIM+ para a equipe' }
  ],

  painel: {
    abas: [
      { id: 'geral', ic: '◧', t: 'Visão geral' }, { id: 'agenda', ic: '◷', t: 'Agenda' },
      { id: 'obras', ic: '⌂', t: 'Empreendimentos', badge: 1 }, { id: 'colab', ic: '◉', t: 'Colaborador 360' },
      { id: 'terc', ic: '⇄', t: 'Empreiteiros', badge: 2 }
    ],
    rotuloObras: 'Empreendimentos e etapas', colunaObra: 'Empreendimento', filtros: ['Todos', 'Alvenaria', 'Outubro'],
    kpis: [
      { t: 'Ativos', v: '{func}', s: 'em 3 frentes' }, { t: 'ASOs a vencer', v: '9', s: 'próximos 30 dias', c: 'warn' },
      { t: 'ASO no prazo', v: '97%', s: 'últimos 90 dias', c: 'green' }, { t: 'Absenteísmo', v: '2,8%', s: 'mês atual' },
      { t: 'Turnover', v: '6,1%', s: 'média mensal' }, { t: 'Empreiteiros conformes', v: '89%', s: '5 empreiteiros', c: 'green' }
    ],
    preview: [{ v: '{func}', l: 'ativos' }, { v: '9', l: 'a vencer', c: 'warn' }, { v: '89%', l: 'conformes', c: 'green' }],
    meses: [['Mai', 31], ['Jun', 38], ['Jul', 29], ['Ago', 44], ['Set', 41], ['Out', 52]],
    alertas: [
      { c: 'r', t: 'Topázio · Bloco B: 3 pedreiros de empreiteiro sem NR-35', q: 'hoje' },
      { c: '', t: 'Guincheiro do Topázio: exame vence em 8 dias', q: 'agendar' },
      { c: '', t: 'Acabamento do Bloco A: 10 admissionais na semana', q: 'reservado' },
      { c: 'g', t: 'Alvenaria Bloco C: 9 ASOs liberados no prazo', q: 'ontem' }
    ],
    obras: [
      { n: 'Residencial Topázio · Bloco A', c: 'Mutuá, São Gonçalo/RJ · Acabamento', e: 34, conf: 0.96, st: 'Acabamento', tag: 'ok' },
      { n: 'Residencial Topázio · Bloco B', c: 'Mutuá, São Gonçalo/RJ · Alvenaria', e: 41, conf: 0.83, st: 'Atenção', tag: 'r' },
      { n: 'Residencial Topázio · Blocos C e D', c: 'Mutuá, São Gonçalo/RJ · Fundação e alvenaria', e: 33, conf: 0.92, st: 'Alvenaria', tag: 'ok' },
      { n: 'Residencial Mutondo', c: 'Mutondo, São Gonçalo/RJ · Pós-obra', e: 6, conf: 1, st: 'Entregue', tag: 'n' }
    ],
    terceiros: [
      { n: 'Alvenaria Alfa', o: 'Topázio · Bloco B', p: 18, aso: 18, nr: 15, epi: 18 },
      { n: 'Estrutura Beta', o: 'Topázio · Blocos C e D', p: 12, aso: 12, nr: 12, epi: 12 },
      { n: 'Elétrica Gama', o: 'Topázio · Bloco A', p: 6, aso: 6, nr: 4, epi: 6 },
      { n: 'Hidráulica Delta', o: 'Topázio · Bloco A', p: 5, aso: 5, nr: 5, epi: 5 },
      { n: 'Pintura Ômega', o: 'Topázio · Bloco A', p: 9, aso: 8, nr: 9, epi: 9 }
    ],
    agenda: [
      { d: 0, h: 0, k: 'adm', t: 'Admissional · 6', s: 'Acabamento Bloco A' }, { d: 0, h: 2, k: 'per', t: 'Periódico · 5', s: 'Alvenaria Bloco B' },
      { d: 1, h: 1, k: 'adm', t: 'Admissional · 4', s: 'Alvenaria Bloco C' }, { d: 2, h: 0, k: 'per', t: 'Audiometria · 6', s: 'Corte de bloco' },
      { d: 2, h: 3, k: 'dem', t: 'Demissional · 3', s: 'Fim da fundação' }, { d: 3, h: 1, k: '', t: 'Guincheiro', s: 'Bloco B' },
      { d: 4, h: 0, k: 'per', t: 'NR-35 · 8', s: 'Alvenaria Bloco B' }, { d: 4, h: 2, k: 'adm', t: 'Admissional · 5', s: 'Empreiteiro de pintura' }
    ],
    colab: {
      ini: 'MS', n: 'Marcos S.', f: 'Pedreiro de alvenaria estrutural', o: 'Residencial Topázio · Bloco B',
      chips: ['Apto NR-35', 'Integração NR-18', 'DIM+ ativo'], fimObra: 'alvenaria do bloco termina em 35 dias',
      linha: [
        { t: 'ASO admissional · Apto', d: 'Liberado no prazo', a: '' }, { t: 'Treinamento NR-35', d: 'Certificado registrado', a: '' },
        { t: 'Telemedicina pelo app DIM+', d: 'Atendido sem sair da obra', a: '' }, { t: 'Audiometria periódica', d: 'Vence em 20 dias', a: 'at' }
      ],
      val: [{ t: 'ASO periódico', r: 210, tot: 365 }, { t: 'NR-35', r: 60, tot: 730 }, { t: 'Audiometria', r: 20, tot: 365 }, { t: 'NR-18 integração', r: 300, tot: 365 }]
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
    capa: 'Abertura', terceiros: 'Problema', mobilizacao: 'Problema', altura: 'Problema', poeira: 'Problema',
    acidente: 'Implicação', prazo: 'Implicação', virada: 'Necessidade', entregue: 'Recompensa', final: 'Próximo passo'
  },
  /* ── FIM BLOCO ── */

  /* ═══ BLOCO: CAMERA ═══ */
  clinica: { pos: [-9, 0, -6], escala: 1.35 },
  cenas: {
    capa:        { pos: [52, 24, 44],  alvo: [20, 6, -8],    obra: 0.55, torre: 0, modo: 'neutro' },
    terceiros:   { pos: [27, 7.5, 24], alvo: [19, 1.2, 10.2], obra: 0.55, torre: 0, modo: 'terceiros' },
    mobilizacao: { pos: [46, 6.5, 0],  alvo: [39, 1.5, -18], obra: 0.55, torre: 0, modo: 'mobilizacao' },
    altura:      { pos: [32, 15, 6],   alvo: [25, 9, -12.5], obra: 0.55, torre: 0, modo: 'altura' },
    poeira:      { pos: [44, 4.2, 4],  alvo: [39, 1.2, -6.2], obra: 0.55, torre: 0, modo: 'poeira' },
    acidente:    { pos: [31, 8, 6],    alvo: [25, 2, -9.5],  obra: 0.55, torre: 0, modo: 'acidente' },
    prazo:       { pos: [8, 7, 34],    alvo: [5, 5.5, 10],   obra: 0.55, torre: 0, modo: 'prazo' },
    virada:      { pos: [2, 9, 22],    alvo: [-9, 3, -3],    obra: 0.55, torre: 0, modo: 'virada' },
    entregue:    { pos: [52, 20, 40],  alvo: [20, 6, -8],    obra: 1,    torre: 7, modo: 'verde' },
    fundo:       { pos: [6, 34, 52],   alvo: [0, 2, 0],      obra: 0.55, torre: 0, modo: 'neutro' },
    final:       { pos: [44, 30, 54],  alvo: [8, 5, -4],     obra: 1,    torre: 7, modo: 'verde' }
  }
  /* ── FIM BLOCO ── */
};
