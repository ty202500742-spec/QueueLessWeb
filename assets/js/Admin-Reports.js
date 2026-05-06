var activeFilters = {
    year:     "all",
    semester: "all",
    month:    "all",
    service:  "all",
    category: "all"
};

function getSemester(monthNumber) {
    var m = parseInt(monthNumber, 10);
    if (m >= 8 && m <= 12) return "1st Semester";
    if (m >= 1 && m <= 5)  return "2nd Semester";
    return "Summer";
}

// Loads all transactions from localStorage //
function getAllTransactions() {
    var data = localStorage.getItem("reportTransactions");
    if (!data) {
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }}

function getFilteredTransactions() {
    var all = getAllTransactions();

    var result = all.filter(function(tx) {

        // year filter//
        if (activeFilters.year !== "all") {
            if (String(tx.year) !== String(activeFilters.year)) {
                return false;
            }
        }
        // semester filter//
        if (activeFilters.semester !== "all") {
            if (tx.semester !== activeFilters.semester) {
                return false;
            }
        }

        // month filter//
        if (activeFilters.month !== "all") {
            if (String(tx.month) !== String(activeFilters.month)) {
                return false;
            }
        }

        // service filter//
         if (activeFilters.service !== "all") {
            if (tx.service !== activeFilters.service) {
                return false;
            }
        }

        // category filter//
        if (activeFilters.category !== "all") {
            if (tx.category !== activeFilters.category) {
                return false;
            }
        }

        return true;
    });

    return result;
}

function renderTable(records) {
    var tbody = document.getElementById("reportTableBody");
    tbody.innerHTML = "";

    if (records.length === 0) {
        tbody.innerHTML =
            '<tr>' +
            '  <td colspan="8" class="empty-state">' +
            '    <div class="empty-icon">📭</div>' +
            '    No records match your selected filters.' +
            '  </td>' +
            '</tr>';
        return;
    }

    var sorted = records.slice().reverse();
    sorted.forEach(function(tx) {

        //picks the right css class for status baddge//
         var badgeClass = "badge-waiting";
        if (tx.status === "served")  badgeClass = "badge-served";
        if (tx.status === "skipped") badgeClass = "badge-skipped";

        //picks the right css class for the queue type badge//
        var typeClass = tx.queueType === "priority" ? "type-priority" : "type-regular";
        var typeLabel = tx.queueType === "priority" ? "⭐ Priority" : "Regular";

        //status for dsplay//
        var statusLabel = tx.status.charAt(0).toUpperCase() + tx.status.slice(1);
        var row = document.createElement("tr");
        row.innerHTML =
            '<td><strong>' + (tx.queueId  || "—") + '</strong></td>' +
            '<td>' + (tx.name     || "—") + '</td>' +
            '<td>' + (tx.service  || "—") + '</td>' +
            '<td>' + (tx.category || "Regular") + '</td>' +
            '<td><span class="type-badge ' + typeClass + '">' + typeLabel + '</span></td>' +
            '<td>' + (tx.date     || "—") + '</td>' +
            '<td>' + (tx.time     || "—") + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + statusLabel + '</span></td>';

        tbody.appendChild(row);
    });
}

function renderStats(records) {
    var total   = records.length;
    var served  = records.filter(function(tx) { return tx.status === "served";  }).length;
    var skipped = records.filter(function(tx) { return tx.status === "skipped"; }).length;
    var waiting = records.filter(function(tx) { return tx.status === "waiting"; }).length;

    document.getElementById("totalCount").textContent   = total;
    document.getElementById("servedCount").textContent  = served;
    document.getElementById("skippedCount").textContent = skipped;
    document.getElementById("waitingCount").textContent = waiting;

    document.getElementById("recordCount").textContent =
        total + (total === 1 ? " record" : " records");
}

function buildDynamicFilters() {
    var all = getAllTransactions();

    var years = [];
    all.forEach(function(tx) {
        if (tx.year && years.indexOf(String(tx.year)) === -1) {
            years.push(String(tx.year));
        }
    });
    years.sort();

    var yearContainer = document.getElementById("yearFilters");

    years.forEach(function(yr) {
        var btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.setAttribute("data-filter", "year");
        btn.setAttribute("data-value", yr);
        btn.textContent = yr;
        yearContainer.appendChild(btn);
    });

    var services = [];
    all.forEach(function(tx) {
        if (tx.service && services.indexOf(tx.service) === -1) {
            services.push(tx.service);
        }
    });
    services.sort();

    var serviceContainer = document.getElementById("serviceFilters");
    services.forEach(function(svc) {
        var btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.setAttribute("data-filter", "service");
        btn.setAttribute("data-value", svc);
        btn.textContent = svc;
        serviceContainer.appendChild(btn);
    });
}

function refresh() {
    var filtered = getFilteredTransactions();
    renderStats(filtered);
    renderTable(filtered);
}

function setupFilterButtons() {

    var filterSection = document.querySelector(".filter-section");

    filterSection.addEventListener("click", function(event) {

        var btn = event.target;
        if (!btn.classList.contains("filter-btn")) {
            return;
        }

         var filterType = btn.getAttribute("data-filter");
         var filterValue = btn.getAttribute("data-value");

         activeFilters[filterType] = filterValue;

         var siblings = filterSection.querySelectorAll(
            '[data-filter="' + filterType + '"]'
        );
        siblings.forEach(function(sib) {
            sib.classList.remove("active");
        });
        btn.classList.add("active");

        refresh();
    });
}

function exportToCSV() {
    var records = getFilteredTransactions();

    if (records.length === 0) {
        alert("No records to export with the current filters.");
        return;
    }

    var csvRows = [
        ["Queue #", "Name", "Service", "Category", "Queue Type", "Date", "Time", "Status"]
    ];

    records.forEach(function(tx) {
        csvRows.push([
            tx.queueId   || "",
            tx.name      || "",
            tx.service   || "",
            tx.category  || "Regular",
            tx.queueType || "regular",
            tx.date      || "",
            tx.time      || "",
            tx.status    || ""
        ]);
    });

    var csvString = csvRows.map(function(row) {

        return row.map(function(val) {
            return '"' + String(val).replace(/"/g, '""') + '"';
        }).join(",");
    }).join("\n");

    var blob = new Blob([csvString], { type: "text/csv" });
    var url  = URL.createObjectURL(blob);
    var link = document.createElement("a");

    var today = new Date();
    var dateStr = today.getFullYear() + "-" +
                  String(today.getMonth() + 1).padStart(2, "0") + "-" +
                  String(today.getDate()).padStart(2, "0");

    link.href     = url;
    link.download = "queueless-report-" + dateStr + ".csv";
    link.click();

    URL.revokeObjectURL(url);
}

window.addEventListener("DOMContentLoaded", function() {
    buildDynamicFilters();
    setupFilterButtons();
    refresh();
});