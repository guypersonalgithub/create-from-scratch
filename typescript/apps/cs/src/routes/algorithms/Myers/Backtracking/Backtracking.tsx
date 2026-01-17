import { MyersStepVisualizer } from "@packages/myers-visualizer";
import { myersConstants } from "../constants";
import { StyledLink } from "../../../../styledComponents/StyledLink";
import { StyledInteractiveTitle } from "../../../../styledComponents/StyledInteractiveTitle";
import { FirstExample } from "./FirstExample";
import { SecondExample } from "./SecondExample";
import { DiffDisplayer } from "@packages/diff-displayer";

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

export const Backtracking = () => {
  const { traces } = myersConstants;

  return (
    <>
      <StyledInteractiveTitle>Backtracking</StyledInteractiveTitle>
      <div>
        Once we reached the final step, we can look at the data that was recorded in a{" "}
        <b>reverse</b> order to figure out which path led to the result.
      </div>
      <div>
        The x values we've recorded record the best values of x we can reach for each (d , k)
        position.
      </div>
      <div>
        For instance, in the previous example within the{" "}
        <StyledLink pathname="/algorithms/myers/algorithmTheory">Myers Algorithm Theory</StyledLink>
        :
      </div>
      <MyersStepVisualizer trace={traces} isSwitched />
      <FirstExample />
      <SecondExample />
      <div>
        Before that we only have one recorded step (1 , 1) with the value of x, and prior to that,
        only one recorded step (0 , 0). So in both cases, we are only capable of rightward moves.
      </div>
      <MyersStepVisualizer trace={traces} isSwitched keepPathsOf={[7, 4, 2, 0]} />
      <div>
        We have walked all the way back to the start and now we know that the (x , y) positions of
        each move are:
      </div>
      <div>
        (0, 0) {"->"} (2, 1) {"->"} (3, 1) {"->"} (4, 3) {"->"} (4, 4)
      </div>
      <div>
        These positions are enough to figure out the diagonal moves between each position - we
        decrement both x and y until one of them is equal to the values in the previous position,
        then we end up a single donward or rightward move away from that position.
      </div>
      <div>
        For example, to get from (4 , 3) back to (3 , 1) we step diagonally back to (3 , 2). Since
        we have the same x value we must take an upward step from (3, 2) to (3, 1) to complete the
        move.
      </div>
      <DiffDisplayer from={from} to={to} highlightSubDifferences />
    </>
  );
};
