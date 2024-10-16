import { Professor } from "../models";

export const populateProfessors = (parent: Document, id: String) => {
    // TODO: cache professors to avoid multiple requests
    let count = 0;
  
    let currElement = parent.getElementById(id + count.toString());
    while (currElement != null) {
      if (currElement.textContent != 'Staff') {
        handleProfessorInfo(currElement, currElement.textContent);
      }
      count++;
      currElement = parent.getElementById(id + count.toString());
    }
  }

export const handleProfessorInfo = (element: Element, name: string) => {
    if (!/[a-zA-Z]/.test(name)) {
        return;
    }

    const port = chrome.runtime.connect({ name: "professor-rating" });
    port.postMessage({ professorName: name });
    port.onMessage.addListener((professor: Professor) => {
        if (professor.wouldTakeAgainPercent === -1) {
            insertNoRatingsError(element, professor.legacyId);
        }
        insertNumRatings(element, professor.numRatings, professor.legacyId);
        insertWouldTakeAgainPercent(element, professor.wouldTakeAgainPercent);
        insertAvgDifficulty(element, professor.avgDifficulty);
        insertRating(element, professor.avgRating);
    });
}

function insertRating(link, avgRating) {
    link.insertAdjacentHTML(
      "afterend",
      `<div class="rating"><b>Rating:</b> ${avgRating}/5</div>`
    );
}

function insertAvgDifficulty(link, avgDifficulty) {
    link.insertAdjacentHTML(
      "afterend",
      `<div><b>Difficulty:</b> ${avgDifficulty}/5</div>`
    );
}

function insertWouldTakeAgainPercent(link, wouldTakeAgainPercent) {
    link.insertAdjacentHTML(
      "afterend",
      `<div class="rating"><b>${wouldTakeAgainPercent}%</b> of students would take this professor again.</div>`
    );
}

function insertNumRatings(link, numRatings, legacyId) {
    const profLink = `<a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>${numRatings} ratings</a>`;
    link.insertAdjacentHTML("afterend", `<div>${profLink}</div>`);
}

function insertNoRatingsError(link, legacyId) {
    link.insertAdjacentHTML(
      "afterend",
      `<div class="rating"><b>Error:</b> this professor has <a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>no ratings on RateMyProfessors.</a></div>`
    );
}
  
function insertNoProfError(link) {
    link.insertAdjacentHTML(
      "afterend",
      `<div class="rating"><b>Error:</b> this professor is not registered on RateMyProfessors.</div>`
    );
}