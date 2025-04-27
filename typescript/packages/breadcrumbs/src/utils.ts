import { Breadcrumb } from "./types";

export const areSimplifiedBreadcrumbs = (crumbs: Breadcrumb[] | string[]): crumbs is string[] => {
  const crumb = crumbs[0];
  const type = typeof crumb;
  return type === "string" || type === "undefined";
};
