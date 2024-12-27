import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Generics } from "./Generics/Generics";

export const Typescript = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/typescript", children: "Typescript" },
          { path: "/typescript/generics", children: "Generics" },
        ]}
      />
      <SubRouter
        paths={{
          "/": () => {
            return (
              <div>
                <StyledMainTitle>Typescript</StyledMainTitle>
              </div>
            );
          },
          "/generics!": <Generics />,
        }}
      />
    </div>
  );
};
