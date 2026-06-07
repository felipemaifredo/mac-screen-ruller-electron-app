//Types
type Point = {
  x: number
  y: number
}

type BadgeInfo = {
  x: number
  y: number
  w: number
  h: number
  text: string
}

//Funcs
function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  screenWidth: number,
  screenHeight: number,
  copied: boolean = false
): BadgeInfo {
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif"
  ctx.textBaseline = "middle"
  ctx.textAlign = "center"

  let displayText = copied ? "Copiado!" : text

  let textWidth = ctx.measureText(displayText).width
  let paddingX = 8
  let paddingY = 4
  let badgeWidth = textWidth + paddingX * 2
  let badgeHeight = 16 + paddingY * 2

  let badgeX = Math.max(10, Math.min(x - badgeWidth / 2, screenWidth - badgeWidth - 10))
  let badgeY = Math.max(10, Math.min(y - badgeHeight / 2, screenHeight - badgeHeight - 10))

  ctx.fillStyle = copied ? "rgba(40, 167, 69, 0.95)" : "rgba(30, 30, 30, 0.9)"
  ctx.beginPath()
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4)
  ctx.fill()

  ctx.strokeStyle = copied ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = "#ffffff"
  ctx.fillText(displayText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2)

  return { x: badgeX, y: badgeY, w: badgeWidth, h: badgeHeight, text }
}

function drawSelection(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  screenWidth: number,
  screenHeight: number,
  copied: boolean = false
): BadgeInfo | null {
  let x = Math.min(start.x, end.x)
  let y = Math.min(start.y, end.y)
  let w = Math.abs(start.x - end.x)
  let h = Math.abs(start.y - end.y)

  ctx.fillStyle = "rgba(0, 122, 255, 0.05)"
  ctx.fillRect(x, y, w, h)

  ctx.strokeStyle = "rgba(0, 122, 255, 0.85)"
  ctx.lineWidth = 1
  ctx.setLineDash([4, 3])
  ctx.strokeRect(x, y, w, h)
  ctx.setLineDash([])

  let labelText = `${w} × ${h} px`
  let labelX = x + w / 2
  let labelY = y + h / 2
  return drawBadge(ctx, labelText, labelX, labelY, screenWidth, screenHeight, copied)
}

function drawHorizontal(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  screenWidth: number,
  screenHeight: number,
  copied: boolean = false
): BadgeInfo | null {
  let y = start.y
  let xStart = start.x
  let xEnd = end.x
  let length = Math.abs(xEnd - xStart)

  ctx.strokeStyle = "rgba(0, 122, 255, 0.9)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xStart, y)
  ctx.lineTo(xEnd, y)
  ctx.stroke()

  ctx.strokeStyle = "rgba(0, 122, 255, 0.9)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xStart, y - 6)
  ctx.lineTo(xStart, y + 6)
  ctx.moveTo(xEnd, y - 6)
  ctx.lineTo(xEnd, y + 6)
  ctx.stroke()

  let labelText = `${length} px`
  let labelX = xStart + (xEnd - xStart) / 2
  let labelY = y - 18
  return drawBadge(ctx, labelText, labelX, labelY, screenWidth, screenHeight, copied)
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  screenWidth: number,
  screenHeight: number,
  copied: boolean = false
): BadgeInfo | null {
  let x = start.x
  let yStart = start.y
  let yEnd = end.y
  let length = Math.abs(yEnd - yStart)

  ctx.strokeStyle = "rgba(0, 122, 255, 0.9)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x, yStart)
  ctx.lineTo(x, yEnd)
  ctx.stroke()

  ctx.strokeStyle = "rgba(0, 122, 255, 0.9)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x - 6, yStart)
  ctx.lineTo(x + 6, yStart)
  ctx.moveTo(x - 6, yEnd)
  ctx.lineTo(x + 6, yEnd)
  ctx.stroke()

  let labelText = `${length} px`
  let labelX = x + 30
  let labelY = yStart + (yEnd - yStart) / 2
  return drawBadge(ctx, labelText, labelX, labelY, screenWidth, screenHeight, copied)
}

function drawCross(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  screenWidth: number,
  screenHeight: number,
  copied: boolean = false
): BadgeInfo | null {
  let xStart = start.x
  let yStart = start.y
  let xEnd = end.x
  let yEnd = end.y

  let w = Math.abs(xEnd - xStart)
  let h = Math.abs(yEnd - yStart)

  ctx.strokeStyle = "rgba(0, 122, 255, 0.85)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xStart, yStart)
  ctx.lineTo(xEnd, yStart)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(xEnd, yStart)
  ctx.lineTo(xEnd, yEnd)
  ctx.stroke()

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xStart, yStart)
  ctx.lineTo(xStart, yEnd)
  ctx.lineTo(xEnd, yEnd)
  ctx.stroke()
  ctx.setLineDash([])

  let labelText = `${w} × ${h} px`
  let labelX = Math.min(xStart, xEnd) + w / 2
  let labelY = Math.min(yStart, yEnd) + h / 2
  return drawBadge(ctx, labelText, labelX, labelY, screenWidth, screenHeight, copied)
}

export type { Point, BadgeInfo }
export { clearCanvas, drawSelection, drawHorizontal, drawVertical, drawCross }
