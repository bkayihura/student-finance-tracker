import { rules, duplicateWords } from "./validators.js";

const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

form.addEventListener("submit", function(event) {
    event.preventDefault();

if(!rules.description.test(description.value)) {
    formMsg.textContent = "Description cannot start or end with a space.";
    return;
}

if(!rules.amount.test(amount.value)) {
    formMsg.textContent = "Enter avalid amount, for example 2500 or 2500.50.";
    return;
}

if(!rules.category.test(category.value)) {
    formMsg.textContent = "Category can only conatin letters and space."; 
    return;
}


if(!rules.date.test(date.value)) {
    formMsg.textContent = "Enter a valid date."; 
    return;
}

if(duplicateWords.test(description.value)) {
    formMsg.textContent = "Please remove repeated words."; 
    return;
}

formMsg.textContent = "Transaction is valid!";
});
