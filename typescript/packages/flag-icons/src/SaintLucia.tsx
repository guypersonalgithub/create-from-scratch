import { type SVGIconProps } from "./types";

export const SaintLucia = ({
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
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#81cbfa"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path d="M16,7l7.281,18-7.281-1.719-7.281,1.719L16,7Z" fill="#fff"></path>
      <path d="M16,9.427l5.604,13.854H10.396l5.604-13.854Z"></path>
      <path d="M16,16l7.281,9H8.719l7.281-9Z" fill="#f4d24b"></path>
    </svg>
  );
};
