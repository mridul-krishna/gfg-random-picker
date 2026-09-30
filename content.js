console.log("GFG Random Picker loaded");
let ignoreSolved = false;

function getProblemRows() {
    return [...document.querySelectorAll('[class*="problemRow"]')]
        .filter(row =>
            row.offsetWidth ||
            row.offsetHeight ||
            row.getClientRects().length
        );
}

function getProblemName(row) {
    return row
        .querySelector('[class*="problemNameText"]')
        ?.innerText
        .trim();
}

function getUniqueProblems(ignoreSolved = false) {
    const rows = getProblemRows();

    const problems = [];
    const seen = new Set();

    for (const row of rows) {

        if (
            ignoreSolved &&
            row.querySelector('[class*="problemStatusSolved"]')
        ) {
            continue;
        }

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

async function loadAllQuestions() {
    const loadButton = document.getElementById("gfg-load-all-button");

    if (loadButton) {
        loadButton.disabled = true;
        loadButton.textContent = "Loading...";
    }

    let clicks = 0;

    // Give GFG time to finish rendering the problem sections.
    await new Promise(resolve => setTimeout(resolve, 1000));

    while (true) {
        const loadMoreButtons = [...document.querySelectorAll('[class*="diffBlock"] button')]
            .filter(btn =>
                btn.innerText.trim() === "Load More" &&
                (btn.offsetWidth ||
                 btn.offsetHeight ||
                 btn.getClientRects().length)
            );

        if (loadMoreButtons.length === 0) {
            break;
        }

        const button = loadMoreButtons[0];

        console.log("Clicking Load More:", clicks + 1);

        button.click();
        clicks++;

        // Give GFG time to render the new questions.
        await new Promise(resolve => setTimeout(resolve, 700));
    }

    const count = getUniqueProblems().length;
    // const count = getUniqueProblems(ignoreSolved).length;

    console.log(`Finished loading. Clicks: ${clicks}`);
    console.log(`Total questions: ${count}`);

    if (loadButton) {
        loadButton.disabled = false;
        loadButton.textContent = `All Loaded (${count})`;
    }

    updatePickerButton();

    return count;
}

function updatePickerButton() {
    const button = document.getElementById("gfg-random-picker-button");
    
    if (!button) {
        return;
    }
    
    const count = getUniqueProblems(ignoreSolved).length;    
    
    button.textContent = `Random · ${count}`;
}



function addPickerButton() {
    const filterRight = [...document.querySelectorAll('[class*="hFilterRight"]')]
    .find(el =>
        el.offsetWidth ||
        el.offsetHeight ||
            el.getClientRects().length
        );
        
        if (!filterRight) {
            return;
        }
        
        if (document.getElementById("gfg-random-picker-button")) {
            return;
        }

        const button = document.createElement("button");
        
        button.id = "gfg-random-picker-button";
        
        const count = getUniqueProblems().length;
        button.textContent = `Random · ${count}`;
        
        button.style.cssText = `
        padding: 7px 12px;
        margin-left: 8px;
        border: 1px solid #2f8d46;
        border-radius: 5px;
        background: transparent;
        color: #2f8d46;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        `;

    button.addEventListener("click", () => {
        const problems = getUniqueProblems(ignoreSolved);
        
        if (problems.length === 0) {
            button.textContent = "No questions found";
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * problems.length);
        const selected = problems[randomIndex];
        
        console.log("Selected:", selected.name);
        
        selected.row.click();
    });

    filterRight.appendChild(button);

// Load All button
const loadButton = document.createElement("button");

loadButton.id = "gfg-load-all-button";
loadButton.textContent = "Load All";

loadButton.style.cssText = `
    padding: 7px 13px;
    margin-left: 6px;
    border: 1px solid #777;
    border-radius: 6px;
    background: #f5f5f5;
    color: #333;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
`;

loadButton.addEventListener("click", () => {
    loadAllQuestions();
});

filterRight.appendChild(loadButton);

console.log("GFG Random Picker buttons added");

setTimeout(updatePickerButton, 1000);
}

addPickerButton();


document.addEventListener("click", (event) => {
    const filterElement = event.target.closest(
        '[class*="hFilter"], [class*="diffBlock"], [class*="topicBlock"]'
    );

    if (!filterElement) {
        return;
    }

    setTimeout(() => {
        updatePickerButton();
    }, 500);
});

chrome.storage.local.get(
    {
        showLoadAll: true,
        ignoreSolved: false
    },
    (settings) => {

        ignoreSolved = settings.ignoreSolved;

        const loadButton =
            document.getElementById("gfg-load-all-button");

        if (loadButton) {
            loadButton.style.display =
                settings.showLoadAll ? "" : "none";
        }

        updatePickerButton();
    }
);


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
        const problems = getUniqueProblems(ignoreSolved);

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

    if (message.type === "SET_SHOW_LOAD_ALL") {
        const loadButton = document.getElementById("gfg-load-all-button");
        
        if (loadButton) {
            loadButton.style.display = message.show ? "" : "none";
        }
        
        return true;
    }
    
    if (message.type === "SET_IGNORE_SOLVED") {
    ignoreSolved = message.ignore;

    updatePickerButton();

    return true;
}

});