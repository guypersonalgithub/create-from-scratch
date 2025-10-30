import { type SVGIconProps } from "./types";

export const FrenchGuiana = ({
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
      <path
        d="M2.316,5.053c-.803,.732-1.316,1.776-1.316,2.947V24c0,2.209,1.791,4,4,4H27c1.037,0,1.974-.405,2.684-1.053L2.316,5.053Z"
        fill="#f7df4b"
      ></path>
      <path
        d="M29.684,26.947c.803-.732,1.316-1.776,1.316-2.947V8c0-2.209-1.791-4-4-4H5c-1.037,0-1.974,.405-2.684,1.053L29.684,26.947Z"
        fill="#3c883a"
      ></path>
      <path
        fill="#c92d25"
        d="M17.673 16.457L20.381 14.49 17.034 14.49 16 11.307 14.966 14.49 11.619 14.49 14.327 16.457 13.292 19.64 16 17.673 18.708 19.64 17.673 16.457z"
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
