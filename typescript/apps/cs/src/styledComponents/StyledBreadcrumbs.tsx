import { Breadcrumbs, BreadcrumbsProps } from "@packages/breadcrumbs";
import { useParsePathname } from "@packages/hooks";
import { usePath } from "@packages/router";
import { capitalizeFirstChar } from "@packages/utils";

type StyledBreadcrumbsProps = Omit<BreadcrumbsProps, "onClick">;

export const StyledBreadcrumbs = ({
  crumbs,
  style,
  currentCrumbStyle,
  ...rest
}: StyledBreadcrumbsProps) => {
  const { paths } = useParsePathname();
  const { moveTo } = usePath();

  return (
    <Breadcrumbs
      {...rest}
      crumbs={[
        ...crumbs,
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
      style={{ height: "30px", ...style }}
      currentCrumbStyle={{
        border: "none",
        background: "none",
        color: "white",
        fontWeight: "bolder",
        ...currentCrumbStyle,
      }}
      clickableCrumbsStyle={{
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#5662F6",
        fontWeight: "bolder",
      }}
      onClick={({ crumb }) => {
        moveTo({ pathname: crumb });
      }}
    />
  );
};
