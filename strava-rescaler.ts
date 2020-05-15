// ==UserScript==
// @name         Strava rescaler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.strava.com/activities/*
// @grant        none
// ==/UserScript==

"use strict";

main();

async function main() {
  const chartSvg = document.querySelector(".chart svg");
  const chartGroup = chartSvg.querySelector("g.chartGroup");
  const { width, height } = chartGroup.getBoundingClientRect();
  const paceAxis = await queryUntilExists(chartSvg, "g.yaxis2", 100, 2000);
  interpretPaceAxis(paceAxis);
}

function interpretPaceAxis(paceAxis) {
  const ticks = Array.from(paceAxis.querySelectorAll(".tick"));
  const [otherTick, lastTick] = ticks.slice(-2);
  console.log("strava-graph-axes.ts under construction:");
  console.log(interpretPaceTick(otherTick));
  console.log(interpretPaceTick(lastTick));
}

function interpretPaceTick(tick) {
  const paceSeconds = parsePace(tick.textContent);
  const yPos = tick.transform.baseVal.getItem(0).matrix.f;
  return { paceSeconds, yPos };
}

function parsePace(paceText) {
  const paceDuration = paceText.split("/")[0];
  return toSeconds(paceDuration);
}

// TODO How to share between this & cumulative time calculator script?
function toSeconds(duration) {
  let [minutes, seconds] = duration.split(":").map((n) => +n);
  return minutes * 60 + seconds;
}
function toDuration(seconds) {
  let minString = Math.floor(seconds / 60).toString();
  let secString = (seconds % 60).toString();
  secString = secString.length === 1 ? "0" + secString : secString;
  return `${minString}:${secString}`;
}

// TODO reconcile with README.md version
// TODO again, how do we share code
/**
 * Repeatedly try document.querySelector until the element exists.
 *
 * Resolves once the queried element exists.
 * If this never happens after `stopAfter` milliseconds, reject.
 *
 * @param selector A selector for document.querySelector.
 * @param intervalTime Time (ms) to wait between queries.
 * @param stopAfter Time (ms) until we give up and reject.
 */
async function queryUntilExists(context, selector, intervalTime, stopAfter) {
  return queryUntil(context, selector, () => true, intervalTime, stopAfter);
}

/**
 * Like queryUntilExists, but a bit more general: wait until the element exists (call it `el`) AND
 * `predicate(el)` returns true.
 *
 * If this never happens after `stopAfter` milliseconds, reject.
 */
async function queryUntil(
  context,
  selector,
  predicate,
  intervalTime,
  stopAfter
) {
  return new Promise((resolve, reject) => {
    let reps = 0;
    const interval = setInterval(() => {
      reps++;
      const el = context.querySelector(selector);
      const success = !!el && predicate(el);
      if (reps * intervalTime >= stopAfter || success) {
        clearInterval(interval);
        if (success) {
          resolve(el);
        } else {
          reject();
        }
      }
    }, intervalTime);
  });
}
