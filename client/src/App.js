import logo from "./logo.svg";
import "./App.css";
import Highlighted from "./Highlighted";
import Footer from "./Footer";
import Keywords from "./Keywords";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <h1>
          <code>
            <Link
              to="/"
              style={{
                margin: "1rem",
                textDecoration: "none",
                color: "#61dbfb",
              }}
            >
              flash.me
            </Link>
          </code>
        </h1>
        <Switch>
          {/** for default path */}
          <Route exact path="/" element={<Highlighted />}>
            <Highlighted />
          </Route>
          {/** for search path */}
          <Route exact path="/keywords" element={<Keywords />}>
            <Keywords />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
