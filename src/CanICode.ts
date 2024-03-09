import AGENTS from "./data/agents";

import {
  CompatStatement,
  SupportBlock,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import {
  BlockedClientName,
  ClientName,
  CompatibilityData,
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
import findInCss from "./helpers/css";

export default class CanICode {
  private unsupportedBrowsers: BlockedClientName[] = [
    "ie",
    "deno",
    "nodejs",
    "oculus",
  ];

  public getCompatibilityData(
    code: string,
    word: string,
    offset: number,
    fileType: string
  ): CompatibilityData {
    let result: CompatibilityData = {
      table: null,
      status: {
        standard_track: true,
        experimental: false,
        deprecated: false,
      },
      mdn_url: undefined,
      notes: [],
      description: undefined,
    };

    if (fileType === "css") {
      const results = findInCss(code, word, offset);
      if (results && results.__compat) {
        result = {
          table: this.generateHTMLTable(results.__compat),
          notes: this.getAllNotes(results.__compat.support),
          status: results.__compat.status,
          mdn_url: results.__compat?.mdn_url,
          description: results.__compat.description,
        };
      }
    }
    return result;
  }

  private generateHTMLTable(comapt: CompatStatement): string {
    const rows = this.getTableRow(comapt);

    const browserTypesRow = `<tr></tr>
                              <tr>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th align="center" colspan="${AGENTS["desktop"].length}" title="desktop">
                                <span>${desktopImage}</span>
                              </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th> | </th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th align="center" colspan="${AGENTS["mobile"].length}" title="mobile">
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

    AGENTS["desktop"].forEach((browser) => {
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
    AGENTS["mobile"].forEach((browser) => {
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
    AGENTS["desktop"].forEach((browser) => {
      iconsRow += `<td align="center">
                  <span>${browserIcons[browser.id]}</span>
              </td><td align='center'> | </td>`;
    });
    // iconsRow += "<th> | </th>";
    AGENTS["mobile"].forEach((browser) => {
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
      if(this.unsupportedBrowsers.includes(browser as BlockedClientName)) return;
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
}
