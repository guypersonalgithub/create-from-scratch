import { AnimatedContentTitle } from "@packages/title";
import type { ComponentProps } from "react";
import { dynatic } from "../dynatic-css.config";

type StyledAnimatedContentTitleProps = Pick<
  ComponentProps<typeof AnimatedContentTitle>,
  "children"
>;

export const StyledAnimatedContentTitle = ({ children }: StyledAnimatedContentTitleProps) => {
  return (
    <AnimatedContentTitle
      className={dynatic`
        background: linear-gradient(90deg, #f472b6, #3b82f6, #f472b6);
        font-size: 30px;
        font-weight: 800;
      `}
    >
      {children}
    </AnimatedContentTitle>
  );
};
