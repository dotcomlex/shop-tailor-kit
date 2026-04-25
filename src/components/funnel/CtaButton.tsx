import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaButtonProps {
  to?: string;
  label?: string;
  className?: string;
  size?: "default" | "lg" | "xl";
  icon?: LucideIcon;
  fullWidth?: boolean;
}

const sizeClasses = {
  default: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
  xl: "h-16 px-10 text-xl",
};

/**
 * The single CTA used across the funnel.
 * Always navigates to /select (size & color step).
 */
export function CtaButton({
  to = "/select",
  label = "Choose My Size & Color",
  className,
  size = "lg",
  fullWidth = true,
}: CtaButtonProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full",
        "bg-brand text-brand-foreground font-display font-semibold tracking-wide",
        "shadow-lift transition-all duration-300",
        "hover:bg-brand-deep hover:shadow-[0_24px_60px_-18px_hsl(var(--brand)/0.6)] hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-soft",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40",
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
    >
      <span className="uppercase tracking-[0.08em]">{label}</span>
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
