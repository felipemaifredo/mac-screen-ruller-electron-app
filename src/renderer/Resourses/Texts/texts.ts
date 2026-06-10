//Types
type TextResources = {
  toolbar: {
    selection: string
    horizontal: string
    vertical: string
    cross: string
    close: string
    minimize: string
    preferences: string
    shortcuts: string
    theme: string
    themeLight: string
    themeDark: string
    material: string
    materialTranslucent: string
    materialTinted: string
    guideColor: string
    systemHighlight: string
    customColor: string
    globalShortcut: string
    clearCancel: string
    changeMode: string
    pinMeasurement: string
    deleteLastPinned: string
    moveActiveGuide: string
    copyPixelValue: string
    clickPixelTag: string
    copied: string
    shortcutsTab: string
    preferencesTab: string
    tooltipHelp: string
    language: string
  }
}

type Languages = {
  en: TextResources
  pt: TextResources
  es: TextResources
}

//Main
let texts: Languages = {
  en: {
    toolbar: {
      selection: "Selection Mode (Drag to measure rectangle)",
      horizontal: "Horizontal Mode (Measure width)",
      vertical: "Vertical Mode (Measure height)",
      cross: "Horizontal + Vertical Mode (Measure both)",
      close: "Close Application",
      minimize: "Minimize",
      preferences: "Preferences",
      shortcuts: "Shortcuts",
      theme: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      material: "Material",
      materialTranslucent: "Translucent",
      materialTinted: "Tinted",
      guideColor: "Guide Color",
      systemHighlight: "System Highlight (macOS)",
      customColor: "Custom Color...",
      globalShortcut: "Global Shortcut",
      clearCancel: "Clear / Cancel",
      changeMode: "Change Mode (Selection / Horiz / Vert)",
      pinMeasurement: "Pin Measurement to Screen",
      deleteLastPinned: "Delete Last Pinned",
      moveActiveGuide: "Move Active Guide (1px / 10px)",
      copyPixelValue: "Copy Pixel Value",
      clickPixelTag: "Click on pixel tag",
      copied: "Copied!",
      shortcutsTab: "Shortcuts",
      preferencesTab: "Preferences",
      tooltipHelp: "Shortcuts and Commands",
      language: "Language"
    }
  },
  pt: {
    toolbar: {
      selection: "Modo Seleção (Arrastar para medir retângulo)",
      horizontal: "Modo Horizontal (Medir largura)",
      vertical: "Modo Vertical (Medir altura)",
      cross: "Modo Horizontal + Vertical (Medir ambos)",
      close: "Fechar Aplicativo",
      minimize: "Minimizar",
      preferences: "Preferências",
      shortcuts: "Atalhos",
      theme: "Tema",
      themeLight: "Claro",
      themeDark: "Escuro",
      material: "Material",
      materialTranslucent: "Translúcido",
      materialTinted: "Tonalizado",
      guideColor: "Cor das Guias",
      systemHighlight: "Destaque do Sistema (macOS)",
      customColor: "Cor Personalizada...",
      globalShortcut: "Atalho Global",
      clearCancel: "Limpar / Cancelar",
      changeMode: "Mudar Modo (Seleção / Horiz / Vert)",
      pinMeasurement: "Fixar Medição na Tela",
      deleteLastPinned: "Apagar Última Fixada",
      moveActiveGuide: "Mover Guia Ativa (1px / 10px)",
      copyPixelValue: "Copiar Valor de Medida",
      clickPixelTag: "Clique na tag de pixels",
      copied: "Copiado!",
      shortcutsTab: "Atalhos",
      preferencesTab: "Preferências",
      tooltipHelp: "Atalhos e Comandos",
      language: "Idioma"
    }
  },
  es: {
    toolbar: {
      selection: "Modo Selección (Arrastrar para medir rectángulo)",
      horizontal: "Modo Horizontal (Medir ancho)",
      vertical: "Modo Vertical (Medir altura)",
      cross: "Modo Horizontal + Vertical (Medir ambos)",
      close: "Cerrar Aplicación",
      minimize: "Minimizar",
      preferences: "Preferencias",
      shortcuts: "Atajos",
      theme: "Tema",
      themeLight: "Claro",
      themeDark: "Oscuro",
      material: "Material",
      materialTranslucent: "Translúcido",
      materialTinted: "Teñido",
      guideColor: "Color de Guías",
      systemHighlight: "Resaltado del Sistema (macOS)",
      customColor: "Color Personalizado...",
      globalShortcut: "Atajo Global",
      clearCancel: "Limpiar / Cancelar",
      changeMode: "Cambiar Modo (Selección / Horiz / Vert)",
      pinMeasurement: "Fijar Medida en Pantalla",
      deleteLastPinned: "Borrar Última Fijada",
      moveActiveGuide: "Mover Guía Activa (1px / 10px)",
      copyPixelValue: "Copiar Valor de Medida",
      clickPixelTag: "Clic en la etiqueta de píxeles",
      copied: "¡Copiado!",
      shortcutsTab: "Atajos",
      preferencesTab: "Preferencias",
      tooltipHelp: "Atajos y Comandos",
      language: "Idioma"
    }
  }
}

export default texts
export { texts }
