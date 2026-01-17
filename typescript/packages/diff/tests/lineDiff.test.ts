import { test, expect } from "@packages/test";
import { lineDiff } from "../src";

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
 yes
 ??
// import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";
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
  test
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";`;
const expected = {
  result: [
    {
      type: "DELETED",
      value: "import {",
    },
    {
      type: "DELETED",
      value: "  type RefObject,",
    },
    {
      type: "DELETED",
      value: "  // useEffect,",
    },
    {
      type: "DELETED",
      value: "  useImperativeHandle,",
    },
    {
      type: "DELETED",
      value: "  useLayoutEffect,",
    },
    {
      type: "DELETED",
      value: "  useRef,",
    },
    {
      type: "DELETED",
      value: '} from "react";',
    },
    {
      type: "ADDED",
      value: 'import { type RefObject, useEffect, useImperativeHandle, useRef } from "react";',
    },
    {
      type: "UNCHANGED",
      value: 'import { type CanvasTooltipActions, type TooltipProperties } from "./types";',
    },
    {
      type: "DELETED",
      value: '// import { drawTooltip } from "./drawTooltip";',
    },
    {
      type: "ADDED",
      value: 'import { drawTooltip } from "./drawTooltip";',
    },
    {
      type: "UNCHANGED",
      value: "import {",
    },
    {
      type: "DELETED",
      value: "  // clearCanvas,",
    },
    {
      type: "DELETED",
      value: "  // getMousePosition,",
    },
    {
      type: "ADDED",
      value: "  clearCanvas,",
    },
    {
      type: "ADDED",
      value: "  getMousePosition,",
    },
    {
      type: "UNCHANGED",
      value: "  type HoverableElement,",
    },
    {
      type: "DELETED",
      value: "  // hoveredElements,",
    },
    {
      type: "ADDED",
      value: "  hoveredElements,",
    },
    {
      type: "UNCHANGED",
      value: '} from "@packages/canvas-utils";',
    },
    {
      type: "DELETED",
      value: " yes",
    },
    {
      type: "DELETED",
      value: " ??",
    },
    {
      type: "DELETED",
      value: '// import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
    {
      type: "DELETED",
      value: 'import { getTooltipAPI } from "./tooltipAPI";',
    },
    {
      type: "ADDED",
      value: "  test",
    },
    {
      type: "ADDED",
      value: 'import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
  ],
};

test({
  name: "Line diff",
  fn: () => expect({ value: lineDiff({ from, to }) }).toEqual({ expected }),
});
