import logo from "./logo.svg";
import "./Highlighted.css";
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";

function Highlighted() {
  const [isKeyword, setIsKeyword] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [submit, setSubmit] = useState(false);

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

  useEffect(() => {
    if (submit) {
      // AFTER .THEN() =>
      chrome.storage.sync.remove("keyword");
      setKeyword("");
      setIsKeyword(!isKeyword);
      setSubmit(false);
    }
  }, [submit]);

  // 1. if nothing is stored, add to keyword.
  // 2. if keyword is stored but no def, add to definition.
  // 3. when keyword/definition is stored, upload and delete.
  const storeWord = () => {
    /* global chrome */
    if (!submit) {
      window.chrome.tabs.executeScript(
        {
          code: "window.getSelection().toString()",
        },
        function (selection) {
          /* global chrome */
          chrome.storage.sync.get(["keyword", "deckId"], async (results) => {
            alert(results.deckId);
            if (!results.keyword && selection !== undefined) {
              // add keyword to storage
              chrome.storage.sync.set({ keyword: selection });
              setKeyword(selection);
              setIsKeyword(!isKeyword);
            } else if (results.keyword && selection !== undefined) {
              // upload to firebase
              try {
                if (results.deckId !== undefined) {
                  await fetch(
                    `https://us-east1-flashme-27657.cloudfunctions.net/cards/toDeck/${results.deckId}`,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        cardKey: `${results.keyword}`,
                        cardDef: `${selection}`,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                        charset: "utf-8",
                      },
                    }
                  );
                } else {
                  const response = await fetch(
                    `https://us-east1-flashme-27657.cloudfunctions.net/cards/createDeck`,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        cardKey: `${results.keyword}`,
                        cardDef: `${selection}`,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                        charset: "utf-8",
                      },
                    }
                  );
                  const deckId = await response.text();
                  chrome.storage.sync.set({ deckId: deckId });
                }
                setSubmit(true);
              } catch (error) {
                alert(error);
              }
            } else if (selection == undefined) {
              alert(
                "Please highlight the term/definition before adding it to your set."
              );
            }
          });
        }
      );
    }
  };

  return (
    <React.Fragment>
      <div className="highlighted_word">
        {/** appears to be an issue with the following condition */}
        {keyword === "" && isKeyword ? (
          <code></code>
        ) : !submit ? (
          <code>
            keyword:{" "}
            {keyword.length > 55 ? keyword.substring(0, 50) + "..." : keyword}
          </code>
        ) : (
          <></>
        )}
      </div>
      <div className="highlighted__button">
        <Button onClick={storeWord}>
          {isKeyword ? (
            <code>+ keyword</code>
          ) : submit ? (
            <code>submit card</code>
          ) : (
            <code>+ definition</code>
          )}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default Highlighted;
