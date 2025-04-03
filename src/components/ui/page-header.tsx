import { ReactNode } from "react";

interface PageHeaderProps {
  heading: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  description,
  icon,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
