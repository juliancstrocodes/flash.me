import React, { useEffect, useState } from "react";
import "./Upload.css";
import { Link } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import validator from "validator";

const styles = {
  root: {
    background: "pink",
    borderRadius: 5,
  },
  input: {
    color: "white",
  },
};

// TODO: make a link to see quizlet generation page
function Upload(props) {
  const { classes } = props;
  const [inputText, setInputText] = useState("");
  const [stage, setStage] = useState(1);
  const [step, setStep] = useState("1");

  useEffect(() => {
    /* global chrome */
    chrome.storage.sync.get(["stage"], async (results) => {
      if (results.stage) {
        if (results.stage >= 5) {
          setStage(1);
          setStep(`1`);
        } else {
          setStage(results.stage);
          setStep(`${results.stage}`);
        }
      }
    });
  }, []);

  const nextStep = () => {
    /* global chrome */
    chrome.storage.sync.set({ stage: stage + 1 });
    setStage(stage + 1);
    setStep(`${stage + 1}`);
  };

  const handleKeypress = async (e) => {
    if (e.key == "Enter" && validator.isEmail(inputText)) {
      nextStep();
      await fetch(
        `https://us-east1-flashme-27657.cloudfunctions.net/email/${inputText}`
      );
    }
  };

  const copyToClipboard = async () => {
    /* global chrome */
    chrome.storage.sync.get(["keyword", "deckId"], async (results) => {
      if (results.deckId !== undefined || results.deckId !== null) {
        const response = await fetch(
          `https://us-east1-flashme-27657.cloudfunctions.net/cards/toQuizlet/${results.deckId}`,
          { method: "POST" }
        );
        const responseJson = await response.text();
        nextStep();
        navigator.clipboard.writeText(responseJson);
      } else {
        alert("You have not started a deck,... :/");
      }
    });
  };

  switch (step) {
    case "1":
      return (
        <div className="upload">
          <code>to get your study set you must flash your friends ;)</code>
          <br />
          <br />
          <TextField
            id="standard-multiline-static"
            label="Friend's Email"
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

          <br />
          <br />
          <code>
            share us with your friends and we will send them a funny email
          </code>
        </div>
      );
    case "2":
      return (
        <div className="upload">
          <code>copy your flashcards into text</code>
          <br />
          <br />
          <div className="copy__button">
            <Button onClick={copyToClipboard}>
              <code>copy to clipboard</code>
            </Button>
          </div>
        </div>
      );
    case "3":
      return (
        <div className="upload__quizlet">
          <Link
            to={{
              pathname: "https://quizlet.com/create-set",
            }}
            target="_blank"
          >
            <div className="copy__button">
              <Button onClick={nextStep}>
                <code>go to quizlet</code>
              </Button>
            </div>
          </Link>
          <br />
          <br />
        </div>
      );
    case "4":
      return (
        <div className="upload__tutorial">
          <code>1. press</code>
          <img className="image" src={require("./quizletwalk2.png")} />
          <br />
          <br />
          <code>2. adjust settings</code>
          <img className="image" src={require("./quizletwalk.png")} />
          <br />
          <Button onClick={nextStep}>
            <code>next</code>
          </Button>
        </div>
      );
    case "5":
      return (
        <div className="finish__upload">
          <code>paste your flashcards into the text box</code>
          <br />
          <br />
          <code>click "Import" and admire your masterpiece</code>
        </div>
      );
    default:
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Upload);
