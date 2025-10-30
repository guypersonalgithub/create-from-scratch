import { type SVGIconProps } from "./types";

export const Mozanbique = ({
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
      <path d="M1 12H31V20H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v5H1v-5c0-2.208,1.792-4,4-4Z" fill="#307068"></path>
      <path
        d="M5,19H27c2.208,0,4,1.792,4,4v5H1v-5c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 23.5)"
        fill="#f8e34c"
      ></path>
      <path fill="#fff" d="M1 11H31V13H1z"></path>
      <path fill="#fff" d="M1 19H31V21H1z"></path>
      <path
        d="M2.316,26.947l13.684-10.947L2.316,5.053c-.803,.732-1.316,1.776-1.316,2.947V24c0,1.172,.513,2.216,1.316,2.947Z"
        fill="#c22b38"
      ></path>
      <path
        fill="#fff"
        d="M8.016 16.628L10.318 14.956 7.473 14.956 6.594 12.25 5.715 14.956 2.87 14.956 5.171 16.628 4.292 19.333 6.594 17.661 8.895 19.333 8.016 16.628z"
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
    </svg>
  );
};
