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

/**
 * CALENDAR_EVENT Returns events excluding all-day events
 * Similar: .NlL62b returns all events including day-long events
 */
const CALENDAR_EVENT = ".EfQccc";
const EVENT_BEING_DRAGGED = ".wbilU .EfQccc";
const TEXT_SUMMARY = ".RIOtYe";
const A11Y_TEXT_SUMMARY = ".ynRLnc";
const RESIZE_HANDLE = ".leOeGd";

const PBR_FIFTEENER = ".pbr-fifteener";
const PBR_THIRTY = ".pbr-thirty";
const PBR_RIGHT_HALF = ".pbr-right-half";

const PBR_FIFTEENER_CLASS = classSelectorToName(PBR_FIFTEENER);
const PBR_THIRTY_CLASS = classSelectorToName(PBR_THIRTY);
const PBR_RIGHT_HALF_CLASS = classSelectorToName(PBR_RIGHT_HALF);

function main() {
  addCSS();
  addFinders();
}

function addCSS() {
  var myCss = `
      ${PBR_FIFTEENER} {
        height: 11px !important;
      }

      ${PBR_FIFTEENER} ${TEXT_SUMMARY} {
        margin-top: -6px;
        margin-left: -5px;
        font-size: 11px;
      }

      ${PBR_RIGHT_HALF} {
        left: 20% !important;
        width: 80% !important;
      }

      ${PBR_FIFTEENER} ${RESIZE_HANDLE} {
        height: 0px; /* 4px is default */
      }

      ${PBR_THIRTY} ${RESIZE_HANDLE} {
        height: 4px; /* 8px is default */
      }

      ${RESIZE_HANDLE}:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      ${EVENT_BEING_DRAGGED} {
        opacity: 0.5 !important;
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
        calendarEvent.classList.add(PBR_FIFTEENER_CLASS);
        if (
          calendarEvent.style.left === "50%" &&
          calendarEvent.style.width === "50%"
        ) {
          calendarEvent.classList.add(PBR_RIGHT_HALF_CLASS);
        }
      } else if (duration <= 30) {
        calendarEvent.classList.add(PBR_THIRTY_CLASS);
      }

      const { start } = parseSummary(textDescription);
      if (
        start === 615 && // 615 = 10:15am
        calendarEvent.style.left === "50%" &&
        calendarEvent.style.width === "50%"
      ) {
        calendarEvent.classList.add(PBR_RIGHT_HALF_CLASS);
      }
    });
  }, 1000);
}

function parseSummary(textDescription) {
  const matches = textDescription.match(/\d+(:\d+)?(am|pm)/g);
  if (!matches) {
    console.warn("No matches for", textDescription);
    return { start: 0, end: 0 };
  }
  const [start, end] = matches.map(parseTime);
  return { start, end };
}

function getDuration(textDescription) {
  const { start, end } = parseSummary(textDescription);
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

function classSelectorToName(selector) {
  return selector.slice(1);
}

main();
