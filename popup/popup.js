"use strict";

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
async function listenForClicks() {
    document.addEventListener("click", (e) => {
        /**
         * Given the name of a beast, get the URL to the corresponding image.
         */
        async function actionToScript(beastName) {
            switch (beastName) {
                // TODO: maybe implement your own css or take the class you need from bootstrap for buttons instead of injecting bootstrap css to the page
                case "Remove Courses":
                    browser.tabs.executeScript({ file: "./../content_scripts/courseRemover.js" }).catch(
                        reportError
                    );
                    return;
                case "Dark Mode":
                    darkModeSwitch().catch(e => console.log(e));
                    return;
                case "Enhance Page":
                    // TODO: implement
                    return;
                case "Reset":
                    // TODO: implement
                    const tabs = await browser.tabs.query({
                        currentWindow: true,
                        active: true
                    }).catch(onError);
                    sendMessageToTabs(tabs, { "reset": "true" });
                    alert("Please refresh your browser tab to apply.");
                    return;
            }
        }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Something went wrong: ${error}`);
        }

        /**
         * Get the active tab,
         * then call "beastify()" or "reset()" as appropriate.
         */
        if (e.target.classList.contains("btn")) {
            console.log("what?");
            actionToScript(e.target.textContent);
        }
    });
}

function sendMessageToTabs(tabs, data) {
    /**
     * Send Message to the content-script
     */
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id,
            data
        ).then(response => {
            window.darkMode = ((response.DarkMode) !== "Off");
        }).catch(onError);
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}

async function darkModeSwitch() {
    if (window.darkMode) {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        }).catch(onError);
        sendMessageToTabs(tabs, { "DarkMode": "Off" });
    } else {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            active: true
        }).catch(onError);
        sendMessageToTabs(tabs, { "DarkMode": "On" });
    }
}


async function loader() {
    listenForClicks();
    const tabs = await browser.tabs.query({
        currentWindow: true,
        active: true
    }).catch(onError);
    sendMessageToTabs(tabs, {});
}

loader();
