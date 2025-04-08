import { ReactNode } from 'react'
import { Button } from './ui/button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {icon && <div className="rounded-full bg-muted p-6 mb-4">{icon}</div>}
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {actionLabel && (onAction || actionHref) && (
        <Button onClick={onAction} asChild={!!actionHref}>
          {actionHref ? <a href={actionHref}>{actionLabel}</a> : actionLabel}
        </Button>
      )}
    </div>
  )
} 