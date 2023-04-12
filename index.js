const display = document.querySelector(".calculator-container .display-text");
const numberButtons = document.querySelectorAll(".button.number");
const signButtons = document.querySelectorAll(".sign-button");
const operatorButton = document.querySelector(".operator-button");
const clearButton = document.querySelector(".clear-button");
const deleteButton = document.querySelector(".delete-button");
const percentageButton = document.querySelector(".percentage-button");

// Using an object to store my calculator, it's methods and the "states". I opted for manipulating the display content only in the functions outside calculator.

const calculator = {
  currentValue: "0",
  memoryValue: undefined,
  operator: "",
  setCurrentValue(value) {
    if (this.currentValue !== "0" || value === ".") {
      this.currentValue += value;
    } else {
      this.currentValue = value;
    }
  },
  clearCurrentValue() {
    this.currentValue = "0";
  },
  setMemoryValue(value) {
    this.memoryValue = value;
  },
  setOperator(sign) {
    this.operator = sign;
  },
  operate() {
    if (this.memoryValue === undefined) {
      return;
    }
    this.reinforceNumber(); //Since I'm moving between strings and numbers, I feel it's good to be sure that we're using numbers here;
    switch (this.operator) {
      case "+":
        this.calculateSum();
        break;
      case "-":
        this.calculateSub();
        break;
      case "/":
        this.calculateDiv();
        break;
      case "X":
        this.calculateMul();
        break;
    }
    this.removeTrailingZeros();
  },
  reinforceNumber() {
    this.currentValue = Number(this.currentValue);
    this.memoryValue = Number(this.memoryValue);
  },
  calculatePercentage() {
    this.reinforceNumber();
    this.currentValue = this.currentValue / 100; // This is the only "special" method because this operation must be done right after click of the sign, different from the others.
  },
  calculateSum() {
    const sum = this.memoryValue + this.currentValue;
    this.currentValue = sum.toFixed(8);
  },
  calculateSub() {
    const sub = this.memoryValue - this.currentValue;
    this.currentValue = sub.toFixed(8);
  },
  calculateDiv() {
    if (this.currentValue === 0) {
      this.currentValue = "Error";
      alert("Dividing numbers by zero is not possible!");
    } else {
      const div = this.memoryValue / this.currentValue;
      this.currentValue = div.toFixed(8);
    }
  },
  calculateMul() {
    const mult = this.memoryValue * this.currentValue;
    this.currentValue = mult.toFixed(8);
  },
  clear() {
    this.currentValue = "0";
    this.memoryValue = undefined;
    this.operator = "";
  },
  removeTrailingZeros() {
    const value = this.currentValue;
    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1) {
      let integer = value.substring(0, decimalIndex);
      let fraction = value.substring(decimalIndex + 1);
      let i = fraction.length - 1;
      while (i >= 0 && fraction[i] === "0") {
        i--;
      }
      fraction = i < 0 ? "" : "." + fraction.substring(0, i + 1);
      this.currentValue = integer + fraction;
    } else {
      this.currentValue = value;
    }
  },
};

function updateNumber() {
  if (calculator.currentValue.length >= 8) {
    alert("Reached maximum capacity"); // I could create a modal here, but I want to move forward with other studies. A point to visit later.
    return;
  }
  if (this.textContent === "." && calculator.currentValue.includes(".")) {
    return; // Avoid double "."
  }
  calculator.setCurrentValue(this.textContent);
  display.textContent = calculator.currentValue;
}

function updateDisplay() {
  display.textContent = calculator.currentValue;
  if (calculator.currentValue === "Error") {
    calculator.clear();
  } else {
    calculator.setMemoryValue(calculator.currentValue); // In order to keep calculator running if User opts for multiple operations, I pass the value to the memory, but keep the display showing the current value, so User can keep track of what's going on.
    calculator.clearCurrentValue();
  }
}

function prepareOperation() {
  const repeated = checkRepeated(this.textContent); // Function for the operator buttons.
  if (!repeated) {
    const value = Number(display.textContent);
    calculator.setMemoryValue(value);
    calculator.setOperator(this.textContent);
    calculator.clearCurrentValue();
  }
}

function checkRepeated(sign) {
  let isRepeated = false;

  if (calculator.memoryValue !== undefined) {
    isRepeated = true;
    if (calculator.currentValue !== "0") {
      operate();
    }
    calculator.setOperator(sign);
  }

  return isRepeated;
}

function operate(e) {
  calculator.operate();
  updateDisplay();
}

function clear() {
  calculator.clear();
  display.textContent = calculator.currentValue;
}

function calculatePerc() {
  calculator.calculatePercentage();
  display.textContent = calculator.currentValue;
}

function deleteNumber() {
  if (calculator.currentValue.toString() !== "0") {
    calculator.currentValue = calculator.currentValue
      .toString()
      .substring(0, calculator.currentValue.length - 1);
  } else if (calculator.memoryValue !== undefined) {
    calculator.memoryValue = calculator.memoryValue
      .toString()
      .substring(0, calculator.memoryValue.length - 1); // If there's a value in memory, it updates it there and display based on it (eg. user is doing multiple operations but want to delete something in between)
    display.textContent = calculator.memoryValue;
    return;
  } else {
    calculator.currentValue = "0";
  }
  display.textContent = calculator.currentValue;
}

numberButtons.forEach((button) =>
  button.addEventListener("click", updateNumber)
);

signButtons.forEach((button) =>
  button.addEventListener("click", prepareOperation)
);

operatorButton.addEventListener("click", operate);

clearButton.addEventListener("click", clear);

deleteButton.addEventListener("click", deleteNumber);

percentageButton.addEventListener("click", calculatePerc);
