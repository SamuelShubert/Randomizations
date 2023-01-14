var entries = [];


function AddEntry() {
    var input = document.getElementById("EntriesTxtFld").value;
    if (input != "") {
        entries.push(input);
        var content = document.getElementById('entriesPara').textContent;
        if (entries.length == 1) {
            document.getElementById('entriesPara').textContent = input;
        } else {
            document.getElementById('entriesPara').textContent = content + ", " + input;
        }
    }
    document.getElementById("EntriesTxtFld").value = "";
}

function randomEntry() {
    if (entries.length < 2) {
        alert("Please add a few entries");
    } else {
        var random = Math.trunc(Math.random() * (entries.length));
        document.getElementById("AllResults").innerHTML = entries[random];
    }
}

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter') {
        event.preventDefault();
        AddEntry();
    }
});