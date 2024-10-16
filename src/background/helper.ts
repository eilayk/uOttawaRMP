import { ErrorResponse, Professor, RequestProfessorResponse } from "../models";
import { getProfessor, searchProfessors } from "../ratemyprof/api";

type ProfId = string;

// initial search, if no results, try modified search
const attemptInitialSearch  = async (name: string): Promise<ProfId | null> => {
    const professors = await searchProfessors(name);
    if (professors.length === 0) {
        return null;
    }
    return professors[0].id;

}

// modified search, try to search with only first and last name
const attemptModifiedSearch = async (name: string): Promise<ProfId | null> => {
    const names = name.split(" ");
    if (names.length < 2) {
        return null;
    }
    const modifiedName = `${names[0]} ${names[names.length - 1]}`;
    const professors = await searchProfessors(modifiedName);
    if (professors.length === 0) {
        return null;
    }
    return professors[0].id;
}

export const getProfessorFromRmp = async (name: string): Promise<RequestProfessorResponse> => {
    try {
        const normalizedName = name.normalize("NFKD");
        const initialSearchProfId = await attemptInitialSearch(normalizedName);
        if (initialSearchProfId) {
            const prof = await getProfessor(initialSearchProfId);
            return {
                professor: prof,
                error: null
            }
        }
        const modifiedSearchProfId = await attemptModifiedSearch(normalizedName);
        if (modifiedSearchProfId) {
            const prof = await getProfessor(modifiedSearchProfId);
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