import { AnimationContainerWrapper } from "@packages/animation-container";

type DigitProps = {
  num: number;
  duration?: number;
};

export const Digit = ({ num, duration }: DigitProps) => {
  return (
    <div>
      <AnimationContainerWrapper
        style={{ overflow: "hidden", width: "1ch", textAlign: "center" }}
        changeMethod="gradual"
        onMount={[{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }]}
        onUnmount={[{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }]}
        mountOptions={{ duration }}
      >
        <div key={num}>{num}</div>
      </AnimationContainerWrapper>
    </div>
  );
};
