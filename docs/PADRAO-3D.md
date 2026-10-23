# Padrão de qualidade 3D das apresentações comerciais

Regra do Henrique (23/10/2026): nível gráfico máximo, para impressionar quem vê, sem economizar e sem desculpas para simplificar. Toda melhoria vale para **todas** as cenas, e este documento é o padrão. Cena nova só entra no hub se cumprir todos os itens abaixo.

## 1. Nada atravessa nada
- Veículos andam sobre a cota real do terreno, seguindo um traçado definido (perfil longitudinal e faixa). Carros nunca andam "no chão" através de ponte, rampa ou arquibancada.
- Cada faixa tem largura suficiente para o veículo, com 20 cm de folga para cada lado. Sentidos opostos nunca se tocam.
- Ninguém fica em pé dentro de objeto, degrau, guarda-corpo ou faixa de rolamento.
- O trabalhador protagonista anda por **rota** (`destinoViajante` devolve `[[x, z], ...]`) que contorna tapume, poste, fila e veículo. Linha reta só quando o caminho está livre.
- Máquinas articuladas (escavadeira, grua) não passam peça por dentro de outra durante o ciclo. A lança sobe antes de girar.
- Veículos não "teleportam" à vista: entram e saem de cena com `opacidade()` (kit `carro` ou `desvanecivel`), ou somem no túnel ou na névoa.
- Nenhuma superfície fica coplanar com outra (z-fighting). Por exemplo: aro rebaixado dentro do pneu, faixas acima do piso com `polygonOffset` e terreno 15 cm abaixo do piso no pé do morro.

## 2. Formas reais
O que aparece tem a anatomia da coisa real:

| Elemento | Mínimo exigido |
|---|---|
| Ponte | estacas e blocos, pilares com travessa, aparelhos de apoio, encontros com alas, vigas I, laje, barreira New Jersey, drenos, aterro de acesso |
| Túnel | corte com bermas, testa em concreto projetado, enfilagens, cambotas, concreto projetado, frente com furos, jumbo, ventilação; pronto: portal, revestimento, passeios, iluminação |
| Grua | mastro e lanças treliçados (`kit.trelica`), contralança com lastro, tirantes, carrinho, cabo, moitão, gancho e carga com estropos |
| Andaime | `kit.andaime`: montantes, longarinas, diagonais, pranchas, guarda-corpo, rodapé, sapatas, escada |
| Bloco cortado | bloco 14×19×39 com furos, palete de madeira, cortadora com coifa, carro deslizante, motor, quadro elétrico e cabo |
| Veículo | silhueta real, rodas com pneu e aro (`kit.roda`), faróis e lanternas acesos, para-choque, grade |
| Pessoa em risco | EPI coerente com a atividade (`kit.epi`: abafador, máscara, óculos, cinto) e pose (`userData.pose`) quando segura algo |
| Arquibancada | degraus maciços sem frestas e cadeiras instanciadas com encosto para fora |

- Relevo é malha com ruído e cumes, cor por inclinação (rocha onde é íngreme) e cores convertidas de sRGB para linear. Nada de cone ou cúpula lisa.
- Muitas peças iguais usam `InstancedMesh`. Estruturas de muitas barras passam por `kit.fundir` (uma malha por material).

## 3. Etapas visíveis
O que está sendo construído mostra a etapa:
- **Obra (55%):** estrutura parcial, provisórios montados (desvio, ponte provisória, guarda-corpo provisório, elevador de obra) e máquinas trabalhando.
- **Entrega:** obra completa, provisórios removidos, luz acesa, trânsito ou público usando.

## 4. Câmeras
- O painel de texto ocupa a esquerda. O kit desloca o olhar 6 m em -x, então a câmera olha para o norte (de +z para -z) e o assunto fica à direita.
- A câmera não fica no meio de uma faixa de tráfego. Veículos passam abaixo do quadro ou atrás do assunto, nunca colados à lente.

## 5. QA obrigatório (pasta `apresentacao/tools/qa`)
Rode com o servidor local `python3 -m http.server 8765 --bind 127.0.0.1` na raiz do repositório e o Playwright instalado.

- **`node colisao.js <roteiro> <cena> [amostras]`:** auditoria de colisões. Usa caixas orientadas (SAT) e simulação acelerada (`window.__qaPassos`). Precisa dar **0 achados** em obra, risco, acidente e entrega.
  - O cenário expõe `auditoria()` → `{ moveis, pessoas }`.
  - Peças vazadas e contatos intencionais são marcados com `userData.oco`, `userData.contatoOk` ou `userData.mesmaMaquina`.
  - Objetos que não andam no chão são marcados com `userData.semApoio`.
- **`node qa.js <roteiro> <slides> <pasta>`:** captura dos slides com a simulação acelerada.
- **`node cam.js <roteiro> <saida.png> "x,y,z" "x,y,z" [modo] [obra]`:** câmera livre para inspecionar qualquer ponto.
- Depois do QA: regressão (todos os roteiros e o hub, 0 erros de console). Cada captura é olhada uma a uma antes do commit.

## 6. Linguagem de cinema (módulo `js/cinema.js`, obrigatório em toda cena)
- **Luz:** céu físico, sol baixo de entardecer (sombras longas), mapa de ambiente para reflexos e névoa da cor do horizonte. Na entrega a cena passa para a **hora azul**: janelas, postes e refletores acendem.
- **Mundo:**
  - chão natural com variação (gramado, capim seco, terra batida no canteiro);
  - mata no entorno;
  - morros e silhueta de cidade no horizonte.
- **Pisos:** nada de piso escuro de maquete. Ruas usam `kit.asfalto()`.
- **Lente:**
  - foco seletivo (bokeh) nas cenas de assunto;
  - tilt-shift de maquete na capa, na visão geral e no final;
  - oclusão ambiente (SSAO) no nível alto;
  - bloom só nas luzes;
  - gradação de cor por clima: neutro, risco (frio), acidente (dessaturado e avermelhado), clínica e entrega (dourado);
  - vinheta, grão e aberração cromática sutis.
- **Câmera:** travelling em curva entre planos, com aceleração e frenagem, e órbita lenta na entrega. A distância focal é por plano (`fov` opcional na cena do roteiro).
- **Qualidade adaptativa:** mede o computador nos primeiros quadros e escolhe entre alto, médio e baixo. Para forçar, use `?q=alto|medio|baixo`. O QA visual roda com `Q=alto` ou `Q=medio`.
- Nenhum brilho estourado (gramado, fachos sobrepostos, alerta). Se estourar, baixe a emissão, não o bloom global.
