// =========================================================
// CSS dice: building, rolling, and the Dice and Home tabs
// =========================================================

// Which of the 9 grid slots (0-8, left to right, top to bottom) has a pip
const PIPS = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
};

// How far to turn the cube [x, y] so that face points at you
const FACE_ROTATION = {
    1: [0, 0],
    2: [-90, 0],
    3: [0, -90],
    4: [0, 90],
    5: [90, 0],
    6: [0, 180]
};

const ROLL_MS = 1200;

function makeFace(value) {
    const face = document.createElement("div");
    face.className = "face f" + value;
    PIPS[value].forEach(function (slot) {
        const pip = document.createElement("span");
        pip.className = "pip";
        pip.style.gridRow = Math.floor(slot / 3) + 1;
        pip.style.gridColumn = (slot % 3) + 1;
        face.appendChild(pip);
    });
    return face;
}

// Creates one 3D die showing `value`
function createDie(value) {
    const die = {
        value: value,
        x: FACE_ROTATION[value][0],
        y: FACE_ROTATION[value][1],
        element: document.createElement("div"),
        cube: document.createElement("div")
    };

    die.element.className = "scene";
    die.cube.className = "cube";
    for (let face = 1; face <= 6; face++) {
        die.cube.appendChild(makeFace(face));
    }
    die.cube.style.transform = cubeTransform(die);
    die.element.appendChild(die.cube);

    die.element.setAttribute("role", "img");
    die.element.setAttribute("aria-label", "Die showing " + value);
    return die;
}

function cubeTransform(die) {
    return "rotateX(" + die.x + "deg) rotateY(" + die.y + "deg)";
}

// Turn forward at least `turns` full spins and stop on `target`
function spinTo(current, target, turns) {
    const start = current + turns * 360;
    const offset = (((target - start) % 360) + 360) % 360;
    return start + offset;
}

// Rolls a die to a new random value. Returns how long the animation takes (ms).
function rollDie(die) {
    die.value = randomInt(1, 6);
    const rotation = FACE_ROTATION[die.value];
    die.x = spinTo(die.x, rotation[0], randomInt(1, 2));
    die.y = spinTo(die.y, rotation[1], randomInt(1, 2));
    die.cube.style.transform = cubeTransform(die);
    return prefersReducedMotion ? 0 : ROLL_MS;
}

// =========================================================
// Dice tab
// =========================================================

(function () {
    const diceContainer = document.getElementById("dice");
    const announcement = document.getElementById("diceAnnouncement");
    const rollButton = document.getElementById("rollButton");

    let count = storage.get("dice.count", 1);
    let dice = [];

    function render() {
        const oldValues = dice.map(function (die) { return die.value; });
        diceContainer.innerHTML = "";
        dice = [];
        for (let i = 0; i < count; i++) {
            const die = createDie(oldValues[i] || 1);
            dice.push(die);
            diceContainer.appendChild(die.element);
        }
    }

    function roll() {
        rollButton.disabled = true;
        let duration = 0;
        dice.forEach(function (die) {
            duration = rollDie(die);
        });

        setTimeout(function () {
            const values = dice.map(function (die) { return die.value; });
            dice.forEach(function (die) {
                die.element.setAttribute("aria-label", "Die showing " + die.value);
            });
            // Not shown on screen, only read out by screen readers
            announcement.textContent = "Rolled " + values.join(" and ");
            rollButton.disabled = false;
        }, duration);
    }

    setupSegmented(document.getElementById("diceCountButtons"), count, function (value) {
        count = Number(value);
        storage.set("dice.count", count);
        render();
    });

    rollButton.addEventListener("click", roll);
    render();
})();

// =========================================================
// Home tab: one big die you can tap
// =========================================================

(function () {
    const button = document.getElementById("homeDie");
    const die = createDie(randomInt(1, 6));
    button.appendChild(die.element);

    button.addEventListener("click", function () {
        button.disabled = true;
        const duration = rollDie(die);
        setTimeout(function () {
            die.element.setAttribute("aria-label", "Die showing " + die.value);
            button.setAttribute("aria-label", "Roll the die. It shows " + die.value);
            button.disabled = false;
        }, duration);
    });
})();
