import { CSSProperties, Fragment, ReactNode } from "react";
import { Button } from "@packages/button";
import { Breadcrumb } from "./types";
import { areSimplifiedBreadcrumbs } from "./utils";

type BreadcrumbsProps = {
  crumbs: Breadcrumb[] | string[];
  onClick: (args: { crumb: string }) => void;
  crumbSpreader?: ReactNode;
  style?: CSSProperties;
  clickableCrumbsStyle?: CSSProperties;
  currentCrumbStyle?: CSSProperties;
};

export const Breadcrumbs = ({
  crumbs = [],
  onClick,
  crumbSpreader = "/",
  style,
  clickableCrumbsStyle,
  currentCrumbStyle,
}: BreadcrumbsProps) => {
  const lastCrumbIndex = crumbs.length - 1;
  const simplifiedBreadcrumbs = areSimplifiedBreadcrumbs(crumbs);

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center", ...style }}>
      {simplifiedBreadcrumbs
        ? crumbs.map((crumb, index) => {
            const isLastCrumb = index === lastCrumbIndex;

            if (isLastCrumb) {
              return (
                <Button
                  key={crumb}
                  disabled
                  style={{ border: "none", background: "none", ...currentCrumbStyle }}
                >
                  {crumb}
                </Button>
              );
            }

            return (
              <Fragment key={crumb}>
                <Button
                  onClick={() => onClick({ crumb })}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#5662F6",
                    fontWeight: "bolder",
                    ...clickableCrumbsStyle,
                  }}
                >
                  {crumb}
                </Button>
                {crumbSpreader}
              </Fragment>
            );
          })
        : crumbs.map((crumb, index) => {
            const { value, content } = crumb;
            const isLastCrumb = index === lastCrumbIndex;

            if (isLastCrumb) {
              return (
                <Button key={value} disabled style={currentCrumbStyle}>
                  {content}
                </Button>
              );
            }

            return (
              <Fragment key={value}>
                <Button onClick={() => onClick({ crumb: value })} style={clickableCrumbsStyle}>
                  {content}
                </Button>
                {crumbSpreader}
              </Fragment>
            );
          })}
    </div>
  );
};
