import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { Commands } from "./Commands";

export const Docker = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/containers/docker/commands", children: "Commands" },
        ]}
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
