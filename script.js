// Grab form and list elements
const form = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");

// Load applications from localStorage if available
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value;

    const application = { company, position, location, date, status, notes };

    applications.push(application);

    // Save to localStorage
    localStorage.setItem("applications", JSON.stringify(applications));

    displayApplications();
    form.reset();
});

// Display applications in a table
function displayApplications() {
    applicationList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="appTableBody"></tbody>
        </table>
        <button id="clearAllBtn">Clear All Applications</button>
    `;

    const tbody = document.getElementById("appTableBody");

    applications.forEach((application, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${application.company}</td>
            <td>${application.position}</td>
            <td>${application.location}</td>
            <td>${application.date}</td>
            <td><span class="status-${application.status}">${application.status}</span></td>
            <td>${application.notes}</td>
            <td>
                <button onclick="editApplication(${index})">Edit</button>
                <button onclick="deleteApplication(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Attach Clear All button event
    const clearBtn = document.getElementById("clearAllBtn");
    clearBtn.addEventListener("click", clearAllApplications);

    updateSummary();
}

// Delete application
function deleteApplication(index) {
    applications.splice(index, 1);
    localStorage.setItem("applications", JSON.stringify(applications));
    displayApplications();
}

// Edit application (pre-fill form)
function editApplication(index) {
    const app = applications[index];
    document.getElementById("company").value = app.company;
    document.getElementById("position").value = app.position;
    document.getElementById("location").value = app.location;
    document.getElementById("date").value = app.date;
    document.getElementById("status").value = app.status;
    document.getElementById("notes").value = app.notes;

    // Remove old entry so updated one replaces it
    applications.splice(index, 1);
    localStorage.setItem("applications", JSON.stringify(applications));
    displayApplications();
}

// Clear all applications with confirmation
function clearAllApplications() {
    if (confirm("Are you sure you want to clear all applications?")) {
        applications = [];
        localStorage.removeItem("applications");
        displayApplications();
    }
}

// Update summary counters
function updateSummary() {
    document.getElementById("totalApplications").textContent = applications.length;
    document.getElementById("interviews").textContent =
        applications.filter(app => app.status === "Interview").length;
    document.getElementById("accepted").textContent =
        applications.filter(app => app.status === "Accepted").length;
}

// Initialize on page load
displayApplications();
