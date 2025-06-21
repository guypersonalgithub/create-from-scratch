import { type SVGIconProps } from "./types";

export const Togo = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path d="M5,4H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z" fill="#2d684e"></path>
      <path
        d="M5,22H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25)"
        fill="#2d684e"
      ></path>
      <path fill="#f8d147" d="M1 18H31V23H1z"></path>
      <path fill="#f8d147" d="M1 9H31V14H1z"></path>
      <path fill="#2d684e" d="M1 13.5H31V18.5H1z"></path>
      <path d="M5,4H15.5v14.5H1V8c0-2.208,1.792-4,4-4Z" fill="#c22b38"></path>
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
        fill="#fff"
        d="M9.802 12.162L12.312 10.338 9.209 10.338 8.25 7.386 7.291 10.338 4.187 10.338 6.698 12.162 5.739 15.114 8.25 13.289 10.761 15.114 9.802 12.162z"
      ></path>
    </svg>
  );
};
