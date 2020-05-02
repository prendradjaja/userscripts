// ==UserScript==
// @name         Crunchbase GitHub Cypress highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/crunchbase/client_app/pull/*
// @grant        GM_addStyle
// ==/UserScript==

"use strict";

main();

function main() {
  addCSS();
  addCypressFinder();
}

function addCypressFinder() {
  setInterval(() => {
    const allCypressElements = Array.from(
      document.querySelectorAll(".js-timeline-item")
    )
      .filter((el) => el instanceof HTMLElement)
      .map((el) => el)
      .filter((el) => el.innerText.includes("Test summary"));
    allCypressElements.forEach((cypressElement) => {
      const failed = cypressElement.innerText.includes("Failures");
      if (failed) {
        cypressElement.classList.add("pandu-userscript-ci-failure");
      } else {
        cypressElement.classList.add("pandu-userscript-ci-success");
      }
      cypressElement.classList.add("pandu-userscript-ci-result");
    });
  }, 500);
}

function addCSS() {
  const css = (x) => x;
  GM_addStyle(css`
    .pandu-userscript-ci-failure p:first-of-type {
      background: #bb2929;
    }

    .pandu-userscript-ci-success p:first-of-type {
      background: #67c05c;
    }

    .pandu-userscript-ci-result p:first-of-type img {
      filter: brightness(99);
    }

    .pandu-userscript-ci-result p:first-of-type {
      margin-bottom: -12px; /* Set to -16px if jitter becomes a problem */
      padding-bottom: 16px;
    }

    .pandu-userscript-ci-result p:first-of-type img {
      background: transparent;
    }
  `);
}
