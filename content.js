console.log("GFG Random Picker loaded");

function getProblemRows() {
    return [...document.querySelectorAll('[class*="problemRow"]')];
}

function getProblemName(row) {
    return row
        .querySelector('[class*="problemNameText"]')
        ?.innerText
        .trim();
}

function getUniqueProblems() {
    const rows = getProblemRows();

    const problems = [];
    const seen = new Set();

    for (const row of rows) {
        const name = getProblemName(row);

        if (!name || seen.has(name)) {
            continue;
        }

        seen.add(name);

        problems.push({
            name,
            row
        });
    }

    return problems;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "GET_PROBLEMS") {
        const problems = getUniqueProblems();

        sendResponse({
            success: true,
            count: problems.length
        });

        return true;
    }

    if (message.type === "PICK_RANDOM") {
        const problems = getUniqueProblems();

        if (problems.length === 0) {
            sendResponse({
                success: false,
                message: "No GFG problems found on this page."
            });

            return true;
        }

        const randomIndex = Math.floor(Math.random() * problems.length);
        const selected = problems[randomIndex];

        console.log("Selected:", selected.name);

        selected.row.click();

        sendResponse({
            success: true,
            name: selected.name,
            count: problems.length
        });

        return true;
    }
});