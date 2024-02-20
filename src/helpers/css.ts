import {Identifier} from "@mdn/browser-compat-data/types";
import bcd from "@mdn/browser-compat-data";
import {parse, findAll, CssNode, MediaFeature} from 'css-tree';

function handleMediaFeatures(node: MediaFeature): Identifier | void{
    // schema: https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/at-rules/media.json
    if(node.name in bcd.css["at-rules"]["media"]) return bcd.css["at-rules"]["media"][node.name];
    if(node.name.startsWith("min-") || node.name.startsWith("max-")){
        const feature = node.name.slice(4);
        if(feature in bcd.css["at-rules"]["media"]) return bcd.css["at-rules"]["media"][feature];
    }
    console.log("Not found MediaFeature", node);
}

function getBCDdata(node: CssNode): Identifier | void{
    switch(node.type){
      case "Declaration":
        return (node.property in bcd.css.properties ? bcd.css.properties[node.property] : undefined);
      case "Atrule":
        return (node.name in bcd.css["at-rules"] ? bcd.css["at-rules"][node.name] : undefined);
      case "MediaFeature":
        return handleMediaFeatures(node);
      default:
        console.log("Not found", node);
        return undefined;
    }
  }

function findInCss(code: string, word: string, offset: number): Identifier | void {
    const nodePath = findAll(parse(code, {positions: true}),(node, item, list) => {
        if(!node.loc) return false;
        return offset >= node.loc.start.offset && offset <= node.loc.end.offset;
    });

    const node = nodePath.at(-1);
    if(node) return getBCDdata(node);
}

export default findInCss;