import { type SidebarLinkGroup } from "./types";

export const isLinkGroup = (link: unknown): link is SidebarLinkGroup => {
  return !!(link as SidebarLinkGroup).category;
};
