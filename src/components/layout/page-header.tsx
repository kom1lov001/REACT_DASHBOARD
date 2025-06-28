import type { ReactNode } from "react"
interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    // <Header fixed className={cn("border-b justify-between", className)}>
    <div>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    // </Header>
  )
}
