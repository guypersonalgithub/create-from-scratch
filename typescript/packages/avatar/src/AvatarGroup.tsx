import { dynatic } from "@packages/dynatic-css";
import { Avatar } from "./Avatar";
import { combineStringsWithSpaces } from "@packages/string-utils";

type AvatarGroupProps = {
  users: { name: string; src?: string }[];
  maxVisible?: number;
  size?: number;
  spacing?: number;
  direction?: "horizontal" | "vertical";
};

export const AvatarGroup = ({
  users,
  maxVisible = 5,
  size = 40,
  spacing = -10,
  direction = "horizontal",
}: AvatarGroupProps) => {
  const visibleUsers = users.slice(0, maxVisible);
  const hiddenCount = users.length - visibleUsers.length;

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          align-items: center;  
        `,
        direction === "vertical"
          ? dynatic`
              flex-direction: column;
            `
          : dynatic`
              flex-direction: row;
            `,
      )}
    >
      {visibleUsers.map((user, index) => {
        const isntTheStart = index !== 0;

        return (
          <div
            key={index}
            className={combineStringsWithSpaces(
              dynatic`
            z-index: ${users.length - index};  
          `,
              direction === "horizontal" && isntTheStart
                ? dynatic`
                    margin-left: ${spacing};
                  `
                : dynatic`
                    margin-left: 0;
                  `,
              direction === "vertical" && isntTheStart
                ? dynatic`
                    margin-top: ${spacing};
                  `
                : dynatic`
                    margin-top: 0;
                  `,
            )}
          >
            <Avatar name={user.name} src={user.src} size={size} />
          </div>
        );
      })}

      {hiddenCount > 0 ? (
        <div
          className={combineStringsWithSpaces(
            dynatic`
              z-index: 0;  
            `,
            direction === "horizontal"
              ? dynatic`
                  margin-left: ${spacing};
                `
              : dynatic`
                  margin-left: 0;
                `,
            direction === "vertical"
              ? dynatic`
                  margin-top: ${spacing};
                `
              : dynatic`
                  margin-top: 0;
                `,
          )}
        >
          <Avatar name={`+${hiddenCount}`} size={size} bgColor="#e0e0e0" textColor="#424242" />
        </div>
      ) : null}
    </div>
  );
};
