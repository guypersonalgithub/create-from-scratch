import { type CSSProperties, type ReactNode, type TextareaHTMLAttributes } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  labelElement?: ReactNode;
  label?: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
};

export const Textarea: React.FC<TextareaProps> = ({
  containerClassName,
  containerStyle,
  labelElement,
  label,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={combineStringsWithSpaces(dynatic`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `)}
      style={containerStyle}
    >
      {labelElement ??
        (label ? (
          <label
            htmlFor={props.id}
            className={dynatic`
                font-size: 0.875rem;
                font-weight: 500;
                color: #333;
            `}
          >
            {label}
          </label>
        ) : null)}
      <textarea
        {...props}
        className={combineStringsWithSpaces(
          dynatic`
            padding: 0.75rem 1rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-family: inherit;
            resize: none;
            min-height: 120px;
            outline: none;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: border 0.2s, box-shadow 0.2s;

            &:focus {
              border: 1px solid #FFD54F;
            }
          `,
          className,
        )}
        style={style}
      />
    </div>
  );
};
