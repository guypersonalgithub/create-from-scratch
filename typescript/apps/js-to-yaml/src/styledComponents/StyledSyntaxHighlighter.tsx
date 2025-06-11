import { SyntaxHighlighter, SyntaxHighlighterProps } from "@packages/syntax-highlighter";

type StyledSyntaxHighlighterProps = SyntaxHighlighterProps;

export const StyledSyntaxHighlighter = (props: StyledSyntaxHighlighterProps) => {
  return (
    <SyntaxHighlighter
      {...props}
      style={
        {
          // backgroundColor: "var(--theme-thirdBackground)",
          // border: "3px solid var(--theme-thirdBackground)",
          // transition: "var(--theme-transition)",
          // ...props.style,
        }
      }
    />
  );
};
