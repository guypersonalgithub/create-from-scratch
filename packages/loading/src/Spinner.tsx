import "./styles.css";

type SpinnerProps = {
  size?: number;
  borderSize?: number;
  backgroundColor?: string;
  spinColor?: string;
};

export const Spinner = ({
  size = 30,
  borderSize = 0.13333333333,
  backgroundColor = "white",
  spinColor = "lightblue",
}: SpinnerProps) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderSize * size}px solid ${backgroundColor}`,
        borderTop: `${borderSize * size}px solid ${spinColor}`,
        borderRadius: "50%",
      }}
      className="loader"
    />
  );
};
