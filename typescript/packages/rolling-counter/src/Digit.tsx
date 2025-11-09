import { AnimationContainerWrapper } from "@packages/animation-container";
import { dynatic } from "@packages/dynatic-css";

type DigitProps = {
  num: number;
  duration?: number;
};

export const Digit = ({ num, duration }: DigitProps) => {
  return (
    <div>
      <AnimationContainerWrapper
        className={dynatic`
          overflow: hidden;
          width: 1ch;
          text-align: center;
        `}
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
