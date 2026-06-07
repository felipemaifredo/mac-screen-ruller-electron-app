//Types
type ElectronAPI = {
  setMeasurementMode: (mode: string | null) => void
  onUpdateMeasurementMode: (callback: (mode: string | null) => void) => void
  cancelMeasurement: () => void
  confirmMeasurement: () => void
  onOverlayAction: (callback: (action: string) => void) => void
  closeApp: () => void
  minimizeApp: () => void
  resizeWindow: (width: number, height: number) => void
  getSystemAccentColor: () => Promise<string>
  setThemeColor: (color: string) => void
  onUpdateThemeColor: (callback: (color: string) => void) => void
  setThemeMode: (mode: "dark" | "light") => void
  onUpdateThemeMode: (callback: (mode: "dark" | "light") => void) => void
  setMaterialType: (type: "translucent" | "tinted") => void
  onUpdateMaterialType: (callback: (type: "translucent" | "tinted") => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export type { ElectronAPI }
