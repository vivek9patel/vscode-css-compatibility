import { BrowserName } from "@mdn/browser-compat-data";

const ICON_SIZE = 16;

export const browserIconsDark: Record<BrowserName, string> = {
  chrome: `<img width=${ICON_SIZE} src='chrome.svg'/>`,
  chrome_android: `<img width=${ICON_SIZE} src='chrome.svg'/>`,
  edge: `<img width=${ICON_SIZE} src='edge.svg'/>`,
  firefox: `<img width=${ICON_SIZE} src='firefox.svg'/>`,
  firefox_android: `<img width=${ICON_SIZE} src='firefox.svg'/>`,
  opera: `<img width=${ICON_SIZE} src='opera.svg'/>`,
  opera_android: `<img width=${ICON_SIZE} src='opera.svg'/>`,
  safari: `<img width=${ICON_SIZE} src='safari.svg'/>`,
  safari_ios: `<img width=${ICON_SIZE} src='safari.svg'/>`,
  samsunginternet_android: `<img width=${ICON_SIZE} src='samsunginternet.svg'/>`,
  webview_android: `<img width=${ICON_SIZE} src='webview.svg'/>`,
  deno: `<img width=${ICON_SIZE} src='deno.svg'/>`,
  nodejs: `<img width=${ICON_SIZE} src='nodejs.svg'/>`,
  ie: `<img width=${ICON_SIZE} src='ie.svg'/>`,
  oculus: `<img width=${ICON_SIZE} src='oculus.svg'/>`,
};

export const browserIconsLight: Record<BrowserName, string> = {
  chrome: `<img width=${ICON_SIZE} src='chrome_light.svg'/>`,
  chrome_android: `<img width=${ICON_SIZE} src='chrome_light.svg'/>`,
  edge: `<img width=${ICON_SIZE} src='edge_light.svg'/>`,
  firefox: `<img width=${ICON_SIZE} src='firefox_light.svg'/>`,
  firefox_android: `<img width=${ICON_SIZE} src='firefox_light.svg'/>`,
  opera: `<img width=${ICON_SIZE} src='opera_light.svg'/>`,
  opera_android: `<img width=${ICON_SIZE} src='opera_light.svg'/>`,
  safari: `<img width=${ICON_SIZE} src='safari_light.svg'/>`,
  safari_ios: `<img width=${ICON_SIZE} src='safari_light.svg'/>`,
  samsunginternet_android: `<img width=${ICON_SIZE} src='samsunginternet_light.svg'/>`,
  webview_android: `<img width=${ICON_SIZE} src='webview_light.svg'/>`,
  deno: `<img width=${ICON_SIZE} src='deno_light.svg'/>`,
  nodejs: `<img width=${ICON_SIZE} src='nodejs_light.svg'/>`,
  ie: `<img width=${ICON_SIZE} src='ie_light.svg'/>`,
  oculus: `<img width=${ICON_SIZE} src='oculus_light.svg'/>`,
};

export const testImage = `<img width=${ICON_SIZE} src='test.svg'/>`;
export const checkImage = `<img width=${ICON_SIZE} src='check.svg'/>`;
export const crossImage = `<img width=${ICON_SIZE} src='cross.svg'/>`;
export const aestricImage = `<img width=${ICON_SIZE} src='aestrick.svg'/>`;
export const desktopImage = `<img height=${ICON_SIZE} src='desktop.svg'/>`;
export const mobileImage = `<img height=${ICON_SIZE} src='mobile.svg'/>`;
export const desktopImageLight = `<img height=${ICON_SIZE} src='desktop_light.svg'/>`;
export const mobileImageLight = `<img height=${ICON_SIZE} src='mobile_light.svg'/>`;
export const warnImage = `<img width=${ICON_SIZE} src='warning.svg'/>`;
export const deleteImage = `<img width=${ICON_SIZE} src='delete.svg'/>`;
