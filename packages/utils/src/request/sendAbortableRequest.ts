import { sendRequest, SendRequestArgs } from "./sendRequest";

type SendAbortableRequestArgs = Omit<SendRequestArgs, "signal">;

export const sendAbortableRequest = (args: SendAbortableRequestArgs) => {
  const controller = new AbortController();
  const { signal, abort } = controller;
  const sendRequestFunction = () => {
    return sendRequest({ ...args, signal });
  };

  return {
    sendRequestFunction,
    abort,
  };
};
