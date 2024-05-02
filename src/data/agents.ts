import { Agents } from "../types";

const AGENTS: Agents = {
  desktop: [
    { id: "chrome", long_name: "Google Chrome", name: "Chrome", icon: "c" },
    { id: "firefox", long_name: "Mozilla Firefox", name: "Firefox", icon: "f" },
    { id: "opera", long_name: "Opera", name: "Opera", icon: "o" },
    { id: "safari", long_name: "Safari", name: "Safari", icon: "s" },
    { id: "edge", long_name: "Microsoft Edge", name: "Edge", icon: "e" },
    { id: "ie", long_name: "Internet Explorer", name: "Internet Explorer", icon: "ie" },
    // { id: "deno" , long_name: "Deno", name: "Deno", icon: "d" },
    // { id: "nodejs", long_name: "Node.js", name: "Node.js", icon: "n" },
    { id: "oculus", long_name: "Oculus Browser", name: "Oculus", icon: "o"}
  ],
  mobile: [
    {
      id: "chrome_android",
      long_name: "Google Chrome for Android",
      name: "Chrome",
      icon: "c",
    },
    {
      id: "firefox_android",
      long_name: "Mozilla Firefox for Android",
      name: "Firefox",
      icon: "f",
    },
    {
      id: "opera_android",
      long_name: "Opera for Android",
      name: "Opera",
      icon: "o",
    },
    {
      id: "safari_ios",
      long_name: "Safari on iOS",
      name: "Safari",
      icon: "s",
    },
    {
      id: "samsunginternet_android",
      long_name: "Samsung Internet Browser",
      name: "Samsung Internet",
      icon: "s",
    },

    {
      id: "webview_android",
      long_name: "Android Browser / Webview",
      name: "Webview",
      icon: "w",
    },
  ],
};

export default AGENTS;
