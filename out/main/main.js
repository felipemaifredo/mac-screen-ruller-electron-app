"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
electron.app.setName("Mai Screen Ruller");
let toolbarWin = null;
let overlayWin = null;
let currentMode = null;
let currentThemeColor = "blue";
let currentThemeMode = "dark";
let currentMaterialType = "translucent";
let configPath = path__namespace.join(electron.app.getPath("userData"), "config.json");
function loadConfig() {
  try {
    if (fs__namespace.existsSync(configPath)) {
      let rawData = fs__namespace.readFileSync(configPath, "utf-8");
      let data = JSON.parse(rawData);
      if (data) {
        if (typeof data.themeColor === "string") {
          currentThemeColor = data.themeColor;
        }
        if (typeof data.themeMode === "string") {
          currentThemeMode = data.themeMode;
        }
        if (typeof data.materialType === "string") {
          currentMaterialType = data.materialType;
        }
      }
    }
  } catch (e) {
    console.error("Erro ao carregar config:", e);
  }
}
function saveConfig() {
  try {
    let data = {
      themeColor: currentThemeColor,
      themeMode: currentThemeMode,
      materialType: currentMaterialType
    };
    fs__namespace.writeFileSync(configPath, JSON.stringify(data), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar config:", e);
  }
}
function broadcastMode(mode) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-measurement-mode", mode);
  }
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send("update-measurement-mode", mode);
  }
}
function broadcastThemeColor(color) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-theme-color", color);
  }
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send("update-theme-color", color);
  }
}
function broadcastThemeMode(mode) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-theme-mode", mode);
  }
}
function broadcastMaterialType(type) {
  if (toolbarWin && !toolbarWin.isDestroyed()) {
    toolbarWin.webContents.send("update-material-type", type);
  }
}
function handleModeChange(mode) {
  currentMode = mode;
  if (mode) {
    if (overlayWin && !overlayWin.isDestroyed()) {
      let cursorPoint = electron.screen.getCursorScreenPoint();
      let targetDisplay = electron.screen.getDisplayNearestPoint(cursorPoint);
      let bounds = targetDisplay.bounds;
      overlayWin.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      });
      overlayWin.show();
      overlayWin.focus();
    }
  } else {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.hide();
    }
  }
  broadcastMode(mode);
}
function createToolbarWindow() {
  let primaryDisplay = electron.screen.getPrimaryDisplay();
  let bounds = primaryDisplay.bounds;
  let width = 250;
  let height = 50;
  toolbarWin = new electron.BrowserWindow({
    title: "Mai Screen Ruller",
    width,
    height,
    x: Math.round(bounds.x + (bounds.width - width) / 2),
    y: bounds.y + 40,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    hasShadow: true,
    webPreferences: {
      preload: path__namespace.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  toolbarWin.setAlwaysOnTop(true, "floating");
  let devServerUrl = process.env.ELECTRON_RENDERER_URL;
  if (devServerUrl) {
    toolbarWin.loadURL(devServerUrl + "?window=toolbar");
    toolbarWin.webContents.openDevTools({ mode: "detach" });
  } else {
    let indexHtml = path__namespace.join(__dirname, "../renderer/index.html");
    toolbarWin.loadFile(indexHtml, { search: "window=toolbar" });
  }
  toolbarWin.webContents.on("did-finish-load", function() {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.webContents.send("update-theme-color", currentThemeColor);
      toolbarWin.webContents.send("update-theme-mode", currentThemeMode);
      toolbarWin.webContents.send("update-material-type", currentMaterialType);
    }
  });
  toolbarWin.on("closed", function() {
    toolbarWin = null;
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.close();
    }
  });
}
function createOverlayWindow() {
  let primaryDisplay = electron.screen.getPrimaryDisplay();
  let bounds = primaryDisplay.bounds;
  overlayWin = new electron.BrowserWindow({
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
      preload: path__namespace.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  overlayWin.setAlwaysOnTop(true, "screen-saver");
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  let devServerUrl = process.env.ELECTRON_RENDERER_URL;
  if (devServerUrl) {
    overlayWin.loadURL(devServerUrl + "?window=overlay");
  } else {
    let indexHtml = path__namespace.join(__dirname, "../renderer/index.html");
    overlayWin.loadFile(indexHtml, { search: "window=overlay" });
  }
  overlayWin.webContents.on("did-finish-load", function() {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.webContents.send("update-theme-color", currentThemeColor);
      overlayWin.webContents.send("update-measurement-mode", currentMode);
    }
  });
  overlayWin.on("closed", function() {
    overlayWin = null;
  });
}
function setupIpc() {
  electron.ipcMain.on("set-measurement-mode", function(_event, mode) {
    handleModeChange(mode);
  });
  electron.ipcMain.on("set-theme-color", function(_event, color) {
    currentThemeColor = color;
    saveConfig();
    broadcastThemeColor(color);
  });
  electron.ipcMain.on("overlay-action", function(_event, action) {
    if (action === "cancel") {
      handleModeChange(null);
    } else if (action === "confirm") {
      if (overlayWin && !overlayWin.isDestroyed()) {
        overlayWin.webContents.send("overlay-action", "confirm");
      }
    }
  });
  electron.ipcMain.on("close-app", function() {
    if (process.platform === "darwin") {
      if (toolbarWin && !toolbarWin.isDestroyed()) {
        toolbarWin.close();
      }
    } else {
      electron.app.quit();
    }
  });
  electron.ipcMain.on("minimize-app", function() {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.minimize();
    }
  });
  electron.ipcMain.on("resize-window", function(_event, width, height) {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      toolbarWin.setSize(width, height);
    }
  });
  electron.ipcMain.on("set-theme-mode", function(_event, mode) {
    currentThemeMode = mode;
    saveConfig();
    broadcastThemeMode(mode);
  });
  electron.ipcMain.on("set-material-type", function(_event, type) {
    currentMaterialType = type;
    saveConfig();
    broadcastMaterialType(type);
  });
  electron.ipcMain.handle("get-system-accent-color", function() {
    try {
      if (typeof electron.systemPreferences.getAccentColor === "function") {
        let rawColor = electron.systemPreferences.getAccentColor();
        if (rawColor && rawColor.length >= 6) {
          return "#" + rawColor.substring(0, 6);
        }
      }
    } catch (e) {
      console.error("Erro ao ler cor de destaque:", e);
    }
    return "#007aff";
  });
}
function registerShortcuts() {
  electron.globalShortcut.register("CommandOrControl+Shift+M", function() {
    if (toolbarWin && !toolbarWin.isDestroyed() && toolbarWin.isMinimized()) {
      toolbarWin.restore();
    }
    if (currentMode) {
      handleModeChange(null);
    } else {
      handleModeChange("selection");
    }
  });
}
function createWindows() {
  if (!toolbarWin || toolbarWin.isDestroyed()) {
    createToolbarWindow();
  }
  if (!overlayWin || overlayWin.isDestroyed()) {
    createOverlayWindow();
  }
}
function init() {
  loadConfig();
  if (process.platform === "darwin") {
    try {
      electron.app.dock?.show();
      let iconPath = path__namespace.join(__dirname, "../assets/lin/icon.png");
      if (!fs__namespace.existsSync(iconPath)) {
        iconPath = path__namespace.join(__dirname, "../../assets/lin/icon.png");
      }
      if (fs__namespace.existsSync(iconPath)) {
        let image = electron.nativeImage.createFromPath(iconPath);
        electron.app.dock?.setIcon(image);
      }
    } catch (e) {
      console.error("Erro ao definir icone do Dock:", e);
    }
  }
  createWindows();
  setupIpc();
  registerShortcuts();
}
electron.app.whenReady().then(init);
electron.app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", function() {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  } else {
    if (toolbarWin && !toolbarWin.isDestroyed()) {
      if (toolbarWin.isMinimized()) {
        toolbarWin.restore();
      }
      toolbarWin.focus();
    }
  }
});
electron.app.on("will-quit", function() {
  electron.globalShortcut.unregisterAll();
});
