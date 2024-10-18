import { RequestProfessorMessage } from "../common/models";
import { getProfessorFromRmp } from "../common/background";

browser.runtime.onInstalled.addListener(() => {
    // disable by default
    browser.action.disable();
});

// use browser.webNavigation to enable action when on course selection portal
browser.webNavigation.onDOMContentLoaded.addListener(
    evt => {
        // filter out child frames (i.e. iframes)
        if (evt.frameId !== 0) {
            return;
        }
        browser.action.enable(evt.tabId);
    },
    {
        url: [
            { hostEquals: 'www.uocampus.uottawa.ca', pathPrefix: '/psp/' }
        ]
    }

);

// Listen for extension click
browser.action.onClicked.addListener(tab => {
    // disable action when clicked
    browser.action.disable(tab.id);
    // re-enable action after 5 seconds
    setTimeout(() => {
        browser.action.enable(tab.id);
    }, 5000);

    // execute content script
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    })
})

// Listen for message from content script
browser.runtime.onMessage.addListener((message: RequestProfessorMessage, sender, sendResponse) => {
    getProfessorFromRmp(message.professorName).then(professor => {
        sendResponse(professor);
    });
    return true;
});