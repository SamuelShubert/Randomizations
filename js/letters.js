// =========================================================
// Letters tab
// =========================================================

(function () {
    const fromSelect = document.getElementById("letterFrom");
    const toSelect = document.getElementById("letterTo");
    const rangeNote = document.getElementById("letterRangeNote");
    const button = document.getElementById("letterButton");
    const resultElement = document.getElementById("letterResult");

    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let letterCase = storage.get("letters.case", "upper");

    // Fill both dropdowns with A to Z
    [fromSelect, toSelect].forEach(function (select) {
        for (const letter of ALPHABET) {
            const option = document.createElement("option");
            option.value = letter;
            option.textContent = letter;
            select.appendChild(option);
        }
    });
    fromSelect.value = storage.get("letters.from", "A");
    toSelect.value = storage.get("letters.to", "Z");

    // From and To in alphabet order, whichever way round they were picked
    function currentRange() {
        const a = ALPHABET.indexOf(fromSelect.value);
        const b = ALPHABET.indexOf(toSelect.value);
        return [Math.min(a, b), Math.max(a, b)];
    }

    function updateRangeNote() {
        const range = currentRange();
        const size = range[1] - range[0] + 1;
        if (size === 26) {
            rangeNote.textContent = "Picks from the whole alphabet";
        } else if (size === 1) {
            rangeNote.textContent = "Only one letter in this range";
        } else {
            rangeNote.textContent = "Picks from " + size + " letters, " + ALPHABET[range[0]] + " to " + ALPHABET[range[1]];
        }
    }

    [fromSelect, toSelect].forEach(function (select) {
        select.addEventListener("change", function () {
            storage.set("letters.from", fromSelect.value);
            storage.set("letters.to", toSelect.value);
            updateRangeNote();
            clearResult(resultElement); // the old letter may be outside the new range
        });
    });

    setupSegmented(document.getElementById("letterCaseButtons"), letterCase, function (value) {
        letterCase = value;
        storage.set("letters.case", letterCase);
        // Switch the letter on screen too (no pop: it's the same letter)
        if (hasResult(resultElement)) {
            const letter = resultElement.textContent;
            resultElement.textContent = letterCase === "upper" ? letter.toUpperCase() : letter.toLowerCase();
        }
    });

    button.addEventListener("click", function () {
        const range = currentRange();
        const letter = ALPHABET[randomInt(range[0], range[1])];
        showResult(resultElement, letterCase === "upper" ? letter : letter.toLowerCase());
    });

    updateRangeNote();
})();
