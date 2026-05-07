// ─────────────────────────────
// NOTIFICATION (phone)
// ─────────────────────────────
function triggerPhoneNotif(student, type) {
    var payload = {
        type: type,
        id: student.id,
        name: student.name,
        phone: student.phone || "N/A",
        purpose: student.purpose,
        timestamp: Date.now()
    };
    localStorage.setItem("phoneNotif", JSON.stringify(payload));
}

function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    document.getElementById("clock").textContent =
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
}
tick();
setInterval(tick, 1000);


// ─────────────────────────────
// UPDATE REPORT STATUS (still used, but NO buttons anymore)
// ─────────────────────────────
function updateReportStatus(queueId, newStatus) {
    var data = localStorage.getItem("reportTransactions");
    if (!data) return;

    var records = [];
    try {
        records = JSON.parse(data);
    } catch (e) {
        return;
    }

    records.forEach(function (record) {
        if (record.queueId === queueId) {
            record.status = newStatus;
        }
    });

    localStorage.setItem("reportTransactions", JSON.stringify(records));
}


// ─────────────────────────────
// REMOVE FROM QUEUE LIST (still used internally)
// ─────────────────────────────
function removeFromQueueList(queueId) {
    var queueList = JSON.parse(localStorage.getItem("queueList")) || [];
    var updated = queueList.filter(function (q) {
        return q.id !== queueId;
    });
    localStorage.setItem("queueList", JSON.stringify(updated));
}


// ─────────────────────────────
// LOAD ALL QUEUES
// ─────────────────────────────
function loadQueues() {
    var queue = JSON.parse(localStorage.getItem("queueList")) || [];
    loadPriorityQueue(queue);
    loadRegularQueue(queue);
}


// ─────────────────────────────
// PRIORITY TABLE
// ─────────────────────────────
function loadPriorityQueue(queue) {
    var priorityQueue = queue.filter(q => q.type === "priority");
    var table = document.getElementById("priorityTableBody");
    table.innerHTML = "";

    if (priorityQueue.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No priority queue entries</td></tr>';
        return;
    }

    priorityQueue.forEach(function (q) {
        var row = createRow(q, "priority");
        table.appendChild(row);
    });
}


// ─────────────────────────────
// REGULAR TABLE
// ─────────────────────────────
function loadRegularQueue(queue) {
    var regularQueue = queue.filter(q => q.type === "regular");
    var table = document.getElementById("regularTableBody");
    table.innerHTML = "";

    if (regularQueue.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No regular queue entries</td></tr>';
        return;
    }

    regularQueue.forEach(function (q) {
        var row = createRow(q, "regular");
        table.appendChild(row);
    });
}


// ─────────────────────────────
// CREATE ROW 
// ─────────────────────────────
function createRow(q, type) {

    var row = document.createElement("tr");
    var statusClass = q.status === "serving" ? "serving" : "waiting";

    var windowLabel =
        q.window === "cashier"
            ? "Cashier Window"
            : "Registrar Window";

    if (type === "priority") {
        row.style.background = "#fff8e1";
    }

    row.innerHTML =
        '<td><strong>' + q.id + '</strong></td>' +
        '<td>' + q.name + '</td>' +
        '<td>' + q.purpose + '</td>' +
        '<td>' + q.time + '</td>' +
        '<td>' +
            '<span style="padding:4px 10px;border-radius:8px;background:#e5e7eb;font-size:12px;">' +
            windowLabel +
            '</span>' +
        '</td>' ;

    return row;
}


// ─────────────────────────────
// LIVE UPDATE
// ─────────────────────────────
window.addEventListener("DOMContentLoaded", function () {
    loadQueues();
    setInterval(loadQueues, 3000);
});