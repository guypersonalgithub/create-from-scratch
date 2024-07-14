import { CSSProperties, ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import "./styles.css";

type EllipsisTooltipProps = {
  style?: CSSProperties;
  message?: ReactNode;
  children: string;
};

export const EllipsisTooltip = ({ style, children, message = children }: EllipsisTooltipProps) => {
  return (
    <Tooltip message={message}>
      <div className="ellipsis" style={style}>
        {children}
      </div>
    </Tooltip>
  );
};
