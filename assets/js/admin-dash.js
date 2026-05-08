
// PHONE NOTIFICATION
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

//clock
function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const el = document.getElementById("clock");
    if (el) el.textContent =
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
}
tick();
setInterval(tick, 1000);

// QUEUE HELPERS
function getQueueList() {
    return JSON.parse(localStorage.getItem("queueList") || "[]");
}
function saveQueueList(list) {
    localStorage.setItem("queueList", JSON.stringify(list));
}

// REPORT HELPERS
function saveAdminReport(queueId, name, service, windowName, category, queueType, status) {
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    var now = new Date();
    reports.push({
        queueId: queueId, name: name, service: service, window: windowName,
        category: category, queueType: queueType, status: status,
        date: now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0"),
        time: now.toLocaleTimeString(), year: now.getFullYear(), month: now.getMonth() + 1,
        semester: (now.getMonth() + 1 >= 8 && now.getMonth() + 1 <= 12) ? "1st Semester" : ((now.getMonth() + 1 >= 1 && now.getMonth() + 1 <= 5) ? "2nd Semester" : "Summer")
    });
    localStorage.setItem("reportTransactions", JSON.stringify(reports));
}

function updateAdminReportStatus(id, status) {
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    reports.forEach(function(r) { if (r.queueId === id) r.status = status; });
    localStorage.setItem("reportTransactions", JSON.stringify(reports));
}

function recordExists(entry) {
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    return reports.some(function(r) { return r.queueId === entry.id; });
}

function adminServe(id) {
    var q = getQueueList();
    var idx = q.findIndex(function(x) { return x.id === id; });
    if (idx === -1) return;
    var entry = q[idx];
    q.splice(idx, 1);
    saveQueueList(q);
    if (!recordExists(entry)) {
        saveAdminReport(entry.id, entry.name, entry.purpose, entry.window, entry.category, entry.type, "served");
    } else {
        updateAdminReportStatus(entry.id, "served");
    }
    addAdminFeed("✔ Served " + entry.id + " — " + entry.name, "green");
    loadQueues();
    updateAdminStats();
}

function adminSkip(id) {
    var q = getQueueList();
    var idx = q.findIndex(function(x) { return x.id === id; });
    if (idx === -1) return;
    var entry = q[idx];
    q.splice(idx, 1);
    saveQueueList(q);
    if (!recordExists(entry)) {
        saveAdminReport(entry.id, entry.name, entry.purpose, entry.window, entry.category, entry.type, "skipped");
    } else {
        updateAdminReportStatus(entry.id, "skipped");
    }
    addAdminFeed("✖ Skipped " + entry.id + " — " + entry.name, "amber");
    loadQueues();
    updateAdminStats();
}

function adminTransfer(id, newWindow) {
    var q = getQueueList();
    var idx = q.findIndex(function(x) { return x.id === id; });
    if (idx === -1) return;
    var entry = q[idx];
    entry.window = newWindow;
    entry.time = new Date().toLocaleTimeString();
    q.splice(idx, 1);
    q.push(entry);
    saveQueueList(q);
    addAdminFeed("→ Transferred " + entry.id + " to " + newWindow, "blue");
    loadQueues();
    updateAdminStats();
}

function adminManualAdd(name, phone, windowName, service, category) {
    var counter = parseInt(localStorage.getItem("queueCounter") || "0") + 1;
    localStorage.setItem("queueCounter", counter);
    var isPri = (category === "PWD" || category === "Senior Citizen" || category === "VIP");
    var qNum = (isPri ? "PR-" : "M-") + String(counter).padStart(3, "0");
    var entry = {
        id: qNum, name: name, phone: phone || "N/A", purpose: service,
        window: windowName, category: category, type: isPri ? "priority" : "regular",
        status: "waiting", time: new Date().toLocaleTimeString()
    };
    var q = getQueueList();
    q.push(entry);
    saveQueueList(q);
    saveAdminReport(qNum, name, service, windowName, category, entry.type, "waiting");
    addAdminFeed("➕ Manual: " + name + " (" + windowName + ")", "blue");
    loadQueues();
    updateAdminStats();
    return qNum;
}

function addAdminFeed(msg, color) {
    var feed = document.getElementById("adminFeed");
    if (!feed) return;
    var li = document.createElement("li");
    li.className = "feed-item";
    li.innerHTML = '<div class="feed-dot ' + color + '"></div><div>' + msg + '<br><span class="feed-time">just now</span></div>';
    feed.prepend(li);
    if (feed.children.length > 15) feed.removeChild(feed.lastChild);
}


function updateAdminStats() {
    var q = getQueueList();
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    var elInQ = document.getElementById("sa-inqueue");
    if (elInQ) elInQ.textContent = q.length;
    var elServed = document.getElementById("sa-served");
    if (elServed) elServed.textContent = reports.filter(function(x) { return x.status === "served"; }).length;
    var elPri = document.getElementById("sa-priority");
    if (elPri) elPri.textContent = q.filter(function(x) { return ["PWD","Senior Citizen","VIP"].includes(x.category); }).length;
}


function loadQueues() {
    var queue = getQueueList();
    loadPriorityQueue(queue);
    loadRegularQueue(queue);
    updateAdminStats();
}

function loadPriorityQueue(queue) {
    var priorityQueue = queue.filter(function(q) { return q.type === "priority"; });
    var table = document.getElementById("priorityTableBody");
    if (!table) return;
    table.innerHTML = "";
    if (priorityQueue.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No priority queue entries</td></tr>';
        return;
    }
    priorityQueue.forEach(function(q) {
        table.appendChild(createRow(q, "priority"));
    });
}

function loadRegularQueue(queue) {
    var regularQueue = queue.filter(function(q) { return q.type === "regular"; });
    var table = document.getElementById("regularTableBody");
    if (!table) return;
    table.innerHTML = "";
    if (regularQueue.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No regular queue entries</td></tr>';
        return;
    }
    regularQueue.forEach(function(q) {
        table.appendChild(createRow(q, "regular"));
    });
}

function createRow(q, type) {
    var row = document.createElement("tr");
    var windowLabel = q.window === "cashier" ? "Cashier Window" : "Registrar Window";
    if (type === "priority") row.style.background = "#fff8e1";
    row.innerHTML =
        '<td><strong>' + q.id + '</strong></td>' +
        '<td>' + q.name + '</td>' +
        '<td>' + q.purpose + '</td>' +
        '<td>' + q.time + '</td>' +
        '<td>' + windowLabel + '</td>' +
        '<td class="action-cell">' +
            '<button class="btn-sm done" onclick="adminServe(\'' + q.id + '\')">✔ Done</button>' +
            '<button class="btn-sm skip" onclick="adminSkip(\'' + q.id + '\')">✖ Skip</button>' +
        '</td>';
    return row;
}

window.addEventListener("DOMContentLoaded", function () {
    loadQueues();
    setInterval(loadQueues, 3000);
});