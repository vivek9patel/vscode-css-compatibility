import {Identifier} from "@mdn/browser-compat-data/types";
import bcd from "@mdn/browser-compat-data";
import {parse, findAll, CssNode} from 'css-tree';

function getBCDdata(node: CssNode): Identifier | void{
    switch(node.type){
      case "Declaration":
        return (node.property in bcd.css.properties ? bcd.css.properties[node.property] : undefined);
      case "Atrule":
        return (node.name in bcd.css["at-rules"] ? bcd.css["at-rules"][node.name] : undefined);
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