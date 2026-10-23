# Plataforma de apresentações DMG

Apresentação comercial SPIN com mundo 3D, personalizada por empresa. Estática: abre direto do GitHub Pages ou da Vercel.

## Como abrir
- `apresentacao/` → roteiro padrão (construção esportiva, modelo Recoma)
- `apresentacao/?r=<roteiro>&empresa=<razão social>&func=<colaboradores>&anos=<anos de empresa>`
  - `empresa` aceita a razão social completa: "ARENA PRIME CONSTRUCOES LTDA" vira "Arena Prime"

## Estrutura
| Arquivo | Papel |
|---|---|
| `index.html` | Casca: palco 3D, HUD, janela do painel exclusivo |
| `css/deck.css` | Todo o visual |
| `js/carregador.js` | Carrega na ordem: núcleo → roteiro → cenário → slides → kit 3D → motor |
| `js/nucleo.js` | Helpers, `EMPRESA` (nome, colaboradores, anos), `pers()` e o registro `CENARIOS` |
| `js/slides.js` | Templates de slide por `tipo`; monta o deck a partir do roteiro |
| `js/kit3d.js` | Renderizador, luz, pessoas, alerta, partículas, fogos e a torre da DMG |
| `js/cenarios/<id>.js` | Mundo 3D de um subtipo (ex.: `esportiva`) |
| `js/motor.js` | FAP, atraso, radar, kanban, painel, navegação |
| `roteiros/<id>.js` | Só dados: textos, dores, andares, kanban, painel, câmeras |
| `assets/logo-dmg.png` | Logo oficial |

## Criar um subtipo novo
1. Copie `roteiros/construcao-esportiva.js` para `roteiros/<novo-id>.js` e troque textos, `eixos`, `cartoes`, `prazo`, `beneficios`, `painel`, `parceiros` e `cenas`.
2. Se o mundo 3D for outro, crie `js/cenarios/<cenario>.js` registrando `CENARIOS.<cenario> = function(kit){ ... }` e devolvendo o contrato:
   - `viajante`, `destinoViajante(modo)`
   - `modosRisco[]`, `alertas{ modo: [x, y, z, yDaOnda] }`
   - `fluxo{ ida, volta }` (curvas THREE), `fogos[x, z]`
   - `aplicarModo(modo, cena)`, `quadro(dt, k, relogio, modo)`, `placar(n)`
3. Use `{empresa}`, `{EMPRESA}`, `{func}` e `{anos}` nos textos: viram os dados do cliente.
4. Coloque o nome do cliente em pelo menos 5 lugares (cena 3D, capa, dores, telas, painel, CTA) e valide no navegador sem erros.

## Tipos de slide
`capa`, `mapa`, `dor`, `linha` (linha do tempo), `calc` (FAP), `prazo` (calendário de atraso), `virada`, `andar` (com `extra: 'painel'` ou `'parceria'`), `entregue`, `prova`, `kanban`, `radar`, `cta`.

## Padrão de qualidade 3D
Toda cena segue `docs/PADRAO-3D.md` (nada atravessa nada, formas reais, etapas visíveis) e passa pela auditoria de `tools/qa/colisao.js` com 0 achados antes de entrar no hub.
