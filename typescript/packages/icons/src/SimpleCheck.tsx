import { SVGIconProps } from "./types";

export const SimpleCheck = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={width}
      height={height}
      style={style}
    >
      <path d="M20 6 9 17l-5-5"></path>
    </svg>
  );
};
