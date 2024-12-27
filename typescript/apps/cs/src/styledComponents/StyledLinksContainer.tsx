import { CSSProperties, forwardRef, ReactNode } from "react";
import { StyledLink } from "./StyledLink";

type StyledLinksContainerProps = {
  links: { path: string; children: ReactNode }[];
  containerStyle?: CSSProperties;
};

export const StyledLinksContainer = forwardRef<HTMLDivElement, StyledLinksContainerProps>(
  ({ links, containerStyle }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...containerStyle,
          display: "flex",
          gap: "5px",
          backgroundColor: "#242424",
          paddingBottom: "5px",
          zIndex: 3,
        }}
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
  },
);
