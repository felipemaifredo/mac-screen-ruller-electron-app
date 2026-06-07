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
  let [systemColor, setSystemColor] = useState<string>("#007aff")
  let [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  let [materialType, setMaterialType] = useState<"translucent" | "tinted">("translucent")

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

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateThemeMode(function (newMode) {
      setThemeMode(newMode)
    })
    return unsubscribe
  }, [])

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateMaterialType(function (newType) {
      setMaterialType(newType)
    })
    return unsubscribe
  }, [])

  useEffect(function () {
    window.electronAPI.getSystemAccentColor().then(function (color) {
      setSystemColor(color)
    })
  }, [])

  function handleSelectMode(selectedMode: string) {
    let nextMode = mode === selectedMode ? null : selectedMode
    window.electronAPI.setMeasurementMode(nextMode)
  }

  function handleSelectTheme(selectedTheme: ThemeColor) {
    window.electronAPI.setThemeColor(selectedTheme)
  }

  function handleSelectThemeMode(selectedThemeMode: "dark" | "light") {
    window.electronAPI.setThemeMode(selectedThemeMode)
  }

  function handleSelectMaterialType(selectedMaterialType: "translucent" | "tinted") {
    window.electronAPI.setMaterialType(selectedMaterialType)
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
      window.electronAPI.resizeWindow(320, 380)
    } else {
      window.electronAPI.resizeWindow(250, 50)
    }
  }

  function hexToRgba(hex: string, alpha: number) {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return `rgba(0, 122, 255, ${alpha})`
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  function getThemeColorValue(color: string, alpha: number) {
    if (color === "system") {
      return hexToRgba(systemColor, alpha)
    }
    if (color.startsWith("#")) {
      return hexToRgba(color, alpha)
    }
    let baseColors: { [key: string]: string } = {
      blue: "0, 122, 255",
      red: "255, 59, 48",
      green: "52, 199, 89",
      orange: "255, 149, 0",
      purple: "175, 82, 222",
      yellow: "255, 204, 0"
    }
    let rgb = baseColors[color] || "0, 122, 255"
    return `rgba(${rgb}, ${alpha})`
  }

  let containerStyle = {
    "--active-color": getThemeColorValue(theme, 0.85),
    "--active-hover-color": getThemeColorValue(theme, 0.95)
  } as React.CSSProperties

  return (
    <div className={`${styles.container} ${themeMode === "light" ? styles.lightTheme : ""} ${materialType === "tinted" ? styles.tinted : ""}`} style={containerStyle}>
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
            className={`${styles.utilityButton} ${showHelp ? styles.buttonActive : ""}`}
            onClick={toggleHelp}
            data-tooltip="Atalhos e Comandos"
          >
            <Icon name="settings" size={16} />
          </button>

          <button
            className={styles.utilityButton}
            onClick={handleMinimize}
            data-tooltip={texts.toolbar.minimize}
          >
            <Icon name="minimize" size={16} />
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
            <button
              className={`${styles.colorCircle} ${theme === "system" ? styles.colorCircleActive : ""}`}
              style={{
                background: "conic-gradient(from 180deg at 50% 50%, #ff453a, #ff9f0a, #ffd60a, #30d158, #0a84ff, #5e5ce6, #bf5af2, #ff453a)"
              }}
              onClick={function () { handleSelectTheme("system") }}
              data-tooltip="Destaque do Sistema (macOS)"
            />

            <div className={styles.separatorMini} />

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

            <div className={styles.separatorMini} />

            <button
              className={`${styles.colorCircle} ${theme !== "system" && !["blue", "red", "green", "orange", "purple", "yellow"].includes(theme) ? styles.colorCircleActive : ""}`}
              style={{
                backgroundColor: theme !== "system" && !["blue", "red", "green", "orange", "purple", "yellow"].includes(theme) ? theme : "#ffffff",
                backgroundImage: theme !== "system" && !["blue", "red", "green", "orange", "purple", "yellow"].includes(theme) ? "none" : "linear-gradient(to right, #ff007f, #7f00ff, #00ffff)",
                border: theme !== "system" && !["blue", "red", "green", "orange", "purple", "yellow"].includes(theme) ? "1.5px solid #ffffff" : "1.5px dashed rgba(255, 255, 255, 0.4)"
              }}
              onClick={function () {
                let picker = document.getElementById("custom-color-picker")
                if (picker) {
                  picker.click()
                }
              }}
              data-tooltip="Cor Personalizada..."
            />
            <input
              id="custom-color-picker"
              type="color"
              value={theme !== "system" && !["blue", "red", "green", "orange", "purple", "yellow"].includes(theme) ? theme : "#007aff"}
              onChange={function (e) { handleSelectTheme(e.target.value) }}
              style={{ display: "none" }}
            />
          </div>

          <div className={styles.helpTitle} style={{ marginTop: "12px" }}>Aparência</div>
          <div className={styles.appearanceSelector}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleButton} ${themeMode === "light" ? styles.toggleButtonActive : ""}`}
                onClick={function () { handleSelectThemeMode("light") }}
              >
                Claro
              </button>
              <button
                className={`${styles.toggleButton} ${themeMode === "dark" ? styles.toggleButtonActive : ""}`}
                onClick={function () { handleSelectThemeMode("dark") }}
              >
                Escuro
              </button>
            </div>

            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleButton} ${materialType === "translucent" ? styles.toggleButtonActive : ""}`}
                onClick={function () { handleSelectMaterialType("translucent") }}
              >
                Translúcido
              </button>
              <button
                className={`${styles.toggleButton} ${materialType === "tinted" ? styles.toggleButtonActive : ""}`}
                onClick={function () { handleSelectMaterialType("tinted") }}
              >
                Tonalizado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
export { Toolbar }
