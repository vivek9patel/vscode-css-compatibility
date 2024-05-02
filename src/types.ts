import {
  BrowserType,
  CompatStatement,
  BrowserName,
  Browsers,
  SimpleSupportStatement,
  VersionValue,

} from "@mdn/browser-compat-data/types";

export type Theme = "dark" | "light";
export type ClientType = Exclude<BrowserType, "xr" | "server">;

export type DesktopBrowser = "chrome" | "firefox" | "opera" | "safari" | "edge" | "ie" | "oculus";
export type MobileBrowser = "chrome_android" | "firefox_android" | "opera_android" | "safari_ios" | "samsunginternet_android" | "webview_android";

export type Agents = {
  [key in ClientType]: Agent[];
};

export type Agent = {
  id: BrowserName;
  long_name: string;
  name: string;
  icon: string;
};

export type CompatibilityData = {
  table: string | null;
  status: CompatStatement["status"];
  mdn_url: CompatStatement["mdn_url"];
  notes: string[];
  description: CompatStatement["description"];
};

export interface Data {
  data: IdentifierExtended;
  query: string;
  browsers: Browsers;
}
export interface SimpleSupportStatementExtended extends SimpleSupportStatement {
  release_date?: string;
  version_last?: VersionValue;
}
export interface CompatStatementExtended extends CompatStatement {
  support: Partial<Record<BrowserName, SimpleSupportStatementExtended[]>>;
}
export interface IdentifierExtended {
  [key: string]: IdentifierExtended | CompatStatementExtended;
}

export type EnabledBrowser = {
  desktop: Record<DesktopBrowser, boolean>;
  mobile: Record<MobileBrowser, boolean>;
}