const admin = require("firebase-admin");

/* eslint-disable no-template-curly-in-string */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
/* eslint-disable no-template-curly-in-string */

const app = admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const firestore = admin.firestore;
const auth = admin.auth();

module.exports = {
  db,
  firestore,
  admin,
};
