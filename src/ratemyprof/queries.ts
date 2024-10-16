const searchProfessorQuery = 
    `query NewSearchTeachersQuery($text: String!, $schoolID: ID!) {
        newSearch {
            teachers(query: {text: $text, schoolID: $schoolID}) {
                edges {
                    cursor
                    node {
                        id
                        firstName
                        lastName
                        school {
                            name
                            id
                        }
                    }   
                }
            }
        }
    }`;

const getProfessorQuery =
    `query TeacherRatingsPageQuery($id: ID!) {
        node(id: $id) {
            ... on Teacher {
                id
                firstName
                lastName
                school {
                  name
                  id
                  city
                  state
                }
                avgDifficulty
                avgRating
                department
                numRatings
                legacyId
                wouldTakeAgainPercent
            }
          id
        }
    }`

export const buildSearchProfessorQuery = (name: string, schoolId: string) => JSON.stringify({ 
    query: searchProfessorQuery, 
    variables: { 
        text: name, 
        schoolID: schoolId 
    } 
});

export const buildGetProfessorQuery = (profId: string) => JSON.stringify({
    query: getProfessorQuery,
    variables: {
        id: profId
    }
});

