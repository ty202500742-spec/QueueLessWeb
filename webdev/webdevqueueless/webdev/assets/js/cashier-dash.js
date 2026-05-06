// ─────────────────────────────
// PHONE NOTIFICATION
// ─────────────────────────────
function sendPhoneNotification(student, type, messageOverride = null) {
    const payload = {
        type,
        id: student.id,
        name: student.name,
        phone: student.phone || "N/A",
        purpose: student.purpose,
        timestamp: Date.now(),
        message: messageOverride
    };

    localStorage.setItem("phoneNotif", JSON.stringify(payload));
}

let currentServing = null;
// ─────────────────────────────
// CLOCK
// ─────────────────────────────
function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    document.getElementById("clock").textContent =
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${ampm}`;
}
tick();
setInterval(tick, 1000);


// ─────────────────────────────
// QUEUE
// ─────────────────────────────
function getCashierQueue() {
    const all = JSON.parse(localStorage.getItem("queueList")) || [];
    return all.filter(q => q.window === "cashier");
}


// ─────────────────────────────
// RENDER
// ─────────────────────────────
function renderQueue() {
    const queue = getCashierQueue();
    const tbody = document.getElementById("queueBody");

    tbody.innerHTML = queue.map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td><span class="purpose-tag">${r.purpose}</span></td>
            <td>${r.time}</td>
        </tr>
    `).join("");

    document.getElementById("queueCount").textContent = queue.length;
}


// ─────────────────────────────
// CALL NEXT (FIXED CORE LOGIC)
// ─────────────────────────────
function callNext() {
    const all = JSON.parse(localStorage.getItem("queueList")) || [];
    const queue = all.filter(q => q.window === "cashier");

    if (queue.length === 0) {
        document.getElementById("currentTicket").style.display = "none";
        document.getElementById("emptyHero").classList.add("visible");
        return;
    }

    currentServing = queue[0]; // ✅ store active user

    document.getElementById("ctNumber").textContent = currentServing.id;
    document.getElementById("ctName").textContent = currentServing.name;
    document.getElementById("ctPurpose").textContent = currentServing.purpose;
    document.getElementById("ctWait").textContent = currentServing.time;

    document.getElementById("currentTicket").style.display = "";
    document.getElementById("emptyHero").classList.remove("visible");

    sendPhoneNotification(currentServing, "serving");
}


// ─────────────────────────────
// MARK DONE
function markDone() {
    if (!currentServing) return;

    let all = JSON.parse(localStorage.getItem("queueList")) || [];

    all = all.filter(q => q.id !== currentServing.id);

    localStorage.setItem("queueList", JSON.stringify(all));

    sendPhoneNotification(currentServing, "done");

    currentServing = null;

    renderQueue();
   
}


// ─────────────────────────────
// NO SHOW
// ─────────────────────────────
function noShow() {
    if (!currentServing) return;

    let all = JSON.parse(localStorage.getItem("queueList")) || [];

    all = all.filter(q => q.id !== currentServing.id);

    all.push(currentServing); // move to back

    localStorage.setItem("queueList", JSON.stringify(all));

    sendPhoneNotification(currentServing, "skip");

    currentServing = null;

    renderQueue();
    callNext();
}

// ─────────────────────────────
// INIT
// ─────────────────────────────
window.addEventListener("DOMContentLoaded", function () {
    renderQueue();
});