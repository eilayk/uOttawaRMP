import { Professor, ProfessorQueryResponse, SearchProfessor, SearchProfessorQueryResponse } from "../models";

// need to use a CORS proxy to access the RateMyProfessors API
const URL = 'https://www.ratemyprofessors.com/graphql';
const AUTH_TOKEN = 'dGVzdDp0ZXN0';

const buildFetchRequest = (body: String) => {
    return fetch(URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${AUTH_TOKEN}`
        },
        body: JSON.stringify(body)
    })
}

const searchProfessors = async (name: string, schoolId: string): Promise<SearchProfessor[]> => {
   const response = await buildFetchRequest(buildSearchProfessorQuery(name, schoolId));
   if (!response.ok) {
       throw new Error('Failed to fetch professors');
   }
   const data: SearchProfessorQueryResponse = await response.json();
   return data.newSearch.teachers.edges.map((teacher) => teacher.node);
}

const getProfessor = async (profId: string): Promise<Professor> => {
    const response = await buildFetchRequest(buildGetProfessorQuery(profId));
    if (!response.ok) {
        throw new Error('Failed to fetch professor');
    }
    const data: ProfessorQueryResponse = await response.json();
    return data.node;
}