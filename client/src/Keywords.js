import logo from "./logo.svg";
import "./Keywords.css";
import FlashCard from "./FlashCard.js";
import HorizontalScroll from "react-scroll-horizontal";
import { useEffect, useState } from "react";

function Keywords() {
  const [cards, setCards] = useState([]);
  const url =
    "https://us-east1-flashme-27657.cloudfunctions.net/cards/flashcards";

  useEffect(async () => {
    setCards([
      {
        cardDef: "hold up,... one sec,...",
        cardKey: "loading",
      },
    ]);
    const response = await fetch(url);
    const responseJson = await response.json().then((data) => {
      setCards(data);
    });
  }, []);

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
          />
        </div>
      ))}
    </HorizontalScroll>
  );
}

export default Keywords;
