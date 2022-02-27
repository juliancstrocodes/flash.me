// 1. if nothing is stored, add to keyword.
// 2. if keyword is stored but no def, add to definition.
// 3. when keyword/definition is stored, upload and delete.
export const storeWord = (setIsKeyword, isKeyword, setKeyword) => {
  const toDeckUrl =
    "https://us-east1-flashme-27657.cloudfunctions.net/cards/toDeck";

  /* global chrome */
  window.chrome.tabs.executeScript(
    {
      code: "window.getSelection().toString();",
    },
    function (selection) {
      /* global chrome */
      chrome.storage.sync.get("keyword", async (results) => {
        if (!results.keyword) {
          // add keyword to storage
          chrome.storage.sync.set({ keyword: selection });
          setKeyword(selection);
        } else {
          // upload to firebase
          try {
            await fetch(toDeckUrl, {
              method: "POST",
              body: JSON.stringify({
                cardKey: `${results.keyword}`,
                cardDef: `${selection}`,
                deckName: "deckName",
                email: "castrojv@bc.edu",
              }),
              headers: {
                "Content-Type": "application/json",
                charset: "utf-8",
              },
            });
          } catch (error) {
            alert("There has been an error posting your flashcard. Try again.");
          }
          // clear storage
          chrome.storage.sync.clear();
          setKeyword("");
        }
      });
    }
  );
  setIsKeyword(!isKeyword);
};
