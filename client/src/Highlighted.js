import logo from "./logo.svg";
import "./Highlighted.css";
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";

function Highlighted() {
  const [isKeyword, setIsKeyword] = useState(true);
  const [keyword, setKeyword] = useState("");
  const toQuizUrl =
    "https://us-east1-flashme-27657.cloudfunctions.net/cards/toDeck";

  useEffect(() => {
    /* global chrome */
    chrome.storage.sync.get("keyword", (results) => {
      if (results.keyword) {
        // add keyword to storage
        setIsKeyword(!isKeyword);
        setKeyword(`${results.keyword}`);
      }
    });
  }, []);

  // 1. if nothing is stored, add to keyword.
  // 2. if keyword is stored but no def, add to definition.
  // 3. when keyword/definition is stored, upload and delete.
  const storeWord = () => {
    /* global chrome */
    window.chrome.tabs.executeScript(
      {
        code: "window.getSelection().toString()",
      },
      function (selection) {
        /* global chrome */
        chrome.storage.sync.get("keyword", async (results) => {
          if (!results.keyword && selection != undefined) {
            // add keyword to storage
            chrome.storage.sync.set({ keyword: selection });
            setKeyword(selection);
            setIsKeyword(!isKeyword);
          } else if (results.keyword && selection != undefined) {
            // upload to firebase
            try {
              await fetch(toQuizUrl, {
                method: "POST",
                body: JSON.stringify({
                  cardKey: `${results.keyword}`,
                  cardDef: `${selection}`,
                  deckName: "deckName",
                  email: "castrojv@bc.edu",
                }),
                headers: {
                  "Content-Type": "application/json",
                  charset: "utf-8",
                },
              });
            } catch (error) {
              alert(
                "There has been an error posting your flashcard. Try again."
              );
            }
            // clear storage
            chrome.storage.sync.clear();
            setKeyword("");
            setIsKeyword(!isKeyword);
          } else if (selection == undefined) {
            alert(
              "Please highlight the term/definition before adding it to your set."
            );
          }
        });
      }
    );
  };

  return (
    <React.Fragment>
      <div className="highlighted_word">
        {/** appears to be an issue with the following condition */}
        {keyword === "" && isKeyword ? (
          <code></code>
        ) : (
          <code>
            keyword:{" "}
            {keyword.length > 55 ? keyword.substring(0, 50) + "..." : keyword}
          </code>
        )}
      </div>
      <div className="highlighted__button">
        <Button onClick={storeWord}>
          {isKeyword ? <code>+ keyword</code> : <code>+ definition</code>}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default Highlighted;
