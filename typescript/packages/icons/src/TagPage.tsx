import { type SVGIconProps } from "./types";

export const TagPage = ({ size, width = size, height = size, style }: SVGIconProps) => {
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
      <path d="M10 12.5 8 15l2 2.5"></path>
      <path d="m14 12.5 2 2.5-2 2.5"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path>
    </svg>
  );
};
