import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { MyersRoot } from "./Root";
import { dynatic } from "../../../dynatic-css.config";
import { MyersAlgorithmTheory } from "./MyersAlgorithmTheory";
import { MyersAlgorithm } from "./MyersAlgorithm";
import { Backtracking } from "./Backtracking";

export const Myers = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerClassName={dynatic`
          position: sticky;
          margin-top: -8px;
        `}
        links={[
          { path: "/algorithms/myers", children: "Myers" },
          { path: "/algorithms/myers/algorithmTheory", children: "Algorithm Theory" },
          { path: "/algorithms/myers/algorithm", children: "Algorithm" },
          { path: "/algorithms/myers/backtracking", children: "Backtracking" },
        ]}
      />
      <SubRouter
        paths={{
          "/": <MyersRoot />,
          "/algorithmTheory": <MyersAlgorithmTheory />,
          "/algorithm": <MyersAlgorithm />,
          "/backtracking": <Backtracking />,
        }}
      />
    </div>
  );
};
