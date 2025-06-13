import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Commands } from "./Commands/Commands";

export const Linux = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/linux", children: "Linux" },
          { path: "/linux/commands", children: "Commands" },
        ]}
      />
      <SubRouter
        paths={{
          "/": <></>,
          "/commands!": <Commands />,
        }}
      />
    </div>
  );
};
