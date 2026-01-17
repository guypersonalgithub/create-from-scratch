import type { ComponentProps } from "react";
import { SkewedTitle } from "@packages/title";
import { dynatic } from "../dynatic-css.config";

type StyledSkewedTitleProps = Pick<ComponentProps<typeof SkewedTitle>, "title" | "skewed">;

export const StyledSkewedTitle = ({ title, skewed }: StyledSkewedTitleProps) => {
  return (
    <SkewedTitle
      className={dynatic`
        font-weight: 700;
        font-size: 20px;
        margin-top: 20px;
      `}
      skewedClassName={dynatic`
        font-weight: 800;
        background-color: #fde68a;
        padding-inline: 8px;
        border-radius: 4px;
        color: #92400e;
      `}
      title={title}
      skewed={skewed}
    />
  );
};
