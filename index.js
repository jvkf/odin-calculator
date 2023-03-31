const display = document.querySelector(".calculator-container .display-text");
const numberButtons = document.querySelectorAll(".button.number");

display.innerText = "1";

function updateNumber(e) {
  display.innerText += this.innerText;
}

numberButtons.forEach((button) =>
  button.addEventListener("click", updateNumber)
);
