import { useState, useRef, useEffect, ReactNode, isValidElement } from "react";

const getElementStyles = (element: Element, stage: Keyframe) => {
  const styles: Keyframe = {};
  const computedStyle = getComputedStyle(element);
  for (let property in stage) {
    styles[property] = computedStyle.getPropertyValue(property);
  }

  return styles;
};

// TODO: Remove AnimationContainer and ChildComponent as they are no longer needed.

export const AnimationContainer = () => {
  const [show, setShow] = useState(true);

  return (
    <div style={{ display: "grid" }}>
      <button onClick={() => setShow((state) => !state)}>Click me</button>
      <AnimationWrapper show={show} from={{ height: "0px" }} to={{ height: "100px" }}>
        <ChildComponent />
      </AnimationWrapper>
    </div>
  );
};

const ChildComponent = () => {
  return <div style={{ border: "1px solid red", height: "inherit" }}>1</div>;
};

type AnimationContainerWrapperProps = {
  from: Keyframe;
  to: Keyframe;
  unMountAnimation?: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: KeyframeAnimationOptions;
  children: ReactNode[] | ReactNode;
};

export const AnimationContainerWrapper = ({
  children,
  from,
  to,
  options,
}: AnimationContainerWrapperProps) => {
  const childrenContent = useRef<ReactNode[]>(Array.isArray(children) ? children : [children]);

  useEffect(() => {
    if (!Array.isArray(children)) {
      if (isValidElement(children)) {
        childrenContent.current = [children];
      }

      return;
    }

    childrenContent.current = children.map((child) => {
      return isValidElement(child) ? child : null;
    });
  }, [children]);

  if (!Array.isArray(children)) {
    const isValid = isValidElement(children);
    return (
      <AnimationWrapper show={isValid} from={from} to={to} options={options}>
        <div key={0} style={{ height: "inherit", width: "inherit" }}>
          {isValid ? children : childrenContent.current[0]}
        </div>
      </AnimationWrapper>
    );
  }

  return children.map((child, index) => {
    const currentChild = childrenContent.current;
    const isValid = isValidElement(child);

    return (
      <AnimationWrapper show={isValid} from={{ height: "0px" }} to={{ height: "100px" }}>
        <div key={index} style={{ height: "inherit", width: "inherit" }}>
          {isValid ? child : currentChild}
        </div>
      </AnimationWrapper>
    );
  });
};

const AnimationWrapper = ({
  show,
  children,
  from = {},
  to = {},
  unMountAnimation,
  options = { duration: 300 },
}: {
  show: boolean;
  children: ReactNode[] | ReactNode;
  from: Keyframe;
  to: Keyframe;
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
  }, [show, removeState, from, to, options, unMountAnimation]);

  return !removeState && <div ref={elementRef}>{children}</div>;
};
