// ==UserScript==
// @name         Lichess study: Mark wins and losses
// @namespace    http://tampermonkey.net/
// @version      2024-12-29
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const $$ = s => document.querySelectorAll(s);
  const username = 'YOUR USERNAME HERE';

  async function main() {
    await queryUntilExists('.study__chapters button');
    const chapters = Array.from($$('.study__chapters button:not([class="add"])'));
    for (const chapter of chapters) {
      const title = chapter.querySelector('h3').innerText;
      const resultElement = chapter.querySelector('res');
      if (title.includes(`${username} -`)) {
        maybeReplaceResult(resultElement, '1-0', '0-1');
      } else if (title.includes(`- ${username}`)) {
        maybeReplaceResult(resultElement, '0-1', '1-0');
      }
    }
  }

  function maybeReplaceResult(
    resultElement, // HTMLElement <res>
    win, // string
    loss // string
  ) {
    const resultString = resultElement.innerText;
    if (resultString === win) {
      resultElement.innerText = '🟢';
    } else if (resultString === loss) {
      resultElement.innerText = '🔴';
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
