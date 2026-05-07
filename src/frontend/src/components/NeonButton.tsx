import { type ButtonHTMLAttributes, forwardRef } from "react";

type NeonVariant = "pink" | "blue" | "yellow" | "ghost";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeonVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  glow?: boolean;
}

const variantStyles: Record<NeonVariant, string> = {
  pink: "border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
  blue: "border-secondary text-secondary hover:bg-secondary/10 active:bg-secondary/20",
  yellow: "border-accent text-accent hover:bg-accent/10 active:bg-accent/20",
  ghost:
    "border-muted text-muted-foreground hover:border-primary hover:text-primary",
};

const glowStyles: Record<NeonVariant, string> = {
  pink: "0 0 12px oklch(0.56 0.26 330 / 0.7), 0 0 24px oklch(0.56 0.26 330 / 0.3)",
  blue: "0 0 12px oklch(0.91 0.26 200 / 0.7), 0 0 24px oklch(0.91 0.26 200 / 0.3)",
  yellow:
    "0 0 12px oklch(0.97 0.31 100 / 0.7), 0 0 24px oklch(0.97 0.31 100 / 0.3)",
  ghost: "none",
};

const sizeStyles = {
  sm: "px-4 py-2 text-xs min-h-[36px]",
  md: "px-6 py-3 text-sm min-h-[44px]",
  lg: "px-8 py-4 text-base min-h-[52px]",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      variant = "pink",
      size = "md",
      fullWidth = false,
      glow = true,
      className = "",
      children,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          "tap-feedback",
          "inline-flex items-center justify-center",
          "border-2 rounded font-mono font-bold uppercase tracking-widest",
          "transition-smooth cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          boxShadow: glow ? glowStyles[variant] : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

NeonButton.displayName = "NeonButton";
