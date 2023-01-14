var diceImages = new Array()
var noOfDice = 1;

function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
        diceImages[i] = new Image()
        diceImages[i].src = preload.arguments[i]
    }
}
preload(
    "assets/dice-rolls/dice-1.gif",
    "assets/dice-rolls/dice-2.gif",
    "assets/dice-rolls/dice-3.gif",
    "assets/dice-rolls/dice-4.gif",
    "assets/dice-rolls/dice-5.gif",
    "assets/dice-rolls/dice-6.gif"
)

function rollDice() {
    var i, randomRoll;

    for (i = 1; i <= noOfDice; i++) {
        document.getElementById("Dice" + i).style.display = "inline";
    }
    for (i = 1; i <= noOfDice; i++) {
        randomRoll = Math.trunc(Math.random() * 6);
        document.getElementById("Dice" + i).src = diceImages[randomRoll].src;
    }
}

function DiceSet(mulitplier) {
    var value = mulitplier * 50;
    noOfDice = mulitplier + 1;
    document.getElementsByClassName("SetNoOfDiceDiv")[0].style["background-position"] = value + "%";
    var i;
    for (i = 1; i <= 3; i++) {
        document.getElementById("Dice" + i).style.display = "none";
    }
}