const data = require('./data').data;

function regexcat(regexes, flags) {
  const source = regexes.map(re => re.source).join('');
  return new RegExp(source, flags);
}

const pattern = regexcat([
  /(January|February|March|April|May|June|July|August|September|October|November|December)/,
  / \d{1,2}, \d{4}/,
], '');

for (let cardText of data) {
  console.log(cardText.match(pattern)[0]);
}
