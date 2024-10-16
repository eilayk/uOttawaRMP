export type SearchProfessorQueryResponse = {
    data: {
        newSearch: {
            teachers: {
                edges: {
                    cursor: string;
                    node: SearchProfessor;
                }[];
            };
        }
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
    data: {
        node: Professor;
    }
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

export type RequestProfessorResponse = {
    professor: Professor | null;
    error: ErrorResponse | null;
}

export type ErrorResponse = {
    errorMessage: string;
}

export enum NonProfessor {
    "To be Announced",
    "Staff"
}