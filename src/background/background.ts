import { RequestProfessorMessage } from "../models";
import { getProfessorFromRmp } from "./helper";

// https://developer.chrome.com/docs/extensions/reference/api/declarativeContent
// use declarative content api to ensure action is only active on on the course selection portal
// TODO: explore css selectors to activate extension once data is loaded
const rule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.uocampus.uottawa.ca', pathPrefix: '/psp/' }
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};
chrome.runtime.onInstalled.addListener(details => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([rule])
    });
});

// Listen for extension click
chrome.action.onClicked.addListener(tab => {
    // check that tab.url is the course selection portal
    if (!tab.url.includes('www.uocampus.uottawa.ca/psp/')) {
        return;
    }

    // execute content script
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    })
})

// Listen for message from content script
chrome.runtime.onMessage.addListener((message: RequestProfessorMessage, sender, sendResponse) => {
    getProfessorFromRmp(message.professorName).then(professor => {
        sendResponse(professor);
    });
    return true;
});