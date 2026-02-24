const buttons = document.querySelectorAll(".button");
const display = document.querySelector(".display");
const clearButton = document.querySelector(".button#clear");

//Event Listeners
buttons.forEach((button) => {
	button.addEventListener("click", handleClick);
});

document.addEventListener("keydown", (e) => {
	const value = keyMap[e.key] || e.key;
	handleClick(value);
});

//variables
let storedValue = ""; //contains first number
let currentInput = ""; //contains second number
let operand = ""; //operand

function handleClick(event) {
	let value = typeof event === "string" ? event : event.target.textContent; // The value of the button

	switch (true) {
		case isNumber(value):
			//prevent from entering just zero
			if (value === "0" && currentInput === "0") {
				currentInput = "";
				break;
			}

			// if the current input was 0 then just assign the value to override
			if (currentInput === "0" && value !== currentInput) {
				currentInput = value; // assign the current input to the value
			} else if (currentInput.startsWith("-") && currentInput.at(1) === "0") {
				// replace the following zero digit with the value
				currentInput = currentInput.slice(0, 1) + value;
			} else {
				currentInput += value; //append to current input;
			}

			//Change AC state to CE for clearing an clear
			if (currentInput !== "0") {
				// only change if the numbers are not zero
				updateClearButton();
			}
			updateDisplay(currentInput);

			break;
		case isOperand(value):
			// If the user press another operand when there exist values and another operand evaluate first then store the values
			if (storedValue && operand && currentInput) {
				currentInput = operate(storedValue, currentInput, operand);
				updateDisplay(currentInput);
			}

			storedValue = currentInput; // store the number input
			operand = value;
			currentInput = ""; //clear input
			break;
		case value === "%":
			currentInput = percentage(currentInput);
			updateDisplay(currentInput);

			break;

		case value === "+/-":
			currentInput = toggleSign(currentInput);
			updateDisplay(currentInput);
			break;

		case value === ".":
			currentInput = decimal(currentInput);
			updateDisplay(currentInput);
			break;
		case value === "√":
			currentInput = squareRoot(currentInput);
			updateDisplay(currentInput);
			break;
		case value === "=":
			if (storedValue) {
				currentInput = operate(storedValue, currentInput, operand);
				storedValue = "";
				operand = "";
				// clear stored value to prevent accidental operations
			}
			updateDisplay(currentInput);

			break;
		case value === "AC":
			allClear();
			break;
		case value === "CE":
			clearEntry();
			break;
	}
}

function isNumber(value) {
	return /^[0-9]+$/.test(value);
}

function isOperand(value) {
	return /^[+\-×÷]$/.test(value); //used regex to set scope
}

//Operator function

function operate(num1, num2, operand) {
	//Convert string input to numbers
	let convertedNum = parseFloat(num1);
	let convertedNum2 = parseFloat(num2);

	switch (operand) {
		case "+":
			return add(convertedNum, convertedNum2);
		case "-":
			return subtract(convertedNum, convertedNum2);
		case "×":
			return multiply(convertedNum, convertedNum2);
		case "÷":
			return divide(convertedNum, convertedNum2);
	}
}

//Operation functions
function add(num1, num2) {
	return parseFloat((num1 + num2).toFixed(4));
}

function subtract(num1, num2) {
	return parseFloat((num1 - num2).toFixed(4));
}

function multiply(num1, num2) {
	return parseFloat((num1 * num2).toFixed(4));
}

function divide(num1, num2) {
	if (num2 === 0) {
		return NaN;
	}
	return parseFloat((num1 / num2).toFixed(4));
}

function percentage(num) {
	if (num === "" || num === "0") {
		return "0";
	} else {
		return parseFloat((num / 100).toFixed(4));
	}
}

function toggleSign(num) {
	if (num.startsWith("-")) {
		return num.slice(1);
	} else if (num === "") {
		return `-0`;
	} else {
		return `-${num}`;
	}
}

function decimal(num) {
	if (num.includes(".")) {
		return num;
	} else if (num === "") {
		return "0.";
	} else {
		return `${num}.`;
	}
}

function squareRoot(num) {
	if (num === "" || num === "0") {
		return "0";
	} else {
		return parseFloat(Math.sqrt(num).toFixed(4));
	}
}

//Clear
function allClear() {
	currentInput = "";
	storedValue = "";
	operand = "";
	display.value = "0";
	updateClearButton();
}

function clearEntry() {
	currentInput = "";
	display.value = "0";
	updateClearButton();
}

//clear button state
function updateClearButton() {
	if (currentInput !== "") {
		clearButton.textContent = "CE";
	} else {
		clearButton.textContent = "AC";
	}
}

//Display
function updateDisplay(input) {
	if (input === "") {
		display.value = "0";
	}
	display.value = input;
}

const keyMap = {
	"*": "×",
	"/": "÷",
	Enter: "=",
	Escape: "AC",
	Backspace: "CE",
};
