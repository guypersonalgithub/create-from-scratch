import { useState, useRef, useEffect, ReactNode, MutableRefObject } from "react";
import { AnimationContainerWrapperProps } from "./types";

type AnimationWrapperProps = Pick<
  AnimationContainerWrapperProps,
  "keyframes" | "unMountAnimation" | "options" | "clearAnimationOnExit" | "style"
> & {
  show: boolean;
  children: ReactNode;
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  animationActive?: MutableRefObject<boolean>;
};

const getElementStyles = (element: Element, stage: Keyframe) => {
  const styles: Keyframe = {};
  const computedStyle = getComputedStyle(element);
  for (let property in stage) {
    styles[property] = computedStyle.getPropertyValue(property);
  }

  return styles;
};

export const AnimationWrapper = ({
  show,
  children,
  keyframes = [],
  unMountAnimation,
  options = { duration: 300 },
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

  clearAnimationOnExit.current = () => {
    animationRef.current?.cancel();
    previousAnimationRefs.current.forEach((animationRef) => {
      animationRef.cancel();
    });
  };

  useEffect(() => {
    const childElement = elementRef.current;

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
      const styles = getElementStyles(childElement, keyframes[keyframes.length - 1]);
      const firstframe = keyframes[0];
      const animation = childElement.animate(
        [
          initialized.current
            ? { ...styles, offset: firstframe.offset ? firstframe.offset : undefined }
            : firstframe,
          ...keyframes.slice(1),
        ],
        {
          ...options,
          fill: "forwards",
        },
      );
      setAnimationRef({ animation });
      initialized.current = true;
    } else {
      if (!childElement) {
        return;
      }

      const styles = getElementStyles(childElement, keyframes[0]);
      const reversedKeyframes = keyframes
        .map((keyframe) => {
          return {
            ...keyframe,
            offset: keyframe.offset ? 1 - keyframe.offset : undefined,
          };
        })
        .reverse();
      const lastKeyframe = reversedKeyframes[0];

      const animation = childElement.animate(
        unMountAnimation || [
          { ...styles, offset: lastKeyframe.offset ? lastKeyframe.offset : undefined },
          ...reversedKeyframes.slice(1),
        ],
        {
          ...options,
          fill: "forwards",
        },
      );
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
