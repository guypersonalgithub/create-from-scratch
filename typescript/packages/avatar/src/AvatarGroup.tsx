import { Avatar } from "./Avatar";

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
      style={{
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems: "center",
      }}
    >
      {visibleUsers.map((user, index) => (
        <div
          key={index}
          style={{
            marginLeft: direction === "horizontal" && index !== 0 ? spacing : 0,
            marginTop: direction === "vertical" && index !== 0 ? spacing : 0,
            zIndex: users.length - index,
          }}
        >
          <Avatar name={user.name} src={user.src} size={size} />
        </div>
      ))}

      {hiddenCount > 0 ? (
        <div
          style={{
            marginLeft: direction === "horizontal" ? spacing : 0,
            marginTop: direction === "vertical" ? spacing : 0,
            zIndex: 0,
          }}
        >
          <Avatar name={`+${hiddenCount}`} size={size} bgColor="#e0e0e0" textColor="#424242" />
        </div>
      ) : null}
    </div>
  );
};
