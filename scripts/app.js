import { rules, duplicateWords } from "./validators.js";

const form = document.getElementById("form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const rows = document.getElementById("rows");
const records = JSON.parse(localStorage.getItem("records") || "[]");
const searchInput = document.getElementById("search");
const ignoreCase = document.getElementById("ignoreCase");
const sortInput = document.getElementById("sort");
const formMsg = document.getElementById("formMsg");

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
   id: crypto.randomUUID(),
   CreatedAt: new Date().toISOString(),
   updateAt: new Date().toISOString(),
   description: description.value,
   amount: Number(amount.value),
   type: document.getElementById("type").value,
   category: category.value,
   date: date.value
};

 records.push(record);
 saveRecords();
 displayRecord(record);
 updateDashboard();
});
 function displayRecord(record){

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
    record.updatedAt = new Date().toISOString();
    row.cells[0].textContent = newName;

    saveRecords();
    sortRecords();
    searchRecords();
   });


   row.querySelector(".delete").addEventListener("click", function() {
    row.remove();
    records.splice(records.indexOf(record), 1);
    updateDashboard();
    saveRecords();
   });
}

searchInput.addEventListener("input", searchRecords);
ignoreCase.addEventListener("change", searchRecords);

function searchRecords() {
    try {
        const regex = new RegExp(
            searchInput.value,
            ignoreCase.checked ? "i" : ""
        );

        rows.querySelectorAll("tr").forEach(row => {
            const cell = row.cells[0];
            const text = cell.textContent;

            row.hidden = !regex.test(text);
            cell.replaceChildren();

            let last = 0;
            const matches = new RegExp(regex.source, "g" + (ignoreCase.checked ? "i" : ""));

            for(const match of text.matchAll(matches)) {
              if (!match[0]) continue;

            cell.append(
                document.cretateTextNode(text.slice(last, match.index))
            );
            
            const mark = document.createElement("mark");
            mark.textContent = match[0];
            cell.append(mark);
            
            last = match.index + match[0].length;
            }
            cell.append(document.createTextNode(text.slice(last)));
        });
    }catch (error) {
        formMsg.textContent = "Invalid search pattern.";
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
        return x.localeCompare(y);
    });
    sorted.forEach(row => rows.appendChild(row));
}

function updateDashboard() {
    let income = 0;
    let spent = 0;

    records.forEach(record => {
        if( record .type === "income") {
            income += record.amount;
        } else {
            spent += record.amount;
        }
    });

    document.getElementById("income").textContent = income;
    document.getElementById("spent").textContent = spent;
    document.getElementById("balance").textContent = income - spent;
    document.getElementById("count").textContent = records.length;

    const totals = {};

    records.forEach(record => {
        if(record.type === "expense") {
            totals[record.category] =
            (totals[record.category] || 0) + record.amount;
      }
    });

    const top = Object.keys(totals).sort(
        (a,b) => totals[b] - totals[a]
    )[0];

    document.getElementById("topCategory").textContent = top || "None";

    updateBudget();
    updateChart();
}

function updateBudget() {
    const budget = Number(document.getElementById("budget").value);

    const spent = records 
    .filter(record => record.type === "expense")
    .reduce((total ,record) => total + record.amount, 0);

    const message = document.getElementById("budgetMsg");

    if(budget <= 0) {
        message.textContent = "No budget set.";
    } else if (spent > budget) {
        message.textContent = "Budget exceeded by " + (spent - budget);
    } else {
        message.textContent = "Budget remaning: " + (budget - spent);
    }

    message.setAttribute("aria-live", spent > budget && budget > 0 ? "assertive" : "polite")
}

document.getElementById("saveSettings").addEventListener("click", function(){
    const budget = document.getElementById("budget").value;
    const currency = document.getElementById("currency").value;

    localStorage.setItem("budget", budget);
    localStorage.setItem("currency", currency);

    updateBudget();
});

function updateChart() {
    const chart = document.getElementById("chart");
    chart.innerHTML = "";

    for (let i = 6; i >= 0; i--){
        const day = new Date();
        day.setDate(day.getDate() - i);

        const dateText = [
            day.getFullYear(),
            String(day.getMonth() + 1).padStart(2, "0"),
            String(day.getDate()). padStart(2, "0")
        ].join("-");

        const total = records
        .filter(r => r.type === "expense" && r.date === dateText)
        .reduce((sum, r) => sum + r.amount, 0);

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = Math.min(130, Math.max(4, total / 100)) + "px";
        bar.title = dateText + ":" + total;

        chart.appendChild(bar);
    }
}

function saveRecords() {
    localStorage.setItem("records", JSON.stringify(records));
}

document.getElementById("budget").value = 
    localStorage.getItem("budget") || "";

document.getElementById("currency").value =
    localStorage.getItem("currency") || "RWF";    

records.forEach(displayRecord);
sortRecords();
searchRecords();
updateDashboard();

document.getElementById("export"). addEventListener( "click", function() {
    const data = {
        records: records,
        budget: localStorage.getItem("budget"),
        currency: localStorage.getItem("currency")
    };

    const file = new Blob(
        [JSON.stringify(data, null, 2)],
        {type: "application/json"}
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "finance-data.json";
    link.click();

    URL.revokeObjectURL(link.href);

});

document.getElementById("import").addEventListener("change", async function(event) {
    const file = event.target.files[0];
    if(!file) return;

    try{
        const text = await file.text();
        const data = JSON.parse(text);

        if(!Array.isArray(data.records) ||
           !data.records.every(r => 
            typeof r.description === "string" &&
            typeof r.amount === "number" &&
            ["income", "expense"].includes(r.type) &&
            typeof r.category === "string" &&
            typeof r.date === "string"
           )){
            throw new Error ("Invalid records");
           }
         localStorage.setItem("records", JSON.stringify(data.records));
         
         if(data.budget != null && Number.isFinite(Number(data.budget))) {
            localStorage.setItem("budget", data.budget);
         }
         
         if (["RWF", "USD", "EUR"].includes(data.currency)) {
            localStorage.setItem("currency", data.currency);
         }

         alert("Data imported successfully!");
         location.reload();
    } catch (error){
        alert("Invalid JSON file.");
    }
});