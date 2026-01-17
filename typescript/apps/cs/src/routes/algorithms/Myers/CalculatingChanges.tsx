import { MyersCanvas, MyersStepVisualizer } from "@packages/myers-visualizer";
import { StyledInteractiveTitle } from "../../../styledComponents/StyledInteractiveTitle";
import { myersConstants } from "./constants";

export const CalculatingChanges = () => {
  const { traces, fromExample, toExample } = myersConstants;

  return (
    <>
      <StyledInteractiveTitle>Calculating Changes</StyledInteractiveTitle>
      <div>
        In order to follow changes consistently, Myers' algorithm splits each change into a
        dedicated step. That means we aim for the least amount of steps to reach the desired goal.
      </div>
      <div>
        Since moving diagonally isn't considered to be an action, we can accumulate as many of these
        as possible within a single step whenever possible, so through calculating, the aim is to
        follow the actions with the highest amount of movement for each potential step.
      </div>
      <div>Lets assume we went through multiple steps and iterated across multiple directions:</div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, label: "1" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 } },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, label: "2" },
          { from: { x: 3, y: 1 }, to: { x: 4, y: 1 } },
          { from: { x: 3, y: 1 }, to: { x: 3, y: 2 }, label: "3" },
          { from: { x: 3, y: 2 }, to: { x: 4, y: 3 } },
          { from: { x: 4, y: 3 }, to: { x: 4, y: 4 }, label: "4" },
          { from: { x: 2, y: 1 }, to: { x: 2, y: 2 } },
          { from: { x: 2, y: 2 }, to: { x: 3, y: 2 }, label: "3" },
          { from: { x: 2, y: 2 }, to: { x: 2, y: 3 } },
          { from: { x: 2, y: 3 }, to: { x: 3, y: 4 } },
          { from: { x: 3, y: 4 }, to: { x: 4, y: 4 }, label: "4" },
          { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
          { from: { x: 0, y: 1 }, to: { x: 1, y: 2 } },
          { from: { x: 1, y: 2 }, to: { x: 2, y: 2 }, label: "2" },
          { from: { x: 1, y: 2 }, to: { x: 1, y: 3 } },
          { from: { x: 1, y: 3 }, to: { x: 2, y: 3 }, label: "3" },
          { from: { x: 1, y: 3 }, to: { x: 1, y: 4 } },
        ]}
      />
      <div>
        We can use the data collected through this matrix and display a different kind of graph, the
        one based off the delta between x and y <b>(K = x - y)</b>, based off the step number we are
        currently in. This graph presents Myers' algorithm in a more understandable manner:
      </div>
      <MyersStepVisualizer trace={traces} />
      <div>
        The graph's lines are similar to the result of the matrix being rotated by 45 degress, just
        as a reference.
      </div>
      <div>As mentioned earlier:</div>
      <div>
        The x axis represents the amount of steps required to reach the specific presented value.
      </div>
      <div>The y axis represents the difference between the x and y values.</div>
      <div>
        Each time we move to the right by deleting a character, the x value increases and thus k
        increases aswell.
      </div>
      <div>
        Each time we move down by inserting a character, the y value increases and thus the k
        decreases.
      </div>
      <div>Moving diagonally increases both x and y, so the k remains to be the same.</div>
      <div>
        Because k is the delta of x and y, we can entirely remove the y value and still maintain all
        relevant data (as y can be calculated through the k and x values):
      </div>
      <MyersStepVisualizer trace={traces} isSwitched />
      <div>
        Even though we changed the matrix into a graph, the algorithm still follows the same rules
        and process.
      </div>
    </>
  );
};
