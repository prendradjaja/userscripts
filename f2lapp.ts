// ==UserScript==
// @name         F2L.app extras
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://f2l.app/
// @grant        GM_addStyle
// ==/UserScript==

"use strict";

main();

function main() {
  addCSS();
  addController();
}

function addController() {
  const controller = document.createElement("div");
  controller.id = "pbr-controller";
  document.body.appendChild(controller);

  const selectNoneBtn = document.createElement("button");
  selectNoneBtn.innerHTML = "Select none";
  selectNoneBtn.addEventListener(
    "click",
    () => {
      document
        .querySelectorAll(".grid input[type=checkbox]")
        .forEach((checkbox, i) => {
          checkbox.click();
          checkbox.insertAdjacentHTML("beforebegin", i + 1);
        });
    },
    false
  );
  controller.appendChild(selectNoneBtn);
}

function addCSS() {
  const css = (x) => x;
  GM_addStyle(css`
    #pbr-controller {
      background: black;
      color: white;
      position: absolute;
      bottom: 0;
      left: 800px;
      z-index: 99;
      padding: 5px;
    }

    #pbr-controller button {
      background: #cccccc;
      color: black;
      padding: 2px;
    }
  `);
}
