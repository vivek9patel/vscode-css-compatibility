const vscode = require("vscode");
const path = require("path");
const CanICode = require("./src/CanICode");

function activate(context) {
  let disposables = [];
  const canicode = new CanICode();

  function provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);
    const fileType = document.languageId;

    const data = canicode.getCompatibilityData(word, fileType);
    if (!data.table) return null;
    const hoverContent = new vscode.MarkdownString();
    hoverContent.appendCodeblock(word, fileType);
    hoverContent.appendMarkdown(data.table);

    hoverContent.supportHtml = true;
    hoverContent.isTrusted = true;
    hoverContent.baseUri = vscode.Uri.file(
      path.join(context.extensionPath, "images", path.sep)
    );

    return new vscode.Hover(hoverContent, range);
  }

  disposables.push(
    vscode.languages.registerHoverProvider("javascript", {
      provideHover,
    })
  );

  disposables.push(
    vscode.languages.registerHoverProvider("css", {
      provideHover,
    })
  );

  context.subscriptions.push(...disposables);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
