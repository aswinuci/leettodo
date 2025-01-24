const fs = require('fs');

// List of JSON files
const files = ['amazon.json', 'linkedin.json','apple.json', 'meta.json', 'microsoft.json', 'nvidia.json', 'google.json', 'salesforce.json'];

// Function to read and parse JSON files
function readJSONFile(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// Function to aggregate problem data
function aggregateProblems(files) {
    const problemMap = new Map();

    files.forEach(file => {
        const company = file.split('.')[0]; // Extract company name from file name
        const problems = readJSONFile(file);

        problems.forEach(problem => {
            const key = problem.link;

            if (!problemMap.has(key)) {
                problemMap.set(key, {
                    link: problem.link,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    frequency: 0,
                    companies: []
                });
            }

            const existingProblem = problemMap.get(key);
            existingProblem.frequency += problem.frequency;
            existingProblem.companies.push({ company: company, frequency: problem.frequency });
        });
    });

    return Array.from(problemMap.values());
}

// Function to sort problems
function sortProblems(problems) {
    return problems.sort((a, b) => {
        const companyCountDiff = b.companies.length - a.companies.length;
        if (companyCountDiff !== 0) return companyCountDiff;

        const frequencyDiff = b.frequency - a.frequency;
        if (frequencyDiff !== 0) return frequencyDiff;

        return 0;
    });
}

// Aggregate and sort problems
const aggregatedProblems = aggregateProblems(files);
const sortedProblems = sortProblems(aggregatedProblems);

// Write the sorted problems to data.json
fs.writeFileSync('data.json', JSON.stringify(sortedProblems, null, 2));

console.log('Data written to data.json');
