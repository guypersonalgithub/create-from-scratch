import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { BadgeSize, BadgeVariant } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const variantClassNames: Record<BadgeVariant, string> = {
  primary: dynatic`
    background-color: #3b82f6;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
    border: 1px solid rgba(59, 130, 246, 0.1);

    &:hover {
      background-color: #3575dd;
    }
  `,
  secondary: dynatic`
    background-color: #64748b;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(100, 116, 139, 0.3);
    border: 1px solid rgba(100, 116, 139, 0.1);

    &:hover {
      background-color: #5a687d
    }
  `,
  success: dynatic`
    background-color: #10b981;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(16, 185, 129, 0.3);
    border: 1px solid rgba(16, 185, 129, 0.1);

    &:hover {
      background-color: #0ea674;
    }
  `,
  danger: dynatic`
    background-color: #ef4444;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(239, 68, 68, 0.3);
    border: 1px solid rgba(239, 68, 68, 0.1);

    &:hover {
      background-color: #d73d3d;
    }
  `,
  warning: dynatic`
    background-color: #f59e0b;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(245, 158, 11, 0.3);
    border: 1px solid rgba(245, 158, 11, 0.1);

    &:hover {
      background-color: #dc8e09;
    }
  `,
  info: dynatic`
    background-color: #06b6d4;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(6, 182, 212, 0.3);
    border: 1px solid rgba(6, 182, 212, 0.1);

    &:hover {
      background-color: #05a3be;
    }
  `,
  ghost: dynatic`
    background-color: #f3f4f6;
    color: #4b5563;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #dadbdd;
    }
  `,
};

const sizeClassNames: Record<BadgeSize, string> = {
  sm: dynatic`
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    height: 1.5rem;
  `,
  md: dynatic`
    font-size: 0.875rem;
    padding: 0.25rem 0.75rem;
    height: 1.75rem;
  `,
  lg: dynatic`
    font-size: 1rem;
    padding: 0.375rem 1rem;
    height: 2.25rem;
  `,
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
  const combinedClassNames = combineStringsWithSpaces(
    dynatic`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.01em;
    transition: all 0.2s ease;
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: hidden;

    &:hover {
      opacity: 0.9;
      transform: translateY(1px);
    }
  `,
    onClick
      ? dynatic`
          cursor: pointer;

          &:active {
            transform: translateY(2px);
            box-shadow: none;
          }
        `
      : dynatic`
          cursor: default;
        `,
    pill
      ? dynatic`
          border-radius: 100%;
        `
      : dynatic`
          border-radius: 0.375rem;
        `,
    variantClassNames[variant],
    sizeClassNames[size],
    className,
  );

  return (
    <span className={combinedClassNames} style={style} onClick={onClick}>
      {children}
    </span>
  );
};
