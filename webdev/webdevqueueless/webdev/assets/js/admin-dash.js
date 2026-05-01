// 🔔 Notify phone
function triggerPhoneNotif(student, type) {
    const payload = {
        type,
        id: student.id,
        name: student.name,
        phone: student.phone || "N/A",
        purpose: student.purpose,
        timestamp: Date.now()
    };
    localStorage.setItem("phoneNotif", JSON.stringify(payload));
}

// 🔥 LOAD ALL QUEUES (MASTER SYSTEM)
function loadQueues() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    loadPriorityQueue(queue);
    loadRegularQueue(queue);
}

// 🔥 PRIORITY TABLE
function loadPriorityQueue(queue) {
    let priorityQueue = queue.filter(q => q.type === "priority");
    let table = document.getElementById("priorityTableBody");

    table.innerHTML = "";

    if (priorityQueue.length === 0) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;">No priority queue</td></tr>`;
        return;
    }

    priorityQueue.forEach(q => {
        let row = createRow(q, "priority");
        table.appendChild(row);
    });
}

// 🔥 REGULAR TABLE
function loadRegularQueue(queue) {
    let regularQueue = queue.filter(q => q.type === "regular");
    let table = document.getElementById("regularTableBody");

    table.innerHTML = "";

    if (regularQueue.length === 0) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center;">No regular queue</td></tr>`;
        return;
    }

    regularQueue.forEach(q => {
        let row = createRow(q, "regular");
        table.appendChild(row);
    });
}

// 🔥 CREATE ROW (REUSABLE)
function createRow(q, type) {
    let row = document.createElement("tr");

    let statusClass = q.status === "serving" ? "serving" : "waiting";

    if (type === "priority") {
        row.style.background = "#fff8e1";
    }

    row.innerHTML = `
        <td><strong>${q.id}</strong></td>
        <td>${q.name}</td>
        <td>${q.purpose}</td>
        <td>${q.time}</td>
        <td><span class="pill ${statusClass}">${q.status}</span></td>
        <td>—</td>
    `;

    return row;
}

// 🔥 AUTO LOAD
window.addEventListener("DOMContentLoaded", () => {
    loadQueues();
    setInterval(loadQueues, 3000);
});