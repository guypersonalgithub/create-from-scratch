import { SVGIconProps } from "./types";

export const QuestionSimple = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={width}
      height={height}
      style={style}
    >
      <path d="M8.5 9.5a3 3 0 0 1 5 1.5 3 3 0 0 1-3 3 1 1 0 0 0-1 1V16" />
      <line x1="12" y1="19" x2="12" y2="19.01" />
    </svg>
  );
};
