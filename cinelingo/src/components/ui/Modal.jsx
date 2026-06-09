import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({ open, onClose, title, children, size = 'md', className }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else       document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-2xl animate-slide-up',
          'max-h-[90vh] overflow-y-auto',
          sizes[size],
          className,
        )}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
            {title && <h2 className="text-lg font-semibold text-dark-900 font-display">{title}</h2>}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-cream-100 text-dark-600 hover:text-dark-900 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
