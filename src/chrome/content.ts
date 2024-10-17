import { runContentScript } from "../common/content";

runContentScript(chrome.runtime.sendMessage);