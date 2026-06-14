"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  setMeasurementMode: function(mode) {
    electron.ipcRenderer.send("set-measurement-mode", mode);
  },
  onUpdateMeasurementMode: function(callback) {
    let subscription = function(_event, mode) {
      callback(mode);
    };
    electron.ipcRenderer.on("update-measurement-mode", subscription);
  },
  cancelMeasurement: function() {
    electron.ipcRenderer.send("overlay-action", "cancel");
  },
  confirmMeasurement: function() {
    electron.ipcRenderer.send("overlay-action", "confirm");
  },
  onOverlayAction: function(callback) {
    let subscription = function(_event, action) {
      callback(action);
    };
    electron.ipcRenderer.on("overlay-action", subscription);
  },
  closeApp: function() {
    electron.ipcRenderer.send("close-app");
  },
  minimizeApp: function() {
    electron.ipcRenderer.send("minimize-app");
  },
  resizeWindow: function(width, height) {
    electron.ipcRenderer.send("resize-window", width, height);
  },
  getSystemAccentColor: function() {
    return electron.ipcRenderer.invoke("get-system-accent-color");
  },
  setThemeColor: function(color) {
    electron.ipcRenderer.send("set-theme-color", color);
  },
  onUpdateThemeColor: function(callback) {
    let subscription = function(_event, color) {
      callback(color);
    };
    electron.ipcRenderer.on("update-theme-color", subscription);
  },
  setThemeMode: function(mode) {
    electron.ipcRenderer.send("set-theme-mode", mode);
  },
  onUpdateThemeMode: function(callback) {
    let subscription = function(_event, mode) {
      callback(mode);
    };
    electron.ipcRenderer.on("update-theme-mode", subscription);
  },
  setMaterialType: function(type) {
    electron.ipcRenderer.send("set-material-type", type);
  },
  onUpdateMaterialType: function(callback) {
    let subscription = function(_event, type) {
      callback(type);
    };
    electron.ipcRenderer.on("update-material-type", subscription);
  }
});
