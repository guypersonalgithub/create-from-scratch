import { type CSSProperties } from "react";
import { nameToColor } from "./utils";

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
  className = "",
  style = {},
  src,
}: AvatarProps) => {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bgColor || nameToColor({ name }),
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: size / 2.5,
        overflow: "hidden",
        ...style,
      }}
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
        src={src}
        alt={name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
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
