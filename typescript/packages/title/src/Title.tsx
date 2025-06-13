import { type CSSProperties, type ReactNode } from "react";
import { type TitleWrapper } from "./types";

export type TitleProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerStyle?: CSSProperties;
  contentContainerStyle?: CSSProperties;
  titleWrapper?: TitleWrapper;
  titleWrapperStyle?: CSSProperties;
  children: ReactNode;
} & TitleHighlight;

type TitleHighlight =
  | {
      titleHighlight: "left" | "right" | "both";
      titleLeftHighlightStyle?: CSSProperties;
      titleRightHighlightStyle?: CSSProperties;
    }
  | {
      titleHighlight?: never;
      titleLeftHighlightStyle?: never;
      titleRightHighlightStyle?: never;
    };

export const Title = ({
  prefix = null,
  children,
  suffix = null,
  titleWrapper,
  titleWrapperStyle = {},
  contentContainerStyle,
  titleHighlight,
  titleLeftHighlightStyle,
  titleRightHighlightStyle,
  containerStyle,
}: TitleProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", ...titleWrapperStyle }}>
      {titleHighlight === "left" || titleHighlight === "both" ? (
        <TitleHighlight style={titleLeftHighlightStyle} />
      ) : null}
      <div style={containerStyle}>
        {prefix}
        <TitleContainer titleWrapper={titleWrapper} titleWrapperStyle={contentContainerStyle}>
          {children}
        </TitleContainer>
        {suffix}
      </div>
      {titleHighlight === "right" || titleHighlight === "both" ? (
        <TitleHighlight style={titleRightHighlightStyle} />
      ) : null}
    </div>
  );
};

type TitleContainerProps = {
  titleWrapper?: TitleWrapper;
  titleWrapperStyle?: CSSProperties;
  children: ReactNode;
};

const TitleContainer = ({
  titleWrapper: Wrapper,
  titleWrapperStyle,
  children,
}: TitleContainerProps) => {
  if (Wrapper) {
    return <Wrapper style={titleWrapperStyle}>{children}</Wrapper>;
  }

  return <div style={titleWrapperStyle}>{children}</div>;
};

type TitleHighlightProps = {
  style?: CSSProperties;
};

const TitleHighlight = ({ style = {} }: TitleHighlightProps) => {
  return <div style={{ height: "1px", width: "100%", backgroundColor: "black", ...style }} />;
};
