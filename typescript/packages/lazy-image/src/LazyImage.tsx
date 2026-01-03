import { useEffect, useRef, useState } from "react";
import { observeElementVisibility } from "@packages/element-utils";

type LazyImageProps = {
  src: string;
  alt?: string;
  onLoadCallback?: () => void;
};

export const LazyImage = ({ src, alt, onLoadCallback }: LazyImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = imgRef.current;
    if (!element) {
      return;
    }

    const observer = observeElementVisibility({
      element,
      observerCallback: ({ isIntersection }) => setIsVisible(isIntersection),
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <img ref={imgRef} src={isVisible ? src : ""} alt={alt} onLoad={onLoadCallback} />;
};
