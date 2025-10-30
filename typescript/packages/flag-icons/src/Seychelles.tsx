import { type SVGIconProps } from "./types";

export const Seychelles = ({
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
      <path
        d="M2.668,27.238c.658,.475,1.459,.762,2.332,.762H27c2.209,0,4-1.791,4-4v-4.857L2.668,27.238Z"
        fill="#357939"
      ></path>
      <path
        d="M12,4H5c-2.209,0-4,1.791-4,4V24c0,.874,.288,1.676,.764,2.334L12,4Z"
        fill="#0e2a69"
      ></path>
      <path
        d="M2.125,26.772L23,4H12L1.764,26.334c.111,.154,.23,.302,.362,.438Z"
        fill="#f7d45d"
      ></path>
      <path
        d="M2.541,27.133L31,11.125v-3.125c0-2.209-1.791-4-4-4h-4L2.125,26.772c.128,.132,.271,.247,.416,.361Z"
        fill="#c23635"
      ></path>
      <path
        d="M3.069,27.483l27.931-6.983V11.125L2.541,27.133c.166,.131,.342,.246,.528,.35Z"
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
    </svg>
  );
};
