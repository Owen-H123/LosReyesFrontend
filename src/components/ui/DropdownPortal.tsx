// components/ui/DropdownPortal.tsx
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

interface Props {
  anchorRef: RefObject<HTMLElement>
  open: boolean
  align?: 'left' | 'right'
  width?: number
  children: React.ReactNode
}

/**
 * DropdownPortal — renderiza un dropdown (notificaciones, perfil, etc.)
 * directamente en document.body en vez de anidado dentro del header.
 *
 * POR QUÉ: los motion.div de Framer Motion dejan un "transform" aplicado
 * como estilo inline incluso en reposo, y eso crea un nuevo stacking
 * context en CSS. Como el dashboard tiene varias tarjetas animadas, esas
 * tarjetas terminaban pintándose ENCIMA del dropdown del header aunque
 * tuviera z-index alto — el z-index solo compite dentro del mismo stacking
 * context. Sacar el dropdown a un portal lo libera de ese problema por
 * completo, sin importar qué animaciones haya en el contenido de la página.
 */
export function DropdownPortal({ anchorRef, open, align = 'right', width = 320, children }: Props) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) { setPos(null); return }
    const rect = anchorRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 8, left: align === 'right' ? rect.right - width : rect.left })
  }, [open, anchorRef, align, width])

  useEffect(() => {
    if (!open) return
    const reposition = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: align === 'right' ? rect.right - width : rect.left })
    }
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, anchorRef, align, width])

  if (!open || !pos) return null

  return createPortal(
    <div
      className="fixed z-[100] animate-slide-down"
      style={{ top: pos.top, left: pos.left, width }}
      onMouseDown={e => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  )
}