import { type SVGIconProps } from "./types";

export const Martinique = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path
        d="m1,24c0,2.2092,1.7908,4,4,4h22c2.2092,0,4-1.7908,4-4v-9H1v9Z"
        fill="#1e1918"
        stroke-width="0"
      ></path>
      <path
        d="m27,4H5c-2.2092,0-4,1.7908-4,4v8h30v-8c0-2.2092-1.7908-4-4-4Z"
        fill="#05a84f"
        stroke-width="0"
      ></path>
      <path
        d="m2.3157,26.9474l13.6843-10.9474L2.3157,5.0526c-.8029.7316-1.3157,1.7756-1.3157,2.9474v16c0,1.1718.5128,2.2158,1.3157,2.9474Z"
        fill="#f0121e"
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
    </svg>
  );
};
