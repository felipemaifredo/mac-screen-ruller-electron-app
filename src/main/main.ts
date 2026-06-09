//Libs
import { app, BrowserWindow, ipcMain, globalShortcut, screen, systemPreferences, nativeImage } from "electron"
import * as path from "path"
import { fileURLToPath } from "url"
import * as fs from "fs"

//Imports
// (No custom local imports in main file)

app.setName("Mai Screen Ruller")

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
let currentThemeColor: string = "blue"
let currentThemeMode: "dark" | "light" = "dark"
let currentMaterialType: "translucent" | "tinted" = "translucent"
let configPath = path.join(app.getPath("userData"), "config.json")

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      let rawData = fs.readFileSync(configPath, "utf-8")
      let data = JSON.parse(rawData)
      if (data) {
        if (typeof data.themeColor === "string") {
          currentThemeColor = data.themeColor
        }
        if (typeof data.themeMode === "string") {
          currentThemeMode = data.themeMode as "dark" | "light"
        }
        if (typeof data.materialType === "string") {
          currentMaterialType = data.materialType as "translucent" | "tinted"
        }
      }
    }
  } catch (e) {
    console.error("Erro ao carregar config:", e)
  }
}

function saveConfig() {
  try {
    let data = {
      themeColor: currentThemeColor,
      themeMode: currentThemeMode,
      materialType: currentMaterialType
    }
    fs.writeFileSync(configPath, JSON.stringify(data), "utf-8")
  } catch (e) {
    console.error("Erro ao salvar config:", e)
  }
}

function broadcastMode(mode: string | null) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-measurement-mode", mode)
  }
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send("update-measurement-mode", mode)
  }
}

function broadcastThemeColor(color: string) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-theme-color", color)
  }
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send("update-theme-color", color)
  }
}

function broadcastThemeMode(mode: "dark" | "light") {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-theme-mode", mode)
  }
}

function broadcastMaterialType(type: "translucent" | "tinted") {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-material-type", type)
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
    title: "Mai Screen Ruller",
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

  toolbarWin.webContents.on("did-finish-load", function () {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.webContents.send("update-theme-color", currentThemeColor)
      toolbarWin.webContents.send("update-theme-mode", currentThemeMode)
      toolbarWin.webContents.send("update-material-type", currentMaterialType)
    }
  })

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

  overlayWin.webContents.on("did-finish-load", function () {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.webContents.send("update-theme-color", currentThemeColor)
      overlayWin.webContents.send("update-measurement-mode", currentMode)
    }
  })

  overlayWin.on("closed", function () {
    overlayWin = null
  })
}

function setupIpc() {
  ipcMain.on("set-measurement-mode", function (_event, mode: string | null) {
    handleModeChange(mode)
  })

  ipcMain.on("set-theme-color", function (_event, color: string) {
    currentThemeColor = color
    saveConfig()
    broadcastThemeColor(color)
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
    if (process.platform === "darwin") {
      if (toolbarWin && !toolbarWin.isDestroyed()) {
        toolbarWin.close()
      }
    } else {
      app.quit()
    }
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

  ipcMain.on("set-theme-mode", function (_event, mode: "dark" | "light") {
    currentThemeMode = mode
    saveConfig()
    broadcastThemeMode(mode)
  })

  ipcMain.on("set-material-type", function (_event, type: "translucent" | "tinted") {
    currentMaterialType = type
    saveConfig()
    broadcastMaterialType(type)
  })

  ipcMain.handle("get-system-accent-color", function () {
    try {
      if (typeof systemPreferences.getAccentColor === "function") {
        let rawColor = systemPreferences.getAccentColor()
        if (rawColor && rawColor.length >= 6) {
          return "#" + rawColor.substring(0, 6)
        }
      }
    } catch (e) {
      console.error("Erro ao ler cor de destaque:", e)
    }
    return "#007aff"
  })
}

function registerShortcuts() {
  globalShortcut.register("CommandOrControl+Shift+M", function () {
    if (toolbarWin && !toolbarWin.isDestroyed() && toolbarWin.isMinimized()) {
      toolbarWin.restore()
    }
    if (currentMode) {
      handleModeChange(null)
    } else {
      handleModeChange("selection")
    }
  })
}

//Main
function createWindows() {
  if (!toolbarWin || toolbarWin.isDestroyed()) {
    createToolbarWindow()
  }
  if (!overlayWin || overlayWin.isDestroyed()) {
    createOverlayWindow()
  }
}

function init() {
  loadConfig()

  if (process.platform === "darwin") {
    try {
      app.dock.show()
      let iconPath = path.join(__dirname, "../assets/lin/icon.png")
      if (!fs.existsSync(iconPath)) {
        iconPath = path.join(__dirname, "../../assets/lin/icon.png")
      }
      if (fs.existsSync(iconPath)) {
        let image = nativeImage.createFromPath(iconPath)
        app.dock.setIcon(image)
      }
    } catch (e) {
      console.error("Erro ao definir icone do Dock:", e)
    }
  }

  createWindows()
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
    createWindows()
  } else {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      if (toolbarWin.isMinimized()) {
        toolbarWin.restore()
      }
      toolbarWin.focus()
    }
  }
})

app.on("will-quit", function () {
  globalShortcut.unregisterAll()
})
