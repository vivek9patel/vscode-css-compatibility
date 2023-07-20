const bcd = require("@mdn/browser-compat-data");

function findInCss(word) {
  if (bcd.css.selectors[word]) {
    return bcd.css.selectors[word].__compat;
  }

  if (bcd.css.properties[word]) {
    return bcd.css.properties[word].__compat;
  }

  if (bcd.css.types[word]) {
    return bcd.css.types[word].__compat;
  }
  // removing @ from the word
  const atRuleWord = word.substr(1);
  if (bcd.css["at-rules"][atRuleWord]) {
    return bcd.css["at-rules"][atRuleWord].__compat;
  }

  return {};
}
const v = findInCss("content-visibility");
console.log(v.support);
console.log(v.status);
