import { SubRouter } from "@packages/router";
import { SecurityRoot } from "./Root";
import { Attacks } from "./attacks/Attacks";
import { StyledBreadcrumbs } from "../../styledComponents/StyledBreadcrumbs";

export const Security = () => {
  return (
    <div>
      <StyledBreadcrumbs crumbs={[{ value: "/", content: "Home" }]} />
      <SubRouter
        paths={{
          "/": <SecurityRoot />,
          "/attacks!": <Attacks />,
        }}
      />
    </div>
  );
};
