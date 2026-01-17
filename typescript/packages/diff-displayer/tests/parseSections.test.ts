import { test, expect } from "@packages/test";
import { parsedSections } from "./mock";

const expected = {
  oldVersion: [
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
      type: "UNCHANGED",
      value: 'import { type CanvasTooltipActions, type TooltipProperties } from "./types";',
    },
    {
      type: "DELETED",
      value: '// import { drawTooltip } from "./drawTooltip";',
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
      type: "UNCHANGED",
      value: "  type HoverableElement,",
    },
    {
      type: "DELETED",
      value: "  // hoveredElements,",
    },
    {
      type: "UNCHANGED",
      value: '} from "@packages/canvas-utils";',
    },
    {
      type: "UNCHANGED",
      value: 'import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
    {
      type: "DELETED",
      value: 'import { getTooltipAPI } from "./tooltipAPI";',
    },
  ],
  newVersion: [
    {
      type: "ADDED",
      value: 'import { type RefObject, useEffect, useImperativeHandle, useRef } from "react";',
    },
    {
      type: "EMPTY",
      size: 6,
    },
    {
      type: "UNCHANGED",
      value: 'import { type CanvasTooltipActions, type TooltipProperties } from "./types";',
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
      type: "ADDED",
      value: "  hoveredElements,",
    },
    {
      type: "UNCHANGED",
      value: '} from "@packages/canvas-utils";',
    },
    {
      type: "UNCHANGED",
      value: 'import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
    {
      type: "EMPTY",
      size: 1,
    },
  ],
  addEmptyIndexes: new Set([1, 11]),
  removeEmptyIndexes: {},
};

test({
  name: "parseSections",
  fn: () => expect({ value: parsedSections }).toEqual({ expected }),
});
