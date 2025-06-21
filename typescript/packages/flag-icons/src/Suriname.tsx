import { type SVGIconProps } from "./types";

export const Suriname = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#a6222f" d="M1 8H31V24H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z" fill="#497e44"></path>
      <path
        d="M5,23H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25.5)"
        fill="#497e44"
      ></path>
      <path fill="#fff" d="M1 9H31V10H1z"></path>
      <path fill="#fff" d="M1 22H31V23H1z"></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path
        fill="#e7cb48"
        d="M18.008 17.18L21.257 14.82 17.241 14.82 16 11 14.759 14.82 10.743 14.82 13.992 17.18 12.751 21 16 18.639 19.249 21 18.008 17.18z"
      ></path>
    </svg>
  );
};
