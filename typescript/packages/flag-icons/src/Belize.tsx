import { type SVGIconProps } from "./types";

export const Belize = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#0f0e91" d="M1 8H31V24H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z" fill="#c82c24"></path>
      <path
        d="M5,23H27c2.208,0,4,1.792,4,4v1H1v-1c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25.5)"
        fill="#c82c24"
      ></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <circle cx="16" cy="16" r="5" fill="#fff"></circle>
      <circle cx="16" cy="12.5" r=".5" fill="#4b8a26"></circle>
      <circle cx="14.25" cy="12.969" r=".5" fill="#4b8a26"></circle>
      <circle cx="12.969" cy="14.25" r=".5" fill="#4b8a26"></circle>
      <circle cx="12.5" cy="16" r=".5" fill="#4b8a26"></circle>
      <circle cx="12.969" cy="17.75" r=".5" fill="#4b8a26"></circle>
      <circle cx="14.25" cy="19.031" r=".5" fill="#4b8a26"></circle>
      <circle cx="16" cy="19.5" r=".5" fill="#4b8a26"></circle>
      <circle cx="17.75" cy="19.031" r=".5" fill="#4b8a26"></circle>
      <circle cx="19.031" cy="17.75" r=".5" fill="#4b8a26"></circle>
      <circle cx="19.5" cy="16" r=".5" fill="#4b8a26"></circle>
      <circle cx="19.031" cy="14.25" r=".5" fill="#4b8a26"></circle>
      <circle cx="17.75" cy="12.969" r=".5" fill="#4b8a26"></circle>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
