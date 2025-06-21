import { type SVGIconProps } from "./types";

export const SaintVincentGrenadines = ({
  size,
  width = size,
  height = size,
  style,
}: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#f5d34d" d="M8 4H24V28H8z"></path>
      <path d="M5,4h4V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#0a2070"></path>
      <path
        d="M27,4h4V28h-4c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 27 16)"
        fill="#367b35"
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
      <path fill="#367b35" d="M13.818 12L15.636 15.149 13.818 18.298 12 15.149 13.818 12z"></path>
      <path fill="#367b35" d="M18.182 12L20 15.149 18.182 18.298 16.364 15.149 18.182 12z"></path>
      <path fill="#367b35" d="M16 15.779L17.818 18.928 16 22.077 14.182 18.928 16 15.779z"></path>
    </svg>
  );
};
