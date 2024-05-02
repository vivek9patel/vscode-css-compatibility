import { EnabledBrowser } from "../types";

const DEFAULT_USER_CONFIG: EnabledBrowser = {
    desktop: {
        chrome: true,
        firefox: true,
        opera: true,
        safari: true,
        edge: true,
        ie: true,
        oculus: true,
    },
    mobile: {
        chrome_android: true,
        firefox_android: true,
        opera_android: true,
        safari_ios: true,
        samsunginternet_android: true,
        webview_android: true,
    },
};

export default DEFAULT_USER_CONFIG;
