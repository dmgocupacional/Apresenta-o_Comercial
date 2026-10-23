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

## Pendências
- Logo oficial da Recoma (placeholder em texto).
- Projeto Vercel `dmg-recoma` (Henrique cria no painel).
