import { type CSSProperties, type ReactNode } from "react";

export type LinkGroupProperties = { title: string; links: { label: string; pathname: string }[] };

export type GroupedSidebarProps = {
  links: LinkGroupProperties[];
  className?: string;
  style?: CSSProperties;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  linkClassName?: (args: { pathname: string }) => string;
  linkStyle?: (args: { pathname: string }) => CSSProperties;
} & Link;

type Link =
  | {
      linkContent?: (args: {
        label: string;
        pathname: string;
        onLinkClick?: (args: { pathname: string }) => void;
      }) => ReactNode;
      onLinkClick?: never;
    }
  | {
      linkContent?: never;
      onLinkClick: (args: { pathname: string }) => void;
    };
