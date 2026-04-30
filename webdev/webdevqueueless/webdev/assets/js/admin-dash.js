let selectedQueueIndex = null;
let selectedQueueId    = null;

// ─── Notify the phone simulator via localStorage ──────────────────────────────
// phone-simulator.html listens for the "phoneNotif" key to change.
function triggerPhoneNotif(student, type) {
    const payload = {
        type:      type,          // "serving" | "done"
        id:        student.id,
        name:      student.name,
        phone:     student.phone  || "N/A",
        purpose:   student.purpose,
        timestamp: Date.now()     // always different so storage event always fires
    };
    localStorage.setItem("phoneNotif", JSON.stringify(payload));
}

// ─── Load & render the queue table ───────────────────────────────────────────
function loadQueue() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let table = document.getElementById("queueTableBody");

    table.innerHTML = "";

    if (queue.length === 0) {
        document.getElementById("noQueueModal").style.display = "flex";
        return;
    }

    document.getElementById("noQueueModal").style.display = "none";

    queue.forEach((q) => {
        let row = document.createElement("tr");

        let statusClass = q.status === "serving" ? "serving" : "waiting";
        let buttonText  = q.status === "serving"  ? "Done"    : "Serve";

        if (q.type === "priority") {
            row.style.background = "#fff8e1";
        }

        row.innerHTML = `
            <td><strong>${q.id}</strong>${q.type === "priority" ? ' <span style="color:#b45309;font-size:11px;font-weight:700;">★ PRIORITY</span>' : ""}</td>
            <td>${q.name}</td>
            <td>${q.purpose}</td>
            <td>${q.time}</td>
            <td><span class="pill ${statusClass}">${q.status}</span></td>
            <td><button class="serve-btn">${buttonText}</button></td>
        `;

        let btn = row.querySelector(".serve-btn");
        btn.style.background   = q.status === "serving" ? "#198754" : "#860000";
        btn.style.color        = "white";
        btn.style.padding      = "6px 12px";
        btn.style.borderRadius = "6px";
        btn.style.border       = "none";
        btn.style.cursor       = "pointer";

        btn.addEventListener("click", () => {
            selectedQueueId = q.id;
            if (q.status === "waiting") {
                document.getElementById("serve-modal").style.display = "flex";
            } else {
                finishServing();
            }
        });

        table.appendChild(row);
    });
}

// ─── Confirm Serve ────────────────────────────────────────────────────────────
function confirmServe() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        queue[index].status = "serving";
        localStorage.setItem("queueList", JSON.stringify(queue));

        // 🔔 Tell phone simulator this student is now being served
        triggerPhoneNotif(queue[index], "serving");

        closeModal();
        selectedQueueId = null;
        loadQueue();
    }
}

// ─── Finish / Done ────────────────────────────────────────────────────────────
function finishServing() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];
    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        // 🔔 Tell phone simulator transaction is done before removing
        triggerPhoneNotif(queue[index], "done");

        queue.splice(index, 1);
        localStorage.setItem("queueList", JSON.stringify(queue));

        selectedQueueId = null;
        loadQueue();
    }
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function closeModal() {
    document.getElementById("serve-modal").style.display = "none";
}

function closeNoQueue() {
    document.getElementById("noQueueModal").style.display = "none";
}

// ─── On page load: render immediately, then auto-refresh every 5 seconds ─────
window.addEventListener("DOMContentLoaded", () => {
    loadQueue();
    setInterval(loadQueue, 5000);
});