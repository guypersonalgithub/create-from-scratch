import { Breadcrumbs, BreadcrumbsProps } from "@packages/breadcrumbs";

type StyledBreadcrumbsProps = BreadcrumbsProps;

export const StyledBreadcrumbs = (props: StyledBreadcrumbsProps) => {
  return (
    <Breadcrumbs
      {...props}
      style={{ height: "30px", ...props.style }}
      currentCrumbStyle={{
        border: "none",
        background: "none",
        color: "white",
        fontWeight: "bolder",
        ...props.currentCrumbStyle,
      }}
      clickableCrumbsStyle={{
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#5662F6",
        fontWeight: "bolder",
      }}
    />
  );
};
