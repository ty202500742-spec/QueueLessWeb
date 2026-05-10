// Clock
function tick() {
    var now = new Date();
    var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    document.getElementById("clock").textContent =
        h + ":" + String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0") + " " + ampm;
}
tick();
setInterval(tick, 1000);

var cashierWindows = [
    "Window 1 - Releasing of Payments / TES",
    "Window 2 - Releasing of Checks",
    "Window 3 - Releasing of Checks",
    "Window 4 - Collection (Priority)",
    "Window 5 - Collection",
    "Window 6 - TES Scholars",
    "Window 7 - Releasing of Petty Cash",
    "Window 8 - Assessment",
    "Window 9 - Assessment"
];

function getServingTicket() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith("currentTicket_")) {
            var windowName = key.replace("currentTicket_", "");
            if (cashierWindows.includes(windowName)) {
                var ticket = JSON.parse(localStorage.getItem(key) || "null");
                if (ticket) return ticket;
            }
        }
    }
    return null;
}

function renderView() {
    // ── Now Serving ──
    var ticket = getServingTicket();
    var currentTicketEl = document.getElementById("currentTicket");
    var emptyHero = document.getElementById("emptyHero");

    if (ticket) {
        currentTicketEl.style.display = "block";
        emptyHero.style.display = "none";
        document.getElementById("ctNumber").textContent = ticket.id;
        document.getElementById("ctName").textContent = ticket.name;
        document.getElementById("ctPurpose").textContent = ticket.purpose;
        document.getElementById("ctWait").textContent = ticket.time;
    } else {
        currentTicketEl.style.display = "none";
        emptyHero.style.display = "block";
        document.getElementById("ctNumber").textContent = "—";
        document.getElementById("ctName").textContent = "—";
        document.getElementById("ctPurpose").textContent = "—";
        document.getElementById("ctWait").textContent = "—";
    }

    // ── Queue Table ──
    var all = JSON.parse(localStorage.getItem("queueList") || "[]");
    var cashierQueue = all.filter(function(q) {
        return q.department === "cashier";
    });

    var tbody = document.getElementById("queueBody");
    tbody.innerHTML = "";
    if (cashierQueue.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px;">No students in queue</td></tr>';
    } else {
        cashierQueue.forEach(function(q, i) {
            var row = document.createElement("tr");
            row.innerHTML =
                '<td>' + (i+1) + '</td>' +
                '<td><strong>' + q.id + '</strong></td>' +
                '<td>' + q.name + '</td>' +
                '<td>' + q.purpose + '</td>' +
                '<td>' + q.time + '</td>';
            tbody.appendChild(row);
        });
    }

    // ── Stats ──
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    var servedToday = reports.filter(function(r) {
        return r.status === "served" &&
               cashierWindows.includes(r.window) &&
               r.date === new Date().toISOString().split("T")[0];
    }).length;

    var queueCount = document.getElementById("queueCount");
    var servedCount = document.getElementById("servedCount");
    if (queueCount) queueCount.textContent = cashierQueue.length;
    if (servedCount) servedCount.textContent = servedToday;
}

// Refresh every 3 seconds
renderView();
setInterval(renderView, 3000);