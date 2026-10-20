# Petri · Apresentação comercial

Deck cinematográfico da PETRI Engenharia: plano-sequência 3D (Three.js r128) que desce do skyline até a fundação, contado no roteiro SPIN.

- `index.html`: página publicada (single-file, imagens embutidas).
- `fonte/deck.src.html`: fonte editável com marcadores `{{IMG:nome}}`.
- `fonte/build.py`: gera o `index.html` a partir da fonte e de `assets/`.
- `?nosh` no link desliga sombras (máquinas fracas); `?nopos` desliga pós-processamento.

Rebuild: `cd fonte && python3 build.py`
