import AGENTS from "./data/agents";

import {
  CompatStatement,
  SupportBlock,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data/types";
import {
  CompatibilityData,
  Theme,
} from "./types";
import {
  checkImage,
  crossImage,
  testImage,
  aestricImage,
  browserIconsDark,
  desktopImage,
  desktopImageLight,
  mobileImage,
  mobileImageLight,
  browserIconsLight,
} from "./Icons";
import findInCss from "./helpers/css";
import { CssNode, parse } from "css-tree";
import { TextDocument } from "vscode";

export default class CanICode {
  private iconpack = browserIconsDark;
  private desktopIcon: string = desktopImage;
  private mobileIcon: string = mobileImage;
  private static _uri: string;
  private static _version: number;
  private parsedCSS: CssNode;
  private static _instance: CanICode;

  constructor(css: string) {
    this.parsedCSS = parse(css, { positions: true });
  }

  public static _getInstance(document: TextDocument): CanICode{
    const uri = document.uri.toString();
    const version = document.version;
    
    if(uri === CanICode._uri && version === CanICode._version){
      return CanICode._instance;
    }
    CanICode._uri = uri;
    CanICode._version = version;
    CanICode._instance = new CanICode(document.getText());
    return CanICode._instance;
  }

  public setTheme(theme: Theme) {
    this.desktopIcon = theme === "dark" ? desktopImage : desktopImageLight;
    this.mobileIcon = theme === "dark" ? mobileImage : mobileImageLight;
    if(theme === "light") this.iconpack = browserIconsLight;
  }

  public getCompatibilityData(
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

    if (fileType === "css" || fileType === "scss" || fileType === "less" || fileType === "sass") {
      const results = findInCss(this.parsedCSS, word, offset);
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
    const emptyDesktopHeaders = AGENTS["desktop"].map((browser) => `<th></th>`);
    const emptyMobileHeaders = AGENTS["mobile"].map((browser) => `<th></th>`);
    const browserTypesRow = `<tr></tr>
                              <tr>
                              ${
                                emptyDesktopHeaders.join("")
                              }
                              <th align="center" colspan="${AGENTS["desktop"].length}" title="desktop">
                                <span>${this.desktopIcon}</span>
                              </th>
                              ${
                                emptyDesktopHeaders.slice(0,-1).join("")
                              }
                              <th> | </th>
                              ${
                                emptyMobileHeaders.join("")
                              }
                              <th align="center" colspan="${AGENTS["mobile"].length}" title="mobile">
                                <span>${this.mobileIcon}</span>
                              </th>
                              ${
                                emptyMobileHeaders.join("")
                              }
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
                  <span>${this.iconpack[browser.id]}</span>
              </td><td align='center'> | </td>`;
    });
    // iconsRow += "<th> | </th>";
    AGENTS["mobile"].forEach((browser) => {
      iconsRow += `<td align="center">
                  <span>${this.iconpack[browser.id]}</span>
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
        support[browser as keyof SupportBlock];
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
