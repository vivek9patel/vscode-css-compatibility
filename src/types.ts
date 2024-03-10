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
export type BlockedClientName = "ie" | "deno" | "nodejs" | "oculus";
export type ClientName = Exclude<BrowserName, BlockedClientName>;

export type Agents = {
  [key in ClientType]: Agent[];
};

export type Agent = {
  id: ClientName;
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
