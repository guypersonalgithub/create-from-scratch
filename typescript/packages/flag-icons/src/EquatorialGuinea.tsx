import { type SVGIconProps } from "./types";

export const EquatorialGuinea = ({
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
      <path fill="#fff" d="M1 11H31V21H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#579a2c"></path>
      <path
        d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 24)"
        fill="#d13626"
      ></path>
      <path
        d="M13.531,12.906h4.937v5.172c0,1.74-2.149,.382-2.469,1.328-.293-.945-2.456,.425-2.456-1.431,0-1.805-.013-5.069-.013-5.069Z"
        fill="#dcdcdc"
      ></path>
      <path
        d="M11,16L2.074,5.289c-.661,.714-1.074,1.661-1.074,2.711V24c0,1.05,.413,1.997,1.074,2.711l8.926-10.711Z"
        fill="#3272c9"
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
