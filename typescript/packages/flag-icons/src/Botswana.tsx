import { type SVGIconProps } from "./types";

export const Botswana = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path d="M1 13H31V19H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v6H1V8c0-2.208,1.792-4,4-4Z" fill="#7ba9d0"></path>
      <path
        d="M5,18H27c2.208,0,4,1.792,4,4v6H1v-6c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 23)"
        fill="#7ba9d0"
      ></path>
      <path fill="#fff" d="M1 12H31V14H1z"></path>
      <path fill="#fff" d="M1 18H31V20H1z"></path>
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
