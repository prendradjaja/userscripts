// ==UserScript==
// @name         Crunchbase GitHub Cypress highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/crunchbase/client_app/pull/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

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
  }, 1000);
})();
