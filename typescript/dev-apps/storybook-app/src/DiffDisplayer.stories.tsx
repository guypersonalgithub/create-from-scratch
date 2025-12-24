import type { Meta, StoryObj } from "@storybook/react";
import { DiffDisplayer } from "@packages/diff-displayer";
import { charDiff } from "@packages/diff";

const meta = {
  title: "DiffDisplayer",
  component: DiffDisplayer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DiffDisplayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    newStr: `import { type RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { type CanvasTooltipActions, type TooltipProperties } from "./types";
import { drawTooltip } from "./drawTooltip";
import {
  clearCanvas,
  getMousePosition,
  type HoverableElement,
  hoveredElements,
} from "@packages/canvas-utils";
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";`,
    oldStr: `import {
  type RefObject,
  // useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { type CanvasTooltipActions, type TooltipProperties } from "./types";
// import { drawTooltip } from "./drawTooltip";
import {
  // clearCanvas,
  // getMousePosition,
  type HoverableElement,
  // hoveredElements,
} from "@packages/canvas-utils";
// import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";
import { getTooltipAPI } from "./tooltipAPI";`,
    highlightSubDifferences: false,
  },
  render: (args) => {
//     const test = charDiff({
//       oldStr: `useRef } from "react";`,
//       newStr: `
//   useRef,
// } from "react";`,
//     });
    // console.log(test);

    return <DiffDisplayer {...args} />;
  },
};


// console.log(vscodeDiff(oldStr, newStr));
