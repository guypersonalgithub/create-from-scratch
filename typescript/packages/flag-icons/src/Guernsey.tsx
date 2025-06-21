import { type SVGIconProps } from "./types";

export const Guernsey = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
      <path
        fill="#be2a2a"
        d="M31 13L19 13 19 4 13 4 13 13 1 13 1 19 13 19 13 28 19 28 19 19 31 19 31 13z"
      ></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        fill="#f5df4c"
        d="M22 15L17 15 17 10 18 9 14 9 15 10 15 15 10 15 9 14 9 18 10 17 15 17 15 22 14 23 18 23 17 22 17 17 22 17 23 18 23 14 22 15z"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
