import { Breadcrumbs, type BreadcrumbsProps } from "@packages/breadcrumbs";
import { useParsePathname } from "@packages/hooks";
import { usePath } from "@packages/router";
import { capitalizeFirstChar, combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";

type StyledBreadcrumbsProps = Omit<BreadcrumbsProps, "style" | "currentCrumbStyle" | "onClick">;

export const StyledBreadcrumbs = ({
  crumbs,
  className,
  currentCrumbClassName,
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
      className={combineStringsWithSpaces(
        dynatic`
          height: 30px;
        `,
        className,
      )}
      currentCrumbClassName={combineStringsWithSpaces(
        dynatic`
          border: none;
          background: none;
          color: white;
          font-weight: bolder;
        `,
        currentCrumbClassName,
      )}
      clickableCrumbClassName={dynatic`
        border: none;
        background: none;
        cursor: pointer;
        color: #5662F6;
        font-weight: bolder;
      `}
      onClick={({ crumb }) => {
        moveTo({ pathname: crumb });
      }}
    />
  );
};
