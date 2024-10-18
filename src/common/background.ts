import { Professor, RequestProfessorResponse, SearchProfessor } from "./models";
import { getProfessor, searchProfessors } from "./ratemyprof/api";

// initial search, if no results, try modified search
const attemptInitialSearch = async (name: string): Promise<SearchProfessor[]> => {
    const professors = await searchProfessors(name);
    return professors;

}

// modified search, try to search with only first and last name
const attemptModifiedSearch = async (name: string): Promise<SearchProfessor[]> => {
    const names = name.split(" ");
    if (names.length < 2) {
        return null;
    }
    const modifiedName = `${names[0]} ${names[names.length - 1]}`;
    const professors = await searchProfessors(modifiedName);
    return professors;
}

const getProfFromSearch = async (profName, searchResults: SearchProfessor[]): Promise<Professor> => {
    // if there is one result, use it
    if (searchResults.length == 1) {
        const prof = await getProfessor(searchResults[0].id);
        return prof;
    }

    // if there are multiple results, compare the names, return the one with more rankings
    const names = profName.split(" ");
    const [profFirstName, profLastName] = [names[0], names[names.length - 1]];
    // check that first and last name are an exact match
    const filteredSearchResults = searchResults.filter(({ firstName, lastName }) => profFirstName === firstName && profLastName === lastName);
    // if no results (sometimes names can be misspelled), return the first result from the original query
    if (filteredSearchResults.length == 0) {
        const prof = await getProfessor(searchResults[0].id);
        return prof
    }
    // return the result with most ratings
    let maxRatings = -1;
    let maxProf = null;
    for (const prof of searchResults) {
        const profData = await getProfessor(prof.id);
        if (profData.numRatings > maxRatings) {
            maxRatings = profData.numRatings;
            maxProf = profData;
        }
    }
    return maxProf;
}

export const getProfessorFromRmp = async (name: string): Promise<RequestProfessorResponse> => {
    try {
        const normalizedName = name.normalize("NFKD");
        const initialProfSearch = await attemptInitialSearch(normalizedName);
        if (initialProfSearch.length > 0) {
            const prof = await getProfFromSearch(normalizedName, initialProfSearch);
            return {
                professor: prof,
                error: null
            }
        }
        const modifiedSearchProfId = await attemptModifiedSearch(normalizedName);
        if (modifiedSearchProfId) {
            const prof = await getProfFromSearch(normalizedName, modifiedSearchProfId);
            return {
                professor: prof,
                error: null
            }
        }
        return {
            professor: null,
            error: {
                errorMessage: "Professor not found"
            }
        }
    } catch (e) {
        return {
            professor: null,
            error: {
                errorMessage: "Network error: " + e.message
            }
        }
    }
}