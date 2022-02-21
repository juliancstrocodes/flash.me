const express = require("express");
const cors = require("cors");
const { db, firestore } = require("../admin");

const cardsApp = express();
// allows a server to indicate any origins other than its own from which a browser should permit loading resources
cardsApp.use(cors({ origin: true }));

cardsApp.post("/toQuizlet", async (req, res) => {
  const cardKey = req.body.cardKey;
  const cardDef = req.body.cardDef;

  await db
    .collection("users")
    .doc("john")
    .update({ cards: firestore.FieldValue.arrayUnion({ cardKey, cardDef }) });
  //Line 9
  res.status(200).send();
});

cardsApp.get("/flashcards", async (req, res) => {
  const flashcards = await db.collection("users").doc("john").get();

  const flashcardData = flashcards.data().cards;

  res.status(200).send(flashcardData);
});

cardsApp.delete("/removeCard/:index", async (req, res) => {
  await db
    .collection("users")
    .doc("john")
    .update({
      cards: firestore.FieldValue.arrayRemove(`${req.params.index}`),
    });

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

async function submitQuizlet() {
  const cardScript = "hello>>>><<<<world<<<<>>>>my name is>>>><<<<john";

  try {
    // 1.
    // TODO: make going to log in page headless

    const URL = "https://quizlet.com/create-set";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(URL);

    const query = "Continue with Google";

    // click on the "Log in with Google" button
    await page.evaluate((query) => {
      const elements = [
        ...document.querySelectorAll(
          "a.UIButton.UIButton--social.UIButton--fill"
        ),
      ];
      const targetElement = elements.find((e) => e.innerText.includes(query));
      // make sure the element exists, and only then click it
      targetElement && targetElement.click();
    }, query);

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    // 2.
    // TODO: make timeout = 3 minutes
  } catch (error) {
    console.log(error);
  }
}

async function login() {
  const testScript = "hello+++world---my name is+++john";

  const URL = "https://quizlet.com/create-set";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(URL);

  const query = "Continue with Google";

  // click on the "Log in with Google" button
  await page.evaluate((query) => {
    const elements = [
      ...document.querySelectorAll(
        "a.UIButton.UIButton--social.UIButton--fill"
      ),
    ];
    const targetElement = elements.find((e) => e.innerText.includes(query));
    // make sure the element exists, and only then click it
    targetElement && targetElement.click();
  }, query);

  try {
    // enter email on google log in
    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    // TODO : change to your email
    await page.type('input[type="email"]', "castrojv@bc.edu");
    // click next
    await page.keyboard.press("Enter");

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    // enter password on google log in
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.click('input[type="password"]');
    // TODO : change to your email
    await page.type('input[type="password"]', "J0c313943");
    // click next
    await page.keyboard.press("Enter");

    // TODO: go to quizlet, import text, create set

    // await browser.close();
  } catch (error) {
    console.error(error);
  }
}

module.exports = cardsApp;
