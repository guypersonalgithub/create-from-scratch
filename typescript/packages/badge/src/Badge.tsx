import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { BadgeSize, BadgeVariant } from "./types";

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  primary: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(59, 130, 246, 0.3)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
  },
  secondary: {
    backgroundColor: "#64748b",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(100, 116, 139, 0.3)",
    border: "1px solid rgba(100, 116, 139, 0.1)",
  },
  success: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(16, 185, 129, 0.3)",
    border: "1px solid rgba(16, 185, 129, 0.1)",
  },
  danger: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(239, 68, 68, 0.3)",
    border: "1px solid rgba(239, 68, 68, 0.1)",
  },
  warning: {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(245, 158, 11, 0.3)",
    border: "1px solid rgba(245, 158, 11, 0.1)",
  },
  info: {
    backgroundColor: "#06b6d4",
    color: "#ffffff",
    boxShadow: "0 1px 2px rgba(6, 182, 212, 0.3)",
    border: "1px solid rgba(6, 182, 212, 0.1)",
  },
  ghost: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
};

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  sm: {
    fontSize: "0.75rem",
    padding: "0.125rem 0.5rem",
    height: "1.5rem",
  },
  md: {
    fontSize: "0.875rem",
    padding: "0.25rem 0.75rem",
    height: "1.75rem",
  },
  lg: {
    fontSize: "1rem",
    padding: "0.375rem 1rem",
    height: "2.25rem",
  },
};

export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  pill = false,
  className,
  style,
  onClick,
}: BadgeProps) => {
  const badgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0.01em",
    transition: "all 0.2s ease",
    cursor: onClick ? "pointer" : "default",
    borderRadius: pill ? "9999px" : "0.375rem",
    whiteSpace: "nowrap",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
  };

  const combinedStyle: CSSProperties = {
    ...badgeStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  const handleMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      const target = e.currentTarget;
      target.style.opacity = "0.9";

      // Darken the background color slightly
      const currentBg = variantStyles[variant].backgroundColor as string;
      if (currentBg) {
        // Simple darkening function for hex colors
        const darkenColor = (hex: string) => {
          // Remove the # if present
          hex = hex.replace("#", "");

          // Convert to RGB
          let r = Number.parseInt(hex.substring(0, 2), 16);
          let g = Number.parseInt(hex.substring(2, 4), 16);
          let b = Number.parseInt(hex.substring(4, 6), 16);

          // Darken by reducing each component by 10%
          r = Math.max(0, Math.floor(r * 0.9));
          g = Math.max(0, Math.floor(g * 0.9));
          b = Math.max(0, Math.floor(b * 0.9));

          // Convert back to hex
          return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        };

        target.style.backgroundColor = darkenColor(currentBg);
      }

      target.style.transform = "translateY(1px)";
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      const target = e.currentTarget;
      target.style.opacity = "1";
      target.style.backgroundColor = variantStyles[variant].backgroundColor as string;
      target.style.transform = "translateY(0)";
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      const target = e.currentTarget;
      target.style.transform = "translateY(2px)";
      target.style.boxShadow = "none";
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      const target = e.currentTarget;
      target.style.transform = "translateY(0)";
      target.style.boxShadow = variantStyles[variant].boxShadow as string;
    }
  };

  return (
    <span
      className={className}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </span>
  );
};
