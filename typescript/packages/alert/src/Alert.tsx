import { CSSProperties, ReactNode } from "react";

type AlertType = "success" | "error" | "info" | "warning";

type AlertProps = {
  style?: CSSProperties;
  type: AlertType;
  message: ReactNode;
  onClose?: () => void;
};

const alertStyles: Record<AlertType, React.CSSProperties> = {
  success: { backgroundColor: "#4CAF50", color: "white" },
  error: { backgroundColor: "#f44336", color: "white" },
  info: { backgroundColor: "#DBEFFA", color: "818FA2" },
  warning: { backgroundColor: "#ff9800", color: "white" },
};

export const Alert = ({ style, type, message, onClose }: AlertProps) => {
  const getTypeStyles = (): React.CSSProperties => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          borderColor: "#c3e6cb",
        };
      case "warning":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          borderColor: "#ffeeba",
        };
      case "error":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderColor: "#f5c6cb",
        };
      case "info":
      default:
        return {
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
          borderColor: "#bee5eb",
        };
    }
  };

  // Base styles for all alerts
  const baseStyles: React.CSSProperties = {
    padding: "12px 20px",
    marginBottom: "1rem",
    border: "1px solid transparent",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  // Combine base styles with type-specific styles
  const alertStyles = { ...baseStyles, ...getTypeStyles() };

  // Close button styles
  const closeButtonStyles: React.CSSProperties = {
    marginLeft: "15px",
    color: "inherit",
    opacity: 0.7,
    background: "none",
    border: "none",
    padding: "0",
    fontSize: "1.25rem",
    fontWeight: "bold",
    lineHeight: 1,
    cursor: "pointer",
  };

  return (
    <div style={alertStyles} className={""} role="alert">
      <div>{message}</div>
      {onClose ? (
        <button onClick={onClose} style={closeButtonStyles} aria-label="Close alert">
          ×
        </button>
      ) : null}
    </div>
  );
};
