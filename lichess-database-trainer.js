// ==UserScript==
// @name         Lichess Database Trainer
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/analysis
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  function main() {
    addCSS();
    document.addEventListener('keydown', event => {
      // todo Allow user to pick a color, then the AI only suggests moves on that color's turn
      if (event.key === '`') {
        event.preventDefault();
        const weightedMoves = scrapeTable();
        alert(selectRandomWeighted(weightedMoves));
      }
    });
  }

  function addCSS() {
    const css = (x) => x;
    GM_addStyle(css`
      .moves tbody tr {
        opacity: 0;
      }
      .explorer-box div.title {
        opacity: 0;
      }
      table.games {
        dipslay: none;
      }
    `);
  }

  function scrapeTable() {
    const moveRows = Array.from($$('.moves tbody tr'))
      .filter(tr => !tr.classList.contains('sum'));
    const weightedMoves = moveRows.map(row => scrapeRow(row));
    return weightedMoves;
  }

  function scrapeRow(row) {
    const cells = Array.from(row.querySelectorAll('td'))
      .map(x => x.innerText);
    assert(cells.length === 4);

    let [move, _, count, __] = cells;
    count = parseWithCommas(count);
    return { move, count };
  }

  function assert(condition, message) {
    if (!condition) {
      const suffix = message ? ': ' + message : '';
      throw new Error('[lichess-database-trainer] Assertion failed' + suffix);
    }
  }

  function parseWithCommas(n) {
    return +n.replaceAll(',', '');
  }

  // @ga
  function selectRandomWeighted(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.count, 0);
    const randomWeight = Math.random() * totalWeight;
    let runningTotal = 0;
    for (const item of items) {
      runningTotal += item.count;
      if (randomWeight < runningTotal) {
        return item.move;
      }
    }
    assert(false);
  }

  main();

})();
