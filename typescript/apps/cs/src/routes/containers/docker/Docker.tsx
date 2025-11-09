import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { Commands } from "./Commands";
import { dynatic } from "../../../dynatic-css.config";

export const Docker = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerClassName={dynatic`
          position: sticky;
          margin-top: -8px;
        `}
        links={[{ path: "/containers/docker/commands", children: "Commands" }]}
      />
      <SubRouter
        paths={{
          "/": (
            <div>
              <StyledMainTitle>Docker</StyledMainTitle>
            </div>
          ),
          "/commands": <Commands />,
        }}
      />
    </div>
  );
};
