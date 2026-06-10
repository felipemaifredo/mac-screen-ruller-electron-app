//Libs
import { useState, useEffect, useRef, useCallback, useMemo } from "react"

//Imports
import useKeyboard from "../../../Lib/Hooks/useKeyboard"
import useI18n from "../../../Lib/Hooks/useI18n"
import { clearCanvas, drawSelection, drawHorizontal, drawVertical } from "../../../Lib/Utils/canvasDrawing"
import type { Point, BadgeInfo, ThemeColor } from "../../../Lib/Utils/canvasDrawing"
import styles from "./Overlay.module.css"

//Types
type PinnedMeasurement = {
  mode: string
  startPoint: Point
  endPoint: Point
}

//Main
const Overlay = () => {
  let { t } = useI18n()
  let canvasRef = useRef<HTMLCanvasElement | null>(null)
  let [mode, setMode] = useState<string | null>(null)
  let [theme, setTheme] = useState<ThemeColor>("blue")
  let [startPoint, setStartPoint] = useState<Point | null>(null)
  let [endPoint, setEndPoint] = useState<Point | null>(null)
  let [isDrawing, setIsDrawing] = useState(false)
  let [isFrozen, setIsFrozen] = useState(false)
  let [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight })
  let [copied, setCopied] = useState(false)

  // Pin state
  let [fixedMeasurements, setFixedMeasurements] = useState<PinnedMeasurement[]>([])
  let [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  let [systemColor, setSystemColor] = useState<string>("#007aff")

  let activeBadgeRef = useRef<BadgeInfo | null>(null)
  let fixedBadgesRef = useRef<BadgeInfo[]>([])

  useEffect(function () {
    window.electronAPI.getSystemAccentColor().then(function (color) {
      setSystemColor(color)
    })
  }, [])

  useEffect(function () {
    let unsubscribe = window.electronAPI.onUpdateMeasurementMode(function (newMode) {
      setMode(newMode)
      setStartPoint(null)
      setEndPoint(null)
      setIsDrawing(false)
      setIsFrozen(false)
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
    function handleResize() {
      setDimensions({ w: window.innerWidth, h: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)
    return function () {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  let keyHandlers = useMemo(function () {
    return {
      Escape: function () {
        if (startPoint || endPoint) {
          setStartPoint(null)
          setEndPoint(null)
          setIsDrawing(false)
          setIsFrozen(false)
        } else if (fixedMeasurements.length > 0) {
          setFixedMeasurements([])
        } else {
          window.electronAPI.cancelMeasurement()
        }
      },
      Enter: function () {
        if (isFrozen && startPoint && endPoint && mode) {
          setFixedMeasurements(function (prev) {
            return [...prev, { mode, startPoint, endPoint }]
          })
          setStartPoint(null)
          setEndPoint(null)
          setIsDrawing(false)
          setIsFrozen(false)
        }
      },
      Backspace: function () {
        setFixedMeasurements(function (prev) {
          return prev.slice(0, -1)
        })
      },
      ArrowUp: function (event: KeyboardEvent) {
        if (isFrozen && endPoint) {
          let delta = event.shiftKey ? 10 : 1
          setEndPoint(function (prev) {
            return prev ? { ...prev, y: prev.y - delta } : null
          })
        }
      },
      ArrowDown: function (event: KeyboardEvent) {
        if (isFrozen && endPoint) {
          let delta = event.shiftKey ? 10 : 1
          setEndPoint(function (prev) {
            return prev ? { ...prev, y: prev.y + delta } : null
          })
        }
      },
      ArrowLeft: function (event: KeyboardEvent) {
        if (isFrozen && endPoint) {
          let delta = event.shiftKey ? 10 : 1
          setEndPoint(function (prev) {
            return prev ? { ...prev, x: prev.x - delta } : null
          })
        }
      },
      ArrowRight: function (event: KeyboardEvent) {
        if (isFrozen && endPoint) {
          let delta = event.shiftKey ? 10 : 1
          setEndPoint(function (prev) {
            return prev ? { ...prev, x: prev.x + delta } : null
          })
        }
      },
      s: function () { window.electronAPI.setMeasurementMode("selection") },
      S: function () { window.electronAPI.setMeasurementMode("selection") },
      h: function () { window.electronAPI.setMeasurementMode("horizontal") },
      H: function () { window.electronAPI.setMeasurementMode("horizontal") },
      v: function () { window.electronAPI.setMeasurementMode("vertical") },
      V: function () { window.electronAPI.setMeasurementMode("vertical") },
      // c: function () { window.electronAPI.setMeasurementMode("cross") },
      // C: function () { window.electronAPI.setMeasurementMode("cross") }
    }
  }, [startPoint, endPoint, mode, isFrozen, fixedMeasurements])

  useKeyboard(keyHandlers)

  let draw = useCallback(function () {
    let canvas = canvasRef.current
    if (!canvas) return

    let ctx = canvas.getContext("2d")
    if (!ctx) return

    clearCanvas(ctx, dimensions.w, dimensions.h)

    // Draw pinned measurements
    let newFixedBadges: BadgeInfo[] = []
    fixedMeasurements.forEach(function (m, idx) {
      let isCopied = copiedIndex === idx
      let badge: BadgeInfo | null = null

      if (m.mode === "selection") {
        badge = drawSelection(ctx, m.startPoint, m.endPoint, dimensions.w, dimensions.h, isCopied, theme, systemColor, t.toolbar.copied)
      } else if (m.mode === "horizontal") {
        badge = drawHorizontal(ctx, m.startPoint, m.endPoint, dimensions.w, dimensions.h, isCopied, theme, systemColor, t.toolbar.copied)
      } else if (m.mode === "vertical") {
        badge = drawVertical(ctx, m.startPoint, m.endPoint, dimensions.w, dimensions.h, isCopied, theme, systemColor, t.toolbar.copied)
      }
      // else if (m.mode === "cross") {
      //   badge = drawCross(ctx, m.startPoint, m.endPoint, dimensions.w, dimensions.h, isCopied, theme)
      // }

      if (badge) {
        newFixedBadges.push(badge)
      }
    })
    fixedBadgesRef.current = newFixedBadges

    // Draw active measurement
    if (!mode || !startPoint || !endPoint) {
      activeBadgeRef.current = null
      return
    }

    let badge: BadgeInfo | null = null

    if (mode === "selection") {
      badge = drawSelection(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied, theme, systemColor, t.toolbar.copied)
    } else if (mode === "horizontal") {
      badge = drawHorizontal(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied, theme, systemColor, t.toolbar.copied)
    } else if (mode === "vertical") {
      badge = drawVertical(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied, theme, systemColor, t.toolbar.copied)
    }
    // else if (mode === "cross") {
    //   badge = drawCross(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied, theme)
    // }

    activeBadgeRef.current = badge
  }, [mode, startPoint, endPoint, dimensions, copied, theme, fixedMeasurements, copiedIndex, systemColor, t.toolbar.copied])

  useEffect(function () {
    draw()
  }, [draw])

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!mode) return

    if (isFrozen) {
      // Check active badge click
      if (activeBadgeRef.current) {
        let badge = activeBadgeRef.current
        let isInside =
          e.clientX >= badge.x &&
          e.clientX <= badge.x + badge.w &&
          e.clientY >= badge.y &&
          e.clientY <= badge.y + badge.h

        if (isInside) {
          let cleanText = badge.text.replace(/\s*px\s*$/, "").trim()
          navigator.clipboard.writeText(cleanText)
          setCopied(true)
          setTimeout(function () {
            setCopied(false)
          }, 1000)
          return
        }
      }

      // Check pinned badges click
      for (let i = 0; i < fixedBadgesRef.current.length; i++) {
        let badge = fixedBadgesRef.current[i]
        let isInside =
          e.clientX >= badge.x &&
          e.clientX <= badge.x + badge.w &&
          e.clientY >= badge.y &&
          e.clientY <= badge.y + badge.h

        if (isInside) {
          let cleanText = badge.text.replace(/\s*px\s*$/, "").trim()
          navigator.clipboard.writeText(cleanText)
          setCopiedIndex(i)
          setTimeout(function () {
            setCopiedIndex(null)
          }, 1000)
          return
        }
      }
    }

    let currentPoint = { x: e.clientX, y: e.clientY }
    setStartPoint(currentPoint)
    setEndPoint(currentPoint)
    setIsDrawing(true)
    setIsFrozen(false)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    let canvas = canvasRef.current
    if (!canvas) return

    if (isFrozen) {
      let isOverBadge = false

      if (activeBadgeRef.current) {
        let badge = activeBadgeRef.current
        if (
          e.clientX >= badge.x &&
          e.clientX <= badge.x + badge.w &&
          e.clientY >= badge.y &&
          e.clientY <= badge.y + badge.h
        ) {
          isOverBadge = true
        }
      }

      if (!isOverBadge) {
        for (let i = 0; i < fixedBadgesRef.current.length; i++) {
          let badge = fixedBadgesRef.current[i]
          if (
            e.clientX >= badge.x &&
            e.clientX <= badge.x + badge.w &&
            e.clientY >= badge.y &&
            e.clientY <= badge.y + badge.h
          ) {
            isOverBadge = true
            break
          }
        }
      }

      if (isOverBadge) {
        canvas.style.cursor = "pointer"
      } else {
        canvas.style.cursor = "crosshair"
      }
      return
    }

    if (!isDrawing || !startPoint) {
      if (mode && canvas.style.cursor !== "crosshair") {
        canvas.style.cursor = "crosshair"
      }
      return
    }

    setEndPoint({ x: e.clientX, y: e.clientY })
  }

  function handleMouseUp() {
    if (!isDrawing) return

    setIsDrawing(false)
    setIsFrozen(true)
  }

  return (
    <div className={styles.overlay}>
      <canvas
        ref={canvasRef}
        width={dimensions.w}
        height={dimensions.h}
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}

export default Overlay
export { Overlay }
