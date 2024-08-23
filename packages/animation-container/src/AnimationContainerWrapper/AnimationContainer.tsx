import { useState, useRef, useEffect, ReactElement, MutableRefObject } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { continueReversedStoppedAnimation, detectStoppedFrame, reverseKeyframes } from "./utils";

type AnimationWrapperProps = Pick<
  AnimationContainerWrapperProps,
  "onMount" | "onUnmount" | "options" | "clearAnimationOnExit" | "style"
> & {
  index: number;
  show: boolean;
  children: ReactElement;
  options?: KeyframeAnimationOptions;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  animationActive?: MutableRefObject<boolean>;
};

export const AnimationWrapper = ({
  index,
  show,
  children,
  onMount = [],
  onUnmount,
  options = {},
  onAnimationStart,
  onAnimationEnd,
  clearAnimationOnExit,
  animationActive,
  style,
}: AnimationWrapperProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [removeState, setRemove] = useState(!show);
  const animationRef = useRef<Animation>();
  const previousAnimationRefs = useRef<Animation[]>([]);
  const initialized = useRef(false);
  const stoppedFrame = useRef<number>(0);

  clearAnimationOnExit.current[index] = () => {
    animationRef.current?.cancel();
    previousAnimationRefs.current.forEach((animationRef) => {
      animationRef.cancel();
    });
  };

  useEffect(() => {
    const childElement = elementRef.current;
    const shouldReverseOnUnmount = !onUnmount;

    const setAnimationRef = ({ animation }: { animation: Animation }) => {
      animationRef.current = animation;
      previousAnimationRefs.current.forEach((animation) => {
        animation.cancel();
      });
      previousAnimationRefs.current = [];
    };

    if (show) {
      setRemove(false);
      if (!childElement) {
        return;
      }

      onAnimationStart?.();

      if (animationActive) {
        animationActive.current = true;
      }

      const currentFrames = shouldReverseOnUnmount
        ? continueReversedStoppedAnimation({
            keyframes: onMount,
            initialized: initialized.current,
            childElement,
            stoppedFrame: stoppedFrame.current,
          })
        : onMount;

      const animation = childElement.animate(currentFrames, {
        duration: 300,
        ...options,
        fill: "forwards",
      });

      setAnimationRef({ animation });
      initialized.current = true;
    } else {
      if (!childElement) {
        return;
      }

      const currentFrames = shouldReverseOnUnmount
        ? continueReversedStoppedAnimation({
            keyframes: reverseKeyframes({ keyframes: onMount }),
            initialized: initialized.current,
            childElement,
            stoppedFrame: stoppedFrame.current,
          })
        : onUnmount;

      const animation = childElement.animate(currentFrames, {
        duration: 300,
        ...options,
        fill: "forwards",
      });

      setAnimationRef({ animation });
      animation.onfinish = () => {
        initialized.current = false;
        setRemove(true);
        onAnimationEnd?.();
        if (animationActive) {
          animationActive.current = false;
        }
      };
    }

    return () => {
      animationRef.current?.pause();
      if (animationRef.current) {
        previousAnimationRefs.current.push(animationRef.current);
      }

      if (animationRef.current && shouldReverseOnUnmount) {
        const currentFrames = show
          ? onMount
          : onUnmount || reverseKeyframes({ keyframes: onMount });
        const duration = Number(options.duration ?? 300);
        const currentFramesAmount = currentFrames.length;

        const lastFrame = detectStoppedFrame({
          animation: animationRef.current,
          duration,
          keyframesAmount: currentFramesAmount,
        });

        stoppedFrame.current = lastFrame === onMount.length - 1 ? 0 : lastFrame;
      }
    };
  }, [show, removeState]);

  return (
    !removeState && (
      <div ref={elementRef} style={style}>
        {children}
      </div>
    )
  );
};
