import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { postMessageFlow, postMessageUtils } from "@packages/micro-frontends";

function App() {
  const [parentMessage, setParentMessage] = useState("");
  const { messageParent } = postMessageUtils();

  useEffect(() => {
    const whitelist = ["http://localhost:5173"];

    const { initializePostMessageListener, closePostMessageListener } = postMessageFlow<string>({
      whitelist,
      messageCallback: (event) => {
        const { origin, data } = event;

        if (origin === "http://localhost:5173") {
          return setParentMessage(data);
        }
      },
    });

    initializePostMessageListener();

    return () => {
      closePostMessageListener();
    };
  }, []);

  const [count, setCount] = useState(0);

  const callParent = () => {
    messageParent({ message: "hello", src: "http://localhost:5173" });
  };

  return (
    <>
      {parentMessage}
      <button onClick={callParent}>Call parent</button>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
