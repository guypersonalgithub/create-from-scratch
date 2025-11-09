import { combineStringsWithSpaces } from "@packages/string-utils";
import "./Spinner.styles.css";
import { dynatic } from "@packages/dynatic-css";

type SpinnerProps = {
  className?: string;
  size?: number;
  borderSize?: number;
  backgroundColor?: string;
  spinColor?: string;
};

export const Spinner = ({
  className,
  size = 30,
  borderSize = 0.13333333333,
  backgroundColor = "white",
  spinColor = "lightblue",
}: SpinnerProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: ${size}px;
          height: ${size}px;
          border: ${borderSize * size}px solid ${backgroundColor};
          border-top: ${borderSize * size}px solid ${spinColor};
          border-radius: 50%;
          -webkit-animation: spin 2s linear infinite;
          animation: spin 2s linear infinite;
        `,
        className,
      )}
    />
  );
};
