import { SVGIconProps } from "./types";

export const ExclamationMark = ({
  size,
  width = size,
  height = size,
  style,
  strokeWidth = 1.5,
}: SVGIconProps & { strokeWidth?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      width={width}
      height={height}
      style={style}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
};
