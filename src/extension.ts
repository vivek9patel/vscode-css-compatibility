import * as vscode from "vscode";
import provideHoverCSS from "./hoverProvider";

const supportedCSSFileTypes = ["css", "scss", "less", "sass"];

function activate(context: vscode.ExtensionContext) {
  let disposables: vscode.Disposable[] = [];

  supportedCSSFileTypes.forEach((fileType) => {
    disposables.push(
      vscode.languages.registerHoverProvider(fileType, {
        provideHover: async function(
          document: vscode.TextDocument,
          position: vscode.Position,
          token: vscode.CancellationToken
        ) {
          return provideHoverCSS(document, position, token, context, fileType);
        }
      })
    );
  });
  

  context.subscriptions.push(...disposables);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
