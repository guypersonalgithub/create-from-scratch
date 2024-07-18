import "./App.css";
import { Link, Router, usePath } from "@packages/router";
import { MainRoute } from "./MainRoute";
import { NotFound } from "./NotFound";
import { RouteParam } from "./RouteParam";

const App = () => {
  const { moveTo } = usePath();

  return (
    <div>
      <div style={{ paddingBottom: "10px" }}>
        <button onClick={() => moveTo({ pathname: "/" })}>main</button>
        <button onClick={() => moveTo({ pathname: "/123" })}>test</button>
        <Link pathname="/124">
          <button>test3</button>
        </Link>
        <Link pathname="/test/new">
          <button>test4</button>
        </Link>
        <Link pathname="/test/old?test=3&no=asdf3">
          <button>test5</button>
        </Link>
      </div>
      <div style={{ height: "800px" }}>
        <Router
          paths={{
            "/": () => {
              return <MainRoute />;
            },
            "/test": {
              "/:one": <RouteParam />,
            },
            "404": <NotFound />,
          }}
        />
      </div>
    </div>
  );
};

export default App;
