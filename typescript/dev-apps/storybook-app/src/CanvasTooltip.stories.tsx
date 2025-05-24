import type { Meta, StoryObj } from "@storybook/react";
import {
  CanvasTooltip,
  CanvasTooltipActions,
  CanvasTooltipWrapper,
} from "@packages/canvas-tooltip";
import { createRef, useEffect, useRef } from "react";
import { drawRectangle } from "@packages/canvas-utils";

const meta = {
  title: "CanvasTooltip",
  component: CanvasTooltip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CanvasTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    height: 500,
    width: 500,
    elements: [
      { x: 50, y: 100, width: 100, height: 200, id: "1" },
      { x: 100, y: 100, width: 100, height: 200, id: "2" },
    ],
    ref: createRef(),
  },
  render: (args) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentCanvasRef = useRef<HTMLCanvasElement>(null);
    const tooltipRef = useRef<CanvasTooltipActions>(null);

    useEffect(() => {
      if (!contentCanvasRef.current) {
        return;
      }

      const context = contentCanvasRef.current.getContext("2d");

      args.elements.forEach((element) => {
        drawRectangle({ ctx: context!, ...element, color: element.id === "1" ? "red" : "blue" });
      });
    }, []);

    useEffect(() => {
      if (!tooltipRef.current) {
        return;
      }

      tooltipRef.current.drawTooltip({ text: "test", x: 50, y: 50, id: "3" });

      setTimeout(() => {
        tooltipRef.current?.removeTooltip({ id: "3" });
      }, 1000);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const handleMouseMove = (event: MouseEvent) => {
        tooltipRef.current?.onMouseMove?.({ event, canvas, animate: true, opacity: 0 });
      };

      const handleMouseLeave = () => {
        tooltipRef.current?.onMouseLeave?.();
      };

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, []);

    return (
      <CanvasTooltipWrapper
        ref={canvasRef}
        tooltipRef={tooltipRef}
        height={args.height}
        width={args.width}
        elements={args.elements}
      >
        <canvas ref={contentCanvasRef} height={args.height} width={args.width} />
      </CanvasTooltipWrapper>
    );
  },
};
