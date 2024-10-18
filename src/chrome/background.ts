import { RequestProfessorMessage } from "../common/models";
import { getProfessorFromRmp } from "../common/background";

// https://developer.chrome.com/docs/extensions/reference/api/declarativeContent
// use declarative content api to ensure action is only active on on the course selection portal
// TODO: explore css selectors to activate extension once data is loaded

// rule that enables action when on course selection portal
const rule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.uocampus.uottawa.ca', pathPrefix: '/psp/' }
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};
chrome.runtime.onInstalled.addListener(details => {
    // disable by default
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([rule])
    });
});

// Listen for extension click
chrome.action.onClicked.addListener(tab => {
    // disable action when clicked
    chrome.action.disable(tab.id);
    // re-enable action after 5 seconds
    setTimeout(() => {
        chrome.action.enable(tab.id);
    }, 5000);

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