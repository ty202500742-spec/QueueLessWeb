// ─────────────────────────────
// CLOCK – updates both global and window clocks
// ─────────────────────────────
function tick() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;

    // Global admin topbar clock
    const globalClock = document.getElementById("clock");
    if (globalClock) globalClock.textContent = timeStr;

    // Window‑specific clock (if present)
    const windowClock = document.getElementById("windowClock");
    if (windowClock) windowClock.textContent = timeStr;
}
tick();
setInterval(tick, 1000);

// ─────────────────────────────
// PHONE NOTIFICATION
// ─────────────────────────────
function sendPhoneNotification(student, type, customMsg = null) {
    const payload = {
        type,
        id: student.id,
        name: student.name,
        phone: student.phone || "N/A",
        purpose: student.purpose,
        timestamp: Date.now(),
        message: customMsg
    };
    localStorage.setItem("phoneNotif", JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("phoneNotifEvent", { detail: payload }));
}

// ─────────────────────────────
// GET REGISTRAR QUEUE ONLY
// ─────────────────────────────
function getRegistrarQueue() {
    const all = JSON.parse(localStorage.getItem("queueList")) || [];
    return all.filter(q => q.window === "registrar");
}

// ─────────────────────────────
// RENDER QUEUE
// ─────────────────────────────
function renderQueue() {
    const queue = getRegistrarQueue();
    const tbody = document.getElementById("queueBody");

    tbody.innerHTML = queue.map((q, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="q-num">${q.id}</td>
            <td>${q.name}</td>
            <td><span class="purpose-tag">${q.purpose}</span></td>
            <td>${q.time}</td>
        </tr>
    `).join("");

    document.getElementById("queueCount").textContent = queue.length;
}

let current = null;

// ─────────────────────────────
// CALL NEXT
// ─────────────────────────────
function callNext() {
    const queue = getRegistrarQueue();
    if (queue.length === 0) {
        alert("No more students in queue.");
        return;
    }

    current = queue[0];

    document.getElementById("ctNumber").textContent = current.id;
    document.getElementById("ctName").textContent = current.name;
    document.getElementById("ctPurpose").textContent = current.purpose;
    document.getElementById("ctWait").textContent = current.time;

    sendPhoneNotification(current, "serving");
}

// ─────────────────────────────
// MARK DONE
// ─────────────────────────────
function markDone() {
    if (!current) return;

    sendPhoneNotification(current, "done");

    let all = JSON.parse(localStorage.getItem("queueList")) || [];
    all = all.filter(q => q.id !== current.id);
    localStorage.setItem("queueList", JSON.stringify(all));

    current = null;
    renderQueue();
}

// ─────────────────────────────
// NO SHOW
// ─────────────────────────────
function noShow() {
    if (!current) return;

    let all = JSON.parse(localStorage.getItem("queueList")) || [];
    all = all.filter(q => q.id !== current.id);
    const moved = { ...current };
    all.push(moved);
    localStorage.setItem("queueList", JSON.stringify(all));

    current = null;
    renderQueue();
}

// ─────────────────────────────
// INIT
// ─────────────────────────────
window.addEventListener("DOMContentLoaded", function () {
    renderQueue();
});

// ─────────────────────────────
// TOAST (optional)
// ─────────────────────────────
function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2500);
}