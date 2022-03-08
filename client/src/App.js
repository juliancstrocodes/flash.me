import logo from "./logo.svg";
import "./App.css";
import Highlighted from "./Highlighted";
import Upload from "./Upload";
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
          <Route exact path="/keywords" element={<Keywords />}>
            <Keywords />
          </Route>
          <Route exact path="/upload" element={<Upload />}>
            <Upload />
          </Route>
          <Route element={<Highlighted />}>
            <Highlighted />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
