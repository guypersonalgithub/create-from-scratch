import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties, type ReactNode } from "react";
import type { AlertType } from "./types";

type AlertProps = {
  className?: string;
  style?: CSSProperties;
  type: AlertType;
  message: ReactNode;
  onClose?: () => void;
};

// const alertStyles: Record<AlertType, CSSProperties> = {
//   success: { backgroundColor: "#4CAF50", color: "white" },
//   error: { backgroundColor: "#f44336", color: "white" },
//   info: { backgroundColor: "#DBEFFA", color: "818FA2" },
//   warning: { backgroundColor: "#ff9800", color: "white" },
// };

type GetTypeClassNamesArgs = {
  type: AlertType;
};

const getTypeClassNames = ({ type }: GetTypeClassNamesArgs) => {
  if (type === "success") {
    return dynatic`
      background-color: #d4edda;
      color: #155724;
      border-color: #c3e6cb;
    `;
  }

  if (type === "warning") {
    return dynatic`
      background-color: #fff3cd;
      color: #856404;
      border-color: #ffeeba;
    `;
  }

  if (type === "error") {
    return dynatic`
      background-color: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
    `;
  }

  return dynatic`
    background-color: #d1ecf1;
    color: #0c5460;
    border-color: #bee5eb;
  `;
};

export const Alert = ({ className, style, type, message, onClose }: AlertProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          padding: 12px 20px;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `,
        getTypeClassNames({ type }),
        className,
      )}
      style={style}
      role="alert"
    >
      <div>{message}</div>
      {onClose ? (
        <button
          className={dynatic`
            margin-left: 15px;
            color: inherit;
            opacity: 0.7;
            background: none;
            border: none;
            padding: 0;
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
          `}
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      ) : null}
    </div>
  );
};
