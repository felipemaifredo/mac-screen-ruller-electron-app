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
  setThemeColor: (color: string) => void
  onUpdateThemeColor: (callback: (color: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export type { ElectronAPI }
