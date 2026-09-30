const status = document.getElementById("status");
const randomButton = document.getElementById("randomButton");
const showLoadAll = document.getElementById("showLoadAll");

function sendMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs) => {

                const tab = tabs[0];

                if (!tab || !tab.id) {
                    reject("No active tab found.");
                    return;
                }

                chrome.tabs.sendMessage(
                    tab.id,
                    message,
                    (response) => {

                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError.message);
                            return;
                        }

                        resolve(response);
                    }
                );
            }
        );
    });
}


// Check how many problems are currently available
sendMessage({ type: "GET_PROBLEMS" })
    .then(response => {

        if (!response?.success) {
            status.textContent = "No GFG problems found.";
            return;
        }

        status.textContent =
            `${response.count} problems available`;
    })
    .catch(error => {
        status.textContent =
            "Open a GFG problem list first.";
        console.error(error);
    });


// Pick random question
randomButton.addEventListener("click", async () => {

    randomButton.disabled = true;
    status.textContent = "Picking...";

    try {

        const response = await sendMessage({
            type: "PICK_RANDOM"
        });

        if (!response?.success) {
            status.textContent =
                response?.message || "Something went wrong.";
            return;
        }

        status.textContent =
            `Opening: ${response.name}`;

    } catch (error) {

        console.error(error);

        status.textContent =
            "Open a GFG problem list first.";

    } finally {

        setTimeout(() => {
            randomButton.disabled = false;
        }, 1000);
    }
});

function updateLoadAllButton(show) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
            if (!tabs[0]?.id) return;

            chrome.tabs.sendMessage(tabs[0].id, {
                type: "SET_SHOW_LOAD_ALL",
                show
            });
        }
    );
}

function updateIgnoreSolved(ignore) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
            if (!tabs[0]?.id) return;

            chrome.tabs.sendMessage(tabs[0].id, {
                type: "SET_IGNORE_SOLVED",
                ignore
            });
        }
    );
}


chrome.storage.local.get(
    {
        showLoadAll: true,
        ignoreSolved: false
    },
    (settings) => {
        showLoadAll.checked = settings.showLoadAll;
        ignoreSolved.checked = settings.ignoreSolved;
    }
);

ignoreSolved.addEventListener("change", () => {
    chrome.storage.local.set({
        ignoreSolved: ignoreSolved.checked
    });

    updateIgnoreSolved(ignoreSolved.checked);
});

showLoadAll.addEventListener("change", () => {
    chrome.storage.local.set({
        showLoadAll: showLoadAll.checked
    });

    updateLoadAllButton(showLoadAll.checked);
});