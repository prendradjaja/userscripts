// ==UserScript==
// @name         Toggle overlay
// @namespace    http://tampermonkey.net/
// @version      2024-12-31
// @description  try to take over the world!
// @author       You
// @match        https://skribbl.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const $ = s => document.querySelector(s);

  function main() {
    document.addEventListener('keydown', event => {
      if (event.key === '`') {
        event.preventDefault();
        toggleOverlay();
      }
    });
  }

  function toggleOverlay() {
    if ($('.overlay').style.display === '') {
      $('.overlay').style.display = 'none';
      $('.overlay-content').style.display = 'none';
    } else {
      $('.overlay').style.display = '';
      $('.overlay-content').style.display = '';
    }
  }

  main();
})();
