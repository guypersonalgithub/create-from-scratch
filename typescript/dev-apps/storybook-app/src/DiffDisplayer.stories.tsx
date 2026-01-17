import type { Meta, StoryObj } from "@storybook/react";
import { DiffDisplayer } from "@packages/diff-displayer";

const meta = {
  title: "DiffDisplayer",
  component: DiffDisplayer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DiffDisplayer>;

export default meta;
type Story = StoryObj<typeof meta>;

const from = `import {
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
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";
import { getTooltipAPI } from "./tooltipAPI";`;

const to = `import { type RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { type CanvasTooltipActions, type TooltipProperties } from "./types";
import { drawTooltip } from "./drawTooltip";
import {
  clearCanvas,
  getMousePosition,
  type HoverableElement,
  hoveredElements,
} from "@packages/canvas-utils";
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";`;

export const Primary: Story = {
  args: {
    from,
    to,
    highlightSubDifferences: true,
  },
  render: (args) => {
    return <DiffDisplayer {...args} />;
  },
};

export const WithoutHighlight: Story = {
  args: {
    from,
    to,
    highlightSubDifferences: false,
  },
  render: (args) => {
    return <DiffDisplayer {...args} />;
  },
};

export const Replaced: Story = {
  args: {
    from: `const testing1 = () => {
  return 12345;
};

const testing2 = () => {
  return "a" + "b" + "c";
};`,
    to: `
const testing2 = () => {
  return "a" + "b" + "c";
};

const testing1 = () => {
  return 12345;
};

`,
  },
  render: (args) => {
    return <DiffDisplayer {...args} />;
  },
};
