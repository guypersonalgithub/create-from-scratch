import { type SVGIconProps } from "./types";

export const Belarus = ({ size, width = size, height = size, className, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <path d="M1,8v13H31V8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4Z" fill="#be2d27"></path>
      <path
        d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 24)"
        fill="#367b37"
      ></path>
      <path fill="#fff" d="M4 13L5 16 4 19 3 16 4 13z"></path>
      <path fill="#fff" d="M2.5 8L3.5 11 2.5 14 1.5 11 2.5 8z"></path>
      <path fill="#fff" d="M5.5 8L6.5 11 5.5 14 4.5 11 5.5 8z"></path>
      <path fill="#fff" d="M2.5 18L3.5 21 2.5 24 1.5 21 2.5 18z"></path>
      <path fill="#fff" d="M5.5 18L6.5 21 5.5 24 4.5 21 5.5 18z"></path>
      <path fill="#fff" d="M1 13L1 19 2 16 1 13z"></path>
      <path fill="#fff" d="M7 13L6 16 7 19 7 13z"></path>
      <path
        d="M5,6l-.645-1.935c-.27,.044-.53,.113-.779,.208l-.576,1.727,1,3,1-3Z"
        fill="#fff"
      ></path>
      <path d="M1.853,5.558c-.526,.677-.853,1.518-.853,2.442v1l1-3-.147-.442Z" fill="#fff"></path>
      <path fill="#fff" d="M6.667 4L6 6 7 9 7 4 6.667 4z"></path>
      <path
        d="M5,26l-.645,1.935c-.27-.044-.53-.113-.779-.208l-.576-1.727,1-3,1,3Z"
        fill="#fff"
      ></path>
      <path d="M1.853,26.442c-.526-.677-.853-1.518-.853-2.442v-1l1,3-.147,.442Z" fill="#fff"></path>
      <path fill="#fff" d="M6.667 28L6 26 7 23 7 28 6.667 28z"></path>
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
