import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Generics } from "./Generics/Generics";
import { dynatic } from "../../dynatic-css.config";

export const Typescript = () => {
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
