import { type CSSProperties, type ReactNode, useRef } from "react";
import { Tooltip, type TooltipProps } from "./Tooltip";

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
      <div
        ref={ref}
        style={{ ...style, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {children}
      </div>
    </Tooltip>
  );
};
