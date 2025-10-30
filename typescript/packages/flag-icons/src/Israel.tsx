import { type SVGIconProps } from "./types";

export const Israel = ({ size, width = size, height = size, className, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"></rect>
      <path fill="#1433b3" d="M1 8H31V12H1z"></path>
      <path fill="#1433b3" d="M1 20H31V24H1z"></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M16,19.464l-1-1.732h-2l1-1.732-1-1.732h2l1-1.732,1,1.732h2l-1,1.732,1,1.732h-2l-1,1.732Zm-.365-1.732l.365,.632,.365-.632h-.73Zm1.682-.55h.73l-.365-.632-.365,.632Zm-2,0h1.365l.682-1.182-.682-1.182h-1.365l-.682,1.182,.682,1.182Zm-1.365,0h.73l-.365-.632-.365,.632Zm3.365-2.364l.365,.632,.365-.632h-.73Zm-3.365,0l.365,.632,.365-.632h-.73Zm1.682-.55h.73l-.365-.632-.365,.632Z"
        fill="#1437b0"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
