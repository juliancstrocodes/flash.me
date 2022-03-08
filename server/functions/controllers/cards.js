const express = require("express");
const cors = require("cors");
const { db, firestore } = require("../admin");

const cardsApp = express();
// allows a server to indicate any origins other than its own from which a browser should permit loading resources
cardsApp.use(cors({ origin: true }));

// initializes deck after the first card is created
cardsApp.post("/createDeck", async (req, res) => {
  const deckCollection = db.collection("decks");
  const deckId = deckCollection.doc().id;
  const cardKey = req.body.cardKey;
  const cardDef = req.body.cardDef;

  // TO DO: make sure users cannot stack cards o top of each other

  await deckCollection.doc(deckId).set({ cards: [{ cardKey, cardDef }] });

  res.status(200).send(deckId);
});

cardsApp.post("/toDeck/:id", async (req, res) => {
  const cardKey = req.body.cardKey;
  const cardDef = req.body.cardDef;
  const deckId = req.params.id;

  await db
    .collection("decks")
    .doc(deckId)
    .update({ cards: firestore.FieldValue.arrayUnion({ cardKey, cardDef }) });
  //Line 9
  res.status(200).send();
});

cardsApp.post("/flashcards/:id", async (req, res) => {
  const deckId = req.params.id;

  const flashcards = await db.collection("decks").doc(deckId).get();

  const flashcardData = flashcards.data().cards;

  res.status(200).send(flashcardData);
});

cardsApp.delete("/removeCard/:id/:index", async (req, res) => {
  const deckId = req.params.id;
  const cardIndex = req.params.index;

  const updateDeck = await (
    await db.collection("decks").doc(deckId).get()
  ).data().cards;

  updateDeck.splice(cardIndex, 1);

  await db.collection("decks").doc(deckId).update({
    cards: updateDeck,
  });

  res.status(200).send();
});

cardsApp.delete("/deleteDeck/:id", async (req, res) => {
  const deckId = req.params.id;

  await db.collection("decks").doc(deckId).delete();

  res.status(200).send();
});

cardsApp.post("/toQuizlet/:id", async (req, res) => {
  let quizletString = "";
  const deckId = req.params.id;

  const flashcards = await db.collection("decks").doc(deckId).get();

  const flashcardData = flashcards.data().cards;

  flashcardData.forEach((card, i) => {
    if (i != 0 || i != flashcardData.length - 1) {
      quizletString += ">>>";
      quizletString += card.cardKey;
      quizletString += ">>><<<";
      quizletString += card.cardDef;
      quizletString += "<<<";
    } else {
      quizletString += card.cardKey;
      quizletString += ">>><<<";
      quizletString += card.cardDef;
    }
  });

  res.status(200).send(quizletString);
});

module.exports = cardsApp;
