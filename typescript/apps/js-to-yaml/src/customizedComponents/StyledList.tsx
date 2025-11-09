import { type ReactNode } from "react";
import { dynatic } from "../dynatic-css.config";

type StyledListProps = {
  list: {
    icon: ReactNode;
    title: ReactNode;
    subTitle: ReactNode;
    example?: ReactNode;
  }[];
};

export const StyledList = ({ list }: StyledListProps) => {
  return (
    <div
      className={dynatic`
        display: flex;
        flex-direction: column;
        gap: 10px;
        text-align: left;
      `}
    >
      {list.map((row, index) => {
        return (
          <div key={index}>
            <div
              className={dynatic`
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                align-items: center;

                ${(config) => config.utils.widthMediaQuery({ to: "800px" })} {
                  align-items: start;
                }
              `}
            >
              <div
                className={dynatic`
                  background-color: ${(config) => config.shared.listIconBG};
                  border-radius: 10px;
                  height: 40px;
                  width: 40px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  transition: ${(config) => config.shared.defaultTransition};
                  color: ${(config) => config.colors.listIconColor};
                `}
              >
                {row.icon}
              </div>
              <div>
                <div
                  className={dynatic`
                    font-weight: bold;
                    font-size: 18px;
                  `}
                >
                  {row.title}
                </div>
                <div
                  className={dynatic`
                    font-size: 14px;
                    color: ${(config) => config.shared.listSubTitle};
                  `}
                >
                  {row.subTitle}
                </div>
              </div>
            </div>
            {row.example}
          </div>
        );
      })}
    </div>
  );
};
