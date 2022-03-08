const functions = require("firebase-functions");
const cards = require("./controllers/cards");
const email = require("./controllers/email");

// prettier-ignore
module.exports = {
  "cards": functions.region("us-east1").https.onRequest(cards),
  "email": functions.region("us-east1").https.onRequest(email),
};
