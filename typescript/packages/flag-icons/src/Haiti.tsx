import { type SVGIconProps } from "./types";

export const Haiti = ({ size, width = size, height = size, className, style }: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <path d="M1,24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V15H1v9Z" fill="#c22b38"></path>
      <path d="M27,4H5c-2.209,0-4,1.791-4,4v8H31V8c0-2.209-1.791-4-4-4Z" fill="#061a9a"></path>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      ></path>
      <path fill="#fff" d="M12 13H20V19H12z"></path>
      <ellipse cx="16.064" cy="14.21" rx="1.187" ry=".678" fill="#2d6920"></ellipse>
      <path
        fill="#e8b942"
        d="M15.979 14.069L16.148 14.069 16.233 17.378 15.894 17.378 15.979 14.069z"
      ></path>
      <path
        d="M16.064,16.881l-1.371-1.639s-.17,.48-.155,.692l-.367-.367s-.071,.608,0,.848l-.297-.254s.014,1.13,.311,1.639l1.879-.421v-.497Z"
        fill="#112e88"
      ></path>
      <path
        d="M16.064,16.881l1.371-1.639s.17,.48,.155,.692l.367-.367s.071,.608,0,.848l.297-.254s-.014,1.13-.311,1.639l-1.879-.421v-.497Z"
        fill="#112e88"
      ></path>
      <path
        d="M12,18.562c.505-.042,2.314-1.385,4.073-1.385s3.389,1.385,3.927,1.385v.438h-8v-.438Z"
        fill="#2d6920"
      ></path>
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      ></path>
    </svg>
  );
};
