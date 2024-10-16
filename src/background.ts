import { searchProfessors } from "./ratemyprof/api";

// Listen for extension click
chrome.action.onClicked.addListener(tab => {
    // execute content script
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
    })
})

// TODO: simplify this
const getProfessor = async (name: string) => {
    const normalizedName = name.normalize("NFKD");
    const professors = await searchProfessors(normalizedName);
    if (professors.length == 0) {
        const names = normalizedName.split(" ");
        if (names.length >= 2) {
            const modifiedName = `${names[0]} ${names[names.length - 1]}`;
            const modifiedProfessors = await searchProfessors(modifiedName);
      
            if (modifiedProfessors.length === 0) {
              return { error: "Professor not found" };
            }
      
            const professorID = modifiedProfessors[0].id;
            const professor = await getProfessor(professorID);
            return professor;
          }
    }
    const professorID = professors[0].id;
    const professor = await getProfessor(professorID);
    return professor;
}

// Listen for message from content script
chrome.runtime.onMessage.addListener(port => {
    port.onMessage.addListener(request => {
        getProfessor(request.professorName).then(professor => {
            port.postMessage(professor);
        }).catch(error => {
            // TODO: improve error handling
            console.log("error", error);
        });
    });
});