function triggerPhoneNotif(student, type) {
    var payload = {
        type:      type,
        id:        student.id,
        name:      student.name,
        phone:     student.phone || "N/A",
        purpose:   student.purpose,
        timestamp: Date.now()
    };
    localStorage.setItem("phoneNotif", JSON.stringify(payload));
}

function updateReportStatus(queueId, newStatus) {
    var data = localStorage.getItem("reportTransactions");
    if (!data) {
        return;
    }

    var records = [];
    try {
        records = JSON.parse(data);
    } catch (e) {
        return;
    }

        // Find the matching record by queueId and update its status //
    var found = false;
    records.forEach(function(record) {
        if (record.queueId === queueId) {
            record.status = newStatus;
            found = true;
        }
    });

    if (found) {
        localStorage.setItem("reportTransactions", JSON.stringify(records));
    }
}

function removeFromQueueList(queueId) {
    var queueList = JSON.parse(localStorage.getItem("queueList")) || [];
    var updated = queueList.filter(function(q) {
        return q.id !== queueId;
    });
    localStorage.setItem("queueList", JSON.stringify(updated));
}


//load all queues//
function loadQueues() {
    var queue = JSON.parse(localStorage.getItem("queueList")) || [];
    loadPriorityQueue(queue);
    loadRegularQueue(queue);
}


// priority tavle //
function loadPriorityQueue(queue) {
    var priorityQueue = queue.filter(function(q) {
        return q.type === "priority";
    });
    var table = document.getElementById("priorityTableBody");
    table.innerHTML = "";

    if (priorityQueue.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No priority queue entries</td></tr>';
        return;
    }

    priorityQueue.forEach(function(q) {
        var row = createRow(q, "priority");
        table.appendChild(row);
    });
}

//regular table//
function loadRegularQueue(queue) {
    var regularQueue = queue.filter(function(q) {
        return q.type === "regular";
    });
    var table = document.getElementById("regularTableBody");
    table.innerHTML = "";

    if (regularQueue.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No regular queue entries</td></tr>';
        return;
    }

    regularQueue.forEach(function(q) {
        var row = createRow(q, "regular");
        table.appendChild(row);
    });
}

function loadRegularQueue(queue) {
    var regularQueue = queue.filter(function(q) {
        return q.type === "regular";
    });
    var table = document.getElementById("regularTableBody");
    table.innerHTML = "";

    if (regularQueue.length === 0) {
        table.innerHTML =
            '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No regular queue entries</td></tr>';
        return;
    }

    regularQueue.forEach(function(q) {
        var row = createRow(q, "regular");
        table.appendChild(row);
    });
}

//priority rows//
 function createRow(q, type) {
    var row = document.createElement("tr");
    var statusClass = (q.status === "serving") ? "serving" : "waiting";

    if (type === "priority") {
        row.style.background = "#fff8e1";
    }

    row.innerHTML = ...

    row.innerHTML =
        '<td><strong>' + q.id + '</strong></td>' +
        '<td>' + q.name + '</td>' +
        '<td>' + q.purpose + '</td>' +
        '<td>' + q.time + '</td>' +
        '<td><span class="pill ' + statusClass + '">' + q.status + '</span></td>' +
        '<td class="action-cell">' +
        '  <button class="btn-action btn-done-sm" data-id="' + q.id + '">✔ Done</button>' +
        '  <button class="btn-action btn-skip-sm" data-id="' + q.id + '">✖ Skip</button>' +
        '</td>';

var doneBtn = row.querySelector(".btn-done-sm");
    doneBtn.addEventListener("click", function() {
        var id = this.getAttribute("data-id");

        updateReportStatus(id, "served");

        removeFromQueueList(id);

         loadQueues();
    });

    //skip button//
    var skipBtn = row.querySelector(".btn-skip-sm");
    skipBtn.addEventListener("click", function() {
        var id = this.getAttribute("data-id");

        updateReportStatus(id, "skipped");

        removeFromQueueList(id);

        loadQueues();
    });

    return row;
 }

//live update//
window.addEventListener("DOMContentLoaded", function() {
    loadQueues();
    setInterval(loadQueues, 3000);
});