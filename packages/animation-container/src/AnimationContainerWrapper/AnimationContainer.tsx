import { useState, useRef, useEffect, ReactNode, MutableRefObject } from "react";

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
  from = {},
  to = {},
  unMountAnimation,
  options = { duration: 300 },
  onAnimationStart,
  onAnimationEnd,
  animationRef,
  previousAnimationRefs
}: {
  show: boolean;
  children: ReactNode[] | ReactNode;
  from: Keyframe;
  to: Keyframe;
  unMountAnimation?: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: KeyframeAnimationOptions;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  animationRef: MutableRefObject<Animation | undefined>;
  previousAnimationRefs: MutableRefObject<Animation[]>;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [removeState, setRemove] = useState(!show);
  // const animationRef = useRef<Animation>();
  // const previousAnimationRefs = useRef<Animation[]>([]);
  const initialized = useRef(false);

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

      const styles = getElementStyles(childElement, to);

      const animation = childElement.animate([initialized.current ? styles : from, to], {
        ...options,
        fill: "forwards",
      });
      setAnimationRef({ animation });
      initialized.current = true;
    } else {
      if (!childElement) {
        return;
      }

      const styles = getElementStyles(childElement, from);
      const animation = childElement.animate(unMountAnimation || [styles, from], {
        ...options,
        fill: "forwards",
      });
      setAnimationRef({ animation });
      animation.onfinish = () => {
        initialized.current = false;
        setRemove(true);
        onAnimationEnd?.();
      };
    }

    return () => {
      animationRef.current?.pause();
      if (animationRef.current) {
        previousAnimationRefs.current.push(animationRef.current);
      }
    };
  }, [show, removeState]);

  return !removeState && <div ref={elementRef}>{children}</div>;
};
