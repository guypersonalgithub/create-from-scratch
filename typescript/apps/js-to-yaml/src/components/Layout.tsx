import { dynatic } from "../dynatic-css.config";
import { type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className={dynatic`
        height: 100vh;
        background-image: linear-gradient(
          135deg,
          ${(config) => config.shared.layoutBackgroundGradientFirstColor},
          ${(config) => config.colors.layoutBackgroundGradientSecondColor}
        );
        overflow-y: auto;
        background-color: ${(config) => config.colors.layoutMainBG};
        transition: ${(config) => config.shared.defaultTransition};
      `}
    >
      {children}
    </div>
  );
};
