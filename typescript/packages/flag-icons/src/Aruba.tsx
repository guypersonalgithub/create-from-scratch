import { type SVGIconProps } from "./types";

export const Aruba = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#4091df" stroke-width="0"></rect>
      <rect x="1" y="18" width="30" height="2" fill="#ffd203" stroke-width="0"></rect>
      <rect x="1" y="22" width="30" height="2" fill="#ffd203" stroke-width="0"></rect>
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
        points="7.2397 12.7031 3.2451 11.4717 7.2397 10.2402 8.4712 6.2451 9.7026 10.2402 13.6973 11.4717 9.7026 12.7031 8.4712 16.6973 7.2397 12.7031"
        fill="#fff"
        stroke-width="0"
      ></polygon>
      <path
        d="m8.4712,7.9424l.8317,2.697,2.697.8317-2.697.8317-.8317,2.697-.8317-2.6969-2.697-.8319,2.697-.8317.8317-2.697Z"
        fill="#db4647"
        stroke-width="0"
      ></path>
    </svg>
  );
};
