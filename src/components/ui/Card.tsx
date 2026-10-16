import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  className?: string
  children: ReactNode
}

export function Card({ title, description, className = '', children }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      )}
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      <div className={title || description ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}
