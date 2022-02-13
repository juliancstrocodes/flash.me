import logo from "./logo.svg";
import "./Highlighted.css";
import { Button } from "@material-ui/core";
import { useState } from "react";

function Highlighted() {
  const [isKeyword, setKeyword] = useState(true);

  const readWords = () => {
    window.chrome.tabs.executeScript(
      {
        code: "window.getSelection().toString();",
      },
      function (selection) {
        alert(selection);
      }
    );
    setKeyword(!isKeyword);
  };

  return (
    <div className="highlighted__button">
      <Button onClick={readWords}>
        {isKeyword ? <code>+ keyword</code> : <code>+ definition</code>}
      </Button>
    </div>
  );
}

export default Highlighted;
