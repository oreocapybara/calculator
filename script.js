const buttons = document.querySelectorAll(".button");
const display = document.querySelector(".display");
const clearButton = document.querySelector(".button#clear");

//Event Listeners
buttons.forEach((button) => {
	button.addEventListener("click", handleClick);
});

//variables
let storedValue = ""; //contains first number
let currentInput = ""; //contains second number
let operand = ""; //operand

function handleClick(event) {
	let value = event.target.textContent; // The value of the button

	switch (true) {
		case isNumber(value):
			currentInput += value; //append to current input;
			//Change AC state to CE for clearing an clear
			updateClearButton();
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
	return num1 + num2;
}

function subtract(num1, num2) {
	return num1 - num2;
}

function multiply(num1, num2) {
	return num1 * num2;
}

function divide(num1, num2) {
	if (num2 === 0) {
		return NaN;
	}
	return num1 / num2;
}

function percentage(num) {
	return parseFloat(num / 100);
}

function toggleSign(num) {
	if (num.startsWith("-")) {
		return num.slice(1);
	} else if (num === ""){
		return `-0`;
	}
	else {
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
	return parseFloat(Math.sqrt(num));
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
		clearButton.textContent = "AC"
	}
}

//Display
function updateDisplay(input) {
	if (input === "") {
		display.value = "0";
	}
	display.value = input;
}

function decimal(num) {
	if (num.includes(".")) {
		return;
	} else {
		return `${num}.`;
	}
}
