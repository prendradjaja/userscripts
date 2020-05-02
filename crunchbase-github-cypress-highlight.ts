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
        cypressElement.classList.add("pbr-ci-failure");
      } else {
        cypressElement.classList.add("pbr-ci-success");
      }
      cypressElement.classList.add("pbr-ci-result");

      const linkElement = cypressElement.querySelector("p:first-of-type img")
        .parentElement;
      linkElement.removeAttribute("href");
      linkElement.onclick = () =>
        cypressElement.classList.toggle("pbr-ci-result-opened");
    });
  }, 200);
}

function addCSS() {
  const css = (x) => x;
  GM_addStyle(css`
    /*** CORE FUNCTIONALITY (color-coding and image stuff) *******************/
    .pbr-ci-failure p:first-of-type {
      background: #bb2929;
    }
    .pbr-ci-success p:first-of-type {
      background: #67c05c;
    }
    .pbr-ci-result p:first-of-type img {
      filter: brightness(99);
    }
    .pbr-ci-result p:first-of-type img {
      background: transparent;
    }
    .pbr-ci-result p:first-of-type {
      margin-bottom: -12px; /* Set to -16px if jitter becomes a problem */
      padding-bottom: 16px;
    }

    /*** POSITIONING AND OPENED STATE ****************************************/
    .pbr-ci-result {
      position: absolute;
      top: -9px;
      right: 120px;
      z-index: 99;
      width: 120px;
      height: 57px;
      overflow: hidden;
    }
    .pbr-ci-result.pbr-ci-result-opened {
      width: 500px;
      height: auto;
      top: 10px;
      right: 10px;
    }
    .pbr-ci-result:not(.pbr-ci-result-opened) p:first-of-type {
      line-height: 9px;
    }
    .pbr-ci-result:not(.pbr-ci-result-opened) p:first-of-type img {
      max-height: 25px;
      height: auto;
      width: auto;
    }
    .pbr-ci-result:not(.pbr-ci-result-opened) .timeline-comment {
      background: transparent;
      border: none;
    }
    .pbr-ci-result .TimelineItem {
      padding-top: 0;
    }
    .pbr-ci-result:not(.pbr-ci-result-opened) .timeline-comment-header {
      display: none;
    }
    .pbr-ci-result .TimelineItem::before {
      /* Hide the vertical line */
      display: none;
    }
    .pbr-ci-result .avatar-parent-child {
      /* Hide the avatar */
      display: none;
    }
  `);
}
