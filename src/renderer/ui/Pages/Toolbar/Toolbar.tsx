//Libs
import { useState, useEffect } from "react"

//Imports
import Icon from "../../Components/Icon"
import texts from "../../../Resourses/Texts/texts"
import styles from "./Toolbar.module.css"

//Main
const Toolbar = () => {
  let [mode, setMode] = useState<string | null>(null)

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateMeasurementMode(function (newMode) {
      setMode(newMode)
    })
    return unsubscribe
  }, [])

  function handleSelectMode(selectedMode: string) {
    let nextMode = mode === selectedMode ? null : selectedMode
    window.electronAPI.setMeasurementMode(nextMode)
  }

  function handleClose() {
    window.electronAPI.closeApp()
  }

  function handleMinimize() {
    window.electronAPI.minimizeApp()
  }

  return (
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

        <button
          className={`${styles.button} ${mode === "cross" ? styles.buttonActive : ""}`}
          onClick={function () { handleSelectMode("cross") }}
          data-tooltip={texts.toolbar.cross}
        >
          <Icon name="cross" size={16} />
        </button>
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
          className={`${styles.utilityButton} ${styles.closeButton}`}
          onClick={handleClose}
          data-tooltip={texts.toolbar.close}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toolbar
export { Toolbar }
