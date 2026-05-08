function loadHistoryFromStorage() {
    var history = JSON.parse(localStorage.getItem("queueHistory") || "[]");
    var list = document.getElementById("historyList");
    if (!list) return;
    list.innerHTML = "";

    if (history.length === 0) {
        list.innerHTML = '<div class="history-item" style="text-align:center;padding:20px;color:#999;">No queue history found.</div>';
        return;
    }

    // Show most recent first
    history.slice().reverse().forEach(function(entry) {
        var statusClass = "";
        if (entry.status === "served") statusClass = "is-done";
        else if (entry.status === "waiting") statusClass = "is-waiting";
        else if (entry.status === "skipped") statusClass = "is-missed";
        else statusClass = "is-active";

        var iconBg = entry.type === "priority" ? "#fef3c7" : "#dcfce7";
        var iconEmoji = entry.window && entry.window.includes("Cashier") ? "💳" : "📄";

        var div = document.createElement("div");
        div.className = "history-item " + statusClass;
        div.innerHTML =
            '<div class="h-icon" style="background:' + iconBg + ';">' + iconEmoji + '</div>' +
            '<div class="h-info">' +
                '<div class="h-title">' + entry.service + '</div>' +
                '<div class="h-sub">' + (entry.window || "—") + ' <span class="h-num">' + entry.id + '</span></div>' +
            '</div>' +
            '<div class="h-right">' +
                '<span class="h-status ' + (entry.status === "served" ? "done" : entry.status === "waiting" ? "waiting" : "missed") + '">' + entry.status + '</span>' +
                '<div class="h-time">' + (entry.date || "") + ' · ' + (entry.time || "") + '</div>' +
            '</div>';
        list.appendChild(div);
    });

    document.getElementById("historyList").style.display = "block";
    var badge = document.querySelector(".history-badge");
    if (badge) badge.textContent = history.length;
}

function clearHistory() {
    if (confirm("Clear all queue history?")) {
        localStorage.removeItem("queueHistory");
        loadHistoryFromStorage();
    }
}

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

window.addEventListener("DOMContentLoaded", function() {
    loadHistoryFromStorage();
    document.getElementById("ham").addEventListener("click", toggleSidebar);
    document.getElementById("overlay").addEventListener("click", closeSidebar);
    document.querySelector(".close-btn").addEventListener("click", closeSidebar);
});