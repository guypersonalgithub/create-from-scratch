import { type SVGIconProps } from "./types";

export const RepublicCongo = ({
  size,
  width = size,
  height = size,
  className,
  style,
}: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <path d="M31,24V8c0-2.209-1.791-4-4-4h-1L6,28H27c2.209,0,4-1.791,4-4Z" fill="#c93039"></path>
      <path d="M5,4H26L6,28h-1c-2.209,0-4-1.791-4-4V8c0-2.209,1.791-4,4-4Z" fill="#42944b"></path>
      <path
        d="M27,4h-6L2.074,26.711c.731,.788,1.766,1.289,2.926,1.289h6L29.926,5.289c-.731-.788-1.766-1.289-2.926-1.289Z"
        fill="#f7e065"
      ></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
