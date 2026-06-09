# Design System: Mai Screen Ruller

Este documento define o sistema de design para o aplicativo Mai Screen Ruller, baseado nas preferências de estilo nativo do macOS (minimalista, semi-translúcido e preciso).

## Princípios de Design

1. **Estética Nativa do macOS**: Painéis com fundo cinza semi-translúcido (efeito blur/vibrancy), bordas finas e sutis, sombras suaves e tipografia padrão do sistema (SF Pro / System UI).
2. **Compacto e Discreto**: A barra de ferramentas deve ocupar o menor espaço possível na tela, exibindo apenas ícones modernos com tooltips explicativos ao passar o mouse.
3. **Precisão de Pixel**: As linhas de medição e overlays devem ter espessura de 1px física, com textos nítidos e legíveis sobre fundos de alto contraste (fundo escuro e texto branco para medições).

---

## Paleta de Cores e Estilos

### Toolbar (Painel Flutuante)
- **Fundo**: `rgba(40, 40, 40, 0.75)` com `backdrop-filter: blur(20px)` (Modo Escuro Nativo do macOS).
- **Borda**: `rgba(255, 255, 255, 0.15)` (1px solid).
- **Sombra**: `0 4px 12px rgba(0, 0, 0, 0.25)`.
- **Botões (Estados)**:
  - **Normal**: Transparente.
  - **Hover**: `rgba(255, 255, 255, 0.1)`.
  - **Active / Selected**: `rgba(255, 255, 255, 0.25)` ou cor de destaque do sistema (ex: Accent Color macOS - `rgba(0, 122, 255, 0.85)`).
- **Ícones**: Cor branca com opacidade (`rgba(255, 255, 255, 0.85)`).

### Overlay e Canvas de Medição
- **Fundo do Overlay**: Totalmente transparente (`rgba(0, 0, 0, 0)`).
- **Linha de Medição**: `rgba(0, 122, 255, 0.9)` (Azul macOS) ou `rgba(255, 255, 255, 0.8)` com linhas auxiliares.
- **Retângulo de Seleção (Preenchimento)**: `rgba(0, 122, 255, 0.05)`.
- **Fundo da Label de Medida**: `rgba(30, 30, 30, 0.9)`.
- **Texto da Label**: `#ffffff`.
- **Borda da Label**: `rgba(255, 255, 255, 0.1)`.

---

## Tipografia

- **Fonte**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- **Tamanho das Labels**: `11px` (Compacto) ou `12px` (Padrão).
- **Peso da Fonte**: Medium (`500`) ou Bold (`600`) para legibilidade em tamanhos pequenos.

---

## Componentes Compartilhados

### 1. Barra Flutuante (Toolbar)
- Estrutura horizontal compacta.
- Cantos arredondados (`border-radius: 8px`).
- Altura aproximada de `40px` a `46px`.
- Botões com tamanho `28px x 28px` e cantos arredondados de `6px`.
- Área de arraste à esquerda (ou toda a barra vazia) com estilo visual sutil (ex: pontos/linhas de grabber).

### 2. Tooltips
- Balões flutuantes pretos que aparecem após `500ms` de hover.
- Fundo: `rgba(20, 20, 20, 0.95)`.
- Texto: `rgba(255, 255, 255, 0.9)` em `10px`.
- Seta sutil direcionada para cima ou para baixo.

### 3. Overlay Canvas
- Tela cheia sem barras ou bordas.
- Cursor do mouse estilizado em cruz (`crosshair`) para medições de alta precisão.
