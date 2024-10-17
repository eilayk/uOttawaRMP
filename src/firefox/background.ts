import { RequestProfessorMessage } from "../common/models";
import { getProfessorFromRmp } from "../common/background";

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