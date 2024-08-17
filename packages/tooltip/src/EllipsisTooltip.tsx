import { CSSProperties, ReactNode, useRef } from "react";
import { Tooltip, TooltipProps } from "./Tooltip";
import "./styles.css";

type EllipsisTooltipProps = {
  style?: CSSProperties;
  content?: ReactNode;
  children: string | number;
} & Pick<TooltipProps, "disabled" | "offset" | "side">;

export const EllipsisTooltip = ({
  style,
  children,
  content = children,
  disabled,
  offset,
  side,
}: EllipsisTooltipProps) => {
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
      disabled={disabled}
      side={side}
      offset={offset}
    >
      <div ref={ref} className="ellipsis" style={style}>
        {children}
      </div>
    </Tooltip>
  );
};
