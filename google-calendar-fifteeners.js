// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*
// @grant        none
// ==/UserScript==
"use strict";

// TODO naming: differentiate classes and selectors
const CALENDAR_EVENT = ".EfQccc";
const TEXT_DESCRIPTION = ".ynRLnc";

const PBR_FIFTEENER = "pbr-fifteener";

function main() {
  addCSS();
  addFifteenerFinder();
}

function addCSS() {
  var myCss = `
      .${PBR_FIFTEENER} {
        height: 8px !important;
      }

      .pbr-fifteener .RIOtYe {
        margin-top: -6px;
        font-size: 10px;
      }
    `;
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(myCss));
}

function addFifteenerFinder() {
  setInterval(() => {
    const allCalendarEvents = Array.from(
      document.querySelectorAll(CALENDAR_EVENT)
    );

    allCalendarEvents.forEach((calendarEvent) => {
      const textDescription = calendarEvent.querySelector(TEXT_DESCRIPTION)
        .innerText;
      const duration = getDuration(textDescription);
      if (duration === 15) {
        calendarEvent.classList.add(PBR_FIFTEENER);
      }
    });
  }, 1000);
}

function getDuration(textDescription) {
  const matches = textDescription.match(/\d+(:\d+)?(am|pm)/g);
  if (!matches) {
    console.warn("No matches for", textDescription);
    return 0;
  }
  const [start, end] = matches.map(parseTime);
  return end - start;
}

/**
 * Return minutes from 0:00
 */
function parseTime(t) {
  const pm = t.includes("pm");
  let hours, minutes;
  if (t.includes(":")) {
    [hours, minutes] = t
      .slice(0, -2) //
      .split(":")
      .map(Number);
  } else {
    hours = +t.slice(0, -2);
    minutes = 0;
  }
  return (
    hours * 60 + //
    minutes +
    (pm ? 12 * 60 : 0) +
    (hours === 12 ? -12 * 60 : 0) // Account for 12pm and 12am
  );
}

main();
