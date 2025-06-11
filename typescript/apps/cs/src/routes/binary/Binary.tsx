import { SubRouter } from "@packages/router";
import { BinaryRoot } from "./Root";
import { StyledBreadcrumbs } from "../../styledComponents/StyledBreadcrumbs";
import { Base10 } from "./Base10";

export const Binary = () => {

  return (
    <div>
      <StyledBreadcrumbs crumbs={[{ value: "/", content: "Home" }]} />
      <SubRouter
        paths={{
          "/": <BinaryRoot />,
          "/base-10": <Base10 />,
        }}
      />
    </div>
  );
};
