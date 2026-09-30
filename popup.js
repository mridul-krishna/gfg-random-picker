const status = document.getElementById("status");
const randomButton = document.getElementById("randomButton");

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