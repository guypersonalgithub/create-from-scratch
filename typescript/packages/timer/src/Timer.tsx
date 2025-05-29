import { useEffect, useState } from "react";

type TimerProps = {
  className?: string;
  milliseconds: number;
};

export const Timer = ({ className, milliseconds }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => (isNaN(milliseconds) ? 0 : milliseconds));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = Math.max(prev - 1000, 0);
        if (newValue <= 0) {
          clearInterval(interval);
        }

        return newValue;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (ms: number): string => {
    if (ms <= 0) {
      return "00:00:00";
    }

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (timeLeft <= 0) {
    return <div className={className}>00:00:00</div>;
  }

  return <div className={className}>{formatTime(timeLeft)}</div>;
};
