import { type CSSProperties, Fragment, type ReactNode } from "react";
import { Button } from "@packages/button";
import { type Breadcrumb } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export type BreadcrumbsProps = {
  crumbs: Breadcrumb[];
  onClick: (args: { crumb: string }) => void;
  crumbSpreader?: ReactNode;
  className?: string;
  style?: CSSProperties;
  clickableCrumbClassName?: string;
  clickableCrumbsStyle?: CSSProperties;
  currentCrumbClassName?: string;
  currentCrumbStyle?: CSSProperties;
};

export const Breadcrumbs = ({
  crumbs = [],
  onClick,
  crumbSpreader = "/",
  className,
  style,
  clickableCrumbClassName,
  clickableCrumbsStyle,
  currentCrumbClassName,
  currentCrumbStyle,
}: BreadcrumbsProps) => {
  const lastCrumbIndex = crumbs.length - 1;

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          gap: 2px;
          align-items: center;
        `,
        className,
      )}
      style={style}
    >
      {crumbs.map((crumb, index) => {
        const { value, content } = crumb;
        const isLastCrumb = index === lastCrumbIndex;

        if (isLastCrumb) {
          return (
            <Button
              key={value}
              disabled
              className={currentCrumbClassName}
              style={currentCrumbStyle}
            >
              {content}
            </Button>
          );
        }

        return (
          <Fragment key={value}>
            <Button
              onClick={() => onClick({ crumb: value })}
              className={clickableCrumbClassName}
              style={clickableCrumbsStyle}
            >
              {content}
            </Button>
            {crumbSpreader}
          </Fragment>
        );
      })}
    </div>
  );
};
