import { ReactNode } from "react";
import { QueryParams } from "@packages/url";

export type SidebarLink = {
  icon?: ReactNode;
  label: string;
  pathname: string;
  queryParams?: QueryParams;
};

export type SidebarLinkGroup = {
  category: string;
  links: (SidebarLink | SidebarLinkGroup)[];
};
