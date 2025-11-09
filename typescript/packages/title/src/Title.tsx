import { type CSSProperties, type ReactNode } from "react";
import { type TitleWrapper } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export type TitleProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  contentContainerClassName?: string;
  contentContainerStyle?: CSSProperties;
  titleWrapper?: TitleWrapper;
  titleWrapperClassName?: string;
  titleWrapperStyle?: CSSProperties;
  children: ReactNode;
} & TitleHighlight;

type TitleHighlight =
  | {
      titleHighlight: "left" | "right" | "both";
      titleLeftHighlightClassName?: string;
      titleLeftHighlightStyle?: CSSProperties;
      titleRightHighlightClassName?: string;
      titleRightHighlightStyle?: CSSProperties;
    }
  | {
      titleHighlight?: never;
      titleLeftHighlightClassName?: never;
      titleLeftHighlightStyle?: never;
      titleRightHighlightClassName?: never;
      titleRightHighlightStyle?: never;
    };

export const Title = ({
  prefix = null,
  children,
  suffix = null,
  titleWrapper,
  titleWrapperClassName,
  titleWrapperStyle,
  contentContainerClassName,
  contentContainerStyle,
  titleHighlight,
  titleLeftHighlightClassName,
  titleLeftHighlightStyle,
  titleRightHighlightClassName,
  titleRightHighlightStyle,
  containerClassName,
  containerStyle,
}: TitleProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          align-items: center;
          gap: 20px;
        `,
        titleWrapperClassName,
      )}
      style={titleWrapperStyle}
    >
      {titleHighlight === "left" || titleHighlight === "both" ? (
        <TitleHighlight className={titleLeftHighlightClassName} style={titleLeftHighlightStyle} />
      ) : null}
      <div className={containerClassName} style={containerStyle}>
        {prefix}
        <TitleContainer
          titleWrapper={titleWrapper}
          titleWrapperClassName={contentContainerClassName}
          titleWrapperStyle={contentContainerStyle}
        >
          {children}
        </TitleContainer>
        {suffix}
      </div>
      {titleHighlight === "right" || titleHighlight === "both" ? (
        <TitleHighlight className={titleRightHighlightClassName} style={titleRightHighlightStyle} />
      ) : null}
    </div>
  );
};

type TitleContainerProps = {
  titleWrapper?: TitleWrapper;
  titleWrapperClassName?: string;
  titleWrapperStyle?: CSSProperties;
  children: ReactNode;
};

const TitleContainer = ({
  titleWrapper: Wrapper,
  titleWrapperClassName,
  titleWrapperStyle,
  children,
}: TitleContainerProps) => {
  if (Wrapper) {
    return (
      <Wrapper className={titleWrapperClassName} style={titleWrapperStyle}>
        {children}
      </Wrapper>
    );
  }

  return (
    <div className={titleWrapperClassName} style={titleWrapperStyle}>
      {children}
    </div>
  );
};

type TitleHighlightProps = {
  className?: string;
  style?: CSSProperties;
};

const TitleHighlight = ({ className, style }: TitleHighlightProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          height: 1px;
          width: 100%;
          background-color: black;
        `,
        className,
      )}
      style={style}
    />
  );
};
