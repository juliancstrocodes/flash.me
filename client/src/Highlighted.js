import "./Highlighted.css";
import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = {
  root: {
    background: "pink",
    borderRadius: 5,
  },
  input: {
    color: "white",
  },
};

function Highlighted(props) {
  const { classes } = props;
  const [isKeyword, setIsKeyword] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [input, setInput] = useState(false);
  const [inputText, setInputText] = useState("");

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
    }
  }, [submit]);

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" && inputText.length > 0) {
      if (isKeyword) {
        // add keyword to storage
        chrome.storage.sync.set({ keyword: inputText });
        setKeyword(inputText);
        setIsKeyword(!isKeyword);
      } else {
        /* global storage */
        chrome.storage.sync.get(["keyword", "deckId"], async (results) => {
          try {
            if (results.deckId !== undefined) {
              await fetch(
                `https://us-east1-flashme-27657.cloudfunctions.net/cards/toDeck/${results.deckId}`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    cardKey: `${results.keyword}`,
                    cardDef: inputText,
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
                    cardDef: inputText,
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
          } catch {
            alert(
              "There has been an error processing your request. Please try again."
            );
          }
        });
      }
      setInput(false);
      setInputText("");
    } else if (e.key === "Enter" && inputText.length == 0) {
      setInput(false);
      setInputText("");
    }
  };

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
            if (!results.keyword && selection !== undefined) {
              // add keyword to storage
              chrome.storage.sync.set({ keyword: inputText });
              setKeyword(inputText);
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
                setInputText("");
              } catch (error) {
                alert(
                  "There has been an error processing your request. Please try again."
                );
              }
            } else {
              alert(
                "Please highlight the term/definition before adding it to your set. In case the website you're on does not have propery copy-paste properties, input the text manually."
              );
            }
          });
        }
      );
    } else {
      setSubmit(false);
    }
  };

  return !input ? (
    <React.Fragment>
      <div className="highlighted__word">
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
      <div className="input__option">
        {!submit ? (
          <Button onClick={() => setInput(true)}>
            <code>type instead</code>
          </Button>
        ) : (
          <></>
        )}
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div className="input__box">
        <TextField
          id="standard-multiline-static"
          label={isKeyword ? "Keyword" : "Definition"}
          multiline
          rows={6}
          color="white"
          variant="outlined"
          className={classes.root}
          InputProps={{
            className: classes.input,
          }}
          value={inputText}
          onInput={(inp) => setInputText(inp.target.value)}
          onKeyPress={handleKeypress}
        />
        <code style={{ color: "white", textAlign: "center", marginTop: 5 }}>
          hit enter to submit
        </code>
      </div>
    </React.Fragment>
  );
}

Highlighted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Highlighted);
