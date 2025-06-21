import { type SVGIconProps } from "./types";

export const Curacao = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#012680" stroke-width="0"></rect>
      <rect x="1" y="19" width="30" height="3" fill="#fae90b" stroke-width="0"></rect>
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
        points="11.3742 14.0242 13.0369 12.8443 10.9809 12.8443 10.3115 10.8361 9.6421 12.8443 7.5861 12.8443 9.2488 14.0242 8.5902 16 10.3115 14.7784 12.0328 16 11.3742 14.0242"
        fill="#fff"
        stroke-width="0"
      ></polygon>
      <polygon
        points="6.8095 9.6539 8.0881 8.7561 6.5102 8.7561 6.0082 7.25 5.5251 8.7561 4 8.7561 5.2398 9.6456 4.7889 11.0512 4.7172 11.123 6.0221 10.2068 7.2992 11.123 6.8095 9.6539"
        fill="#fff"
        stroke-width="0"
      ></polygon>
    </svg>
  );
};
