import { NonProfessor, RequestProfessorMessage, RequestProfessorResponse } from "./models";

type MessageHandler = (message: RequestProfessorMessage) => Promise<RequestProfessorResponse>;

export const runContentScript = (messageHandler: MessageHandler) => {
    // select iframe that displays class info
    const iframe = document.querySelector('iframe').contentWindow.document;

    // css to add space between prof name and rating
    const style = document.createElement('style');
    style.innerHTML = `
        .rating {
            margin-top: 7px;
        }`;
    iframe.head.appendChild(style);

    // if viewing in schedule
    populateProfessors(iframe, "DERIVED_CLS_DTL_SSR_INSTR_LONG$", messageHandler);
    // if viewing in course selector
    populateProfessors(iframe, "MTG_INSTR$", messageHandler);
}

export const populateProfessors = async (parent: Document, id: String, messageHandler: MessageHandler) => {
    // cache professors 
    const professorMap = new Map<string, RequestProfessorResponse>();

    let count = 0;
    let currElement = parent.getElementById(id + count.toString());
    while (currElement != null) {
        const professorName = currElement.textContent;
        if (!Object.values(NonProfessor).includes(professorName)) {
            await handleProfessorInfo(professorName, currElement, professorMap, messageHandler);
        }
        count++;
        currElement = parent.getElementById(id + count.toString());
    }
}

const handleProfessorInfo = async (professorName: string, element: HTMLElement, professorMap: Map<string, RequestProfessorResponse>, messageHandler: MessageHandler) => {
    if (professorMap.has(professorName)) {
        addProfessorRatingToPage(professorMap.get(element.textContent), element);
    } else {
        if (!/[a-zA-Z]/.test(professorName)) {
            return;
        }
        const message: RequestProfessorMessage = { professorName };
        const response = await messageHandler(message);
        addProfessorRatingToPage(response, element);
        professorMap.set(professorName, response);
    }
}

const addProfessorRatingToPage = (professorResponse: RequestProfessorResponse, element: HTMLElement) => {
    if (professorResponse.error) {
        insertError(element, professorResponse.error.errorMessage);
        return;
    }
    const professor = professorResponse.professor;
    if (!professor) {
        insertNoProfError(element);
        return;
    }

    if (professor.wouldTakeAgainPercent === -1) {
        insertNoRatingsError(element, professor.legacyId);
        return;
    }
    insertNumRatings(element, professor.numRatings, professor.legacyId);
    insertWouldTakeAgainPercent(element, professor.wouldTakeAgainPercent);
    insertAvgDifficulty(element, professor.avgDifficulty);
    insertRating(element, professor.avgRating);
}

function insertRating(link: HTMLElement, avgRating: string) {
    link.insertAdjacentHTML(
        "afterend",
        `<div class="rating"><b>Rating:</b> ${avgRating}/5</div>`
    );
}

function insertAvgDifficulty(link: HTMLElement, avgDifficulty: string) {
    link.insertAdjacentHTML(
        "afterend",
        `<div><b>Difficulty:</b> ${avgDifficulty}/5</div>`
    );
}

function insertWouldTakeAgainPercent(link: HTMLElement, wouldTakeAgainPercent: number) {
    link.insertAdjacentHTML(
        "afterend",
        `<div class="rating"><b>${Math.round(wouldTakeAgainPercent)}%</b> of students would take this professor again.</div>`
    );
}

function insertNumRatings(link: HTMLElement, numRatings: number, legacyId: string) {
    const profLink = `<a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>${numRatings} ratings</a>`;
    link.insertAdjacentHTML("afterend", `<div>${profLink}</div>`);
}

function insertNoRatingsError(link: HTMLElement, legacyId: string) {
    link.insertAdjacentHTML(
        "afterend",
        `<div class="rating"><b>Error:</b> this professor has <a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>no ratings on RateMyProfessors.</a></div>`
    );
}

function insertNoProfError(link: HTMLElement) {
    link.insertAdjacentHTML(
        "afterend",
        `<div class="rating"><b>Error:</b> this professor is not registered on RateMyProfessors.</div>`
    );
}

function insertError(link: HTMLElement, error: string) {
    link.insertAdjacentHTML(
        "afterend",
        `<div class="rating"><b>Error:</b> ${error}</div>`
    );
}