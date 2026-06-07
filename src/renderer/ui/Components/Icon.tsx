//Libs
import React from "react"

//Types
type IconProps = {
  name: "selection" | "horizontal" | "vertical" | "cross" | "grabber" | "close" | "minimize"
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

  return null
}

export default Icon
export { Icon }
