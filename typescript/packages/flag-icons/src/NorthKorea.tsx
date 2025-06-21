import { type SVGIconProps } from "./types";

export const NorthKorea = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#da3530" d="M1 8H31V24H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z" fill="#1f4d9e"></path>
      <path
        d="M5,23H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25.5)"
        fill="#1f4d9e"
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
        d="M10.312,12c-2.037,0-3.687,1.651-3.687,3.688s1.651,3.688,3.687,3.688,3.688-1.651,3.688-3.688-1.651-3.688-3.688-3.688Zm2.1,6.578l-2.1-1.526-2.1,1.526,.802-2.468-2.1-1.526h2.595l.802-2.468,.802,2.468h2.595l-2.1,1.526,.802,2.468Z"
        fill="#fff"
      ></path>
    </svg>
  );
};
