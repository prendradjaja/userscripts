// ==UserScript==
// @name         Google Calendar: Toggle main calendar via semicolon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*
// @grant        none
// ==/UserScript==

"use strict";
document.addEventListener("keydown", function (e) {
  if (e.key === ";") {
    return Array.from(document.querySelectorAll("#dws12b span"))
      .filter((x) => x.innerText === "Pandu Rendradjaja")[0]
      .parentElement.click();
  }
});
