//Libs
import { app, BrowserWindow, ipcMain, globalShortcut, screen } from "electron"
import * as path from "path"
import { fileURLToPath } from "url"

//Imports
// (No custom local imports in main file)

//Types
type WindowConfig = {
  width: number
  height: number
  x?: number
  y?: number
}

//Consts
// (None - using let since rule 4 restricts const to JSX)

//Funcs
function getDirname() {
  let filename = fileURLToPath(import.meta.url)
  return path.dirname(filename)
}

let __dirname = getDirname()
let toolbarWin: BrowserWindow | null = null
let overlayWin: BrowserWindow | null = null
let currentMode: string | null = null

function broadcastMode(mode: string | null) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-measurement-mode", mode)
  }
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send("update-measurement-mode", mode)
  }
}

function handleModeChange(mode: string | null) {
  currentMode = mode
  if (mode) {
    if (overlayWin && !overlayWin.isDestroyed()) {
      let cursorPoint = screen.getCursorScreenPoint()
      let targetDisplay = screen.getDisplayNearestPoint(cursorPoint)
      let bounds = targetDisplay.bounds

      overlayWin.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      })

      overlayWin.show()
      overlayWin.focus()
    }
  } else {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.hide()
    }
  }
  broadcastMode(mode)
}

function createToolbarWindow() {
  let primaryDisplay = screen.getPrimaryDisplay()
  let bounds = primaryDisplay.bounds
  let width = 250
  let height = 50

  toolbarWin = new BrowserWindow({
    width: width,
    height: height,
    x: Math.round(bounds.x + (bounds.width - width) / 2),
    y: bounds.y + 40,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  toolbarWin.setAlwaysOnTop(true, "floating")

  let devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    toolbarWin.loadURL(devServerUrl + "?window=toolbar")
    toolbarWin.webContents.openDevTools({ mode: "detach" })
  } else {
    let indexHtml = path.join(__dirname, "../dist/index.html")
    toolbarWin.loadFile(indexHtml, { search: "window=toolbar" })
  }

  toolbarWin.on("closed", function () {
    toolbarWin = null
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.close()
    }
  })
}

function createOverlayWindow() {
  let primaryDisplay = screen.getPrimaryDisplay()
  let bounds = primaryDisplay.bounds

  overlayWin = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    enableLargerThanScreen: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  overlayWin.setAlwaysOnTop(true, "screen-saver")
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  let devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    overlayWin.loadURL(devServerUrl + "?window=overlay")
  } else {
    let indexHtml = path.join(__dirname, "../dist/index.html")
    overlayWin.loadFile(indexHtml, { search: "window=overlay" })
  }

  overlayWin.on("closed", function () {
    overlayWin = null
  })
}

function setupIpc() {
  ipcMain.on("set-measurement-mode", function (_event, mode: string | null) {
    handleModeChange(mode)
  })

  ipcMain.on("overlay-action", function (_event, action: string) {
    if (action === "cancel") {
      handleModeChange(null)
    } else if (action === "confirm") {
      if (overlayWin && !overlayWin.isDestroyed()) {
        overlayWin.webContents.send("overlay-action", "confirm")
      }
    }
  })

  ipcMain.on("close-app", function () {
    app.quit()
  })

  ipcMain.on("minimize-app", function () {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.minimize()
    }
  })

  ipcMain.on("resize-window", function (_event, width: number, height: number) {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.setSize(width, height)
    }
  })
}

function registerShortcuts() {
  globalShortcut.register("CommandOrControl+Shift+M", function () {
    if (currentMode) {
      handleModeChange(null)
    } else {
      handleModeChange("selection")
    }
  })
}

//Main
function init() {
  createToolbarWindow()
  createOverlayWindow()
  setupIpc()
  registerShortcuts()
}

app.whenReady().then(init)

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    init()
  }
})

app.on("will-quit", function () {
  globalShortcut.unregisterAll()
})
