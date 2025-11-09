import { type ReactNode, type RefObject } from "react";
import { StyledLink } from "./StyledLink";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";

type StyledLinksContainerProps = {
  links: { path: string; children: ReactNode }[];
  containerClassName?: string;
  ref: RefObject<HTMLDivElement | null>;
};

export const StyledLinksContainer = ({
  links,
  containerClassName,
  ref,
}: StyledLinksContainerProps) => {
  return (
    <div
      ref={ref}
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          gap: 5px;
          padding-bottom: 5px;
          z-index: 3;
          background-color: #242424;
        `,
        containerClassName,
      )}
    >
      {links.map((link) => {
        return (
          <StyledLink key={link.path} pathname={link.path}>
            {link.children}
          </StyledLink>
        );
      })}
    </div>
  );
};
