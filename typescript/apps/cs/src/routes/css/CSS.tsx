import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Converter } from "./Converter";

export const CSS = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
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
