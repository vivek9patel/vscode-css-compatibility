import * as vscode from "vscode";
import path from "path";
import CanICode from "./CanICode";

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
        if (result.table){
          const hoverContent = new vscode.MarkdownString();
          hoverContent.appendMarkdown(result.table);
          
          if(result.deprecated){
            hoverContent.appendMarkdown("Deprecated");
          }

          if(result.mdn_url){
            hoverContent.appendMarkdown(`</br><a href="${result.mdn_url}">Open MDN doc for '${word}'</a>`);
          }
      
          hoverContent.supportHtml = true;
          hoverContent.isTrusted = true;
          hoverContent.baseUri = vscode.Uri.file(
            path.join(context.extensionPath, "images", path.sep)
          );
      
          return new vscode.Hover(hoverContent, range);
        }
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
