import * as vscode from "vscode";
import path = require("path");
import CanICode from "./CanICode";

function activate(context: vscode.ExtensionContext) {
  let disposables = [];
  const canicode = new CanICode();

  disposables.push(
    vscode.languages.registerHoverProvider("css", {
      provideHover: async function provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
      ) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        const fileType = document.languageId;
        const line = document.lineAt(position.line).text;

        const { table, mdn_url, description, notes } =
          canicode.getCompatibilityData(word, line, fileType);

        if (!table) return null;

        const hoverContent = new vscode.MarkdownString();
        if (description) hoverContent.appendMarkdown(description);
        else hoverContent.appendCodeblock(word, fileType);
        hoverContent.appendMarkdown(table);
        notes.forEach((note) => {
          hoverContent.appendMarkdown(`${note}\n\n`);
        });
        if (mdn_url) {
          hoverContent.appendMarkdown(
            `<a href='https://developer.mozilla.org${mdn_url}'>See MDN documentation for '${word}'</a>`
          );
        }
        // hoverContent.appendMarkdown(
        //   "<img src='https://picsum.photos/200/300' height='200' />"
        // );

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
