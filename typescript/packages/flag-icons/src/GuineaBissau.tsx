import { type SVGIconProps } from "./types";

export const GuineaBissau = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path d="m27,4h-15v12h19v-8c0-2.2092-1.7908-4-4-4Z" fill="#fdd310" stroke-width="0"></path>
      <path d="m12,16v12h15c2.2092,0,4-1.7908,4-4v-8H12Z" fill="#049f48" stroke-width="0"></path>
      <path
        d="m5,4h8v24H5c-2.2077,0-4-1.7923-4-4V8c0-2.2077,1.7923-4,4-4Z"
        fill="#cf0922"
        stroke-width="0"
      ></path>
      <path
        d="m27,4H5c-2.2091,0-4,1.7908-4,4v16c0,2.2092,1.7909,4,4,4h22c2.2092,0,4-1.7908,4-4V8c0-2.2092-1.7908-4-4-4Zm3,20c0,1.6543-1.3457,3-3,3H5c-1.6543,0-3-1.3457-3-3V8c0-1.6543,1.3457-3,3-3h22c1.6543,0,3,1.3457,3,3v16Z"
        opacity=".15"
        stroke-width="0"
      ></path>
      <path
        d="m27,5H5c-1.6569,0-3,1.3431-3,3v1c0-1.6569,1.3431-3,3-3h22c1.6569,0,3,1.3431,3,3v-1c0-1.6569-1.3431-3-3-3Z"
        fill="#fff"
        opacity=".2"
        stroke-width="0"
      ></path>
      <polygon
        points="9.6449 19.6853 8.7301 16.87 11.125 15.13 8.1648 15.13 7.25 12.3147 6.3352 15.13 3.375 15.13 5.7699 16.87 4.8551 19.6853 4.8551 19.6853 4.8551 19.6853 4.8551 19.6853 4.8551 19.6853 7.25 17.9454 9.6449 19.6853 9.6449 19.6853 9.6449 19.6853 9.6449 19.6853 9.6449 19.6853"
        stroke-width="0"
      ></polygon>
    </svg>
  );
};
