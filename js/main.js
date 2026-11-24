// =========================================================
// Shared helpers used by every tab
// =========================================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Random whole number from min to max, both included
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Remembers settings between visits. Storage can be blocked
// (private windows, strict browsers), so failures are ignored.
const storage = {
    get(key, fallback) {
        try {
            const value = localStorage.getItem("randomizations." + key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem("randomizations." + key, JSON.stringify(value));
        } catch (error) {
            // Not saved; the page still works
        }
    }
};

// Shows a result with a short pop so you can see it changed
function showResult(element, text) {
    element.textContent = text;
    element.classList.remove("is-empty", "pop");
    void element.offsetWidth; // restart the animation
    element.classList.add("pop");
}

// Puts a result back to its starting text, e.g. "Your number appears here"
function clearResult(element) {
    element.textContent = element.dataset.placeholder;
    element.classList.add("is-empty");
    element.classList.remove("pop");
}

// True when a real result is showing (not the starting text)
function hasResult(element) {
    return !element.classList.contains("is-empty");
}

// Remember each result's starting text so clearResult can bring it back
document.querySelectorAll(".result").forEach(function (element) {
    element.dataset.placeholder = element.textContent;
});

// Wires up a row of toggle buttons (like One / Two / Three)
function setupSegmented(group, initialValue, onChange) {
    const buttons = group.querySelectorAll("button");

    function select(value) {
        buttons.forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.dataset.value === String(value)));
        });
    }

    select(initialValue);
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            select(button.dataset.value);
            onChange(button.dataset.value);
        });
    });
}

// =========================================================
// Tabs: the part after # in the address picks the tab,
// so tabs can be linked, survive a refresh and work with Back
// =========================================================

const VIEW_TITLES = {
    home: "Randomizations",
    dice: "Dice - Randomizations",
    numbers: "Numbers - Randomizations",
    letters: "Letters - Randomizations",
    entries: "Entries - Randomizations"
};

function showView() {
    let name = location.hash.slice(1);
    if (!VIEW_TITLES[name]) {
        name = "home";
    }

    document.querySelectorAll(".view").forEach(function (view) {
        view.hidden = view.dataset.view !== name;
    });

    document.querySelectorAll(".tab").forEach(function (tab) {
        if (tab.dataset.view === name) {
            tab.setAttribute("aria-current", "page");
        } else {
            tab.removeAttribute("aria-current");
        }
    });

    document.title = VIEW_TITLES[name];
}

window.addEventListener("hashchange", showView);
showView();

// =========================================================
// Space runs the main action of the open tab
// =========================================================

document.addEventListener("keydown", function (event) {
    if (event.code !== "Space" || event.repeat) {
        return;
    }

    // Leave Space alone when typing or when it already presses something
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") {
        return;
    }

    const openView = document.querySelector(".view:not([hidden])");
    const primary = openView ? openView.querySelector("[data-primary]") : null;
    if (primary && !primary.disabled) {
        event.preventDefault();
        primary.click();
    }
});
