import { ReactNode, useEffect, useState, useRef } from "react";

type LazyLoadIntersectionProps = {
  children: ReactNode;
};

export const LazyLoadIntersection = ({ children }: LazyLoadIntersectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{visible ? children : null}</div>;
};
