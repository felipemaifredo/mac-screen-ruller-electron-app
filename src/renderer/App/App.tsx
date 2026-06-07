//Libs
import { useState, useEffect } from "react"

//Imports
import Toolbar from "../ui/Pages/Toolbar/Toolbar"
import Overlay from "../ui/Pages/Overlay/Overlay"
import styles from "./App.module.css"

//Main
const App = () => {
  let [windowType, setWindowType] = useState<string | null>(null)

  useEffect(function () {
    let params = new URLSearchParams(window.location.search)
    setWindowType(params.get("window"))
  }, [])

  if (windowType === "toolbar") {
    return (
      <div className={styles.container}>
        <Toolbar />
      </div>
    )
  }

  if (windowType === "overlay") {
    return (
      <div className={styles.container}>
        <Overlay />
      </div>
    )
  }

  return (
    <div className={styles.loading}>
      "Carregando..."
    </div>
  )
}

export default App
export { App }
