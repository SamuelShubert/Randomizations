// =========================================================
// Entries tab: build a list, then let it pick one
// =========================================================

(function () {
    const form = document.getElementById("entryForm");
    const field = document.getElementById("entryField");
    const errorElement = document.getElementById("entryError");
    const list = document.getElementById("entryList");
    const emptyMessage = document.getElementById("entryEmpty");
    const footer = document.getElementById("entryFooter");
    const countElement = document.getElementById("entryCount");
    const clearButton = document.getElementById("clearEntriesButton");
    const pickButton = document.getElementById("pickEntryButton");
    const resultElement = document.getElementById("entryResult");
    const csvInput = document.getElementById("csvInput");
    const csvButton = document.getElementById("csvButton");
    const noteElement = document.getElementById("entryNote");

    const MAX_CSV_BYTES = 1024 * 1024; // 1 MB

    let entries = storage.get("entries.list", []);
    let picking = false;

    function save() {
        storage.set("entries.list", entries);
    }

    function render() {
        list.innerHTML = "";
        entries.forEach(function (entry, index) {
            const item = document.createElement("li");
            item.className = "entry";

            const text = document.createElement("span");
            text.textContent = entry;
            text.title = entry;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "×";
            removeButton.setAttribute("aria-label", "Remove " + entry);
            removeButton.addEventListener("click", function () {
                if (picking) {
                    return; // the list must not change mid-pick
                }
                entries.splice(index, 1);
                save();
                render();
            });

            item.append(text, removeButton);
            list.appendChild(item);
        });

        if (entries.length === 0) {
            emptyMessage.textContent = "No entries yet. Add at least two to pick from.";
        } else if (entries.length === 1) {
            emptyMessage.textContent = "Add one more entry to start picking.";
        } else {
            emptyMessage.textContent = "";
        }

        footer.hidden = entries.length === 0;
        countElement.textContent = entries.length === 1 ? "1 entry" : entries.length + " entries";
        pickButton.disabled = entries.length < 2 || picking;
    }

    function isOnList(value) {
        return entries.some(function (entry) {
            return entry.toLowerCase() === value.toLowerCase();
        });
    }

    function clearMessages() {
        errorElement.textContent = "";
        noteElement.textContent = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearMessages();
        const value = field.value.trim();

        if (value === "") {
            errorElement.textContent = "Type something to add.";
            return;
        }

        if (isOnList(value)) {
            errorElement.textContent = value + " is already on the list.";
            return;
        }

        entries.push(value);
        save();
        render();
        field.value = "";
        field.focus();
    });

    field.addEventListener("input", clearMessages);

    // ---------- CSV upload ----------

    // Splits CSV text into cell values. Handles commas or semicolons
    // (Excel in Belgium uses semicolons) and "quoted, cells".
    function parseCsv(text) {
        const cells = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (inQuotes) {
                if (char === '"' && text[i + 1] === '"') {
                    current += '"'; // "" inside quotes is one quote
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else if (char === '"') {
                inQuotes = true;
            } else if (char === "," || char === ";" || char === "\n" || char === "\r") {
                cells.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        cells.push(current);

        return cells
            .map(function (cell) { return cell.trim(); })
            .filter(function (cell) { return cell !== ""; });
    }

    csvButton.addEventListener("click", function () {
        if (!picking) {
            csvInput.click();
        }
    });

    csvInput.addEventListener("change", function () {
        const file = csvInput.files[0];
        csvInput.value = ""; // lets you upload the same file again
        clearMessages();

        if (!file) {
            return;
        }
        if (file.size > MAX_CSV_BYTES) {
            errorElement.textContent = file.name + " is too big. Use a CSV file under 1 MB.";
            return;
        }

        file.text().then(function (text) {
            const cells = parseCsv(text.replace(/^﻿/, "")); // drop Excel's hidden start mark
            let added = 0;
            let skipped = 0;

            cells.forEach(function (cell) {
                if (isOnList(cell)) {
                    skipped++;
                } else {
                    entries.push(cell);
                    added++;
                }
            });

            if (added === 0 && skipped === 0) {
                errorElement.textContent = file.name + " has no entries in it.";
                return;
            }

            save();
            render();
            let note = "Added " + added + (added === 1 ? " entry" : " entries") + " from " + file.name;
            if (skipped > 0) {
                note += ", skipped " + skipped + (skipped === 1 ? " duplicate" : " duplicates");
            }
            noteElement.textContent = note + ".";
        }).catch(function () {
            errorElement.textContent = file.name + " could not be read. Save it as a CSV file and try again.";
        });
    });

    clearButton.addEventListener("click", function () {
        if (confirm("Remove all " + entries.length + " entries?")) {
            entries = [];
            save();
            render();
            resultElement.textContent = "The picked entry appears here";
            resultElement.classList.add("is-empty");
        }
    });

    function highlight(index) {
        list.querySelectorAll(".entry").forEach(function (item, i) {
            item.classList.toggle("is-picked", i === index);
        });
    }

    function finish(index) {
        highlight(index);
        showResult(resultElement, entries[index]);
        picking = false;
        render();
        highlight(index);
    }

    pickButton.addEventListener("click", function () {
        if (entries.length < 2 || picking) {
            return;
        }

        const winner = randomInt(0, entries.length - 1);

        if (prefersReducedMotion) {
            finish(winner);
            return;
        }

        // Run the highlight through the list a few times, then land on the winner
        picking = true;
        pickButton.disabled = true;
        let ticks = 0;
        const timer = setInterval(function () {
            ticks++;
            if (ticks >= 10) {
                clearInterval(timer);
                finish(winner);
            } else {
                highlight(randomInt(0, entries.length - 1));
            }
        }, 70);
    });

    render();
})();
