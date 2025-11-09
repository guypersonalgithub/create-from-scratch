import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Commands } from "./commands/Commands";
import { dynatic } from "../../dynatic-css.config";

export const Linux = () => {
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
