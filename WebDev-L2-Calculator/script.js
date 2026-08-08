const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "";
let previousValue = "";
let selectedOperator = null;
let shouldResetDisplay = false;


// Get operator symbol for display
function getOperatorSymbol(operator) {
    switch (operator) {
        case "+":
            return "+";
        case "-":
            return "−";
        case "*":
            return "×";
        case "/":
            return "÷";
        default:
            return "";
    }
}


// Update display
function updateDisplay() {
    currentDisplay.textContent = currentValue || "0";
}


// Enter numbers
function appendNumber(number) {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();

    // Show complete expression while typing
    if (previousValue && selectedOperator) {
        previousDisplay.textContent =
            `${previousValue} ${getOperatorSymbol(selectedOperator)} ${currentValue}`;
    }
}


// Enter decimal
function appendDecimal() {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (shouldResetDisplay) {
        currentValue = "0";
        shouldResetDisplay = false;
    }

    if (!currentValue.includes(".")) {
        currentValue = currentValue === "" ? "0." : currentValue + ".";
    }

    updateDisplay();

    if (previousValue && selectedOperator) {
        previousDisplay.textContent =
            `${previousValue} ${getOperatorSymbol(selectedOperator)} ${currentValue}`;
    }
}


// Select operator
function chooseOperator(operator) {
    if (currentValue === "" || currentValue === "Error") {
        return;
    }

    // If user already selected an operator and enters another one,
    // calculate the previous operation first.
    if (previousValue && selectedOperator && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    selectedOperator = operator;
    shouldResetDisplay = true;

    previousDisplay.textContent =
        `${previousValue} ${getOperatorSymbol(selectedOperator)}`;

    currentDisplay.textContent = previousValue;
}


// Calculate result
function calculate() {
    if (
        previousValue === "" ||
        currentValue === "" ||
        selectedOperator === null
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (selectedOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                selectedOperator = null;
                shouldResetDisplay = true;

                previousDisplay.textContent = "Cannot divide by zero";
                currentDisplay.textContent = "Error";

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    const expression =
        `${previousValue} ${getOperatorSymbol(selectedOperator)} ${currentValue} =`;

    if (Number.isFinite(result)) {
        currentValue = parseFloat(result.toFixed(10)).toString();
    } else {
        currentValue = "Error";
    }

    previousDisplay.textContent = expression;
    currentDisplay.textContent = currentValue;

    previousValue = "";
    selectedOperator = null;
    shouldResetDisplay = true;
}


// Clear calculator
function clearCalculator() {
    currentValue = "";
    previousValue = "";
    selectedOperator = null;
    shouldResetDisplay = false;

    previousDisplay.textContent = "";
    currentDisplay.textContent = "0";
}


// Backspace
function deleteLastCharacter() {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();

    if (previousValue && selectedOperator) {
        if (currentValue === "") {
            previousDisplay.textContent =
                `${previousValue} ${getOperatorSymbol(selectedOperator)}`;
        } else {
            previousDisplay.textContent =
                `${previousValue} ${getOperatorSymbol(selectedOperator)} ${currentValue}`;
        }
    }
}


// Number button listeners
numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});


// Operator button listeners
operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});


// Other button listeners
actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearCalculator();
                break;

            case "backspace":
                deleteLastCharacter();
                break;

            case "decimal":
                appendDecimal();
                break;

            case "equals":
                calculate();
                break;
        }
    });
});


// Initial display
updateDisplay();