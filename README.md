# My userscripts

Also, some useful recipes for writing userscripts:

## Query until exists

```js
function queryUntilExists(selector, intervalTime, stopAfter, callback) {
  let reps = 0;
  const interval = setInterval(() => {
    reps++;
    const el = document.querySelector(selector);
    if (reps * intervalTime >= stopAfter || el) {
      clearInterval(interval);
    }
    if (el) {
      callback(el);
    }
  }, intervalTime);
}
```

## CSS

```js
// @grant        GM_addStyle

function addCSS() {
  const css = (x) => x;
  GM_addStyle(css`
    /* put your css here */
  `);
}
```
