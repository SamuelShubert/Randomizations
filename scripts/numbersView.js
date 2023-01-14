var NumberType = 0;

function randomNumber() {
    var fromTxtFldNoValue = document.getElementById("fromTxtFld").value;
    var toTxtFldNoValue = document.getElementById("toTxtFld").value;

    var from = parseInt(fromTxtFldNoValue, 10);
    var to = parseInt(toTxtFldNoValue, 10);

    if (from > to) {
        fromTxtFldNoValue = to;
        toTxtFldNoValue = from;
        from = parseInt(fromTxtFldNoValue, 10);
        to = parseInt(toTxtFldNoValue, 10);
    }

    var random = Math.random();


    var randomNo = random * (to + 1 - from) + from;


    switch (NumberType) {
        case 0:
            randomNo = parseInt(randomNo, 10);
            document.getElementById("otherResults").innerHTML = randomNo;
            break;
        case 1:
            randomNo = randomNo.toFixed(2);
            document.getElementById("otherResults").innerHTML = randomNo;
            break;
        case 2:
            randomNo = randomNo.toFixed(4);
            document.getElementById("otherResults").innerHTML = randomNo;
            break;
    }
}


function SetNumberType(mulitplier) {
    NumberType = mulitplier;
    var value = mulitplier * 33.3;
    document.getElementById("NumberSetTypeSelected").style.left = value + "%";
    document.getElementById("AllResults").innerHTML = "";
}