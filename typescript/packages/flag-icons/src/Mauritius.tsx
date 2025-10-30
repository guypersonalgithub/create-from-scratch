import { type SVGIconProps } from "./types";

export const Mauritius = ({
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
      <path d="M1,24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4v-3H1v3Z" fill="#4aa459"></path>
      <path fill="#f8d849" d="M1 15H31V22H1z"></path>
      <path d="M27,4H5c-2.209,0-4,1.791-4,4v3H31v-3c0-2.209-1.791-4-4-4Z" fill="#d83b3f"></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path fill="#151a69" d="M1 10H31V16H1z"></path>
    </svg>
  );
};
