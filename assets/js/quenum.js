// ── Sidebar toggle ──
var isOpen = false;
function toggleSidebar() { isOpen ? closeSidebar() : openSidebar(); }
function openSidebar() {
    isOpen = true;
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("active");
    document.getElementById("ham").classList.add("active");
}
function closeSidebar() {
    isOpen = false;
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("ham").classList.remove("active");
}

// ── Queue page logic ──
function loadQueuePage() {
    var userName = localStorage.getItem("queue_userName") || "Unknown User";
    var userId = localStorage.getItem("queue_userId") || "";
    var userService = localStorage.getItem("queue_userService") || "Unknown Service";

    var allQueue = JSON.parse(localStorage.getItem("queueList") || "[]");
    var queue = allQueue.filter(function(q) { return q.type === "regular"; });

    var queueListEl = document.getElementById("queueList");
    var currentNumberEl = document.getElementById("currentNumber");
    var statusMessageEl = document.getElementById("statusMessage");

    queueListEl.innerHTML = "";

    if (queue.length === 0) {
        currentNumberEl.textContent = "---";
        statusMessageEl.textContent = "No queue yet.";
        return;
    }

    var userIndex = queue.findIndex(function(q) { return q.id === userId; });
    if (userIndex === -1) {
        userIndex = queue.map(function(q) { return q.name; }).lastIndexOf(userName);
    }
    if (userIndex === -1) userIndex = queue.length - 1;

    var userQueue = queue[userIndex];

    queue.forEach(function(q, index) {
        var li = document.createElement("li");
        if (index === userIndex) {
            li.classList.add("current");
            li.innerHTML = '<span>#' + q.id + ' You</span><span>' + (q.status === "serving" ? "Now Serving!" : "Your Turn") + '</span>';
        } else {
            li.innerHTML = '<span>#' + q.id + ' ' + q.name + '</span><span>' + (q.status === "serving" ? "Now Serving" : "Waiting") + '</span>';
        }
        queueListEl.appendChild(li);
    });

    currentNumberEl.textContent = userQueue.id;

    var peopleAhead = userIndex;
    var estWait = peopleAhead * 5;
    var queueType = userQueue.type === "priority" ? "Priority Line" : "Regular Line";

    if (userQueue.status === "serving") {
        statusMessageEl.textContent = "You are now being served for " + userService + "! Please proceed to the window.";
    } else {
        statusMessageEl.innerHTML = "You are in queue for <strong>" + userService + "</strong>.<br>" +
            "(<span class='queue-typereg'>" + queueType + "</span>) " + peopleAhead + " people ahead. Est. wait: " + estWait + " min.";
    }
}

function cancelQueue() {
    if (confirm("Are you sure you want to cancel your queue?")) {
        var userId = localStorage.getItem("queue_userId") || "";
        var queue = JSON.parse(localStorage.getItem("queueList") || "[]");
        var index = queue.findIndex(function(q) { return q.id === userId; });
        if (index !== -1) {
            queue.splice(index, 1);
            localStorage.setItem("queueList", JSON.stringify(queue));
        }
        localStorage.removeItem("queue_userName");
        localStorage.removeItem("queue_userType");
        localStorage.removeItem("queue_userId");
        alert("Your queue has been cancelled.");
        window.location.href = "index.html";
    }
}

// Auto‑refresh
setInterval(loadQueuePage, 5000);
window.onload = loadQueuePage;

// Attach event listeners
window.addEventListener("DOMContentLoaded", function() {
    // Hamburger
    var ham = document.getElementById("ham");
    if (ham) ham.addEventListener("click", toggleSidebar);
    var overlay = document.getElementById("overlay");
    if (overlay) overlay.addEventListener("click", closeSidebar);
    var closeBtn = document.querySelector(".sidebar .close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    // Cancel button
    var cancelBtn = document.getElementById("cancelQueueBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function(e) {
            e.preventDefault();
            cancelQueue();
        });
    }
});