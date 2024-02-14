import AGENTS from "./data/agents";
import bcdPath from "./data/bcdPath";
import { getBCDDataForPath } from "@mdn/bcd-utils-api";
import {
  BrowserName,
  CompatStatement,
  SupportBlock,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import {
  Agents,
  BlockedClientName,
  ClientName,
  ClientType,
  CompatibilityData,
  Data,
} from "./types";
import {
  checkImage,
  crossImage,
  testImage,
  aestricImage,
  browserIcons,
  desktopImage,
  mobileImage,
} from "./Icons";

export default class CanICode {
  private agents: Agents;
  private unsupportedBrowsers: BlockedClientName[] = [
    "ie",
    "deno",
    "nodejs",
    "oculus",
  ];

  constructor() {
    this.agents = AGENTS;
  }

  public getCompatibilityData(
    word: string,
    line: string,
    fileType: string
  ): CompatibilityData {
    let result: CompatibilityData = {
      table: null,
      deprecated: false,
      mdn_url: undefined,
      notes: [],
      description: undefined,
    };

    if (fileType === "css") {
      const wordInfo = this.findInCss(word, line);
      if (wordInfo) {
        const comapt = wordInfo.data.__compat as CompatStatement;
        if (comapt) {
          result = {
            table: this.generateHTMLTable(comapt),
            notes: this.getAllNotes(comapt.support),
            deprecated: comapt.status?.deprecated,
            mdn_url: comapt?.mdn_url,
            description: comapt.description,
          };
        }
      }
    }
    return result;
  }

  private generateHTMLTable(comapt: CompatStatement): string {
    const rows = this.getTableRow(comapt);

    const browserTypesRow = `<tr>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th align="center" colspan="${this.agents["desktop"].length}" title="desktop">
                                <span>${desktopImage}</span>
                              </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th> | </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th align="center" colspan="${this.agents["mobile"].length}" title="mobile">
                                <span>${mobileImage}</span>
                              </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>`;
    return `<table><thead>${browserTypesRow}</thead><tbody>${rows}</tbody></table>`;
  }

  private getTableRow(wordInfo: CompatStatement) {
    const { support } = wordInfo;

    const browserIconsRow = this.getBrowserIconRow();

    let browserVersionsRow = "<tr><td align='center'> | </td>";
    let statusIconRow = "<tr><td align='center'> | </td>";

    this.agents["desktop"].forEach((browser) => {
      const icon: string = this.getIcon(support[browser.id]);
      const versionNumber: string = this.getVersionNumber(support[browser.id]);
      const isNotes: boolean =
        this.getVersionNotes(support[browser.id]).length > 0;
      statusIconRow += `<td align="center">${icon}</td><td align='center'> | </td>`;
      browserVersionsRow += `<td align="center">${versionNumber} ${
        isNotes ? aestricImage : ""
      }</td><td align='center'> | </td>`;
    });
    // statusIconRow += "<th> | </th>";
    // browserVersionsRow += "<th> | </th>";
    this.agents["mobile"].forEach((browser) => {
      const icon: string = this.getIcon(support[browser.id]);
      const versionNumber: string = this.getVersionNumber(support[browser.id]);
      const isNotes: boolean =
        this.getVersionNotes(support[browser.id]).length > 0;
      statusIconRow += `<td align="center">${icon}</td><td align='center'> | </td>`;
      browserVersionsRow += `<td align="center">${versionNumber} ${
        isNotes ? aestricImage : ""
      }</td><td align='center'> | </td>`;
    });
    statusIconRow += "</tr>";
    browserVersionsRow += "</tr>";

    return `${browserIconsRow}${statusIconRow}${browserVersionsRow}`;
  }

  private getBrowserIconRow(): string {
    let iconsRow = "<tr><td align='center'> | </td>";
    this.agents["desktop"].forEach((browser) => {
      iconsRow += `<td align="center">
                  <span>${browserIcons[browser.id]}</span>
              </td><td align='center'> | </td>`;
    });
    // iconsRow += "<th> | </th>";
    this.agents["mobile"].forEach((browser) => {
      iconsRow += `<td align="center">
                  <span>${browserIcons[browser.id]}</span>
              </td><td align='center'> | </td>`;
    });
    iconsRow += "</tr>";
    return iconsRow;
  }

  private getVersionNumber(
    browserSupport: SupportStatement | undefined
  ): string {
    if (browserSupport === undefined) return "";
    let versionNumber: VersionValue = "";
    if (Array.isArray(browserSupport)) {
      versionNumber = browserSupport[0]?.version_added;
    } else versionNumber = browserSupport.version_added;
    if (typeof versionNumber === "boolean") {
      if (versionNumber) return "";
      else return "No";
    }
    return versionNumber || "";
  }

  private getVersionNotes(
    browserSupport: SupportStatement | undefined
  ): string {
    if (browserSupport === undefined) return "";
    let notes: string | string[] = "";
    if (Array.isArray(browserSupport)) {
      notes = browserSupport[0]?.notes || "";
    } else notes = browserSupport.notes || "";
    if (typeof notes === "string") {
      return notes;
    }
    return notes.join("\n\n");
  }

  private getAllNotes(support: SupportBlock): string[] {
    const notes = new Set<string>();
    Object.keys(support).forEach((browser) => {
      const browserSupport: SupportStatement | undefined =
        support[browser as ClientName];
      const browserNotes: string = this.getVersionNotes(browserSupport);
      if (browserNotes.length > 0) {
        notes.add(browserNotes);
      }
    });
    return Array.from(notes);
  }

  private getIcon(browserSupport: SupportStatement | undefined) {
    if (!browserSupport) return crossImage;

    const versionNumber = this.getVersionNumber(browserSupport);
    if (versionNumber === "No") return crossImage;
    if (versionNumber === "preview") {
      return testImage;
    } else {
      return checkImage;
    }
  }

  findSymbol(word: string): Data | void {
    const path = bcdPath[word];
    if (Array.isArray(path)) {
      // TODO: return multiple bcd data
      return undefined;
    }
    return getBCDDataForPath(path);
  }

  private findInCss(word: string, line: string): Data | void {
    const symbols = line.split(";");

    for (let i = 0; i < symbols.length; i++) {
      const cssLine = symbols[i].split(":");
      const parent = cssLine[0].trim();
      const child = (cssLine[1] || "").trim();
      if (parent === word) {
        return this.findSymbol(parent);
      }
    }

    return this.findSymbol(word);
  }
}
