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

// TODO i bet i can use cypress for this

let PRIMARY_VIEW, EDITOR, SEND_BUTTON;

PRIMARY_VIEW = ".p-workspace__primary_view_contents";
EDITOR = ".ql-editor";
SEND_BUTTON = ".c-texty_input__button--send";

async function goAway() {
  await sendText("/active"); // Because /away is a toggle
  await sendText("/away");
  await sendText("/status 🍱 Lunch");
  await sendText("afk lunch");
}

async function comeBack() {
  await sendText("/active"); // Because /away is a toggle
  await sendText("/status clear");
  // TODO automate react "back"
}

async function sendText(text) {
  const editor = document.querySelector(`${PRIMARY_VIEW} ${EDITOR}`); // TODO should i wait for previous to have been sent? seems to work anyway lolz
  editor.innerHTML = `<p>${text}</p>`;
  const sendButton = await queryUntilEnabled(
    `${PRIMARY_VIEW} ${SEND_BUTTON}`,
    10,
    500
  );
  sendButton.click();
}

// TODO handle promise rejection
// TODO test queryUntilExists
// TODO update README with the promise version
// TODO tune the timeouts?

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

function createController() {
  const html = (x) => x;
  const CONTROLLER_ID = "pbr-slack-away-controller";
  let controller = document.getElementById(CONTROLLER_ID);
  if (controller) {
    controller.parentElement.removeChild(controller);
  }
  controller = document.createElement("div");
  controller.id = CONTROLLER_ID;
  controller.style.background = "black";
  controller.style.color = "white";
  controller.style.position = "absolute";
  controller.style.top = 0;
  controller.style.left = 0;
  controller.style.zIndex = 9999;
  controller.innerHTML = html`<button style="color:white">Lunch</button>
    <button style="color:white">Back</button>`;
  const [awayBtn, backBtn] = controller.children;
  awayBtn.onclick = goAway;
  backBtn.onclick = comeBack;
  document.body.appendChild(controller);
}
createController();
