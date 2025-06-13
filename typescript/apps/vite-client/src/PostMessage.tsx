import { type RefObject, useEffect, useRef, useState } from "react";
import { postMessageFlow, postMessageUtils } from "@packages/micro-frontends";

export const PostMessage = () => {
  const [vueChildMessage, setVueChildMessage] = useState("");
  const [reactChildMessage, setReactChildMessage] = useState("");

  useEffect(() => {
    const whitelist = ["http://localhost:3004", "http://localhost:5174"];

    const { initializePostMessageListener, closePostMessageListener } = postMessageFlow<string>({
      whitelist,
      messageCallback: (event) => {
        const { origin, data } = event;

        if (origin === "http://localhost:3004") {
          return setVueChildMessage(data);
        }
        if (origin === "http://localhost:5174") {
          return setReactChildMessage(data);
        }
      },
    });

    initializePostMessageListener();

    return () => {
      closePostMessageListener();
    };
  }, []);

  const vueMicro = useRef<HTMLIFrameElement>(null);
  const reactMicro = useRef<HTMLIFrameElement>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <MicroFrontend
        childRef={vueMicro}
        src="http://localhost:3004"
        childMessage={vueChildMessage}
      />
      <MicroFrontend
        childRef={reactMicro}
        src="http://localhost:5174"
        childMessage={reactChildMessage}
      />
    </div>
  );
};

type MicroFrontendProps = {
  childRef: RefObject<HTMLIFrameElement>;
  src: string;
  childMessage: string;
};

const MicroFrontend = ({ childRef, src, childMessage }: MicroFrontendProps) => {
  const { messageChild } = postMessageUtils({ iframe: childRef.current });

  return (
    <>
      <iframe ref={childRef} src={src} />
      <button
        onClick={() => {
          messageChild({ message: "test message to child", src });
        }}
      >
        Test
      </button>
      {childMessage ? <div>Received from child: {childMessage}</div> : null}
    </>
  );
};
