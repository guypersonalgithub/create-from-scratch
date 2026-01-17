import { MyersCanvas } from "@packages/myers-visualizer";
import { myersConstants } from "./constants";
import { StyledInteractiveTitle } from "../../../styledComponents/StyledInteractiveTitle";

export const MyersAlgorithmTheory = () => {
  const { fromExample, toExample } = myersConstants;

  return (
    <>
      <StyledInteractiveTitle>Myers algorithm theory</StyledInteractiveTitle>
      <div>
        In general, Myers is a <b>greedy</b> algorithm.
      </div>
      <div>
        It is trying to batch as many lines that weren't changed before making any change if
        possible, and prefers deletions over insertions.
      </div>
      <div>
        The algorithm is based off the idea that finding the shortest edit path can be modelled as a{" "}
        <b>graph search</b>.
      </div>
      <div>
        By treating each letter as a point in a two dimensional grid, treating each change as an
        action of moving to the right or down from the previous position through (x , y)
        coordinates, it helps to visualize the optimal road to reach from (0 , 0) which is the
        starting point of string A at the top left corner of the grid, to the end point of string B
        at the bottom right corner of the grid.
      </div>
      <MyersCanvas oldStr={fromExample} newStr={toExample} />
      <StyledInteractiveTitle>Diff rules</StyledInteractiveTitle>
      <div>
        The rules are simple:
        <ul>
          <li>
            <div>
              moving right (<b>increasing the x coordinate</b>) represents deleting a character.
            </div>
            <MyersCanvas
              oldStr={fromExample}
              newStr={toExample}
              highlights={[
                { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, endComment: "(1 , 0)", color: "red" },
              ]}
            />
          </li>
          <li>
            <div>
              moving bottom (<b>increasing the y coordinate</b>) represents inserting a character.
            </div>
            <MyersCanvas
              oldStr={fromExample}
              newStr={toExample}
              highlights={[{ from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, endComment: "(0 , 1)" }]}
            />
          </li>
          <li>
            <div>
              moving digonally (<b>increasing both the x and y coordinates</b>) represents keeping
              the character without conducting any change.
            </div>
            <MyersCanvas
              oldStr={fromExample}
              newStr={toExample}
              highlights={[
                { from: { x: 0, y: 0 }, to: { x: 1, y: 1 }, endComment: "(1 , 1)", color: "blue" },
              ]}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
