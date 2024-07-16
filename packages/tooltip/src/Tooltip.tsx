import { ReactNode, useState } from "react";
import { AnimationContainerWrapper } from "@packages/animation-container";
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
    <div className="tooltip-container">
      <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
      <AnimationContainerWrapper
        from={{ opacity: 0, visibility: "hidden" }}
        to={{ opacity: 1, visibility: "visible" }}
        options={{ duration: 300 }}
      >
        {visible ? (
          <div key="tooltip" className="tooltip-box">
            {message}
          </div>
        ) : null}
      </AnimationContainerWrapper>
    </div>
  );
};
