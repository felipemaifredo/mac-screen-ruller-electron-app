//Libs
import { useState, useEffect } from "react"

//Imports
import Icon from "../../Components/Icon"
import texts from "../../../Resourses/Texts/texts"
import styles from "./Toolbar.module.css"

//Types
import type { ThemeColor } from "../../../Lib/Utils/canvasDrawing"

//Main
const Toolbar = () => {
  let [mode, setMode] = useState<string | null>(null)
  let [theme, setTheme] = useState<ThemeColor>("blue")
  let [showHelp, setShowHelp] = useState(false)

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateMeasurementMode(function (newMode) {
      setMode(newMode)
    })
    return unsubscribe
  }, [])

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateThemeColor(function (newTheme) {
      setTheme(newTheme as ThemeColor)
    })
    return unsubscribe
  }, [])

  function handleSelectMode(selectedMode: string) {
    let nextMode = mode === selectedMode ? null : selectedMode
    window.electronAPI.setMeasurementMode(nextMode)
  }

  function handleSelectTheme(selectedTheme: ThemeColor) {
    window.electronAPI.setThemeColor(selectedTheme)
  }

  function handleClose() {
    window.electronAPI.closeApp()
  }

  function handleMinimize() {
    window.electronAPI.minimizeApp()
  }

  function toggleHelp() {
    let nextShowHelp = !showHelp
    setShowHelp(nextShowHelp)
    if (nextShowHelp) {
      window.electronAPI.resizeWindow(250, 250)
    } else {
      window.electronAPI.resizeWindow(250, 50)
    }
  }

  let activeColorMap: { [key in ThemeColor]: string } = {
    blue: "rgba(0, 122, 255, 0.85)",
    red: "rgba(255, 59, 48, 0.85)",
    green: "rgba(52, 199, 89, 0.85)",
    orange: "rgba(255, 149, 0, 0.85)",
    purple: "rgba(175, 82, 222, 0.85)",
    yellow: "rgba(255, 204, 0, 0.85)"
  }

  let activeHoverColorMap: { [key in ThemeColor]: string } = {
    blue: "rgba(0, 122, 255, 0.95)",
    red: "rgba(255, 59, 48, 0.95)",
    green: "rgba(52, 199, 89, 0.95)",
    orange: "rgba(255, 149, 0, 0.95)",
    purple: "rgba(175, 82, 222, 0.95)",
    yellow: "rgba(255, 204, 0, 0.95)"
  }

  let containerStyle = {
    "--active-color": activeColorMap[theme],
    "--active-hover-color": activeHoverColorMap[theme]
  } as React.CSSProperties

  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.toolbar}>
        <div className={styles.grabber}>
          <Icon name="grabber" size={12} />
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${mode === "selection" ? styles.buttonActive : ""}`}
            onClick={function () { handleSelectMode("selection") }}
            data-tooltip={texts.toolbar.selection}
          >
            <Icon name="selection" size={16} />
          </button>

          <button
            className={`${styles.button} ${mode === "horizontal" ? styles.buttonActive : ""}`}
            onClick={function () { handleSelectMode("horizontal") }}
            data-tooltip={texts.toolbar.horizontal}
          >
            <Icon name="horizontal" size={16} />
          </button>

          <button
            className={`${styles.button} ${mode === "vertical" ? styles.buttonActive : ""}`}
            onClick={function () { handleSelectMode("vertical") }}
            data-tooltip={texts.toolbar.vertical}
          >
            <Icon name="vertical" size={16} />
          </button>

          {/* <button
            className={`${styles.button} ${mode === "cross" ? styles.buttonActive : ""}`}
            onClick={function () { handleSelectMode("cross") }}
            data-tooltip={texts.toolbar.cross}
          >
            <Icon name="cross" size={16} />
          </button> */}
        </div>

        <div className={styles.separator} />

        <div className={styles.utilityGroup}>
          <button
            className={styles.utilityButton}
            onClick={handleMinimize}
            data-tooltip={texts.toolbar.minimize}
          >
            <Icon name="minimize" size={16} />
          </button>

          <button
            className={`${styles.utilityButton} ${showHelp ? styles.buttonActive : ""}`}
            onClick={toggleHelp}
            data-tooltip="Atalhos e Comandos"
          >
            <Icon name="settings" size={16} />
          </button>

          <button
            className={`${styles.utilityButton} ${styles.closeButton}`}
            onClick={handleClose}
            data-tooltip={texts.toolbar.close}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>

      {showHelp && (
        <div className={styles.helpModal}>
          <div className={styles.helpTitle}>Atalhos & Comandos</div>
          <div className={styles.helpList}>
            <div className={styles.helpItem}>
              <span className={styles.helpKey}>Cmd + Shift + M</span>
              <span className={styles.helpDesc}>Atalho global</span>
            </div>
            <div className={styles.helpItem}>
              <span className={styles.helpKey}>Arrastar</span>
              <span className={styles.helpDesc}>Medir na tela</span>
            </div>
            <div className={styles.helpItem}>
              <span className={styles.helpKey}>Clique no nº</span>
              <span className={styles.helpDesc}>Copiar medida</span>
            </div>
            <div className={styles.helpItem}>
              <span className={styles.helpKey}>Esc</span>
              <span className={styles.helpDesc}>Limpar / Fechar</span>
            </div>
          </div>

          <div className={styles.helpTitle} style={{ marginTop: "10px" }}>Cor das Guias</div>
          <div className={styles.themeSelector}>
            {(["blue", "red", "green", "orange", "purple", "yellow"] as ThemeColor[]).map(function (colorName) {
              return (
                <button
                  key={colorName}
                  className={`${styles.colorCircle} ${styles[colorName]} ${theme === colorName ? styles.colorCircleActive : ""}`}
                  onClick={function () { handleSelectTheme(colorName) }}
                  data-tooltip={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
export { Toolbar }
