// ==UserScript==
// @name         Temi.com: Color-code speakers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.temi.com/editor/*
// @grant        GM_addStyle
// ==/UserScript==
"use strict";

const CLASS_PREFIX = "pbr-temi_";
const classesSeen = new Set();

main();

function main() {
  addFinder();
}

function addFinder() {
  setInterval(() => {
    document.querySelectorAll(".speaker span").forEach((el) => {
      const speakerName = el.innerText;
      const className = getClassName(speakerName);
      const classesToRemove = [...el.classList].filter((className) =>
        className.startsWith(CLASS_PREFIX)
      );
      classesToRemove.forEach((c) => el.classList.remove(c));
      el.classList.add(className);
    });
  }, 1000);
}

function getClassName(speakerName) {
  const className =
    CLASS_PREFIX +
    speakerName //
      .replaceAll(/[^A-Za-z]/g, "-")
      .toLowerCase();
  if (!classesSeen.has(className)) {
    classesSeen.add(className);
    addCSS(className);
  }
  return className;
}

function addCSS(className) {
  const color = getColor(className);
  GM_addStyle(`
    .${className} {
      color: ${color} !important;
    }
  `);
}

function getColor(className) {
  var hash = 0;
  for (var i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}
