import { lineDiff } from "@packages/diff";
import { parseSections } from "../src/parseSections";

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

const parsedData = lineDiff({ from, to }).result;
export const parsedSections = parseSections({ parsed: parsedData });