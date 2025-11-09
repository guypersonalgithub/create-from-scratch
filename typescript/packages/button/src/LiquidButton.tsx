import { dynatic } from "@packages/dynatic-css";
import "./LiquidButton.style.css";

export const LiquidButton = () => {
  return (
    <div
      className={dynatic`
        position: relative;
        display: inline-block;
      `}
    >
      <svg
        className={dynatic`
          position: absolute;
          width: 0;
          height: 0;
        `}
      >
        <filter id="liquid">
          <feTurbulence
            className={dynatic`
              animation: noiseAnim 1s infinite linear;
            `}
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="2s"
              values="0.02;0.05;0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <button
        className={dynatic`
          padding: 16px 32px;
          font-size: 18px;
          color: white;
          background: linear-gradient(135deg, #6a0dad, #d63384);
          border: none;
          border-radius: 12px;
          filter: url(#liquid);
          cursor: pointer;
          transition: transform 0.2s;

          &:hover {
           transform: scale(1.05);
          }
        `}
      >
        Liquid Button
      </button>
    </div>
  );
};
