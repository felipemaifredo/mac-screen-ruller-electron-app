//Libs
import React from "react"

//Types
type IconProps = {
  name: "selection" | "horizontal" | "vertical" | "cross" | "grabber" | "close" | "minimize" | "settings" | "help"
  size?: number
  className?: string
}

//Main
const Icon = ({ name, size = 16, className = "" }: IconProps) => {
  let style = { width: size, height: size }

  if (name === "selection") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
      </svg>
    )
  }

  if (name === "horizontal") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M7 8l-4 4 4 4M17 8l4 4-4 4" />
      </svg>
    )
  }

  if (name === "vertical") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="3" x2="12" y2="21" />
        <path d="M8 7l4-4 4 4M8 17l4 4 4-4" />
      </svg>
    )
  }

  if (name === "cross") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  if (name === "grabber") {
    return (
      <svg style={style} className={className} viewBox="0 0 8 16" fill="currentColor">
        <circle cx="2" cy="2" r="1" />
        <circle cx="2" cy="6" r="1" />
        <circle cx="2" cy="10" r="1" />
        <circle cx="2" cy="14" r="1" />
        <circle cx="6" cy="2" r="1" />
        <circle cx="6" cy="6" r="1" />
        <circle cx="6" cy="10" r="1" />
        <circle cx="6" cy="14" r="1" />
      </svg>
    )
  }

  if (name === "close") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
  }

  if (name === "minimize") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    )
  }

  if (name === "settings") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }

  if (name === "help") {
    return (
      <svg style={style} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    )
  }

  return null
}

export default Icon
export { Icon }
