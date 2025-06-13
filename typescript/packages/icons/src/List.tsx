import { type SVGIconProps } from "./types";

export const List = ({ size, width = size, height = size, style }: SVGIconProps) => {
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
      <line x1="8" x2="21" y1="6" y2="6"></line>
      <line x1="8" x2="21" y1="12" y2="12"></line>
      <line x1="8" x2="21" y1="18" y2="18"></line>
      <line x1="3" x2="3.01" y1="6" y2="6"></line>
      <line x1="3" x2="3.01" y1="12" y2="12"></line>
      <line x1="3" x2="3.01" y1="18" y2="18"></line>
    </svg>
  );
};
