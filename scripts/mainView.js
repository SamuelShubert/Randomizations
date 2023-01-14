let currentTabButton;
let currentSubSettings;

function changeView(SelectedButton, SubSettingsID) {
    if (currentTabButton != undefined) {
        currentTabButton.classList.remove("tabButtonSelected");
        currentTabButton.classList.add("tabButtonHover");
        currentTabButton.disabled = false;

        currentSubSettings.style.display = "none";

        document.getElementById("alphabetsResults").textContent = "";
    }
    currentTabButton = document.getElementById(SelectedButton.id);
    currentTabButton.classList.add("tabButtonSelected");
    currentTabButton.classList.remove("tabButtonHover");
    currentTabButton.disabled = true;

    currentSubSettings = document.getElementById(SubSettingsID);
    currentSubSettings.style.display = "flex";

    document.getElementById("otherResults").textContent = SubSettingsID == "HomeSubSettings" ? "Randomizations" : "";
    document.getElementById("DiceResults").style.display = SubSettingsID == "DiceSubSettings" ? "block" : "none";



    switch (SubSettingsID) {
        case "HomeSubSettings":
            document.getElementById("otherResults").textContent = "Randomizations";
            break;
        case "DiceSubSettings":
            document.getElementById("DiceResults").style.display = "block";
            break;

        case "AlphabetsSubSettings":
            break;
        default:
            document.getElementById("DiceResults").style.display = "none";
    }

}

function runFirst() {
    changeView(document.getElementById("HomeTab"), "HomeSubSettings");
}