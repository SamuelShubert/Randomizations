// =========================================================
// Numbers tab
// =========================================================

(function () {
    const form = document.getElementById("numbersForm");
    const fromField = document.getElementById("fromField");
    const toField = document.getElementById("toField");
    const errorElement = document.getElementById("numbersError");
    const resultElement = document.getElementById("numberResult");

    let decimals = storage.get("numbers.decimals", 0);
    fromField.value = storage.get("numbers.from", 1);
    toField.value = storage.get("numbers.to", 10);

    setupSegmented(document.getElementById("decimalsButtons"), decimals, function (value) {
        decimals = Number(value);
        storage.set("numbers.decimals", decimals);
        clearResult(resultElement); // the old result has the wrong number of decimals
    });

    function pickNumber() {
        errorElement.textContent = "";
        let from = parseFloat(fromField.value);
        let to = parseFloat(toField.value);

        if (isNaN(from) || isNaN(to)) {
            errorElement.textContent = "Fill in both From and To.";
            return;
        }

        // Swap the fields themselves, so you can see the range that is used.
        // Done here and not while typing, so a half-typed range is left alone.
        if (from > to) {
            const temp = from;
            from = to;
            to = temp;
            fromField.value = from;
            toField.value = to;
        }

        storage.set("numbers.from", from);
        storage.set("numbers.to", to);

        // Work in whole steps (1, 0.01 or 0.0001) so every possible result
        // between From and To has the same chance, and both ends are included.
        const scale = Math.pow(10, decimals);
        const min = Math.ceil(from * scale - 1e-9);
        const max = Math.floor(to * scale + 1e-9);

        if (min > max) {
            errorElement.textContent = "There is no whole number between " + from + " and " + to + ". Widen the range or allow decimals.";
            return;
        }

        const picked = randomInt(min, max) / scale;
        showResult(resultElement, picked.toFixed(decimals));
    }

    // Changing the range makes the old result out of date
    form.addEventListener("input", function () {
        errorElement.textContent = "";
        clearResult(resultElement);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        pickNumber();
    });
})();
