import { Table } from "@packages/table";
import { Tooltip } from "@packages/tooltip";
import { useControlModal } from "@packages/modal";
import { useControlToast } from "@packages/toast";
import { useQueryParamsState, usePath } from "@packages/router";
// import { Spinner, Skeleton } from "@packages/loading";

export const MainRoute = () => {
  const { openModal, closeModal } = useControlModal();
  const { openModal: openModal2, closeModal: closeModal2 } = useControlModal();
  const { showToast, hideToast } = useControlToast();
  const { showToast: showToast2, hideToast: hideToast2 } = useControlToast();
  const queryParams = useQueryParamsState({ specificParams: ["pagination"] });
  const { moveTo } = usePath();
  const pagination = Number(queryParams.pagination ?? 1);

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
                <button
                  onClick={() => {
                    hideToast();
                  }}
                >
                  hide
                </button>
                <button
                  onClick={() => {
                    showToast2({
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
                          test
                        </div>
                      ),
                    });
                  }}
                >
                  open
                </button>
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
        pagination={{
          rowsPerPage: 10,
          paginationProps: {
            currentPage: pagination,
            maxPagesToShow: 5,
            onPageChange: (page) => {
              moveTo({
                pathname: window.location.pathname,
                queryParams: page === 1 ? undefined : { pagination: page },
              });
            },
          },
        }}
      />
    </div>
  );
};
