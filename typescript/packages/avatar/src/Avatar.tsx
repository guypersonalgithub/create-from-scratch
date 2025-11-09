import { type CSSProperties } from "react";
import { nameToColor } from "./utils";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type AvatarProps = {
  name: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
  src?: string;
};

export const Avatar = ({
  name,
  size = 40,
  bgColor = "#b3e5fc",
  textColor = "#0d47a1",
  className,
  style = {},
  src,
}: AvatarProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: ${size};
          height: ${size};
          border-radius: 50%;
          background-color: ${bgColor || nameToColor({ name })};
          color: ${textColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${size / 2.5};
          overflow: hidden;
        `,
        className,
      )}
      style={style}
    >
      <AvatarContent name={name} src={src} />
    </div>
  );
};

type AvatarContentProps = Pick<AvatarProps, "name" | "src">;

const AvatarContent = ({ name, src }: AvatarContentProps) => {
  if (src) {
    return (
      <img
        className={dynatic`
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        `}
        src={src}
        alt={name}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials;
};
