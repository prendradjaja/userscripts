// ==UserScript==
// @name         Strava splits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.strava.com/activities/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  async function main() {
    const button = document.createElement('button');
    button.innerHTML = '!';
    button.addEventListener('click', doTheThing);

    const header = await queryUntilExists('#splits-container h2', 250, 5000);
    header.appendChild(button);
  };

  function doTheThing() {
    let data = Array.from($$(".mile-splits tbody tr")).map(
      (row) => Array.from(row.querySelectorAll("td")).map((td) => td.innerText)
    );

    data = data.map(([mileno, pace, netElevation]) => ({mileno, pace, netElevation}))

    if (!data.at(-1).mileno.startsWith('0.')) {
      return;
    }

    data = data.slice(0, -1);

    data = data.map(
      ({mileno, pace, netElevation}) => ({
        mileno: +mileno,
        pace: pace.split(' ')[0],
        netElevation: +netElevation.split(' ')[0],
      })
    );

    let paceRow = data.map(split => split.pace).join('\t');
    let netElevationRow = data.map(split => split.netElevation).join('\t');

    document.body.innerHTML = `
<pre>
${paceRow}
${netElevationRow}</pre>
    `;
  };

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
