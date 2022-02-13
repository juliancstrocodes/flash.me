const functions = require("firebase-functions");
const cards = require("./controllers/cards");

// prettier-ignore
module.exports = {
  "cards": functions.region("us-east1").https.onRequest(cards),
};
