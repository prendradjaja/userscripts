// ==UserScript==
// @name         Google Calendar: Fifteen-minute events and other goodies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*
// @grant        none
// ==/UserScript==
"use strict";

// Main features:
// - Fifteen-minute events are super-narrow (instead of being as wide as a thirty-minute event)
// - Resize handles on thirty-minute events are made narrower

// TODO naming: differentiate classes and selectors
const CALENDAR_EVENT = ".EfQccc";
const VISIBLE_TEXT_SUMMARY = ".RIOtYe";
const A11Y_TEXT_SUMMARY = ".ynRLnc";
const RESIZE_HANDLE = ".leOeGd";

const PBR_THIRTY = "pbr-thirty";
const PBR_FIFTEENER = "pbr-fifteener";

// Other unused classes:
// EfQccc: Events including all-day events

function main() {
  addCSS();
  addFinders();
}

function addCSS() {
  // TODO extract css classes to variables
  var myCss = `
      .${PBR_FIFTEENER} {
        height: 9px !important;
      }

      .pbr-fifteener ${VISIBLE_TEXT_SUMMARY} {
        margin-top: -7px;
        margin-left: -5px;
        font-size: 11px;
      }

      .pbr-fifteener.pbr-right-half {
        left: 20% !important;
        width: 80% !important;
      }

      .pbr-fifteener ${RESIZE_HANDLE} {
        height: 4px; /* 4px is default */
      }

      .pbr-thirty ${RESIZE_HANDLE} {
        height: 4px; /* 8px is default */
      }

      ${RESIZE_HANDLE}:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    `;
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  head.appendChild(style);
  style.type = "text/css";
  style.appendChild(document.createTextNode(myCss));
}

function addFinders() {
  setInterval(() => {
    const allCalendarEvents = Array.from(
      document.querySelectorAll(CALENDAR_EVENT)
    );

    allCalendarEvents.forEach((calendarEvent) => {
      const textDescription = calendarEvent.querySelector(A11Y_TEXT_SUMMARY)
        .innerText;
      const duration = getDuration(textDescription);
      if (duration <= 15) {
        calendarEvent.classList.add(PBR_FIFTEENER);
        if (
          calendarEvent.style.left === "50%" &&
          calendarEvent.style.width === "50%"
        ) {
          calendarEvent.classList.add("pbr-right-half");
        }
      } else if (duration <= 30) {
        calendarEvent.classList.add(PBR_THIRTY);
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
