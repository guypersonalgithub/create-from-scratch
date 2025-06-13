import { Title, type TitleProps } from "@packages/title";

export const StyledMainTitle = (props: TitleProps) => {
  return (
    <Title
      titleWrapper="h3"
      titleHighlight="both"
      contentContainerStyle={{ whiteSpace: "nowrap" }}
      titleLeftHighlightStyle={{
        width: "20px",
        minWidth: "20px",
        backgroundColor: "white",
        height: "2px",
      }}
      titleRightHighlightStyle={{ minWidth: "20px", backgroundColor: "white", height: "2px" }}
      {...props}
    />
  );
};

export const StyledSubTitle = (props: TitleProps) => {
  return (
    <Title
      titleWrapper="h5"
      titleHighlight="both"
      contentContainerStyle={{ whiteSpace: "nowrap" }}
      titleLeftHighlightStyle={{
        width: "10px",
        minWidth: "10px",
        backgroundColor: "white",
        height: "2px",
      }}
      titleRightHighlightStyle={{ minWidth: "10px", backgroundColor: "white", height: "2px" }}
      {...props}
    />
  );
};
