import logo from "./logo.svg";
import "./Keywords.css";
import FlashCard from "./FlashCard.js";
import HorizontalScroll from "react-scroll-horizontal";
import { useEffect, useState } from "react";

function Keywords() {
  const [cards, setCards] = useState([]);
  const [removed, setRemoved] = useState(false);
  const [deckId, setDeckId] = useState("");
  // TODO: get email and deck name from cache DO SO GLOBALLY

  useEffect(() => {
    /* global chrome */
    chrome.storage.sync.get("deckId", async (results) => {
      setDeckId(`${results.deckId}`);
    });
  }, []);

  useEffect(async () => {
    setCards([
      {
        cardDef: "hold up,... one sec,...",
        cardKey: "loading",
      },
    ]);

    const response = await fetch(
      `https://us-east1-flashme-27657.cloudfunctions.net/cards/flashcards/${deckId}`,
      {
        method: "POST",
      }
    );
    const responseJson = await response.json();
    setCards(responseJson);
  }, [deckId]);

  useEffect(async () => {
    setCards([
      {
        cardDef: "hold up,... one sec,...",
        cardKey: "loading",
      },
    ]);
    const response = await fetch(
      `https://us-east1-flashme-27657.cloudfunctions.net/cards/flashcards/${deckId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    await response.json().then((data) => {
      setCards(data);
    });
  }, [removed]);

  return (
    <HorizontalScroll
      style={{ position: "absolute", top: "80px" }}
      reverseScroll={true}
    >
      {cards.map((card, index) => (
        <div className="main">
          <FlashCard
            term={card.cardKey}
            definition={card.cardDef}
            index={index}
            setRemoved={setRemoved}
          />
        </div>
      ))}
    </HorizontalScroll>
  );
}

export default Keywords;
