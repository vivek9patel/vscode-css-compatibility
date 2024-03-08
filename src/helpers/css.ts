import {Identifier} from "@mdn/browser-compat-data/types";
import bcd from "@mdn/browser-compat-data";
import {parse, findAll, CssNode, Atrule, MediaFeature, AttributeSelector, Combinator, FunctionNode, TypeSelector, Identifier as IdentifierNode, Declaration} from 'css-tree';
import functions from "../data/functions.json";

function handleAtRule(node: Atrule): Identifier | void{
    if(node.name in bcd.css["at-rules"]){
        return bcd.css["at-rules"][node.name];
    }
}

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

function handleUnicodeRange(): Identifier | void{
    const compat = bcd.css["at-rules"]["font-face"]["unicode-range"];
    compat.__compat!.description = "<code>unicode-range</code>";
    return compat;
}

function handleTypeselector(node: TypeSelector): Identifier | void{
    let compat = bcd.css.selectors.type;
    if(node.name.includes("|")) {
        compat = compat.namespaces;
        compat.__compat!.mdn_url = "https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors#namespaces";
    }
    return compat;
}

function handleIdentifier(nodePath: CssNode[]): Identifier | null{
    const declarationNode = nodePath.at(-3) as Declaration;
    const identifierNode = nodePath.at(-1) as IdentifierNode;
    if(declarationNode && identifierNode){
        const declarationCompat = getBCDdata(declarationNode);
        if(declarationCompat !== null && declarationCompat.hasOwnProperty(identifierNode.name)){
            const identiferCompat = declarationCompat[identifierNode.name];
            if(identiferCompat){
                if(!identiferCompat.__compat?.description){
                    identiferCompat.__compat!.description = declarationCompat.__compat!.description;
                }
                if(!identiferCompat.__compat?.mdn_url){
                    identiferCompat.__compat!.mdn_url = declarationCompat.__compat!.mdn_url;
                }
                return identiferCompat;
            }
        }

        if(!declarationCompat?.__compat?.description){
            declarationCompat!.__compat!.description = declarationNode.property;
        }
        return declarationCompat;
    }
    console.log(`Type not found '${identifierNode.type}'`, identifierNode);
    return null;
}

function getBCDdata(node: CssNode): Identifier | null{
    // Css Node Types: https://github.com/csstree/csstree/blob/master/docs/ast.md
    try{
        switch(node.type){
            case "Atrule":
                const atrule = handleAtRule(node);
                if(atrule) return atrule;
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
            case "Identifier": // TODO
                // there should be no Identifier node type at this point
                throw new Error();
            // @ts-ignore this type does exists in documentation
            case "NestingSelector":
                return bcd.css.selectors.nesting;
            case "Number":
                return bcd.css.types.number;
            case "Percentage":
                return bcd.css.types.percentage;
            case "PseudoClassSelector":
                return bcd.css.selectors[node.name];
            case "PseudoElementSelector":
                return bcd.css.selectors[node.name];
            case "Ratio":
                return bcd.css.types.ratio;
            case "SelectorList":
                return bcd.css.selectors.list;
            case "String":
                return bcd.css.types.string;
            case "TypeSelector":
                const typeSelector = handleTypeselector(node);
                if(typeSelector) return typeSelector;
                throw new Error();
            case "UnicodeRange":
                const unicode = handleUnicodeRange();
                if(unicode) return unicode;
                throw new Error();
            case "Url":
                return bcd.css.types.url;
            default:
                throw new Error();
        }
    }
    catch(e){
        console.log(`Type not found '${node.type}'`, node);
        return null;
    }
}

function findInCss(code: string, word: string, offset: number): Identifier | null {
    const nodePath = findAll(parse(code, {positions: true}),(node, item, list) => {
        if(!node.loc) return false;
        return offset >= node.loc.start.offset && offset <= node.loc.end.offset;
    });

    const node = nodePath.at(-1);
    if(node){
        if(node.type === "Identifier"){
            return handleIdentifier(nodePath);
        }
        return getBCDdata(node);
    }
    return null;
}

export default findInCss;