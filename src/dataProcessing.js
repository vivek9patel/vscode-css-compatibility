const bcd = require("@mdn/browser-compat-data");
const { getBCDDataForPath } = require("@mdn/bcd-utils-api");

function removeCSSprefix(word) {
  if (word.startsWith("::")) {
    word = word.substr(2);
  } else if (word.startsWith(":")) {
    word = word.substr(1);
  } else if (word.startsWith("@")) {
    word = word.substr(1);
  }
  return word;
}

function findInCss(word) {
  word = removeCSSprefix(word);

  if (bcd.css.selectors[word]) {
    return bcd.css.selectors[word].__compat;
  }

  if (bcd.css.properties[word]) {
    return bcd.css.properties[word].__compat;
  }

  if (bcd.css.types[word]) {
    return bcd.css.types[word].__compat;
  }

  if (bcd.css["at-rules"][word]) {
    return bcd.css["at-rules"][word].__compat;
  }

  return {};
}

// const v = findInCss("left");
// console.log(v);

console.log(getBCDDataForPath("css.selectors.after"));
