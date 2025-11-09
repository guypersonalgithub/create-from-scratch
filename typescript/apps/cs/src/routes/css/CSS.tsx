import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Converter } from "./Converter";
import { dynatic } from "../../dynatic-css.config";

export const CSS = () => {
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
          { path: "/css", children: "CSS" },
          { path: "/css/converter", children: "Converter" },
        ]}
      />
      <SubRouter
        paths={{
          "/": <></>,
          "/converter": <Converter />,
        }}
      />
    </div>
  );
};
