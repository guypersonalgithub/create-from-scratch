import { MyersStepVisualizer } from "@packages/myers-visualizer";
import { StyledInteractiveTitle } from "../../../../styledComponents/StyledInteractiveTitle";
import { baseTrace } from "./constants";
import { FirstExample } from "./FirstExample";
import { SecondExample } from "./SecondExample";
import { ThirdExample } from "./ThirdExample";
import { FourthExample } from "./FourthExample";

export const MyersAlgorithm = () => {
  return (
    <>
      <StyledInteractiveTitle>Myers Algorithm</StyledInteractiveTitle>
      <ul>
        <li>
          <div>
            On each step, the value of k either increases or decreases by 1. That means, that for
            example on step 3,
            <b>the highest potential value of K is 3, and the lowest is -3</b>.
          </div>
          <div>
            <b>
              That means, that for each step, we have a potential range that k cannot get out of
              [-d, +d] when d represents the current step.
            </b>
          </div>
          <MyersStepVisualizer trace={baseTrace} />
        </li>
        <li>
          <FirstExample />
        </li>
        <li>
          <SecondExample />
          <div>
            To discover the best move we need to decide where should we be going.{" "}
            <b>
              Either downward which would mean the previous step can be presented as (d - 1, k + 1)
              (which would lead to (d - 1 + 1, k + 1 - 1)), or rightward which would mean the
              previous step can be presented as (d - 1, k - 1) (which would lead to (d - 1 + 1, k -
              1 + 1))
            </b>
            .
          </div>
          <ul>
            <li>
              <ThirdExample />
            </li>
            <li>
              <FourthExample />
            </li>
          </ul>
        </li>
        <li>
          If we got two different steps with the same k, the algorithm dictates that we should be
          going with the rightward approach as that would increase k as opposed to decreasing it by
          deleting a character <b>(Example in the algorithm examples page)</b>.
        </li>
        <li>
          <div>
            Since we are storing each (x, y) position indexed against k, and k = x - y, we don't
            need to store the y since it can be calculated from the values of k and x.
          </div>
          <div>
            We don't need to store the direction of the move taken at each step, we just store the
            best x value we can achieve at each point. The path will be derived after we've
            completed this process to find the smallest d that gets us to the bottom right position.
            Once we know where the final position shows up we can backtrack to find which single
            path out of the many will lead us there.
          </div>
          <div>
            The x values in the <b>d</b>th round depend only on those in the <b>(d-1)</b>th round,
            because each round modifies either the odd or even k positions, each round doesn't
            modify the values it depends on from the previous round, therefore the x values can be
            stored in a single flat array indexed by k.
          </div>
          <div>
            <b>All of these could be seen in the implementation.</b>
          </div>
        </li>
      </ul>
    </>
  );
};
