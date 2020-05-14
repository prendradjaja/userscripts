// ==UserScript==
// @name         Slack Lunch Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.slack.com/*
// @grant        none
// ==/UserScript==

"use strict";

// TODO
// . i bet i can use cypress for this
// . handle promise rejection
// . update README with the promise version
// . tune the timeouts?

const CONTROLLER_ID = "pbr-slack-away-controller";

// Selectors
const PRIMARY_VIEW = ".p-workspace__primary_view_contents";
const EDITOR = ".ql-editor";
const SEND_BUTTON = ".c-texty_input__button--send";

function main() {
  const controller = document.createElement("div");
  controller.innerHTML = `
  <button style="color: white">Lunch</button>
  <button style="color: white">Back</button>`;
  const [awayBtn, backBtn] = controller.children;
  awayBtn.onclick = goAway;
  backBtn.onclick = comeBack;
  document.body.appendChild(controller);

  // Styles
  controller.style.background = "black";
  controller.style.position = "absolute";
  controller.style.top = "0";
  controller.style.left = "0";
  controller.style.zIndex = "9999";
}

async function goAway() {
  await sendMessage("/active"); // Because /away is a toggle
  await sendMessage("/away");
  await sendMessage("/status 🍱 Lunch");
  await sendMessage("afk lunch");
}

async function comeBack() {
  await sendMessage("/active");
  await sendMessage("/status clear");
  // TODO automate react "back"
}

async function sendMessage(text) {
  const editor = document.querySelector(`${PRIMARY_VIEW} ${EDITOR}`); // TODO should i wait for previous to have been sent? (if so, how?) seems to work anyway
  editor.innerHTML = `<p>${text}</p>`;
  const sendButton = await queryUntilEnabled(
    `${PRIMARY_VIEW} ${SEND_BUTTON}`,
    10,
    500
  );
  sendButton.click();
}

async function queryUntilExists(selector, intervalTime, stopAfter) {
  return queryUntil(selector, () => true, intervalTime, stopAfter);
}

async function queryUntilEnabled(selector, intervalTime, stopAfter) {
  return queryUntil(selector, (el) => !el.disabled, intervalTime, stopAfter);
}

// TODO docstring
// "query until exists & predicate returns true"
async function queryUntil(selector, predicate, intervalTime, stopAfter) {
  return new Promise((resolve, reject) => {
    let reps = 0;
    const interval = setInterval(() => {
      reps++;
      const el = document.querySelector(selector);
      const success = !!el && predicate(el);
      if (reps * intervalTime >= stopAfter || success) {
        clearInterval(interval);
        if (success) {
          resolve(el);
        } else {
          reject();
        }
      }
    }, intervalTime);
  });
}

main();
