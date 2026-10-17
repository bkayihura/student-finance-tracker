import { rules, duplicateWords } from "./validators.js";

const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const rows = document.getElementById("rows");
const records = [];
const searchInput = document.getElementById("search");
const ignoreCase = document.getElementById("ignoreCase");
const sortInput = document.getElementById("sort");

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

const record = {
    description: description.value,
    amount: Number(amount.value),
    type: document.getElementById("type").value,
    category: category.value,
    date: date.value
};

 records.push(record);

 const row = document.createElement("tr");

 row.innerHTML = `
      <td>${record.description}</td>
      <td>${record.amount}</td>
      <td>${record.type}</td>
      <td>${record.category}</td>
      <td>${record.date}</td>
      <td>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
      </td>
   `;   

   rows.appendChild(row);
   sortRecords();
   searchRecords();

   row.querySelector(".edit").addEventListener("click", function() {
    const newName = prompt("Edit description:", record.description);

    if(newName === null) return;

    if(!rules.description.test(newName) || duplicateWords.test(newName)) {
        alert("Enter a valid description.");
        return;
    }

    record.description = newName;
    row.cells[0].textContent = newName;
   });


   row.querySelector(".delete").addEventListener("click", function() {
    row.remove();
    records.splice(records.indexOf(record), 1);
   });

});

searchInput.addEventListener("input", searchRecords);
ignoreCase.addEventListener("change", searchRecords);

function searchRecords() {
    try {
        const regex = new RegExp(
            searchInput.value,
            ignoreCase.checked ? "i" : ""
        );

        rows.querySelectorAll("tr").forEach(row => {
            const text = row.cells[0].textContent;
            row.hidden = !regex.test(text);
        });
    } catch {
        formMsg.textContent = "Inalid search pattern.";
    }
}
 
sortInput.addEventListener("change", sortRecords);

function sortRecords() {
    const sorted = [...rows.querySelectorAll("tr")];

    sorted.sort((a, b) => {
        const type = sortInput.value;

        const columns = {
            description: 0,
            amount: 1,
            date: 4
        };

        const index = columns[type];

        const x = a.cells[index].textContent;
        const y = b.cells[index].textContent;

        if (type === "amount") {
            return Number(x) - Number(y);
        }
        returnx.localCompare(y);
    });
    sorted.forEach(row => rows.appendChild(row));
}