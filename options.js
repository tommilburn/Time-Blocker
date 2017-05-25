
document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    var blocklistBox = document.getElementById("blocklist");
    var saveButton = document.getElementById("saveButton");
    var activeToggle = document.getElementById("activeToggle");

    //when saving the sites the user has entered, use JSON object in local storage and filter empty lines
    saveButton.addEventListener('click', function () {
        console.log(blocklistBox.value);
        var blocklist = blocklistBox.value;
        blocklist = blocklist.split('\n');
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
        blocklistBox.value = JSON.parse(localStorage.blocklist).join('\n');
    } else {
        blocklistBox.value = "";
        localStorage.blocklist = "[]";
    }
});

function checkUrlAgainstBlocklist(tab) {
    'use strict';
    console.log(tab.url.indexOf("reddit.com"));
    if (tab.url.indexOf("reddit.com") !== -1) {
        chrome.tabs.update(tab.id, {url: "http://google.com"});
    }
}

function getTabs() {
    'use strict';
    var blocklist = localStorage.blocklist.split('\n');
    blocklist = blocklist.filter(Boolean);
    console.log(blocklist);
    chrome.tabs.query({}, function (tabs) {
        var i;
        for (i = 0; i < tabs.length; i += 1) {
            checkUrlAgainstBlocklist(tabs[i]);
        }
    });
}