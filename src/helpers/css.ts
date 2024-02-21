import {Identifier} from "@mdn/browser-compat-data/types";
import bcd from "@mdn/browser-compat-data";
import {parse, findAll, CssNode, MediaFeature, AttributeSelector, Combinator, FunctionNode} from 'css-tree';
import functions from "../data/functions.json";

function handleMediaFeatures(node: MediaFeature): Identifier | void{
    if(node.name in bcd.css["at-rules"]["media"]) return bcd.css["at-rules"]["media"][node.name];
    if(node.name.startsWith("min-") || node.name.startsWith("max-")){
        const feature = node.name.slice(4);
        if(feature in bcd.css["at-rules"]["media"]) return bcd.css["at-rules"]["media"][feature];
    }
}

function handleAttributeSelector(node: AttributeSelector): Identifier | void{
    if(node.flags == 'i'){
        return bcd.css.selectors.attribute.case_insensitive_modifier;
    }
    else if(node.flags == 's'){
        return bcd.css.selectors.attribute.case_sensitive_modifier;
    }
    else{
        return bcd.css.selectors.attribute;
    }
}

function handleCombinaor(node: Combinator): Identifier | void{
    if(node.name === '>') {
        return bcd.css.selectors["child"];
    }
    else if(node.name === '||') {
        return bcd.css.selectors["column"];
    }
    else if(node.name === '~') {
        return bcd.css.selectors["subsequent-sibling"];
    }
    else if(node.name === '+') {
        return bcd.css.selectors["next-sibling"];
    }
    else{
        return bcd.css.selectors["descendant"];
    }
}

function handleFunctions(node: FunctionNode): Identifier | void{
    if(node.name in bcd.css.types) return bcd.css.types[node.name];
    if(node.name in functions) {
        // @ts-ignore
        return functions[node.name].split(".").reduce((o, k) => o ? o[k] : undefined, bcd);
    } 
}

function getBCDdata(node: CssNode): Identifier | void{
    // Css Node Types: https://github.com/csstree/csstree/blob/master/docs/ast.md
    try{
        switch(node.type){
            case "Atrule":
                if(node.name in bcd.css["at-rules"]){
                    return bcd.css["at-rules"][node.name];
                }
                throw new Error();
            case "AttributeSelector":
                const res = handleAttributeSelector(node);
                if(res) return res;
                throw new Error();
            case "ClassSelector":
                return bcd.css.selectors.class;
            case "Combinator":
                const comb = handleCombinaor(node);
                if(comb) return comb;
                throw new Error();
            case "Declaration":
                if(node.property in bcd.css.properties) return bcd.css.properties[node.property];
                throw new Error();
            case "Dimension":
                return bcd.css.types.dimension;
            case "Function":
                const func = handleFunctions(node);
                if(func) return func;
                throw new Error();
            case "MediaFeature":
                const media = handleMediaFeatures(node);
                if(media) return media;
                throw new Error();
            case "IdSelector":
                return bcd.css.selectors.id;
            default:
                throw new Error();
        }
    }
    catch(e){
        console.log(`Type not found '${node.type}'`, node);
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