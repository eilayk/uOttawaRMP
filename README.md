# uOttawaRMP
Rate My Professors extension for the uOttawa course portal. Based on the [YorkURMP](https://github.com/mahfoozm/YorkURMP) extension. Renovated with Typescript.

This extension works on both the schedule page and course enrolment page.

Pulls data from the Rate My Professors GraphQL API (https://www.ratemyprofessors.com/graphql)

## Screenshots
The extension works as an action. To activate it, simply click the icon from your browser's extension menu. The action is only enabled on the uOttawa course portal.

The extension displays the professor's RMP rating, average difficulty, percentage of students that would take again, and the number of ratings with a hyperlink to the prof's RMP page.
![Extension demo](https://i.imgur.com/zcRRWK6.png)

## CORS
This extension requires a CORS proxy to function since RateMyProf does not return CORS headers. The packaged builds in the Releases page include a self-hosted proxy.

## Building Locally
1. Clone the repo
```bash
git clone https://github.com/eilayk/uOttawaRMP
```

2. Install dependencies
```bash
cd uOttawaRMP
npm install
```

3. Update CORS_PROXY environment variable (see .env.example file)
```bash
CORS_PROXY=<YOUR_CORS_PROXY>
```

4. Build
```bash
npm run build
```

5. Built bundles are in the dist folder