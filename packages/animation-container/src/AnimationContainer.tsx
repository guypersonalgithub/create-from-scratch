import { useState, useRef, useEffect, ReactNode } from "react";

const getElementStyles = (element: Element, stage: Keyframe) => {
  const styles: Keyframe = {};
  const computedStyle = getComputedStyle(element);
  for (let property in stage) {
    styles[property] = computedStyle.getPropertyValue(property);
  }

  return styles;
};

export const AnimationContainer = () => {
  const [show, setShow] = useState(true);

  return (
    <div style={{ display: "grid" }}>
      <button onClick={() => setShow((state) => !state)}>Click me</button>
      <AnimationWrapper show={show}>
        <ChildComponent />
      </AnimationWrapper>
    </div>
  );
};

const ChildComponent = () => {
  return <div style={{ border: "1px solid red", height: "inherit" }}>1</div>;
};

const AnimationWrapper = ({
  show,
  children,
  from = { height: "0px" },
  to = { height: "100px" },
  unMountAnimation,
  options = { duration: 300 },
}: {
  show: boolean;
  children: ReactNode[] | ReactNode;
  from?: Keyframe;
  to?: Keyframe;
  unMountAnimation?: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: KeyframeAnimationOptions;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [removeState, setRemove] = useState(!show);
  const animationRef = useRef<Animation>();
  const initialized = useRef(false);

  useEffect(() => {
    const childElement = elementRef.current;

    if (show) {
      setRemove(false);
      if (!childElement) {
        return;
      }

      const styles = getElementStyles(childElement, to);

      const animation = childElement.animate([initialized.current ? styles : from, to], {
        ...options,
        fill: "forwards",
      });
      animationRef.current = animation;
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
      animationRef.current = animation;
      animation.onfinish = () => {
        initialized.current = false;
        setRemove(true);
      };
    }

    return () => {
      animationRef.current?.pause();
    };
  }, [show, removeState]);

  if (!Array.isArray(children)) {
    return <div>{!removeState && <div ref={elementRef}>{children}</div>}</div>;
  }

  return !removeState && <div ref={elementRef}>{children}</div>;
};
