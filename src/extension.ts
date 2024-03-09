import * as vscode from "vscode";
import path from "path";
import CanICode from "./CanICode";
import { aestricImage, deleteImage, testImage, warnImage } from "./Icons";

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

        const offset = document.offsetAt(position);
        const canICode = new CanICode();

        const result = canICode.getCompatibilityData(document.getText(), word, offset, "css");

        const hoverContent = new vscode.MarkdownString();

        let isAnyFlag = false;
        if(result.status?.deprecated === true){
          hoverContent.appendMarkdown(`<table><tr><td valign="center">${deleteImage}</td><td valign="center"> <strong>Deprecated:</strong> This feature is no longer recommended. </td></tr></table>`);
          isAnyFlag = true;
        }

        if(result.status?.experimental === true){
          hoverContent.appendMarkdown(`<table><tr><td valign="center">${testImage}</td><td valign="center"> <strong>Experimental:</strong> This is an <a href="https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Experimental_deprecated_obsolete#experimental">experimental technology</a>. Check the Browser compatibility table carefully before using this in production. </td></tr></table>`);
          isAnyFlag = true;
        }

        if(result.status?.standard_track === false){
          hoverContent.appendMarkdown(`<table><tr><td valign="center">${warnImage}</td><td valign="center"> <strong>Non-standard:</strong> This feature is non-standard and is not on a standards track. </td></tr></table>`);
          isAnyFlag = true;
        }

        if (result.table){
          if(isAnyFlag){
            hoverContent.appendMarkdown("<hr>");
          }
          hoverContent.appendMarkdown(result.table);
        }

        if(result.notes.length > 0){
          hoverContent.appendMarkdown(`<table><tr><td valign="center">${aestricImage}</td><td valign="center">Documentation contains some notes of usage.</td></tr></table>`);
        }

        if(result.mdn_url){
          hoverContent.appendMarkdown(`<a href="${result.mdn_url}">See MDN documentaion for ${result.description ? result.description : `<strong><code>${word}</code></strong>`}</a>`);
        }
        else if(result.description){
          hoverContent.appendMarkdown(`<strong><code>${result.description}</strong></code>`);
        }
    
        hoverContent.supportHtml = true;
        hoverContent.isTrusted = true;
        hoverContent.baseUri = vscode.Uri.file(
          path.join(context.extensionPath, "images", path.sep)
        );
    
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
