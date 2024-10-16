export type SearchProfessorQueryResponse = {
    newSearch: {
        teachers: {
            edges: {
                cursor: string;
                node: SearchProfessor;
            }[];
        };
    }
}

export type SearchProfessor = {
    id: string;
    firstName: string;
    lastName: string;
    school: {
        name: string;
        id: string;
    };
}

export type ProfessorQueryResponse = {
    node: Professor;
}

export type Professor = {
    id: string;
    firstName: string;
    lastName: string;
    school: {
      name: string;
      id: string;
      city: string;
      state: string;
    };
    avgDifficulty: string;
    avgRating: string;
    department: string;
    numRatings: string;
    legacyId: string;
    wouldTakeAgainPercent: number;
}

export type RequestProfessorMessage = {
    professorName: string;
}

export type Error = {
    errorMessage: string;
}
