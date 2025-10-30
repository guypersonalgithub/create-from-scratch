import { type SVGIconProps } from "./types";

export const CentralAfricanRepublic = ({
  size,
  width = size,
  height = size,
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
      <path fill="#4b9638" d="M1 15H31V22H1z"></path>
      <path fill="#fff" d="M1 9H31V16H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z" fill="#0f2c7e"></path>
      <path
        d="M5,22H27c2.208,0,4,1.792,4,4v2H1v-2c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 25)"
        fill="#f8d147"
      ></path>
      <path
        fill="#f8d147"
        d="M7.575 7.472L8.875 6.528 7.269 6.528 6.772 5 6.276 6.528 4.669 6.528 5.969 7.472 5.472 9 6.772 8.056 8.072 9 7.575 7.472z"
      ></path>
      <path fill="#c22b38" d="M13 4H19V28H13z"></path>
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
