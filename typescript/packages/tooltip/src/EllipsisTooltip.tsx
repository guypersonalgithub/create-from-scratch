import { type CSSProperties, type ReactNode, useRef } from "react";
import { Tooltip, type TooltipProps } from "./Tooltip";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type EllipsisTooltipProps = {
  className?: string;
  style?: CSSProperties;
  content?: ReactNode;
  children: string | number;
} & Pick<TooltipProps, "disabled" | "offset" | "side">;

export const EllipsisTooltip = ({
  className,
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
        className={combineStringsWithSpaces(
          dynatic`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `,
          className,
        )}
        style={style}
      >
        {children}
      </div>
    </Tooltip>
  );
};
