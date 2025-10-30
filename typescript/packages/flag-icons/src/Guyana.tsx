import { type SVGIconProps } from "./types";

export const Guyana = ({ size, width = size, height = size, className, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#4a926d"></rect>
      <path
        d="M1,8V24c0,1.372,.692,2.581,1.745,3.302l28.255-11.302L2.745,4.698c-1.053,.72-1.745,1.93-1.745,3.302Z"
        fill="#fff"
      ></path>
      <path
        d="M2.917,26.156c-.581-.562-.917-1.337-.917-2.156V8c0-.819,.336-1.595,.917-2.156l25.391,10.156L2.917,26.156Z"
        fill="#f6c644"
      ></path>
      <path d="M2.271,26.911l12.729-10.911L2.271,5.089c-.778,.73-1.271,1.76-1.271,2.911V24c0,1.151,.493,2.181,1.271,2.911Z"></path>
      <path
        d="M1.627,5.867c-.392,.618-.627,1.347-.627,2.133V24c0,.79,.237,1.522,.632,2.143l11.832-10.143L1.627,5.867Z"
        fill="#b02d30"
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
