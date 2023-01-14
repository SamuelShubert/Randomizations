function randomAlphabet() {
    var randomAl = parseInt(Math.random() * 26 + 65);
    var output = String.fromCharCode(randomAl);
    document.getElementById("alphabetsResults").innerHTML = output;
}