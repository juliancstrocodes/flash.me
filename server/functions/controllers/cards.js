const express = require("express");
const cors = require("cors");
const { db, firestore } = require("../admin");

const cardsApp = express();
// allows a server to indicate any origins other than its own from which a browser should permit loading resources
cardsApp.use(cors({ origin: true }));

cardsApp.post("/toDeck", async (req, res) => {
  const cardKey = req.body.cardKey;
  const cardDef = req.body.cardDef;
  const deckName = req.body.deckName;
  const email = req.body.email;

  await db
    .collection("decks")
    .doc(`${deckName}by${email}`)
    .update({ cards: firestore.FieldValue.arrayUnion({ cardKey, cardDef }) });
  //Line 9
  res.status(200).send();
});

cardsApp.post("/flashcards", async (req, res) => {
  const deckName = req.body.deckName;
  const email = req.body.email;

  const flashcards = await db
    .collection("decks")
    .doc(`${deckName}by${email}`)
    .get();

  const flashcardData = flashcards.data();

  res.status(200).send(flashcardData);
});

cardsApp.delete("/removeCard/:index", async (req, res) => {
  const deckName = req.body.deckName;
  const email = req.body.email;

  await db
    .collection("decks")
    .doc(`${deckName}by${email}`)
    .update({
      cards: firestore.FieldValue.arrayRemove(`${req.params.index}`),
    });

  res.status(200);
});

cardsApp.delete("/deleteDeck", async (req, res) => {
  const deckName = req.body.deckName;
  const email = req.body.email;

  await db.collection("decks").doc(`${deckName}by${email}`).delete();

  res.status(200);
});

/**
 * work flow of scrapper
 *
 * 1. show log in to quizlet, have the user log in.
 * 2. wait for user input; exit any banner ad,...
 * 3. click "import from..."
 * 4. link term-definition with >>>><<<<
 * 5. link cards with <<<<>>>>
 * 6. copy text
 * 7. click submit
 */

module.exports = cardsApp;
