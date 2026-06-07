//Libs
import { useEffect } from "react"

//Types
type KeyHandlers = {
  [key: string]: () => void
}

//Main
function useKeyboard(handlers: KeyHandlers) {
  useEffect(function () {
    function handleKeyDown(event: KeyboardEvent) {
      let handler = handlers[event.key]
      if (handler) {
        handler()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return function () {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handlers])
}

export default useKeyboard
export { useKeyboard }
