import { CSSProperties, ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import "./styles.css";

type EllipsisTooltipProps = {
  style?: CSSProperties;
  content?: ReactNode;
  children: string;
};

export const EllipsisTooltip = ({ style, children, content = children }: EllipsisTooltipProps) => {
  return (
    <Tooltip content={content}>
      <div className="ellipsis" style={style}>
        {children}
      </div>
    </Tooltip>
  );
};
