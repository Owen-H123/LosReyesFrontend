// components/ui/card.tsx
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  hover?: boolean
  padding?: string
}

export function Card({ children, className = '', style = {}, hover = false, padding = 'p-5' }: CardProps) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${padding} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
