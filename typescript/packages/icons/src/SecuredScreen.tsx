import { SVGIconProps } from "./types";

export const SecuredScreen = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={style}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g id="PC_protection">
          <path d="M80.9175,377.0562H202V439.16H139a9.8965,9.8965,0,1,0,0,19.7929H373a9.8965,9.8965,0,1,0,0-19.7929H310V377.0562H431.0869a49.9008,49.9008,0,0,0,49.5527-44.13H31.36A49.9083,49.9083,0,0,0,80.9175,377.0562Z"></path>
          <path d="M431.0869,53.0474H80.9175A49.9179,49.9179,0,0,0,31,102.9626V313.1333H481V102.9626A49.9141,49.9141,0,0,0,431.0869,53.0474ZM337,188.58a83.0122,83.0122,0,0,1-43.1807,72.8306L256,282.09l-37.8149-20.68A83.0075,83.0075,0,0,1,175,188.58V127.9269L256,102.09l81,25.8366Z"></path>
          <path d="M221.1162,188.8131a9.894,9.894,0,1,0-13.9922,13.9922L232.5684,228.25a9.8984,9.8984,0,0,0,14.0009,0l58.3155-58.3242a9.9,9.9,0,1,0-14.01-13.9922l-51.31,51.3194Z"></path>
        </g>
      </g>
    </svg>
  );
};
