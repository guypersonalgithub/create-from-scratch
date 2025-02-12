import { useState } from "react";
import "./styles.css";

type ToggleProps = {
  // label?: string;
  // defaultChecked?: boolean;
  // disabled?: boolean;
  // id?: string;
  defaultTheme?: string;
  size?: string;
  onChange: (value: any) => void;
};

export const Toggle = ({ defaultTheme = "light", onChange, size = "default" }: ToggleProps) => {
  const [isDark, setIsDark] = useState(defaultTheme === "dark");

  const handleToggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    onChange(newValue ? "dark" : "light");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={handleToggle}
      className={`theme-toggle ${size} ${isDark ? "dark" : "light"}`}
    >
      <span className="sr-only">Toggle dark mode</span>

      {/* Sliding background */}
      <span className="toggle-background" />

      {/* Sliding circle with icons */}
      <span className="toggle-circle">
        {/* Sun Icon */}
        <svg
          className="icon sun-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon */}
        <svg
          className="icon moon-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
};
