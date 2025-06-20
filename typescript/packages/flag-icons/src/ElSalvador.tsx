import { type SVGIconProps } from "./types";

export const ElSalvador = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      style={style}
    >
      <path fill="#fff" d="M1 11H31V21H1z"></path>
      <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#1c44a6"></path>
      <path
        d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 24)"
        fill="#1c44a6"
      ></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path
        d="M15.429,15.299l-1.162-1.307s-.184,2.401,.174,2.982l.988-1.675Z"
        fill="#1c44a6"
      ></path>
      <path d="M15.129,16.228l-1.53-.997s-.126,1.801,.542,2.072l.988-1.075Z" fill="#1c44a6"></path>
      <path d="M16.571,15.299l1.162-1.307s.184,2.401-.174,2.982l-.988-1.675Z" fill="#1c44a6"></path>
      <path d="M16.871,16.228l1.53-.997s.126,1.801-.542,2.072l-.988-1.075Z" fill="#1c44a6"></path>
      <path
        d="M16,19.541c-1.953,0-3.541-1.588-3.541-3.541s1.588-3.541,3.541-3.541,3.541,1.588,3.541,3.541-1.588,3.541-3.541,3.541Zm0-6.563c-1.667,0-3.022,1.356-3.022,3.022s1.356,3.022,3.022,3.022,3.022-1.356,3.022-3.022-1.356-3.022-3.022-3.022Z"
        fill="#f7cf46"
      ></path>
      <path fill="#fff" d="M16 13.806L13.911 17.424 18.089 17.424 16 13.806z"></path>
      <path
        d="M18.538,17.684h-5.075l2.538-4.395,2.538,4.395Zm-4.178-.519h3.28l-1.64-2.84-1.64,2.84Z"
        fill="#f7cf46"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
