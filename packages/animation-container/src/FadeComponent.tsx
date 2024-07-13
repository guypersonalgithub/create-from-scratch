import React, { useEffect, useState } from "react";

interface FadeComponentProps {
  unique: string;
  isExiting?: boolean;
  triggerRemove?: () => void;
  delay?: number;
}

export const FadeComponent: React.FC<FadeComponentProps> = ({
  unique,
  isExiting,
  triggerRemove,
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(!!isExiting);

  useEffect(() => {
    if (isExiting) {
      setIsVisible(!isExiting);
    } else {
      setTimeout(() => {
        setIsVisible(!isExiting);
      }, delay);
    }
  }, [isExiting, delay]);

  useEffect(() => {
    if (isVisible || !triggerRemove) {
      return;
    }

    triggerRemove();
  }, [isVisible, triggerRemove]);

  return (
    <div className={isVisible ? "fade-enter fade-enter-active" : "fade-exit fade-exit-active"}>
      {unique}
    </div>
  );
};
