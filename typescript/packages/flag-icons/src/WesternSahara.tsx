import { type SVGIconProps } from "./types";

export const WesternSahara = ({
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
      <rect x="1" y="11" width="30" height="10" fill="#fff" stroke-width="0"></rect>
      <path d="m5,4h22c2.2077,0,4,1.7923,4,4v4H1v-4c0-2.2077,1.7923-4,4-4Z" stroke-width="0"></path>
      <path
        d="m5,20h22c2.2077,0,4,1.7923,4,4v4H1v-4c0-2.2077,1.7923-4,4-4Z"
        transform="translate(32 48) rotate(180)"
        fill="#027b3b"
        stroke-width="0"
      ></path>
      <path
        d="m2.2711,26.9105l12.7289-10.9105L2.2711,5.0895c-.7781.7298-1.2711,1.7595-1.2711,2.9105v16c0,1.151.4929,2.1807,1.2711,2.9105Z"
        fill="#c50a14"
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
      <path
        d="m18.2109,16c0-1.8132,1.2996-3.322,3.0179-3.6482-.2257-.0428-.4583-.0662-.6964-.0662-2.0514,0-3.7143,1.663-3.7143,3.7143s1.663,3.7143,3.7143,3.7143c.2382,0,.4707-.0233.6964-.0662-1.7183-.3261-3.0179-1.8349-3.0179-3.6482Z"
        fill="#c50a14"
        stroke-width="0"
      ></path>
      <path
        d="m19.5354,18.2491l1.5838-1.1322,1.5714,1.1493-.5873-1.8562,1.5787-1.1394-1.9468-.015-.5958-1.8535-.6158,1.8469-1.9469-.0061,1.5662,1.1564-.6075,1.8497h0Z"
        fill="#c50a14"
        stroke-width="0"
      ></path>
    </svg>
  );
};
