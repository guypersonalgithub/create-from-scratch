import { type SVGIconProps } from "./types";

export const Container = ({ size, width = size, height = size, style }: SVGIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      id="Artwork"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width={width}
      height={height}
      style={style}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M19.73,6.56a1.73,1.73,0,0,0-1.68,1.68,1.83,1.83,0,0,0,.89,1.48v6.9l-5.16,3.06.8,1.28,5.55-3.25a.84.84,0,0,0,.4-.69V9.72a1.64,1.64,0,0,0,.89-1.48A1.61,1.61,0,0,0,19.73,6.56Z"
          //   style="fill:#aecbfa"
        ></path>
        <path
          id="Path-2"
          data-name="Path"
          d="M18,5.48,12.39,2.32a1.18,1.18,0,0,0-.79,0L5.25,6A1.72,1.72,0,0,0,2.57,7.35,1.73,1.73,0,0,0,4.26,9,1.73,1.73,0,0,0,5.94,7.35L12,3.9l5.15,3Z"
          //   style="fill:#aecbfa"
        ></path>
        <path
          id="Path-3"
          data-name="Path"
          d="M11.2,18.5a1.57,1.57,0,0,0-.89.29l-5.16-3V9.92H3.56v6.31a.84.84,0,0,0,.4.69L9.52,20v.09a1.69,1.69,0,0,0,3.37,0A1.65,1.65,0,0,0,11.2,18.5Z"
          //   style="fill:#aecbfa"
        ></path>
        <polygon
          id="Path-4"
          data-name="Path"
          points="16.96 8.63 12.1 5.78 7.13 8.63 12.1 11.4 16.96 8.63"
          //   style="fill:#669df6"
        ></polygon>
        <polygon
          points="12.1 12.38 6.84 9.32 6.84 11.79 12.1 14.75 12.1 12.38"
          //   style="fill:#669df6"
        ></polygon>
        <polygon
          points="12.1 15.73 6.84 12.68 6.84 14.75 12.1 17.81 12.1 15.73"
          //   style="fill:#669df6"
        ></polygon>
        <path
          d="M12.09,12.38v2.37l5.26-3.06V9.33Zm4.32-.94a.38.38,0,1,1,0-.76.38.38,0,0,1,0,.76Z"
          //   style="fill:#4285f4"
        ></path>
        <path
          d="M12.09,15.73V17.8l5.26-3.05V12.68Zm4.32-1.07a.38.38,0,1,1,0-.76.38.38,0,0,1,0,.76Z"
          //   style="fill:#4285f4"
        ></path>
      </g>
    </svg>
  );
};
