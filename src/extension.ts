import * as vscode from "vscode";
import path = require("path");
import {
  getCSSLanguageService,
  LanguageService,
  SymbolKind,
} from "vscode-css-languageservice";

// @ts-ignore
import * as nodes from "vscode-css-languageservice/lib/esm/parser/cssNodes.js";
// @ts-ignore
import { CSSDataManager } from "vscode-css-languageservice/lib/esm/languageFacts/dataManager.js";
import { TextDocument } from "vscode-css-languageservice";

const languageServices: { [id: string]: LanguageService } = {
  css: getCSSLanguageService(),
};

const cssDataManager = new CSSDataManager();

function activate(context: vscode.ExtensionContext) {
  let disposables = [];

  disposables.push(
    vscode.languages.registerHoverProvider("css", {
      provideHover: async function provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
      ) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        const languageService = languageServices[document.languageId];
        if (!languageService) {
          return;
        }

        const cssDoc = languageService.parseStylesheet(document as any);
        const offset = document.offsetAt(position);
        const nodepath = nodes.getNodePath(cssDoc, offset);
        for (let i = 0; i < nodepath.length; i++) {
          const node = nodepath[i];

          if (node instanceof nodes.Selector) {
            const selector = node.getText();
            console.log("Selector: ", selector);
            continue;
          }
    
          if (node instanceof nodes.SimpleSelector) {
            const selector = node.getText();
            console.log("SimpleSelector: ", selector);
            continue;
          }

          if (node instanceof nodes.Declaration) {
            // done
            const propertyName = node.getFullPropertyName();
            console.log(
              "propertyName: ",
              cssDataManager.getProperty(propertyName)
            );
            continue;
          }

          if (node instanceof nodes.UnknownAtRule) {
            const atRuleName = node.getText();
            const entry = cssDataManager.getAtDirective(atRuleName);
            console.log("atRuleName: ", entry);
            continue;
          }

          if (
            node instanceof nodes.Node &&
            node.type === nodes.NodeType.PseudoSelector
          ) {
            // done
            const selectorName = node.getText();
            const entry =
              selectorName.slice(0, 2) === "::"
                ? cssDataManager.getPseudoElement(selectorName)
                : cssDataManager.getPseudoClass(selectorName);
            console.log("selectorName: ", entry);
            continue;
          }
        }

        const hoverContent = new vscode.MarkdownString();
        hoverContent.appendCodeblock("```css\n" + word + "\n```");

        return new vscode.Hover(hoverContent, range);
      },
    })
  );

  context.subscriptions.push(...disposables);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
