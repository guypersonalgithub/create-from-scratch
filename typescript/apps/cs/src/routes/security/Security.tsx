import { SubRouter, usePath } from "@packages/router";
import { SecurityRoot } from "./Root";
import { Attacks } from "./attacks/Attacks";
import { useParsePathname } from "@packages/hooks";
import { StyledBreadcrumbs } from "../../styledComponents/StyledBreadcrumbs";
import { capitalizeFirstChar } from "@packages/utils";

export const Security = () => {
  const { paths } = useParsePathname();
  const { moveTo } = usePath();

  return (
    <div>
      <StyledBreadcrumbs
        crumbs={[
          { value: "/", content: "Home" },
          ...paths.map((path) => {
            const { part, fullPath } = path;
            const split = part.split("-");
            const capitalized = split
              .map((current) => {
                return capitalizeFirstChar({ str: current });
              })
              .join(" ");

            return {
              value: fullPath,
              content: capitalized,
            };
          }),
        ]}
        onClick={({ crumb }) => {
          moveTo({ pathname: crumb });
        }}
      />
      <SubRouter
        paths={{
          "/": <SecurityRoot />,
          "/attacks!": <Attacks />,
        }}
      />
    </div>
  );
};
