import { useState } from "react";
import { Input } from "@packages/input";
import { Button } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";
import { Eye, EyeClosed } from "@packages/icons";

type PasswordInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  const getStrengthColor = () => {
    if (value.length > 8) {
      return "#0f0";
    }

    if (value.length > 4) {
      return "#ff0";
    }

    if (value.length > 0) {
      return "#f00";
    }

    return "#555";
  };

  return (
    <div>
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={dynatic`
            padding: 8px 36px 8px 8px;
        `}
        customSuffix={
          <Button
            className={dynatic`
                width: 20px;
                height: 20px;
                background: none;
                border: none;
            `}
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <EyeClosed size={16} /> : <Eye size={16} />}
          </Button>
        }
      />
      <div
        className={dynatic`
            height: 4px;
            margin-top: 2px;
            background: #222;
        `}
      >
        <div
          className={dynatic`
            border-radius: 2px;
            transition: width 0.2s;
            height: 100%;
          `}
          style={{
            width: `${Math.min(value.length * 10, 100)}%`,
            background: getStrengthColor(),
          }}
        />
      </div>
    </div>
  );
};
