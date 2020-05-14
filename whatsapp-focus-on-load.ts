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

async function main() {
  queryUntilExists('#pane-side [tabindex="-1"]', 250, 5000).then((el) => {
    el.focus();
  });
}

/**
 * Repeatedly try document.querySelector until the element exists.
 *
 * Resolves once the queried element exists.
 * If this never happens after `stopAfter` milliseconds, reject.
 *
 * @param selector A selector for document.querySelector.
 * @param intervalTime Time (ms) to wait between queries.
 * @param stopAfter Time (ms) until we give up and reject.
 */
async function queryUntilExists(selector, intervalTime, stopAfter) {
  return queryUntil(selector, () => true, intervalTime, stopAfter);
}

/**
 * Like queryUntilExists, but a bit more general: wait until the element exists (call it `el`) AND
 * `predicate(el)` returns true.
 *
 * If this never happens after `stopAfter` milliseconds, reject.
 */
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
