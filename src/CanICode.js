const AGENTS = require("../data/agents.json");
const bcd = require("@mdn/browser-compat-data");

class CanICode {
  constructor() {
    this.agents = AGENTS;
    this.supportedBrowserNames = {
      desktop: this.agents.desktop.map((browser) => browser.name),
      mobile: this.agents.mobile.map((browser) => browser.name),
    };
  }

  getCompatibilityData(word, fileType) {
    let result = {
      table: null,
      deprecated: false,
    };
    if (fileType === "css") {
      const wordInfo = this.findInCss(word);
      if (wordInfo && wordInfo.support) {
        result = {
          table: this.generateMarkdownTable(wordInfo),
          deprecated: wordInfo.status?.deprecated,
        };
      }
    }
    return result;
  }

  generateMarkdownTable(wordInfo) {
    const desktopRow = this.getMarkdownRow("desktop", wordInfo);
    const mobileRow = this.getMarkdownRow("mobile", wordInfo);

    return `<table>${desktopRow}${mobileRow}</table>`;
  }

  getMarkdownRow(deviceType, wordInfo) {
    const { support, status } = wordInfo;
    let browserNamesRow = "<tr>";
    this.supportedBrowserNames[deviceType].forEach((browser) => {
      browserNamesRow += `<td>${browser}</td>`;
    });
    browserNamesRow += "</tr>";

    let browserVersionsRow = "<tr>";
    let iconRow = "<tr>";

    this.agents[deviceType].forEach((browser) => {
      const icon = this.getIcon(support[browser.id]);
      const version = this.getVersionNumber(support[browser.id]);
      iconRow += `<td>${icon}</td>`;
      browserVersionsRow += `<td>${version}</td>`;
    });
    browserVersionsRow += "</tr>";
    iconRow += "</tr>";

    return `${browserNamesRow}${iconRow}${browserVersionsRow}`;
  }

  getVersionNumber(browserSupport) {
    return (
      browserSupport.version_added || browserSupport[0]?.version_added || ""
    );
  }

  getIcon(browserSupport) {
    const testImage = "<image width='14' src='test.svg'/>";
    const checkImage = "<image width='14' src='check.svg'/>";
    const crossImage = "<image width='14' src='cross.svg'/>";

    if (!browserSupport) return crossImage;

    const versionNumber = this.getVersionNumber(browserSupport);

    if (versionNumber) {
      if (versionNumber === "preview") {
        return testImage;
      } else {
        return checkImage;
      }
    }
    return crossImage;
  }

  findInCss(word) {
    if (bcd.css.selectors[word]) {
      return bcd.css.selectors[word].__compat;
    }

    if (bcd.css.properties[word]) {
      return bcd.css.properties[word].__compat;
    }

    if (bcd.css.types[word]) {
      return bcd.css.types[word].__compat;
    }
    // removing @ from the word
    const atRuleWord = word.substr(1);
    if (bcd.css["at-rules"][atRuleWord]) {
      return bcd.css["at-rules"][atRuleWord].__compat;
    }

    return {};
  }
}

module.exports = CanICode;
