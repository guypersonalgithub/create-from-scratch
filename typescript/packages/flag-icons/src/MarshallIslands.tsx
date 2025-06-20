import { type SVGIconProps } from "./types";

export const MarshallIslands = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#13348f"></rect>
      <path
        d="M29.684,5.053L2.316,26.947c.059,.054,.122,.102,.185,.152L31,10v-2c0-1.172-.513-2.216-1.316-2.947Z"
        fill="#d07b2c"
      ></path>
      <path
        d="M2.745,27.302l28.255-11.302v-6L2.5,27.1c.082,.067,.157,.142,.245,.202Z"
        fill="#fff"
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
        d="M10,8l.206,3.433,.72-1.892-.322,1.998,1.186-1.641-.828,1.847,1.57-1.278-1.277,1.57,1.846-.828-1.641,1.185,1.999-.322-1.892,.721,3.433,.206-3.433,.206,1.892,.72-1.999-.322,1.641,1.186-1.846-.828,1.277,1.57-1.57-1.277,.828,1.846-1.186-1.641,.322,1.999-.72-1.892-.206,3.433-.206-3.433-.721,1.892,.322-1.999-1.185,1.641,.828-1.846-1.57,1.277,1.278-1.57-1.847,.828,1.641-1.186-1.998,.322,1.892-.72-3.433-.206,3.433-.206-1.892-.721,1.998,.322-1.641-1.185,1.847,.828-1.278-1.57,1.57,1.278-.828-1.847,1.185,1.641-.322-1.998,.721,1.892,.206-3.433Z"
        fill="#fff"
      ></path>
    </svg>
  );
};
