import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { useControlModal } from "@packages/modal";
import { useControlToast } from "@packages/toast";
import { useQueryParamsState, usePath } from "@packages/router";
import { useTempRequest } from "../useTempRequest";
// import { Spinner, Skeleton } from "@packages/loading";

export const MainRoute = () => {
  const { data, isLoading, isError } = useTempRequest();
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
                <EllipsisTooltip offset={-10} content={data.name}>
                  {data.name}
                </EllipsisTooltip>
              );
            },
            size: 50,
          },
          // {
          //   header: "version",
          //   cell: (data) => {
          //     return <div>{data.instances?.[0]?.path}</div>;
          //   },
          //   size: 100,
          // },
        ]}
        data={data}
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
