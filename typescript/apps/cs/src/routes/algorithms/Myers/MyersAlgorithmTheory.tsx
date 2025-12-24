import { MyersCanvas, MyersStepVisualizer } from "@packages/myers-visualizer";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { myersConstants } from "./constants";

export const MyersAlgorithmTheory = () => {
  const { traces, fromExample, toExample } = myersConstants;

  return (
    <>
      <StyledMainTitle>Myers algorithm theory</StyledMainTitle>
      <div>
        Myers is a <b>greedy</b> algorithm - it is trying to follow as many lines that weren't
        changed before making any change, and prefers deletions over insertions. That's why it helps
        maintaining changes as blocks, if possible.
      </div>
      <div>
        The algorithm is based off the idea that finding the shortest edit path can be modelled as a
        graph search.
      </div>
      <div>
        By presenting the (x,y) coordinates as a grid, where we start at (0,0) at the top left
        corner, and we aim to reach the bottom right corner as the final destination for the diff to
        complete.
      </div>
      <div>
        The rules are simple:
        <ul>
          <li>
            moving right (<b>increasing the x coordinate</b>) represents deleting a character.
          </li>
          <li>
            moving bottom (<b>increasing the y coordinate</b>) represents inserting a character.
          </li>
          <li>
            moving digonally (<b>increasing both the x and y coordinates</b>) represents keeping the
            character without conducting any change.
          </li>
        </ul>
      </div>
      <MyersCanvas oldStr={fromExample} newStr={toExample} />
      <div>
        That means that for the previous examples of from <b>{fromExample}</b> to <b>{toExample}</b>
        , reaching (0,1) following the Myers' algorithm, would mean inserting B at the very start.
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[{ from: { x: 0, y: 0 }, to: { x: 0, y: 1 } }]}
      />
      <div>
        Once reaching that point, we can notice that not only we can go right or down once we reach
        (0, 1), but also diagonally.
      </div>
      <div>
        Diagonal movement refers to both "deleting and inserting" the same character, because it
        exists for both the old and new strings at the specific location we are currently at, for
        both of their current indexes.
      </div>
      <div>
        As the maximum amount of changes we can take from the old string to the new string is the
        sum of their lengths (in the given example{" "}
        <b>
          {fromExample} ({fromExample.length})
        </b>{" "}
        and{" "}
        <b>
          {toExample} ({toExample.length})
        </b>
        , so in total <b>{fromExample.length + toExample.length}</b>), the Myers' algorithm prefers
        as many diagonal encounters as possible, as that potentially lowers the amount of changes
        required.
      </div>
      <StyledSubTitle>Changes</StyledSubTitle>
      <div>A step is equivalent to an action of moving right or down.</div>
      <div>
        Since moving diagonally isn't considered to be an action, we can accumulate as many of these
        as possible within a single step.
      </div>
      <div>
        Since every action can begin as moving downwards or to the right, we should be only
        following the actions with the most amount of movement for each potential step.
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, label: "1" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 } },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, label: "2" },
          { from: { x: 3, y: 1 }, to: { x: 4, y: 1 }, skipped: true },
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
          { from: { x: 1, y: 3 }, to: { x: 1, y: 4 }, skipped: true },
        ]}
      />
      <div>
        By taking the steps and spinning them by 45 degrees, we can get the following graph, which
        represents the Myers algorithm better:
      </div>
      <MyersStepVisualizer trace={traces} />
      <div>
        The x axis represents the amount of steps required to reach the specific presented value.
      </div>
      <div>The y axis represents the difference between the x and y values.</div>
      <div>
        Each time we move to the right (as in delete a character), the x value increases and thus
        the k increases aswell.
      </div>
      <div>
        Each time we move down (as in add a character), the y value increases and thus the k
        decreases.
      </div>
      <div>Moving diagonally increases both x and y, so the k remains to be the same.</div>
      <div>
        Because k relies on the value of k, we can entirely remove the y value and still maintain
        all relevant data (as y can be calculated through the k and x values):
      </div>
      <MyersStepVisualizer trace={traces} isSwitched />
      <div>
        For both the matrix and spinned graph, we are trying to record the furthest through we can
        reach of each k at each step.
      </div>
    </>
  );
};
