import { sendRequest, SendRequestArgs } from "./sendRequest";

type SendAbortableRequestArgs<T> = Omit<SendRequestArgs<T>, "signal">;

export const sendAbortableRequest = () => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => {
    controller.abort();
  };

  async function sendRequestFunction<T>(
    args: SendAbortableRequestArgs<T> & { fallback: T },
  ): Promise<T>;
  async function sendRequestFunction<T>(args: SendAbortableRequestArgs<T>): Promise<T | undefined>;

  async function sendRequestFunction<T>(args: SendAbortableRequestArgs<T>): Promise<T | undefined> {
    return sendRequest({ ...args, signal });
  }

  return {
    sendRequestFunction,
    abort,
  };
};
