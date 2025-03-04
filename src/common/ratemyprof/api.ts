import { Professor, ProfessorQueryResponse, SearchProfessor, SearchProfessorQueryResponse } from "../models";
import { buildGetProfessorQuery, buildSearchProfessorQuery } from "./queries";

const URL = 'https://www.ratemyprofessors.com/graphql';

// need to use a CORS proxy to access the RateMyProfessors API
const PROXIED_URL = `${process.env.CORS_PROXY || ''}${URL}`;
const AUTH_TOKEN = 'dGVzdDp0ZXN0';
const SCHOOL_ID = 'U2Nob29sLTE0NTI=';

const buildFetchRequest = (body: string) => {
    return fetch(PROXIED_URL, {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${AUTH_TOKEN}`
        },
        body: body
    })
}

export const searchProfessors = async (name: string): Promise<SearchProfessor[]> => {
    const response = await buildFetchRequest(buildSearchProfessorQuery(name, SCHOOL_ID));
    if (!response.ok) {
        throw new Error('Fetching from RateMyProf failed');
    }
    const json: SearchProfessorQueryResponse = await response.json();
    return json.data.newSearch.teachers.edges.map((teacher) => teacher.node);
}

export const getProfessor = async (profId: string): Promise<Professor> => {
    const response = await buildFetchRequest(buildGetProfessorQuery(profId));
    if (!response.ok) {
        throw new Error('Fetching from RateMyProf failed');
    }
    const json: ProfessorQueryResponse = await response.json();
    return json.data.node;
}