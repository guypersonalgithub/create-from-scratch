import { combineStringsWithSpaces } from "@packages/string-utils";
import "./Skeleton.styles.css";
import { dynatic } from "@packages/dynatic-css";

type SkeletonProps = {
  className?: string;
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  borderRadius?: number;
  backgroundColor?: string;
};

export const Skeleton = ({
  className,
  height = 0,
  width = 0,
  borderRadius = 4,
  backgroundColor = "#e0e0e0",
}: SkeletonProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          -webkit-animation: flicker 3s infinite ease-in-out;
          animation: flicker 3s infinite ease-in-out;
        `,
        typeof height === "string" && height.includes("%")
          ? dynatic`
              height: ${height};
            `
          : dynatic`
              height: ${height}px;
            `,
        typeof width === "string" && width.includes("%")
          ? dynatic`
              width: ${width};
            `
          : dynatic`
              width: ${width}px;
            `,
        borderRadius &&
          dynatic`
            border-radius: ${borderRadius}px; 
          `,
        backgroundColor &&
          dynatic`
            background-color: ${backgroundColor};
          `,
        className,
      )}
    />
  );
};
