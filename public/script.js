var url = 'http://localhost:3000';
var row = 1;

function populateTable() {
    var req = new XMLHttpRequest();
    console.log("GET ALL WORKOUTS");
    req.open("GET", url + "/get-all", true);
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var result = JSON.parse(req.responseText);
            if (result) {
                // console.log(result);
                buildWorkoutRows(result);
            } else {
                console.log("No data receivied.");
            }
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send();
}

function buildWorkoutRows(result) {
    var finishedHead = document.getElementById("finishedHead");
    var newRow = document.createElement("tr");
    var newCol = document.createElement("th");
    newRow.setAttribute("class", "table-success");
    newCol.textContent = "Name";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Reps";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Weight";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Date (YYYY-MM-DD)";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Lbs";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Edit";
    newRow.appendChild(newCol);
    newCol = document.createElement("th");
    newCol.textContent = "Delete";
    newRow.appendChild(newCol);
    finishedHead.appendChild(newRow);

    result.forEach(buildOneWorkoutRow)
}

function buildOneWorkoutRow(workout) {
    finishedBody = document.getElementById("finishedBody");
    newRow = document.createElement("tr");
    finishedBody.appendChild(newRow);

    newCol = document.createElement("td");
    newCol.textContent = workout.name;
    newRow.appendChild(newCol);

    newCol = document.createElement("td");
    newCol.textContent = workout.reps;
    newRow.appendChild(newCol);

    newCol = document.createElement("td");
    newCol.textContent = workout.weight;
    newRow.appendChild(newCol);

    newCol = document.createElement("td");
    newCol.textContent = workout.date;
    newRow.appendChild(newCol);

    newCol = document.createElement("td");
    newCol.textContent = workout.lbs == 1 ? "Lbs" : "Kgs";
    newRow.appendChild(newCol);

    // Build edit form
    newCol = document.createElement("td");
    var editForm = document.createElement("form");
    editForm.action = "/edit";
    editForm.method = "post";
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "id");
    input.setAttribute("value", workout.id);
    editForm.appendChild(input);
    input = document.createElement("input");
    input.setAttribute("class", "btn btn-warning")
    input.setAttribute("type", "submit");
    input.setAttribute("value", "Edit");
    editForm.appendChild(input);
    newCol.appendChild(editForm);
    newRow.appendChild(newCol);

    // Build delete button
    newCol = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("class", "delete btn btn-danger");
    deleteButton.setAttribute("id", workout.id);
    deleteButton.setAttribute("row", row++);
    newCol.appendChild(deleteButton);
    newRow.appendChild(newCol);
    finishedBody.appendChild(newRow);
    bindDeleteButton(deleteButton);
}

function bindDeleteButton(deleteButton) {
    deleteButton.addEventListener("click", function(event) {
        console.log("BIND ONE BUTTON " + deleteButton.getAttribute("id"));
        var req = new XMLHttpRequest();
        var payload = {
            id: deleteButton.getAttribute("id")
        }
        req.open('POST', url + '/delete', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                console.log(response);
                document.getElementById("finishedWorkouts").deleteRow(deleteButton.getAttribute("row"));
                reCalculateRowCount();
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(payload));
        event.preventDefault();
    })
}

function reCalculateRowCount() {
    var elements = document.getElementsByClassName('delete');
    row = 1;
    Array.prototype.forEach.call(elements, function(element) {
        element.setAttribute("row", row++);
    });
}

function bindAddButton() {
    document.getElementById("addButton").addEventListener("click", function(event) {
        var req = new XMLHttpRequest();
        var payload = {
            name: null,
            reps: null,
            weight: null,
            date: null,
            lbs: null
        };
        payload.name = document.getElementById('newName').value;
        payload.reps = document.getElementById('newReps').value;
        payload.weight = document.getElementById('newWeight').value;
        payload.date = document.getElementById('newDate').value;
        payload.lbs = document.getElementById('newLbs').checked ? 1 : 0;
        req.open('POST', url + '/add', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                console.log("LOAD SUCCESS");
                console.log(response);
                buildOneWorkoutRow(response);
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(payload));
        event.preventDefault();
    })

}

function bindButtons() {
    bindAddButton();
}

// document.getElementById("weatherCheck").addEventListener("click", checkWeather);
document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', populateTable);
