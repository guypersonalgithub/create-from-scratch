import { CSSProperties, Fragment, ReactNode } from "react";
import { Button } from "@packages/button";
import { Breadcrumb } from "./types";

export type BreadcrumbsProps = {
  crumbs: Breadcrumb[];
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

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center", ...style }}>
      {crumbs.map((crumb, index) => {
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
