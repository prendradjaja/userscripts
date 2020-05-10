// ==UserScript==
// @name         WhatsApp focus on load
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

"use strict";

function queryUntilExists(selector, intervalTime, stopAfter, callback) {
  let reps = 0;
  const interval = setInterval(() => {
    reps++;
    const el = document.querySelector(selector);
    if (reps * intervalTime >= stopAfter || el) {
      clearInterval(interval);
    }
    if (el) {
      callback(el);
    }
  }, intervalTime);
}

queryUntilExists('#pane-side [tabindex="-1"]', 250, 5000, (el) => {
  el.focus();
});
