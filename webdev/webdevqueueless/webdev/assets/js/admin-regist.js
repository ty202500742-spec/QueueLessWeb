
// ─── Selected Queue
let selectedQueueId = null;

// ─── Phone Notification
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

// ─── UPDATE BIG CARD
function updateCurrentDisplay(current) {
    const qNum = document.querySelector(".current-q");
    const name = document.querySelector(".student-name");
    const purpose = document.querySelector(".transaction-type");

    if (!current) {
        qNum.textContent = "—";
        name.textContent = "No Active Queue";
        purpose.textContent = "";
        return;
    }

    qNum.textContent = current.id;
    name.textContent = current.name;
    purpose.textContent = current.purpose;
}

// ─── LOAD REGISTRAR QUEUE (MASTER SYSTEM)
function loadQueue() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let table = document.getElementById("queueTableBody");
    let upNextList = document.querySelector(".queue-list");

    table.innerHTML = "";
    upNextList.innerHTML = "";

    if (queue.length === 0) {
        updateCurrentDisplay(null);
        return;
    }

    // ─── CURRENT SERVING
    let current = queue.find(q => q.status === "serving") || null;
    updateCurrentDisplay(current);

    // ─── TABLE
    queue.forEach(q => {
        let row = document.createElement("tr");

        let statusClass = q.status === "serving" ? "serving" : "waiting";
        let buttonText = q.status === "serving" ? "Done" : "Serve";

        if (q.type === "priority") {
            row.style.background = "#fff8e1";
        }

        row.innerHTML = `
            <td><strong>${q.id}</strong></td>
            <td>${q.name}</td>
            <td>${q.purpose}</td>
            <td>${q.time}</td>
            <td><span class="pill ${statusClass}">${q.status}</span></td>
            <td><button class="serve-btn">${buttonText}</button></td>
        `;

        let btn = row.querySelector(".serve-btn");

        btn.onclick = () => {
            selectedQueueId = q.id;

            if (q.status === "waiting") {
                document.getElementById("serve-modal").style.display = "flex";
            } else {
                finishServing();
            }
        };

        table.appendChild(row);
    });

    // ─── UP NEXT LIST
    let waitingQueue = queue.filter(q => q.status === "waiting");

    waitingQueue.slice(0, 3).forEach((q, index) => {
        let li = document.createElement("li");
        li.className = "queue-item" + (index === 0 ? " next-up" : "");

        li.innerHTML = `
            <div class="q-num">${q.id}</div>
            <div class="q-info">
                <strong>${q.name}</strong>
                <span>${q.purpose}</span>
            </div>
        `;

        upNextList.appendChild(li);
    });
}

// ─── CALL NEXT
function callNext() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let nextIndex = queue.findIndex(q => q.status === "waiting");

    if (nextIndex === -1) {
        alert("No more students in queue");
        return;
    }

    queue.forEach(q => {
        if (q.status === "serving") q.status = "waiting";
    });

    queue[nextIndex].status = "serving";

    localStorage.setItem("queueList", JSON.stringify(queue));

    triggerPhoneNotif(queue[nextIndex], "serving");

    loadQueue();
}

// ─── FINISH SERVING (DONE)
function finishServing() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.id === selectedQueueId);

    if (index !== -1) {
        triggerPhoneNotif(queue[index], "done");
        queue.splice(index, 1);
    }

    localStorage.setItem("queueList", JSON.stringify(queue));
    loadQueue();
}

// ─── SKIP CURRENT
function skipCurrent() {
    let queue = JSON.parse(localStorage.getItem("queueList")) || [];

    let index = queue.findIndex(q => q.status === "serving");

    if (index !== -1) {
        queue.splice(index, 1);
    }

    localStorage.setItem("queueList", JSON.stringify(queue));
    loadQueue();
}

// ─── MODAL
function closeModal() {
    document.getElementById("serve-modal").style.display = "none";
}

// ─── INIT
window.addEventListener("DOMContentLoaded", () => {
    loadQueue();
    setInterval(loadQueue, 3000);
});