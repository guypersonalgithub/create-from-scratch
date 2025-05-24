import { RefObject, ReactNode } from "react";
import "./CanvasTooltipWrapper.css";
import { CanvasTooltip, CanvasTooltipProps } from "./CanvasTooltip";
import { CanvasTooltipActions } from "./types";

type CanvasTooltipWrapperProps = Pick<CanvasTooltipProps, "elements"> & {
  height: number;
  width: number;
  children: ReactNode | ReactNode[];
  ref: RefObject<HTMLCanvasElement | null>;
  tooltipRef: RefObject<CanvasTooltipActions | null>;
};

export const CanvasTooltipWrapper = ({
  height,
  width,
  ref,
  tooltipRef,
  elements,
  children,
}: CanvasTooltipWrapperProps) => {
  return (
    <div className="canvasTooltipWrapper">
      {children}
      <CanvasTooltip ref={tooltipRef} height={height} width={width} elements={elements} />
      <canvas ref={ref} height={height} width={width} />
    </div>
  );
};
