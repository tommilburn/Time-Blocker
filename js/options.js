/*global chrome*/

function activatePauseTimer(pauseTimeLength) {
    'use strict';
    console.log('pauseTime');
    if (localStorage.active && localStorage.pauseEndTime === "0") {
        localStorage.active = false;
        var currentTime = Date.now();
        var pauseEndTime = currentTime + pauseTimeLength * 60 * 1000;
        localStorage.pauseEndTime = pauseEndTime;
        console.log(currentTime);
        console.log("pausing:" + pauseTimeLength);
        setTimeout(function () {
            localStorage.active = true;
            console.log("done pausing");
            localStorage.pauseEndTime = 0;
        }, pauseTimeLength * 60 * 1000);
    }
}

function blockUrl(tabId) {
    'use strict';
    chrome.tabs.update(tabId, {url: "blocked.html"});
}

function checkUrlAgainstBlocklist(blocklist, tab) {
    'use strict';
    var i;
    for (i = 0; i < blocklist.length; i += 1) {
        if (tab.url.indexOf(blocklist[i]) !== -1 && tab.url.indexOf(chrome.extension.getURL("")) === -1) { //don't let users lock themselves out of the extension
            blockUrl(tab.id);
            return;
        }
    }
}

function checkTabs(blocklist) {
    'use strict';
    if (localStorage.active === "true") {
        chrome.tabs.query({}, function (tabs) {
            var i;
            for (i = 0; i < tabs.length; i += 1) {
                checkUrlAgainstBlocklist(blocklist, tabs[i]);
            }
        });
    }

}

document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    var blocklist;
    var blocklistBox = document.getElementById("blocklist");
    var saveButton = document.getElementById("saveButton");
    var activeToggle = document.getElementById("activeToggle");
    var pauseTime = document.getElementById("pauseTime");
    var pauseButton = document.getElementById("pauseButton");

    pauseTime.value = localStorage.pauseTime || 5;
    if (localStorage.active === "true") {
        activeToggle.checked = true;
    }
    activeToggle.checked = (localStorage.active === "true");

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

    //handle pause button pressed
    pauseButton.addEventListener('click', function () {
        activatePauseTimer(parseInt(pauseTime.value));
    });
    chrome.tabs.onUpdated.addListener(function () {
        checkTabs(blocklist);
    });

});