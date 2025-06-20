import { type SVGIconProps } from "./types";

export const Philippines = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path d="M1,24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V15H1v9Z" fill="#be2a2c"></path>
      <path d="M27,4H5c-2.209,0-4,1.791-4,4v8H31V8c0-2.209-1.791-4-4-4Z" fill="#1334a3"></path>
      <path
        d="M2.316,26.947l13.684-10.947L2.316,5.053c-.803,.732-1.316,1.776-1.316,2.947V24c0,1.172,.513,2.216,1.316,2.947Z"
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
        d="M10.569,15.303l-1.561,.31c-.051-.26-.154-.502-.296-.715l1.323-.884-.011-.975-.975-.011-.884,1.323c-.213-.143-.455-.245-.715-.296l.31-1.561-.697-.681-.697,.681,.31,1.561c-.26,.051-.502,.154-.715,.296l-.884-1.323-.975,.011-.011,.975,1.323,.884c-.143,.213-.245,.455-.296,.715l-1.561-.31-.681,.697,.681,.697,1.561-.31c.051,.26,.154,.502,.296,.715l-1.323,.884,.011,.975,.975,.011,.884-1.323c.213,.143,.455,.245,.715,.296l-.31,1.561,.697,.681,.697-.681-.31-1.561c.26-.051,.502-.154,.715-.296l.884,1.323,.975-.011,.011-.975-1.323-.884c.143-.213,.245-.455,.296-.715l1.561,.31,.681-.697-.681-.697Z"
        fill="#f4d24b"
      ></path>
    </svg>
  );
};
