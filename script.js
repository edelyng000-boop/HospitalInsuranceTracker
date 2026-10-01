const form = document.getElementById("insuranceForm");
const table = document.getElementById("verificationTable");
const resetButton = document.getElementById("resetButton");

let records = JSON.parse(localStorage.getItem("insuranceRecords")) || [];

let currentFilter = "All";


function saveRecords() {
    localStorage.setItem("insuranceRecords", JSON.stringify(records));
}


function displayRecords() {

    table.innerHTML = "";

    let filteredRecords = records;

    if (currentFilter !== "All") {
        filteredRecords = records.filter(function(record) {
            return record.status === currentFilter;
        });
    }

    filteredRecords.forEach(function(record) {

        const row = document.createElement("tr");

        const statusClass = record.status.toLowerCase();

        row.innerHTML = `
            <td>${record.patientName}</td>
            <td>${record.insuranceCompany}</td>
            <td>${record.memberId}</td>
            <td>${record.dateOfService}</td>

            <td>
                <span class="status ${statusClass}">
                    ${record.status}
                </span>
            </td>

            <td>
                <button class="delete-button"
                        onclick="deleteRecord(${record.id})">
                    🗑 Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    updateSummary();
}


function updateSummary() {

    const total = records.length;

    const verified = records.filter(function(record) {
        return record.status === "Verified";
    }).length;

    const pending = records.filter(function(record) {
        return record.status === "Pending";
    }).length;

    const denied = records.filter(function(record) {
        return record.status === "Denied";
    }).length;

    document.getElementById("totalPatients").textContent = total;
    document.getElementById("verifiedCount").textContent = verified;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("deniedCount").textContent = denied;
}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientName =
        document.getElementById("patientName").value;

    const insuranceCompany =
        document.getElementById("insuranceCompany").value;

    const memberId =
        document.getElementById("memberId").value;

    const dateOfService =
        document.getElementById("dateOfService").value;

    const status =
        document.getElementById("status").value;


    const newRecord = {
        id: Date.now(),
        patientName: patientName,
        insuranceCompany: insuranceCompany,
        memberId: memberId,
        dateOfService: dateOfService,
        status: status
    };


    records.push(newRecord);

    saveRecords();
    displayRecords();

    form.reset();
});


function deleteRecord(id) {

    records = records.filter(function(record) {
        return record.id !== id;
    });

    saveRecords();
    displayRecords();
}


function filterRecords(status) {

    currentFilter = status;

    displayRecords();
}


resetButton.addEventListener("click", function() {

    const confirmReset =
        confirm("Are you sure you want to delete all verification records?");

    if (confirmReset) {
        records = [];
        saveRecords();
        displayRecords();
    }
});


displayRecords();
