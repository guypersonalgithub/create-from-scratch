import { type SVGIconProps } from "./types";

export const Maldives = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c22b38"></rect>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
      <path fill="#377d40" d="M6 9H26V23H6z"></path>
      <path
        d="M15.217,16c0-1.747,1.252-3.201,2.908-3.515-.217-.041-.442-.064-.671-.064-1.977,0-3.579,1.602-3.579,3.579s1.602,3.579,3.579,3.579c.229,0,.454-.022,.671-.064-1.656-.314-2.908-1.768-2.908-3.515Z"
        fill="#fff"
      ></path>
    </svg>
  );
};
