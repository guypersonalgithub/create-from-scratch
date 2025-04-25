import { CSSProperties, MouseEvent, ReactNode } from "react";
import { BadgeSize, BadgeVariant } from "./types";

type BadgeProps = {
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
  },
  secondary: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
  },
  success: {
    backgroundColor: "#22c55e",
    color: "#ffffff",
  },
  danger: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },
  warning: {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
  },
  info: {
    backgroundColor: "#06b6d4",
    color: "#ffffff",
  },
  ghost: {
    backgroundColor: "#eee9f6",
    color: "#ffffff",
  },
};

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  sm: {
    fontSize: "0.75rem",
    padding: "0.125rem 0.5rem",
  },
  md: {
    fontSize: "0.875rem",
    padding: "0.25rem 0.625rem",
  },
  lg: {
    fontSize: "1rem",
    padding: "0.375rem 0.75rem",
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
    fontWeight: 500,
    lineHeight: 1,
    transition: "opacity 0.2s ease",
    cursor: onClick ? "pointer" : "default",
    borderRadius: pill ? "9999px" : "4px",
    whiteSpace: "nowrap",
  };

  const combinedStyle: CSSProperties = {
    ...badgeStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  const handleMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      e.currentTarget.style.opacity = "0.8";
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLSpanElement>) => {
    if (onClick) {
      e.currentTarget.style.opacity = "1";
    }
  };

  return (
    <span
      className={className}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
};
