import React, {
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  cloneElement,
  useMemo,
  useRef,
} from "react";
import "./styles.css";

type AnimationContainerProps = {
  children: ReactNode[];
  delay?: number;
};

interface ChildProps {
  animatePresenceKey: number;
  isExiting: boolean;
  triggerRemove: () => void;
  delay: number;
}

export const AnimationContainer2 = ({ children, delay = 300 }: AnimationContainerProps) => {
  const [presentChildren, setPresentChildren] = useState<ReactElement[]>([]);
  const [exitingChildren, setExitingChildren] = useState<Set<string | number | null>>(new Set());
  const presentChildrenRef = useRef<ReturnType<typeof setTimeout>>();

  const newChildren = useMemo(() => {
    return children
      .filter((child) => React.isValidElement(child))
      .map((child, index) => {
        if (React.isValidElement(child)) {
          return cloneElement(child, {
            key: index,
          });
        }
        return child;
      });
  }, [children]);

  useEffect(() => {
    const prevKeys = presentChildren.map((child) => child.key);
    const currentKeys = newChildren.map((child) => child.key);
    const removedChildren = prevKeys.filter((key) => !currentKeys.includes(key));
    setExitingChildren(new Set(removedChildren));
  }, [newChildren]);

  useEffect(() => {
    presentChildrenRef.current = setTimeout(() => {
      setPresentChildren(newChildren);
    }, delay);

    return () => {
      if (!presentChildrenRef.current) {
        return;
      }

      clearTimeout(presentChildrenRef.current);
    };
  }, [newChildren, delay]);

  const handleExit = (key: string | number | null) => {
    setTimeout(() => {
      setExitingChildren((prev) => {
        const duplicated = new Set([...prev]);
        duplicated.delete(key);
        return duplicated;
      });
    }, delay);
  };

  return (
    <div className="animate-presence">
      {presentChildren.map((child) => {
        return cloneElement(child as ReactElement<ChildProps>, {
          isExiting: exitingChildren.has(child.key),
          triggerRemove: () => handleExit(child.key),
          delay,
        });
      })}
    </div>
  );
};
