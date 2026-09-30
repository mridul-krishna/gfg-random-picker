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
    
    const count = getUniqueProblems().length;
    
    button.textContent = `🎲 Pick Random (${count})`;
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
        button.textContent = `🎲 Pick Random (${count})`;
        
        button.style.cssText = `
        padding: 8px 14px;
        margin-left: 8px;
        border: 1px solid #2f80ed;
        border-radius: 6px;
        background: white;
        color: #2f80ed;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        `;

    button.addEventListener("click", () => {
        const problems = getUniqueProblems();
        
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
    padding: 8px 14px;
    margin-left: 8px;
    border: 1px solid #777;
    border-radius: 6px;
    background: white;
    color: #444;
    font-size: 14px;
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

chrome.storage.local.get(
    { showLoadAll: true },
    (settings) => {
        const loadButton = document.getElementById("gfg-load-all-button");

        if (loadButton) {
            loadButton.style.display =
                settings.showLoadAll ? "" : "none";
        }
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

    if (message.type === "SET_SHOW_LOAD_ALL") {
        const loadButton = document.getElementById("gfg-load-all-button");
        
        if (loadButton) {
            loadButton.style.display = message.show ? "" : "none";
        }
        
        return true;
    }
});