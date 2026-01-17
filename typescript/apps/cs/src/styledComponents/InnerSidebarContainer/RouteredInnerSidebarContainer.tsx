import { RouterPaths, SubRouter, usePath, usePathState } from "@packages/router";
import { InnerSidebarContainerProps } from "./types";
import { InnerSidebarContainer } from "./InnerSidebarContainer";
import { dynatic } from "../../dynatic-css.config";
import { StyledBreadcrumbs } from "../StyledBreadcrumbs";

type RouteredInnerSidebarContainerProps<T extends string> = Omit<
  InnerSidebarContainerProps<T>,
  "className" | "sidebarClassName" | "current" | "onClick" | "content"
> & {
  paths: RouterPaths;
};

export const RouteredInnerSidebarContainer = <T extends string>({
  paths,
  ...props
}: RouteredInnerSidebarContainerProps<T>) => {
  const { path } = usePathState();
  const { moveTo } = usePath();

  return (
    <InnerSidebarContainer
      {...props}
      className={dynatic`
        height: calc(100vh - 80px);
      `}
      sidebarClassName={dynatic`
        height: calc(100vh - 100px);  
      `}
      current={path}
      onClick={(pathname) => moveTo({ pathname })}
      content={
        <>
          <StyledBreadcrumbs crumbs={[{ value: "/", content: "Home" }]} />
          <SubRouter
            wrapperClassName={dynatic`
            padding-inline: 20px;
            padding-bottom: 20px;
            overflow-y: auto;
            height: calc(100vh - 130px);
            width: calc(100vw - 510px);
          `}
            paths={paths}
          />
        </>
      }
    />
  );
};
