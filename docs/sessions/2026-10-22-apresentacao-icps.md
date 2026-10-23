# Sessão 2026-10-22 — Plataforma de apresentações por ICP

## Contexto
- Deck da Recoma publicado em `/recoma/` (GitHub Pages). Vercel pendente: o conector não cria projeto; Henrique cria pelo painel (Root Directory `recoma`).
- Próximo passo aprovado ("pode rodar! vai"): plataforma com ICP → subtipo → empresa, mesmo motor 3D.

## Decisões
- Navegação: vendedor conduz na reunião; link por cliente enviado depois.
- Personalização: CNPJ preenche tudo (nome, CNAE→ICP/subtipo e RAT, cidade); site traz logo/cor; vendedor ajusta antes de começar. Nome da empresa aparece em ≥5 momentos (cena 3D, capa, dores, placar/telas, prédio DMG, painel, kanban/radar, CTA).
- Arquitetura: sair do arquivo único → `apresentacao/` com motor + cenários + roteiros (estático).
- 6 ICPs × 3 subtipos, validados contra a base do SGG (270 cadastros):
  - Construção: edificações/incorporação · infraestrutura/terraplenagem · especializadas (fundações, instalações, esportiva/Recoma)
  - Comércio: materiais de construção · supermercados · atacado/distribuição
  - Serviços terceirizados: facilities · resíduos/ambiental · alimentação coletiva
  - Serviços profissionais e tecnologia: provedores de internet · contabilidades · engenharia/consultorias
  - Indústria: manutenção/usinagem · concreto/pré-moldados · gráficas/embalagens
  - Logística: transporte de cargas · e-commerce/CD · mobilidade (estacionamento/fretamento)
- Saúde e setor público saíram (clínicas SST = canal de revenda; público = licitação).

## Descobertas
- SGG: todos os cadastros vêm "ativa", 80 sem CNAE, nenhum com nº de funcionários → não serve sozinho para medir carteira.
- Contabilidade como canal: Nobre Contabilidade trouxe 14 clientes (grupo 3).

## Fases
1. Motor (concluída): `apresentacao/` com carregador, núcleo, slides (templates), kit 3D, cenário `esportiva`, motor e roteiro `construcao-esportiva`. Paridade validada: 22 slides com texto idêntico ao `/recoma/`, 0 erros no navegador.
2. Hub (concluída): `apresentacao/` sem `?r=` abre o preparo. CNPJ via BrasilAPI (CORS liberado, validação de dígitos) → razão, fantasia, CNAE, cidade, anos desde a abertura; CNAE sugere ICP/subtipo (prefixo mais longo) e RAT estimado; site → ícone via Google favicons; vendedor ajusta nome, colaboradores, anos e RAT; gera e copia o link (`r, empresa, func, anos, rat, site, cidade`). Último preparo fica salvo no navegador.
3. Construção completa (3 subtipos) — em andamento:
   - Edificações e incorporação (concluído, 23/10): cenário `edificacoes` (torre de 12 pavimentos que sobe com a obra, guarda-corpo NR-18 e bandeja, grua torre, cremalheira, tapume e placa de obra com o nome do cliente, contêineres de vivência, área de corte com poeira de sílica, betoneira na rua, stand de vendas; na entrega a torre fecha, acende parte das janelas e mostra o nome na coroa) + roteiro `construcao-edificacoes` (dores: empreiteiros por etapa, altura e equipamentos, rotatividade, poeira e ruído; prazo = entrega das chaves) + slide novo `etapas` (fundação → acabamento).
   - Infraestrutura e terraplenagem (concluído, 23/10): cenário `infraestrutura` (estrada com trecho entregue e subleito, pavimento que avança com a obra, escavadeira em ciclo carregando basculante, caminhão de ré sobre trabalhador no ponto cego, vala com e sem escoramento, motoniveladora e rolo, desvio com sinaleiro PARE/SIGA e carros, ponte com cimbramento, base com placa de obra do cliente; na entrega as máquinas saem, a pista ganha faixas, postes acesos e o trânsito volta) + roteiro `construcao-infraestrutura` (frentes espalhadas, máquina pesada, escavação, céu aberto e trânsito; prazo = medição do contrato).
   - Construção concluída: 3 de 3 subtipos no ar e liberados no hub.
4. Demais ICPs.
5. Radar → pré-proposta no padrão dmg-erp.

## Fase 1 — registro técnico
- Personalização por URL: `?empresa=` (razão social → nome curto), `?func=`, `?anos=`; tokens `{empresa}`, `{EMPRESA}`, `{func}`, `{anos}` nos roteiros.
- Nome do cliente agora também no letreiro da fábrica e no placar (antes só no caminhão e na cobertura).
- Correção: `dt` negativo no laço de animação quebrava a curva do fluxo dourado (getPoint com t < 0); travado em ≥ 0 no kit. O `/recoma/` publicado ainda tem esse defeito latente.
- "45 anos" virou `{anos}` (dado da Recoma não pode aparecer para outra empresa); na Fase 2 virá da data de abertura do CNPJ.
- Guia de criação de subtipo em `apresentacao/LEIAME.md`.

## Fase 2 — registro técnico
- Catálogo dos 18 subtipos em `js/hub.js` (bloco CATALOGO), com prefixos de CNAE e RAT estimado por ICP; só `construcao-esportiva` tem roteiro, os demais aparecem "Em produção".
- Teste: CNPJ da Estrela (09.413.300/0001-77) → Construção · Edificações (CNAE 4120-4/00), Cotia/SP, 18 anos. Link gerado abriu o deck com nome, anos, RAT e logo.
- Logo pelo site usa o ícone do domínio (pequeno); logo grande continua por arquivo.

## Fase 3 — registro técnico
- Personalização ganhou concordância de artigo: nomes masculinos (Consórcio, Grupo, Instituto, Supermercado…) trocam "a/da/na/pela {empresa}" por "o/do/no/pelo".
- `nomeCurto` devolve acentos que a Receita remove (Consórcio, Construções, São, José…) e só mantém em maiúsculas o que é sigla (GSO, JX), não palavra curta comum (Via, São).
- Lição: comentário inserido no meio de linha engoliu um `cena.add` (pavimento sumido); conferir com grep após patches que adicionam `//` ao fim de instrução.

## Refino gráfico total (23/10) — padrão "ultra"
- Pedido: sem conflitos (carro dentro da ponte), formas reais (bloco cortado "pobre"), ponte e túnel de verdade; extrapolar para todas as cenas e salvar como padrão → `docs/PADRAO-3D.md` + ferramentas em `apresentacao/tools/qa/`.
- Kit (`kit3d.js`) ganhou peças compartilhadas: `trelica` (fundida em 1 malha por material), `fundir`, `barra`, `fita` (pista que segue o relevo), `texturaProc`/`granulado`, `carro` (silhueta real, faróis, desvanece), `roda` (pneu em anel, aro rebaixado), `arvores` (instanciadas), `andaime`, `epi`, `desvanecivel`; rotas do trabalhador (`destinoViajante` com lista de pontos), poses de braço (`userData.pose`), grua da clínica treliçada, `normalBias` na sombra, grade mais suave, modo QA (`window.__qaPassos`) e gancho `window.__cena3d`.
- Infraestrutura refeita: perfil longitudinal com aterros em terra armada; ponte em vigas I (estacas/blocos, pilares, encontros com alas, laje, New Jersey, drenos) em etapas (vão 1 concretado, vão 2 em forma e armação, vão 3 recebendo viga por guindaste de esteira); túnel NATM na encosta (corte com bermas, testa em concreto projetado com a boca recortada, enfilagens, cambotas, jumbo, ventilação; na entrega portal com o nome do cliente, revestimento, LEDs); maciço natural com mata; desvio com taper de cones e ponte provisória Bailey (removidos na entrega); trânsito por traçado com cota e inclinação; carros cruzam o viaduto e entram no túnel.
- Edificações: estação de corte real (blocos com furos em amarração sobre paletes, cortadora com coifa, operador com PFF2/óculos/abafador segurando o bloco, quadro elétrico e cabo), grua torre e elevador cremalheira treliçados com ancoragem, contêineres detalhados, betoneira com rodas reais e bica, meio-fio e postes, rota do trabalhador pela calçada, fila de terceiros fora da passagem do portão; na entrega saem elevador e corte.
- Esportiva reorganizada (havia arquibancada sobre a estrada, linha de produção na pista e gente no trajeto do caminhão): estádio recuado com arquibancada de 8 degraus sem frestas e ~1.500 cadeiras, cobertura no fundo, campo com traves e áreas, torres de iluminação treliçadas com projetores, placar elevado, alambrado com pórtico "Entrada de obra · cliente", faixa curva "Arena · cliente", andaime real com escada, grua treliçada içando terça; galpão com fachada aberta e a linha dentro; área de químicos com bacia de contenção; caminhão por toda a estrada com entrada/saída suave.
- Resultado: auditoria com 0 colisões em obra, risco, acidente e entrega nas 3 cenas; regressão 0 erros.

## Linguagem de cinema (23/10, noite)
- Pedido: "cinematográfico, imagens profissionais", para o dono da empresa sair impressionado. Direção aprovada: realista nas cenas e maquete (tilt-shift) na capa e nas visões gerais.
- Novo `js/cinema.js`, com uso documentado em `PADRAO-3D.md §6`:
  - atmosfera: céu físico, sol de entardecer, envmap, névoa, estrelas e hora azul na entrega;
  - mundo: chão natural, mata, morros e cidade com janelas que acendem;
  - lente: SSAO, bokeh, tilt-shift, bloom, gradação por clima, vinheta e grão;
  - travelling em curva, órbita na entrega e qualidade adaptativa.
- Pisos antigos de maquete trocados: asfalto com agregado (`kit.asfalto`), calçada, terra do canteiro. Brilhos estourados corrigidos (gramado do estádio, fachos, luz de alerta).
- Próximos lotes:
  - materiais com desgaste: sujeira, ferrugem, marcas de pneu, poças;
  - pessoas mais anatômicas e com ações (martelar, sinalizar, operar);
  - abertura com sobrevoo do canteiro.

## Pendências
- Logo oficial da Recoma (placeholder em texto).
- Projeto Vercel `dmg-recoma` (Henrique cria no painel).
