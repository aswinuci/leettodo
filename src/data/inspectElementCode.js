function extractProblemData(company) {
    // Select all row elements
    const rows = document.querySelectorAll('div[role="row"]');

    const result = Array.from(rows).map(row => {
        // Extract the link and problem title
        const linkElement = row.querySelector('a[href*="/problems/"]');
        const link = linkElement ? linkElement.href : null;
        const title = linkElement ? linkElement.textContent.trim() : null;

        // Extract the difficulty
        const difficultyElement = row.querySelector('span.text-pink, span.dark\\:text-dark-pink, span.text-yellow, span.dark\\:text-dark-yellow, span.text-olive, span.dark\\:text-dark-olive');
        let difficulty = null;
        if (difficultyElement) {
            if (difficultyElement.classList.contains('text-pink') || difficultyElement.classList.contains('dark:text-dark-pink')) {
                difficulty = 'Hard';
            } else if (difficultyElement.classList.contains('text-yellow') || difficultyElement.classList.contains('dark:text-dark-yellow')) {
                difficulty = 'Medium';
            } else if (difficultyElement.classList.contains('text-olive') || difficultyElement.classList.contains('dark:text-dark-olive')) {
                difficulty = 'Easy';
            }
        }

        // Extract the frequency
        const frequencyElement = row.querySelector('.bg-brand-orange, .dark\\:bg-dark-brand-orange');
        const frequency = frequencyElement ? parseFloat(frequencyElement.style.width) : null;

        return { link, title, difficulty, frequency, company };
    }).filter(item => item.frequency >= 20);

    return result;
}


const company = "YourCompany";
const problemsData = extractProblemData(company);
console.log(problemsData);
