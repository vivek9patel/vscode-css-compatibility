const bcd = require("@mdn/browser-compat-data");
const fs = require("fs");

// recursive function to extract all the compats by (keycheck, identifier) filters from given path
function mohilMobil(path, keyCheck, identifier, level, mdn_url) {
  if(level === 0) return {};
  const object = path.split(".").reduce((o, k) => o ? o[k] : undefined, bcd);
  if(path.split(".").pop() === "__compat") {
    if (object[keyCheck] && object[keyCheck].includes(identifier)) {
        const value = path.split("."); // ["css", "properties", "background-color", "__compat"]
        value.pop(); // ["css", "properties", "background-color"]
        const key = value[value.length - 1]; // "background-color"
        return { [key]: {path: value.join("."), mdn_url} }; // { "background-color": "css.properties.background-color" }
    }
    return {}
  }
  let results = {};
  for (const key in object) {
    mdn_url = object[key].mdn_url ? object[key].mdn_url : (object["__compat"]?.mdn_url ? object["__compat"].mdn_url : mdn_url);
    results = { ...results, ...mohilMobil(`${path}.${key}`, keyCheck, identifier, level-1, mdn_url) };
    mdn_url = null;
  }
  return results;
}

const properties = mohilMobil("css.properties", "description", "()</code>", 999, null);
const atRules = mohilMobil("css.at-rules", "description", "()</code>", 999, null);
const selectors = mohilMobil("css.selectors", "description", "()</code>", 999, null);
const types = mohilMobil("css.types", "description", "()</code>", 999, null);
const functions = { ...properties, ...atRules, ...selectors, ...types };

fs.writeFileSync("src/data/functions.json", JSON.stringify(functions, null, 2));