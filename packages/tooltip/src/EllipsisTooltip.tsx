import { CSSProperties, ReactNode, useRef } from "react";
import { Tooltip } from "./Tooltip";
import "./styles.css";

type EllipsisTooltipProps = {
  style?: CSSProperties;
  content?: ReactNode;
  children: string;
};

export const EllipsisTooltip = ({ style, children, content = children }: EllipsisTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Tooltip
      content={content}
      isEllipsizedCallback={() => {
        if (!ref.current) {
          return false;
        }

        return ref.current.scrollWidth > ref.current.clientWidth;
      }}
    >
      <div ref={ref} className="ellipsis" style={style}>
        {children}
      </div>
    </Tooltip>
  );
};
