import "./LiquidButton.style.css";

export const LiquidButton = () => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="liquid">
          <feTurbulence
            id="turb"
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
        style={{
          padding: "16px 32px",
          fontSize: "18px",
          color: "white",
          background: "linear-gradient(135deg, #6a0dad, #d63384)",
          border: "none",
          borderRadius: "12px",
          filter: "url(#liquid)",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
      >
        Liquid Button
      </button>
    </div>
  );
};
