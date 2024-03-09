import { ClientName } from "../types";

const ICON_SIZE = 20;

export const browserIcons: Record<ClientName, string> = {
  chrome: `<img height=${ICON_SIZE} src='chrome.svg'/>`,
  chrome_android: `<img height=${ICON_SIZE} src='chrome.svg'/>`,
  edge: `<img height=${ICON_SIZE} src='edge.svg'/>`,
  firefox: `<img height=${ICON_SIZE} src='firefox.svg'/>`,
  firefox_android: `<img height=${ICON_SIZE} src='firefox.svg'/>`,
  opera: `<img height=${ICON_SIZE} src='opera.svg'/>`,
  opera_android: `<img height=${ICON_SIZE} src='opera.svg'/>`,
  safari: `<img height=${ICON_SIZE} src='safari.svg'/>`,
  safari_ios: `<img height=${ICON_SIZE} src='safari.svg'/>`,
  samsunginternet_android: `<img height=${ICON_SIZE} src='samsunginternet.svg'/>`,
  webview_android: `<img height=${ICON_SIZE} src='webview.svg'/>`,
};

export const testImage = `<img width=${ICON_SIZE} src='test.svg'/>`;
export const checkImage = `<img width=${ICON_SIZE} src='check.svg'/>`;
export const crossImage = `<img width=${ICON_SIZE} src='cross.svg'/>`;
export const aestricImage = `<img width=${ICON_SIZE} src='aestrick.svg'/>`;
export const desktopImage = `<img height=${ICON_SIZE} src='desktop.svg'/>`;
export const mobileImage = `<img height=${ICON_SIZE} src='mobile.svg'/>`;
