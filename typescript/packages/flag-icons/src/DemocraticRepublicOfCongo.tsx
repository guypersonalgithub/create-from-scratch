import { type SVGIconProps } from "./types";

export const DemocraticRepublicOfCongo = ({
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
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#387ef7"></rect>
      <path
        fill="#f2d84b"
        d="M9.295 11.069L11.895 9.181 8.682 9.181 7.689 6.125 6.696 9.181 3.483 9.181 6.082 11.069 5.089 14.125 7.689 12.236 10.288 14.125 9.295 11.069z"
      ></path>
      <path
        d="M31,8c0-1.64-.989-3.045-2.401-3.663L1,21.816v2.184c0,1.64,.989,3.045,2.401,3.663L31,10.184v-2.184Z"
        fill="#f2d84b"
      ></path>
      <path
        d="M29.534,4.929L1,23v1c0,1.242,.578,2.338,1.466,3.071L31,9v-1c0-1.242-.578-2.338-1.466-3.071Z"
        fill="#be2a28"
      ></path>
      <path
        d="M1,8V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4Zm1,0c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8Z"
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
