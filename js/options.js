/*global
chrome
*/
var blocklist;
document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    localStorage.active = false;
    var blocklistBox = document.getElementById("blocklist");
    var saveButton = document.getElementById("saveButton");
    var activeToggle = document.getElementById("activeToggle");

    //when saving the sites the user has entered, use JSON object in local storage and filter empty lines
    saveButton.addEventListener('click', function () {
        console.log(blocklistBox.value);
        blocklist = blocklistBox.value.split('\n');
        blocklist = blocklist.filter(Boolean);
        localStorage.blocklist = JSON.stringify(blocklist);
    });

    //store if blocking is enabled or not
    activeToggle.addEventListener('click', function () {
        localStorage.active = activeToggle.checked;
        console.log(activeToggle.checked);
    });

    //set up the block list text box
    if (Array.isArray(JSON.parse(localStorage.blocklist)) === true) {
        blocklist = JSON.parse(localStorage.blocklist);
        blocklistBox.value = blocklist.join('\n');
    } else {
        blocklistBox.value = "";
        localStorage.blocklist = "[]";
    }
});

function blockUrl(tabId) {
    'use strict';
    chrome.tabs.update(tabId, {url: "blocked.html"});
}



function checkUrlAgainstBlocklist(tab) {
    'use strict';
    var i;
    for (i = 0; i < blocklist.length; i += 1) {
        if (tab.url.indexOf(blocklist[i]) !== -1) {
            console.log("blockable: " + tab.url);
            blockUrl(tab.id);
        }
    }
}

function checkTabs() {
    'use strict';
    if (localStorage.active === "true") {
        chrome.tabs.query({}, function (tabs) {
            var i;
            for (i = 0; i < tabs.length; i += 1) {
                checkUrlAgainstBlocklist(tabs[i]);
            }
        });
    }

}

chrome.tabs.onUpdated.addListener(checkTabs);
