//Types
type TextResources = {
  toolbar: {
    selection: string
    horizontal: string
    vertical: string
    cross: string
    close: string
    minimize: string
  }
}

//Main
let texts: TextResources = {
  toolbar: {
    selection: "Modo Seleção (Arrastar para medir retângulo)",
    horizontal: "Modo Horizontal (Medir largura)",
    vertical: "Modo Vertical (Medir altura)",
    cross: "Modo Horizontal + Vertical (Medir ambos)",
    close: "Fechar Aplicativo",
    minimize: "Minimizar"
  }
}

export default texts
export { texts }
