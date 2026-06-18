import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function PageShell({
  children,
  className,
  contentClassName,
}: PageShellProps) {
  return (
    <section className={cn("relative overflow-hidden px-4 pb-24 pt-8 sm:px-6 lg:px-10 site-background", className)}>
      <div className="pointer-events-none absolute inset-0 -z-20 site-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(142,236,255,0.06),transparent_18%)]" />
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(142,236,255,0.09),rgba(142,236,255,0)_62%)] blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className={cn("relative z-10 mx-auto max-w-7xl", contentClassName)}>{children}</div>
    </section>
  );
}
