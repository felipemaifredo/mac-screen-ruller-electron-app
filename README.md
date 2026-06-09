# Mai Screen Ruller 📏

Uma ferramenta desktop leve, moderna e de alta precisão para medir elementos na tela, inspirada no *Screen Ruler* do Microsoft PowerToys. Desenvolvida para macOS (com suporte completo para Windows) utilizando **Electron**, **React**, **TypeScript** e **Vite**.

A interface adota a estética nativa do macOS, apresentando uma barra de ferramentas flutuante semi-translúcida com efeito blur/vibrancy, ícones limpos e tooltips responsivos.

---

## 🚀 Principais Recursos

- **Quatro Modos de Medição**:
  - 🔳 **Seleção**: Desenha um retângulo na tela e exibe a largura e altura em tempo real.
  - ↔️ **Horizontal**: Desenha uma guia horizontal medindo a largura em pixels.
  - ↕️ **Vertical**: Desenha uma guia vertical medindo a altura em pixels.
  - ➕ **Horizontal + Vertical**: Medição combinada que desenha guias em ambos os eixos simultaneamente.
- **Teclas de Atalho de Controle**:
  - `ESC`: Limpa a medição atual ou fecha o overlay de régua.
  - `ENTER`: Congela a medição ativa na tela.
  - `Cmd+Shift+M` (macOS) / `Ctrl+Shift+M` (Windows): Atalho global para ativar/desativar a régua instantaneamente, mesmo com o app em segundo plano.
- **Barra Flutuante (Toolbar)**: Compacta, discreta, arrastável e sempre no topo (`alwaysOnTop`).
- **Renderização por Canvas**: Desenhos com precisão física de 1px e etiquetas escuras de alto contraste para leitura perfeita sobre qualquer fundo.

---

## 📂 Arquitetura de Pastas do Projeto

O projeto segue uma arquitetura modularizada e limpa para facilitar futuras expansões (como detecção automática de bordas ou zoom de pixels):

```
mai-screen-ruller/
├── assets/                  # Ícones oficiais do aplicativo (.icns, .ico, .png)
├── dist-electron/           # Código compilado do Electron (Main e Preload)
├── src/
│   ├── main/                # Processo Principal do Electron (Janelas, IPC, Atalhos)
│   ├── preload/             # Script de Preload (Exposição segura de APIs via IPC)
│   ├── types/               # Tipagens estritas do Electron
│   └── renderer/            # Processo de Renderização (React)
│       ├── App/             # Roteador de telas (Toolbar vs Overlay)
│       ├── ui/
│       │   ├── Pages/       # Páginas principais (Toolbar e Overlay)
│       │   └── Components/  # Componentes reutilizáveis (Icon, etc.)
│       ├── Lib/
│       │   ├── Utils/       # Utilitários de desenho do Canvas (canvasDrawing)
│       │   └── Hooks/       # Hooks globais (useKeyboard)
│       └── Resourses/       # Recursos estáticos
│           └── Texts/       # Textos e traduções da aplicação
├── package.json             # Dependências e scripts de build
├── tsconfig.json            # Configuração do compilador TypeScript
└── vite.config.ts           # Configuração de compilação do Vite
```

---

## 🛠️ Tecnologias Utilizadas

- **Runtime**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://react.dev/) (Hooks e Context)
- **Compilador/Empacotador**: [Vite](https://vitejs.dev/) & [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita em todo o fluxo)
- **Estilização**: [CSS Modules](https://github.com/css-modules/css-modules) (Estilos locais isolados)

---

## 🏃 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado na sua máquina.

### Passos para execução

1. Clone o repositório ou navegue até a pasta do projeto:
   ```bash
   cd mai-screen-ruller
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 📦 Gerando os Executáveis (Build)

Para empacotar a aplicação e gerar o instalador nativo correspondente ao seu sistema operacional com o ícone oficial da pasta `assets/`:

```bash
npm run dist
```

Os arquivos de instalação finais serão gerados dentro da pasta **`release/`** criada na raiz do projeto.
