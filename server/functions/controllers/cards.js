const express = require("express");
const cors = require("cors");
const { db, firestore } = require("../admin");

const cardsApp = express();

// allows a server to indicate any origins other than its own from which a browser should permit loading resources
cardsApp.use(cors({ origin: true }));

cardsApp.post("/toQuizlet", async (req, res) => {
  const text = req.body.text;

  await db
    .collection("users")
    .doc("john")
    .set({ hello: firestore.FieldValue.arrayUnion(text) });
  //Line 9
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

async function login() {
  const testScript = "hello+++world---my name is+++john";

  try {
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

    // console.log("now email");

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
    console.log("now password");

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
