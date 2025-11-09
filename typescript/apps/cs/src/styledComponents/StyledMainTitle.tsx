import { Title, type TitleProps } from "@packages/title";
import { dynatic } from "../dynatic-css.config";

export const StyledMainTitle = (props: TitleProps) => {
  return (
    <Title
      titleWrapper="h3"
      titleHighlight="both"
      contentContainerClassName={dynatic`
        white-space: nowrap;
      `}
      titleLeftHighlightClassName={dynatic`
        width: 20px;
        min-width: 20px;
        background-color: white;
        height: 2px;  
      `}
      titleRightHighlightClassName={dynatic`
        min-width: 20px;
        background-color: white;
        height: 2px;  
      `}
      {...props}
    />
  );
};

export const StyledSubTitle = (props: TitleProps) => {
  return (
    <Title
      titleWrapper="h5"
      titleHighlight="both"
      contentContainerClassName={dynatic`
        white-space: nowrap;  
      `}
      titleLeftHighlightClassName={dynatic`
        width: 10px;
        min-width: 10px;
        background-color: white;
        height: 2px;  
      `}
      titleRightHighlightClassName={dynatic`
        min-width: 10px;
        background-color: white;
        height: 2px;    
      `}
      {...props}
    />
  );
};
