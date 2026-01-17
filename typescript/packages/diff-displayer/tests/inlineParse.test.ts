import { test, expect } from "@packages/test";
import { parsedSections } from "./mock";
import { inlineParse } from "../src/inlineParse/inlineParse";

const expected = {
  updatedAdd: [
    {
      type: "NESTED_ADD",
      value: [
        {
          type: "UNCHANGED",
          value: "import { type RefObject, useEffect, useImperativeHandle, useRef",
        },
        { type: "HIGHLIGHTED_ADD", value: " " },
        { type: "UNCHANGED", value: '} from "react";' },
      ],
    },
    { type: "EMPTY", size: 6 },
    {
      type: "UNCHANGED",
      value: 'import { type CanvasTooltipActions, type TooltipProperties } from "./types";',
    },
    { type: "ADDED", value: 'import { drawTooltip } from "./drawTooltip";' },
    { type: "UNCHANGED", value: "import {" },
    { type: "ADDED", value: "  clearCanvas," },
    { type: "ADDED", value: "  getMousePosition," },
    { type: "UNCHANGED", value: "  type HoverableElement," },
    { type: "ADDED", value: "  hoveredElements," },
    { type: "UNCHANGED", value: '} from "@packages/canvas-utils";' },
    {
      type: "UNCHANGED",
      value: 'import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
    { type: "EMPTY", size: 1 },
  ],
  updatedRemove: [
    {
      type: "NESTED_DELETE",
      value: [
        { type: "UNCHANGED", value: "import {" },
        { type: "HIGHLIGHTED_DELETE", value: "\n" },
        { type: "UNCHANGED", value: " " },
        { type: "HIGHLIGHTED_DELETE", value: " " },
        { type: "UNCHANGED", value: "type RefObject," },
        { type: "HIGHLIGHTED_DELETE", value: "\n" },
        { type: "UNCHANGED", value: " " },
        { type: "HIGHLIGHTED_DELETE", value: " // " },
        { type: "UNCHANGED", value: "useEffect," },
        { type: "HIGHLIGHTED_DELETE", value: "\n" },
        { type: "UNCHANGED", value: " " },
        { type: "HIGHLIGHTED_DELETE", value: " " },
        { type: "UNCHANGED", value: "useImperativeHandle," },
        { type: "HIGHLIGHTED_DELETE", value: "\n" },
        { type: "UNCHANGED", value: " " },
        { type: "HIGHLIGHTED_DELETE", value: " useLayoutEffect,\n  " },
        { type: "UNCHANGED", value: "useRef" },
        { type: "HIGHLIGHTED_DELETE", value: ",\n" },
        { type: "UNCHANGED", value: '} from "react";' },
      ],
    },
    {
      type: "UNCHANGED",
      value: 'import { type CanvasTooltipActions, type TooltipProperties } from "./types";',
    },
    {
      type: "NESTED_DELETE",
      value: [
        { type: "HIGHLIGHTED_DELETE", value: "// " },
        { type: "UNCHANGED", value: 'import { drawTooltip } from "./drawTooltip";' },
      ],
    },
    { type: "UNCHANGED", value: "import {" },
    {
      type: "NESTED_DELETE",
      value: [
        { type: "UNCHANGED", value: "  " },
        { type: "HIGHLIGHTED_DELETE", value: "// " },
        { type: "UNCHANGED", value: "clearCanvas," },
      ],
    },
    {
      type: "NESTED_DELETE",
      value: [
        { type: "UNCHANGED", value: "  " },
        { type: "HIGHLIGHTED_DELETE", value: "// " },
        { type: "UNCHANGED", value: "getMousePosition," },
      ],
    },
    { type: "UNCHANGED", value: "  type HoverableElement," },
    {
      type: "NESTED_DELETE",
      value: [
        { type: "UNCHANGED", value: "  " },
        { type: "HIGHLIGHTED_DELETE", value: "// " },
        { type: "UNCHANGED", value: "hoveredElements," },
      ],
    },
    { type: "UNCHANGED", value: '} from "@packages/canvas-utils";' },
    {
      type: "UNCHANGED",
      value: 'import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";',
    },
    { type: "DELETED", value: 'import { getTooltipAPI } from "./tooltipAPI";' },
  ],
};

test({
  name: "inlineParse",
  fn: () => expect({ value: inlineParse(parsedSections) }).toEqual({ expected }),
});
