import "./App.css";
import { Link, Router, usePath } from "@packages/router";
import { MainRoute } from "./MainRoute";
import { NotFound } from "./NotFound";
import { RouteParam } from "./RouteParam";
import { TooltipManager } from "@packages/tooltip";
import { MathRoute } from "./MathRoute";
import { Test } from "./Test";
import { dynatic } from "@packages/dynatic-css";

const App = () => {
  const { moveTo } = usePath();

  return (
    <div>
      <div
        className={dynatic`
          padding-bottom: 10px;
        `}
      >
        <button onClick={() => moveTo({ pathname: "/" })}>main</button>
        <button onClick={() => moveTo({ pathname: "/123" })}>test</button>
        <Link pathname="/test/test">
          <button>TestTest</button>
        </Link>
        <Link pathname="/124">
          <button>test3</button>
        </Link>
        <Link pathname="/test/new">
          <button>test4</button>
        </Link>
        <Link pathname="/test/old?test=3&no=asdf3">
          <button>test5</button>
        </Link>
        <Link pathname="/math">
          <button>Math</button>
        </Link>
      </div>
      <div
        className={dynatic`
          height: 800px;
        `}
      >
        <Router
          paths={{
            "/": () => {
              return <MainRoute />;
            },
            "/test": {
              "/:one": <RouteParam />,
              "/test": <Test />,
            },
            "/math": <MathRoute />,
            "404": <NotFound />,
          }}
        />
      </div>
      <TooltipManager />
    </div>
  );
};

export default App;
