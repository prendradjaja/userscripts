// ==UserScript==
// @name         Lichess study: Expand all
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  function main() {
    document.addEventListener('keydown', event => {
      if (event.key === '`') {
        event.preventDefault();
        expandAll();
      }
    });
  }

  function expandAll() {
    const maxRepeatCount = 10;
    for (let i = 0; i < maxRepeatCount; i++) {
      const expandButtons = $$('line.expand a');
      if (expandButtons.length === 0) {
        return;
      }
      for (const each of expandButtons) {
        each.click();
      }
    }
  }

  main();
})();
