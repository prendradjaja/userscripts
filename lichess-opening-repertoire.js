// ==UserScript==
// @name         Lichess study: Opening repertoire tweaks
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// ==/UserScript==

(function() {
  const $$ = s => document.querySelectorAll(s);

  function main() {
    // De-emphasize "--" lines
    const lines = $$('line');
    for (const line of lines) {
      const firstMove = line.querySelector('move');
      if (
        firstMove?.nextSibling?.tagName === 'COMMENT' &&
        firstMove.nextSibling.innerText === '--'
      ) {
        line.style.opacity = '0.3';
      }
    }

    // Shorten links
    const links = $$('comment a');
    for (const link of links) {
      link.innerHTML = new URL(link.href).hostname;
    }

    // Emphasize "[OPENING NAME]" comments
    const comments = $$('comment');
    for (const comment of comments) {
      if (comment.innerText.startsWith('[')) {
        comment.style.color = 'hsl(60 90 70)';
      }
    }
  }

  setInterval(main, 500);
})();
