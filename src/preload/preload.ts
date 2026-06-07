//Libs
import { contextBridge, ipcRenderer } from "electron"

//Main
contextBridge.exposeInMainWorld("electronAPI", {
  setMeasurementMode: function (mode: string | null) {
    ipcRenderer.send("set-measurement-mode", mode)
  },
  onUpdateMeasurementMode: function (callback: (mode: string | null) => void) {
    let subscription = function (_event: unknown, mode: string | null) {
      callback(mode)
    }
    ipcRenderer.on("update-measurement-mode", subscription)
  },
  cancelMeasurement: function () {
    ipcRenderer.send("overlay-action", "cancel")
  },
  confirmMeasurement: function () {
    ipcRenderer.send("overlay-action", "confirm")
  },
  onOverlayAction: function (callback: (action: string) => void) {
    let subscription = function (_event: unknown, action: string) {
      callback(action)
    }
    ipcRenderer.on("overlay-action", subscription)
  },
  closeApp: function () {
    ipcRenderer.send("close-app")
  },
  minimizeApp: function () {
    ipcRenderer.send("minimize-app")
  },
  resizeWindow: function (width: number, height: number) {
    ipcRenderer.send("resize-window", width, height)
  },
  setThemeColor: function (color: string) {
    ipcRenderer.send("set-theme-color", color)
  },
  onUpdateThemeColor: function (callback: (color: string) => void) {
    let subscription = function (_event: unknown, color: string) {
      callback(color)
    }
    ipcRenderer.on("update-theme-color", subscription)
  }
})
