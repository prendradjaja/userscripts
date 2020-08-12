// ==UserScript==
// @name         GitHub open everything
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/crunchbase/client_app/pull/*
// @grant        none
// ==/UserScript==


'use strict';

window.pbrOpenEverything = {
  loadMores: () =>
    document.querySelectorAll('.ajax-pagination-btn')
      .forEach(x => x.click()),

  showResolveds: () =>
    Array.from(document.querySelectorAll('details'))
      .filter(x => x.innerText.includes('Show resolved'))
      .map(x => x.querySelector('.btn-link.Details-content--closed'))
      .forEach(x => x.click())
}
