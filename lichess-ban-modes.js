// ==UserScript==
// @name         Lichess: Ban modes
// @namespace    http://tampermonkey.net/
// @version      2024-12-29
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const $$ = s => document.querySelectorAll(s);
  const username = 'YOUR USERNAME HERE';

  async function main() {
    const poolsSelector = '.lpools div[role="button"]';

    await queryUntilExists(poolsSelector);
    const usernameEl = await queryUntilExists('#user_tag');

    if (usernameEl.innerText !== username) {
      return;
    }

    const pools = Array.from($$(poolsSelector));
    for (let i = 0; i < 6; i++) {
      pools[i].style.visibility = 'hidden';
    }
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
})();
