// ── Load current user and window ──
var currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
var myWindow = currentUser.window || "Window 1 - School to School & Faculty Clearance";
document.getElementById("currentUserName").textContent = currentUser.name || "Registrar Staff";

// Registrar windows list (same as registration)
var registrarWindows = [
    "Window 1 - School to School & Faculty Clearance",
    "Window 2 - Request of Documents",
    "Window 3 - Request of Documents",
    "Window 4 - Request of Documents",
    "Window 5 - Releasing",
    "Window 6 - Releasing"
];

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

// Queue helpers
function getQueue() {
    return JSON.parse(localStorage.getItem("queueList") || "[]");
}
function saveQueue(q) {
    localStorage.setItem("queueList", JSON.stringify(q));
}

// Phone notification
function notifyPhone(student, type) {
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

// Current ticket being served (per window)
var currentTicket = null;

function renderDashboard() {
    var all = getQueue();
    var myQueue = all.filter(function(q) { return q.window === myWindow; });

    // Group by priority/regular
    var priority = myQueue.filter(function(q) { return q.type === "priority"; });
    var regular  = myQueue.filter(function(q) { return q.type === "regular"; });

    var html = "";

    // Current ticket section
    if (currentTicket) {
        html += '<div class="current-ticket">';
        html += '<div class="ct-label">Now serving</div>';
        html += '<div class="ct-number">' + currentTicket.id + '</div>';
        html += '<div class="ct-meta">';
        html += '<div><div class="ct-meta-key">Name</div><div class="ct-meta-val">' + currentTicket.name + '</div></div>';
        html += '<div><div class="ct-meta-key">Purpose</div><div class="ct-meta-val">' + currentTicket.purpose + '</div></div>';
        html += '</div>';
        html += '<div class="ct-actions">';
        html += '<button class="btn-done" onclick="markDone()">Mark as Done</button>';
        html += '<button class="btn-skip" onclick="noShow()">No-Show</button>';
        html += '</div>';
        html += '</div>';
    } else {
        html += '<div class="empty-hero" style="display:block; margin-bottom:20px;">';
        html += '<div class="empty-hero-title">No active ticket</div>';
        html += '<button class="btn-next" onclick="callNext()">Call Next Student ↓</button>';
        html += '</div>';
    }

    // Priority queue table
    html += '<div class="window-section">';
    html += '<div class="window-title">⭐ Priority Queue — ' + myWindow + '</div>';
    html += '<table class="queue-table"><thead><tr><th>#</th><th>Ticket</th><th>Name</th><th>Purpose</th><th>Waiting</th></tr></thead><tbody>';
    if (priority.length === 0) {
        html += '<tr><td colspan="5" style="text-align:center;color:#999;">No priority entries</td></tr>';
    } else {
        priority.forEach(function(q, i) {
            html += '<tr><td>' + (i+1) + '</td><td>' + q.id + '</td><td>' + q.name + '</td><td>' + q.purpose + '</td><td>' + q.time + '</td></tr>';
        });
    }
    html += '</tbody></table></div>';

    // Regular queue table
    html += '<div class="window-section">';
    html += '<div class="window-title">👤 Regular Queue — ' + myWindow + '</div>';
    html += '<table class="queue-table"><thead><tr><th>#</th><th>Ticket</th><th>Name</th><th>Purpose</th><th>Waiting</th></tr></thead><tbody>';
    if (regular.length === 0) {
        html += '<tr><td colspan="5" style="text-align:center;color:#999;">No regular entries</td></tr>';
    } else {
        regular.forEach(function(q, i) {
            html += '<tr><td>' + (i+1) + '</td><td>' + q.id + '</td><td>' + q.name + '</td><td>' + q.purpose + '</td><td>' + q.time + '</td></tr>';
        });
    }
    html += '</tbody></table></div>';

    document.getElementById("dashboardContent").innerHTML = html;
}

function callNext() {
    var all = getQueue();
    var myQueue = all.filter(function(q) { return q.window === myWindow; });
    if (myQueue.length === 0) return alert("No students in queue.");

    // Priority first
    var priority = myQueue.filter(function(q) { return q.type === "priority"; });
    var next = priority.length > 0 ? priority[0] : myQueue[0];

    // Remove from queue
    var updated = all.filter(function(q) { return q.id !== next.id; });
    saveQueue(updated);

    currentTicket = next;
    notifyPhone(next, "serving");
    renderDashboard();
}

function markDone() {
    if (!currentTicket) return;
    // Update report as served
    var reports = JSON.parse(localStorage.getItem("reportTransactions") || "[]");
    reports.push({
        queueId: currentTicket.id,
        name: currentTicket.name,
        service: currentTicket.purpose,
        window: currentTicket.window,
        category: currentTicket.category,
        queueType: currentTicket.type,
        status: "served",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        year: new Date().getFullYear(),
        month: new Date().getMonth()+1,
        semester: (new Date().getMonth()+1 >= 8 && new Date().getMonth()+1 <= 12) ? "1st Semester" : ((new Date().getMonth()+1 >= 1 && new Date().getMonth()+1 <= 5) ? "2nd Semester" : "Summer")
    });
    localStorage.setItem("reportTransactions", JSON.stringify(reports));

    notifyPhone(currentTicket, "done");
    currentTicket = null;
    renderDashboard();
}

function noShow() {
    if (!currentTicket) return;
    // Put back at end of same window queue
    var all = getQueue();
    var entry = currentTicket;
    entry.time = new Date().toLocaleTimeString(); // reset wait time
    all.push(entry);
    saveQueue(all);

    notifyPhone(currentTicket, "skip");
    currentTicket = null;
    renderDashboard();
}

// Refresh every 3 seconds
setInterval(renderDashboard, 3000);
renderDashboard();