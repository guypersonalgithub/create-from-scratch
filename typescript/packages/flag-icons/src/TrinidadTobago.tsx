import { type SVGIconProps } from "./types";

export const TrinidadTobago = ({
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
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c93039"></rect>
      <path
        d="M29.926,26.711L11,4H5c-1.159,0-2.195,.501-2.926,1.289L21,28h6c1.159,0,2.195-.501,2.926-1.289Z"
        fill="#fff"
      ></path>
      <path d="M9.692,4H5c-.8,0-1.541,.241-2.166,.645L22.328,28h4.672c.806,0,1.552-.243,2.18-.653L9.692,4Z"></path>
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
