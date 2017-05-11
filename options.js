console.log("test");

document.addEventListener("DOMContentLoaded", function(event){
	console.log("dom loaded");
	var blocklistBox = document.getElementById("blocklist");
	var saveButton = document.getElementById("saveButton");
	if(typeof(localStorage.blocklist) == 'string'){
		blocklistBox.value = localStorage.blocklist;
	}
	document.getElementsByClassName("saveButton")[0].onclick = function(event){
		var blocklistBox = document.getElementById("blocklist");
		localStorage.blocklist = blocklistBox.value
	};
});

