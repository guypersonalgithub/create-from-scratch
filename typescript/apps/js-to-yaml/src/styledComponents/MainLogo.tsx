import { type CSSProperties } from "react";

type MainLogoProps = {
  style?: CSSProperties;
  size?: number;
  width?: number;
  height?: number;
};

export const MainLogo = ({ size, width = size, height = size, style }: MainLogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="230 200 690 550"
      width={width}
      height={height}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background piece 1 */}
      {/* <g
                transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                fill="#CCCCCC"
                stroke="none"
              >
                <path d="M0 5120 l0 -5120 5120 0 5120 0 0 5120 0 5120 -5120 0 -5120 0 0 -5120z" />
              </g> */}

      {/* Piece 1 of the empty region */}
      <g
        transform="translate(50.000000,500.000000) scale(0.100000,-0.100000)"
        fill="none"
        stroke="none"
      >
        <path
          d="M3160 2430 l0 -200 -72 0 c-183 -1 -318 -62 -384 -176 -58 -99 -57 -87 -64 -759 l-6 -620 -31 -95 c-68 -201 -210 -376 -413 -509 l-87 -58 90 -59 c50 -32 132 -99 182 -149 139 -136 205 -245 245 -400 19 -73 20 -111 20 -619 0 -298 4 -577 9 -621 20 -167 78 -258 207 -322 71 -35 82 -37 190 -41 l114 -5 0 -191 0 -191 -182 6 c-163 5 -191 8 -256 32 -226 80 -389 260 -458 507 -16 59 -18 130 -23 730 l-6 665 -28 80 c-68 194 -203 315 -404 362 l-73 17 0 221 0 221 62 12 c34 6 100 30 146 52 133 64 220 163 275 315 21 59 22 75 28 720 6 736 3 707 79 860 68 138 185 258 320 329 115 61 221 81 428 85 l92 1 0 -200z"
          fill="#5BC0BD" // Example color
        />
      </g>

      {/* Piece 2 of the empty region */}
      <g
        transform="translate(400.000000,250.000000) scale(0.100000,-0.100000)"
        fill="none"
        stroke="none"
      >
        <path
          d="M4406 -500 c384 -385 705 -713 713 -727 41 -80 41 -47 41 -1901 0 -1965 6 -1804 -67 -1859 l-36 -28 -1661 0 c-1558 0 -1663 1 -1693 17 -17 10 -42 32 -55 50 l-23 33 -3 510 -3 509 134 136 c164 165 1181 1232 1220 1278 32 40 37 103 10 142 -15 22 -481 510 -1155 1210 l-207 215 -1 492 c0 325 4 501 11 520 14 37 47 73 84 89 24 11 216 13 1011 14 l981 0 699 -700z"
          fill="#F8CA43" // Example color
        />
      </g>

      {/* Piece 3 of the empty region */}
      <g
        transform="translate(250.000000,300.000000) scale(0.100000,-0.100000)"
        fill="none"
        stroke="none"
      >
        <path
          d="M2899 -801 c20 -7 174 -158 440 -432 578 -596 643 -664 643 -676 0 -5 -170 -186 -377 -403 -730 -762 -694 -728 -776 -728 -49 0 -109 31 -138 72 -32 44 -38 132 -13 180 16 30 215 245 588 636 l69 72 -879 0 -880 0 -44 22 c-73 37 -111 114 -96 193 7 37 53 97 90 118 16 9 240 13 912 17 l891 5 -224 230 c-297 304 -421 439 -433 471 -6 14 -10 47 -10 73 0 116 119 192 237 150z"
          fill="currentColor" // Example color
        />
      </g>

      <rect x="650" y="400" width="250" height="10" fill="white" rx="5" />
      <rect x="710" y="480" width="190" height="10" fill="white" rx="5" />
      <rect x="650" y="560" width="250" height="10" fill="white" rx="5" />
      <rect x="680" y="640" width="220" height="10" fill="white" rx="5" />

      <polygon points="336,0 480,144 336,144" fill="#d8aa22" transform="translate(433.2, 230)" />
    </svg>
  );
};
