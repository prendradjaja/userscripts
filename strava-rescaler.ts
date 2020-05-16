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

// TODO debug -- why doesn't it work e.g. on https://www.strava.com/activities/3442625725 with 10 & 12 top/bottom
// - p sure the scale factor is right
// - so is the transpose dist wrong?

const SECONDS_PER_MINUTE = 60;

main();
// window.getTransformParams = main;

async function main(desiredConfig) {
  desiredConfig = desiredConfig || {
    topPace: 7.5 * SECONDS_PER_MINUTE,
    bottomPace: 18 * SECONDS_PER_MINUTE,
  };

  const chartSvg = document.querySelector(".chart svg");
  const chartGroup = chartSvg.querySelector("g.chartGroup");
  const { width, height } = chartGroup.getBoundingClientRect();
  const paceAxis = await queryUntilExists(chartSvg, "g.yaxis2", 100, 2000);
  const originalPaceAxis = interpretPaceAxis(paceAxis);
  const desiredPaceScale = getDesiredPaceScale(height, desiredConfig);

  // Compute transform params
  const scaleFactor =
    (desiredPaceScale(originalPaceAxis.bottomPace) -
      desiredPaceScale(originalPaceAxis.topPace)) /
    height;
  const transposeDistance = desiredPaceScale(originalPaceAxis.topPace);

  // return { scaleFactor, transposeDistance };

  // Adjust pace series
  const paceSeries = chartGroup.querySelector("#pace");
  paceSeries.style.transform = `translateY(${transposeDistance}px) scaleY(${scaleFactor})`;

  // Adjust ticks
  // TODO dedupe queryselector?
  paceAxis.querySelectorAll(".tick").forEach((tick) => {
    const { paceSeconds, yPos } = interpretPaceTick(tick);
    const newY = desiredPaceScale(paceSeconds);
    getTransformMatrix(tick).f = newY;
  });
}

function interpretPaceAxis(paceAxis) {
  const ticks = Array.from(paceAxis.querySelectorAll(".tick"));
  const [otherTick, lastTick] = ticks.slice(-2).map(interpretPaceTick);
  const scale = linearScale(otherTick, lastTick, {
    x: "paceSeconds",
    y: "yPos",
  });
  return {
    scale,
    topPace: scale.invert(0),
    bottomPace: lastTick.paceSeconds,
  };
}

function getDesiredPaceScale(height, desiredConfig) {
  const p1 = {
    paceSeconds: desiredConfig.topPace,
    yPos: 0,
  };
  const p2 = {
    paceSeconds: desiredConfig.bottomPace,
    yPos: height,
  };
  const scale = linearScale(p1, p2, { x: "paceSeconds", y: "yPos" });
  return scale;
}

function interpretPaceTick(tick) {
  const paceSeconds = parsePace(tick.textContent);
  const yPos = getTransformMatrix(tick).f;
  return { paceSeconds, yPos };
}

function getTransformMatrix(svgElement) {
  return svgElement.transform.baseVal.getItem(0).matrix;
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

/**
 * Create a linear scale (similar to d3) from two {x, y} points
 */
function linearScale(p1, p2, attrsToPluck) {
  attrsToPluck = attrsToPluck || { x: "x", y: "y" };
  const p1x = p1[attrsToPluck.x];
  const p1y = p1[attrsToPluck.y];
  const p2x = p2[attrsToPluck.x];
  const p2y = p2[attrsToPluck.y];
  const m = (p2y - p1y) / (p2x - p1x);
  const b = p1y - m * p1x;
  const scale = (x) => m * x + b;
  scale.invert = (y) => (y - b) / m;
  return scale;
}
