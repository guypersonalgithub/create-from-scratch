import { type SVGIconProps } from "./types";

export const Djibouti = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path d="M1,24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V15H1v9Z" fill="#4fac3f"></path>
      <path d="M27,4H5c-2.209,0-4,1.791-4,4v8H31V8c0-2.209-1.791-4-4-4Z" fill="#7cb2e3"></path>
      <path
        d="M2.433,27.044l16.567-11.044L2.433,4.956c-.869,.734-1.433,1.818-1.433,3.044V24c0,1.227,.564,2.311,1.433,3.044Z"
        fill="#fff"
      ></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        fill="#c62d25"
        d="M9.467 16.553L11.562 15.03 8.972 15.03 8.172 12.567 7.371 15.03 4.781 15.03 6.877 16.553 6.076 19.016 8.172 17.494 10.267 19.016 9.467 16.553z"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
