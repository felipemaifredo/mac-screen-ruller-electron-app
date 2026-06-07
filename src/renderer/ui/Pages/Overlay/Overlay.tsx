//Libs
import { useState, useEffect, useRef, useCallback } from "react"

//Imports
import useKeyboard from "../../../Lib/Hooks/useKeyboard"
import { clearCanvas, drawSelection, drawHorizontal, drawVertical, drawCross } from "../../../Lib/Utils/canvasDrawing"
import type { Point, BadgeInfo } from "../../../Lib/Utils/canvasDrawing"
import styles from "./Overlay.module.css"

//Main
const Overlay = () => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null)
  let [mode, setMode] = useState<string | null>(null)
  let [startPoint, setStartPoint] = useState<Point | null>(null)
  let [endPoint, setEndPoint] = useState<Point | null>(null)
  let [isDrawing, setIsDrawing] = useState(false)
  let [isFrozen, setIsFrozen] = useState(false)
  let [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight })
  let activeBadgeRef = useRef<BadgeInfo | null>(null)
  let [copied, setCopied] = useState(false)

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
    function handleResize() {
      setDimensions({ w: window.innerWidth, h: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)
    return function () {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  let keyHandlers = {
    Escape: function () {
      if (startPoint || endPoint) {
        setStartPoint(null)
        setEndPoint(null)
        setIsDrawing(false)
        setIsFrozen(false)
      } else {
        window.electronAPI.cancelMeasurement()
      }
    }
  }
  useKeyboard(keyHandlers)

  let draw = useCallback(function () {
    let canvas = canvasRef.current
    if (!canvas) return

    let ctx = canvas.getContext("2d")
    if (!ctx) return

    clearCanvas(ctx, dimensions.w, dimensions.h)

    if (!mode || !startPoint || !endPoint) {
      activeBadgeRef.current = null
      return
    }

    let badge: BadgeInfo | null = null

    if (mode === "selection") {
      badge = drawSelection(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied)
    } else if (mode === "horizontal") {
      badge = drawHorizontal(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied)
    } else if (mode === "vertical") {
      badge = drawVertical(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied)
    } else if (mode === "cross") {
      badge = drawCross(ctx, startPoint, endPoint, dimensions.w, dimensions.h, copied)
    }

    activeBadgeRef.current = badge
  }, [mode, startPoint, endPoint, dimensions, copied])

  useEffect(function () {
    draw()
  }, [draw])

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!mode) return

    if (isFrozen && activeBadgeRef.current) {
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

    let currentPoint = { x: e.clientX, y: e.clientY }
    setStartPoint(currentPoint)
    setEndPoint(currentPoint)
    setIsDrawing(true)
    setIsFrozen(false)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    let canvas = canvasRef.current
    if (!canvas) return

    if (isFrozen && activeBadgeRef.current) {
      let badge = activeBadgeRef.current
      let isInside =
        e.clientX >= badge.x &&
        e.clientX <= badge.x + badge.w &&
        e.clientY >= badge.y &&
        e.clientY <= badge.y + badge.h

      if (isInside) {
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
