import { usePath } from "@packages/router";

export const NotFound = () => {
  const { moveTo } = usePath();

  return (
    <div>
      <div>404 not found!</div>
      <button
        onClick={() => {
          moveTo({
            pathname: "/",
            overrideParams: true,
          });
        }}
      >
        Back to main
      </button>
    </div>
  );
};
