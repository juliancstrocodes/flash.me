const admin = require("firebase-admin");

/* eslint-disable no-template-curly-in-string */
const firebaseConfig = {
  apiKey: "AIzaSyAyq9qHrrA56A1Vc3Pj5BYav2kh-Akp6Ks",
  authDomain: "flashme-27657.firebaseapp.com",
  projectId: "flashme-27657",
  storageBucket: "flashme-27657.appspot.com",
  messagingSenderId: "983038615558",
  appId: "1:983038615558:web:12a882e458a9dee174e387",
  measurementId: "G-W93D8SMGTM",
};
/* eslint-disable no-template-curly-in-string */

const app = admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const firestore = admin.firestore;

module.exports = {
  db,
  firestore,
};