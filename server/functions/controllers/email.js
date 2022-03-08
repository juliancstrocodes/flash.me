const express = require("express");
const { google } = require("googleapis");
const keys = require("./googlesheets.json");

const emailApp = express();

// after establishing connection with client, run events
async function gsrun(client, email) {
  const gsapi = google.sheets({ version: "v4", auth: client });
  const updateOptions = {
    spreadsheetId: "1yVes0erEc_ZLUh57xM3rdgaC-4-f3vine4aF12Hd63M",
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[email], []],
    },
  };

  let response = await gsapi.spreadsheets.values.append(updateOptions);
}

emailApp.get("/:email", async (req, res) => {
  const inviteEmail = req.params.email;

  // allows a server to indicate any origins other than its own from which a browser should permit loading resources

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  client.authorize((err, tokens) => {
    if (err) {
      return;
    } else {
      gsrun(client, inviteEmail);
    }
  });

  res.send("Succesfully submitted, thank you!");
});

// emailApp.listen(1337, (req, res) => console.log("john"));

module.exports = emailApp;
