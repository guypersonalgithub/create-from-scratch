import { Table } from "@packages/table";
import { Tooltip } from "@packages/tooltip";
import { useControlModal } from "@packages/modal";
import { useControlToast } from "@packages/toast";

export const MainRoute = () => {
  const { openModal, closeModal } = useControlModal();
  const { openModal: openModal2, closeModal: closeModal2 } = useControlModal();
  const { showToast, hideToast } = useControlToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            content: (
              <div
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  padding: "20px",
                  backgroundColor: "ActiveCaption",
                  borderRadius: "10%",
                  border: "1px solid red",
                }}
              >
                test123456
              </div>
            ),
          })
        }
      >
        open toast
      </button>
      <button
        onClick={() =>
          openModal({
            content: (
              <div
                style={{
                  width: "800px",
                  height: "500px",
                  backgroundColor: "ThreeDShadow",
                  borderRadius: "5%",
                }}
              >
                testing123
                <button
                  onClick={() =>
                    openModal2({
                      content: (
                        <div
                          style={{
                            width: "900px",
                            height: "250px",
                            backgroundColor: "ActiveCaption",
                            borderRadius: "5%",
                            border: "1px solid red",
                          }}
                        >
                          test123456
                        </div>
                      ),
                    })
                  }
                >
                  click
                </button>
              </div>
            ),
          })
        }
      >
        click
      </button>
      <Table
        rowContainer={{
          height: "500px",
        }}
        columns={[
          {
            header: "name",
            cell: (data) => {
              return (
                <Tooltip offset={-10} content={data.name}>
                  <div>{data.name}</div>
                </Tooltip>
              );
            },
            size: 50,
          },
          {
            header: "version",
            cell: (data) => {
              return <div>{data.version}</div>;
            },
            size: 100,
          },
        ]}
        data={[
          {
            name: "test",
            version: "123",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
        ]}
      />
    </div>
  );
};
