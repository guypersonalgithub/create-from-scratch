import { type SVGIconProps } from "./types";

export const AntiguaBarbuda = ({
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
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4"></rect>
      <path
        d="M16,17.658l-7.935-2.645,4.044-.774-3.439-2.263,4.032,.832-2.312-3.406,3.406,2.312-.832-4.032,2.263,3.439,.774-4.044,.774,4.044,2.263-3.439-.832,4.032,3.406-2.312-2.312,3.406,4.032-.832-3.439,2.263,4.044,.774-7.935,2.645Z"
        fill="#fcd116"
      ></path>
      <path fill="#0072c6" d="M2 15H30V20H2z"></path>
      <path fill="#fff" d="M5 19H27V28H5z"></path>
      <path
        d="M1,8V24c0,2.209,1.791,4,4,4h11L1.922,5.475c-.567,.69-.922,1.562-.922,2.525Z"
        fill="#ce1126"
      ></path>
      <path
        d="M16,28h11c2.209,0,4-1.791,4-4V8c0-.963-.354-1.835-.922-2.525l-14.078,22.525Z"
        fill="#ce1126"
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
