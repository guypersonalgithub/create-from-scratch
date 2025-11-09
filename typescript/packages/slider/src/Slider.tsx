import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { useRef, useState, useEffect, useCallback } from "react";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
};

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  className,
}: SliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const rect = track.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = clamp(relativeX / rect.width);
      const rawValue = min + ratio * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const finalValue = clamp(steppedValue);

      if (finalValue !== internalValue) {
        setInternalValue(finalValue);
        onChange?.(finalValue);
      }
    },
    [min, max, step, internalValue, onChange],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.touches[0].clientX);
  };

  const stopDragging = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) updateValueFromPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) updateValueFromPosition(e.touches[0].clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newValue = internalValue;

    if (e.key === "ArrowLeft") {
      newValue = clamp(internalValue - step);
    }
    if (e.key === "ArrowRight") {
      newValue = clamp(internalValue + step);
    }

    if (newValue !== internalValue) {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [handleMouseMove, handleTouchMove]);

  const percentage = getPercentage(internalValue);

  return (
    <div
      ref={trackRef}
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          height: 6px;
          background: #ccc;
          border-radius: 3px;
          cursor: pointer;
          user-select: none;
          margin-top: 10px;
          margin-left: 10px;
          margin-right: 10px;
        `,
        className,
      )}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={internalValue}
    >
      <div
        className={dynatic`
          position: absolute;
          height: 100%;
          background: #007bff;
          border-radius: 3px;
        `}
        style={{
          width: `${percentage}%`,
        }}
      />
      <div
        className={dynatic`
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #fff;
          border: 2px solid #007bff;
          border-radius: 50%;
          cursor: grab;
        `}
      />
    </div>
  );
};
