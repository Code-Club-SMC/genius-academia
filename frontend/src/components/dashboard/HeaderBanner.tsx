import { ReactNode } from "react";

interface HeaderBannerProps {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function HeaderBanner({ title, subtitle, children }: HeaderBannerProps) {
  return (
    <div className="header-gradient rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 text-primary-foreground shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight leading-tight">{title}</h2>
          {subtitle && (
            <div className="mt-0.5 text-xs text-primary-foreground/85">
              {subtitle}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
