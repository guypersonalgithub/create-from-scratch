import { type SVGIconProps } from "./types";

export const Mauritania = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#4ca863" d="M1 9H31V23H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z" fill="#c02f27"></path>
      <path
        d="M5,22H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25)"
        fill="#c02f27"
      ></path>
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
        fill="#f8d749"
        d="M13.953 13.393L15.511 13.393 16 11.927 16.489 13.393 18.047 13.393 16.764 14.33 17.283 15.817 16 14.9 14.717 15.817 15.236 14.33 13.953 13.393z"
      ></path>
      <path
        d="M8.363,12.64c.694,3.485,4.676,5.845,8.894,5.271,3.274-.445,5.841-2.566,6.38-5.271,0,4.105-3.419,7.433-7.637,7.433s-7.637-3.328-7.637-7.433Z"
        fill="#f8d749"
      ></path>
    </svg>
  );
};
