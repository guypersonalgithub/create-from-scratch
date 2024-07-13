import { ReactNode, useState } from "react";
import "./styles.css";

type TooltipProps = {
  message: ReactNode;
  children: ReactNode;
};

export const Tooltip = ({ message, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div style={{ position: "relative" }}>
      <div className="tooltip-container">
        <div className="tooltip-target" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
          {children}
        </div>
        {visible ? <div className="tooltip-box">{message}</div> : null}
      </div>
    </div>
  );
};
