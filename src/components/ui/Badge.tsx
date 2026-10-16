import type { ReactNode } from 'react'

type BadgeTone = 'amber' | 'emerald' | 'indigo' | 'slate'

interface BadgeProps {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}

const toneClasses: Record<BadgeTone, string> = {
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300',
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

export function Badge({ tone = 'slate', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
