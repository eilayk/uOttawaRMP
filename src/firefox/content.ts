import { runContentScript } from "../common/content";

runContentScript(browser.runtime.sendMessage);