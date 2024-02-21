const bcd = require("@mdn/browser-compat-data");
const fs = require("fs");

// recursive function to extract all the compats by (keycheck, identifier) filters from given path

function mohilMobil(path, keyCheck, identifier, level) {
  if(level === 0) return {};
  const object = path.split(".").reduce((o, k) => o ? o[k] : undefined, bcd);
  if(path.split(".").pop() === "__compat") {
    if (object[keyCheck] && object[keyCheck].includes(identifier)) {
        const value = path.split("."); // ["css", "properties", "background-color", "__compat"]
        value.pop(); // ["css", "properties", "background-color"]
        const key = value[value.length - 1]; // "background-color"
        return { [key]: value.join(".") }; // { "background-color": "css.properties.background-color" }
    }
    return {}
  }
  let results = {};
  for (const key in object) {
    results = { ...results, ...mohilMobil(`${path}.${key}`, keyCheck, identifier, level-1) };
  }
  return results;
}

// const properties = mohilMobil("css.properties", "description", "()</code>", 999);
// const atRules = mohilMobil("css.at-rules", "description", "()</code>", 999);
// const selectors = mohilMobil("css.selectors", "description", "()</code", 999);
// const functions = { ...properties, ...atRules, ...selectors };
// console.log("Properties", Object.keys(properties).length);
// console.log("At-Rules", Object.keys(atRules).length);
// console.log("Selectors", Object.keys(selectors).length);
// fs.writeFileSync("src/data/combined_functions.json", JSON.stringify(functions, null, 2));



// write the result to a file 
// const functions = mohilMobil("css.types", "description", "()</code>", 999);
// fs.writeFileSync("src/data/functions.json", JSON.stringify(functions, null, 2));