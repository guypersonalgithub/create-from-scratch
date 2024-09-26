type postMessageFlowArgs<T> = {
  whitelist: string[];
  messageCallback: (event: MessageEvent<T>) => void;
};

export const postMessageFlow = <T>({
  whitelist,
  messageCallback,
}: postMessageFlowArgs<T>) => {
  const postMessageCallback = (event: MessageEvent<T>) => {
    if (!whitelist.includes(event.origin)) {
      return;
    }

    messageCallback(event);
  };

  const initializePostMessageListener = () => {
    window.addEventListener("message", postMessageCallback, false);
  };

  const closePostMessageListener = () => {
    window.removeEventListener("message", postMessageCallback, false);
  };

  return {
    initializePostMessageListener,
    closePostMessageListener,
  };
};

type PostMessageUtilsArgs =
  | {
      iframe: HTMLIFrameElement | null;
    }
  | undefined;

type UtilsArgs = {
  message: string;
  src: string;
};

export const postMessageUtils = (props?: PostMessageUtilsArgs) => {
  const { iframe } = props || {};

  const messageChild = ({ message, src }: UtilsArgs) => {
    iframe?.contentWindow?.postMessage(message, src);
  };

  const messageParent = ({ message, src }: UtilsArgs) => {
    window.parent.postMessage(message, src);
  };

  return {
    messageChild,
    messageParent,
  };
};
