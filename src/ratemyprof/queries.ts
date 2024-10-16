const buildSearchProfessorQuery = (name: string, schoolId: string) => 
    `query NewSearchTeachersQuery($text: String!, $schoolID: ID!) {
        newSearch {
            teachers(query: {text: ${name}, schoolID: ${schoolId}}) {
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
    }`

const buildGetProfessorQuery = (profId: string) => 
    `query TeacherRatingsPageQuery($id: ID!) {
        node(id: ${profId}) {
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