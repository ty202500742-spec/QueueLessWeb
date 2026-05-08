function loadPriorityRecords() {
    var q = JSON.parse(localStorage.getItem("queueList") || "[]");
    var priority = q.filter(function(x) {
        return x.category === "PWD" || x.category === "Senior Citizen" || x.category === "VIP";
    });
    var tbody = document.getElementById("priorityRecordsBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (priority.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px">No priority records</td></tr>';
        return;
    }
    priority.forEach(function(p) {
        var tr = document.createElement("tr");
        tr.innerHTML = '<td>' + p.name + '</td>' +
                       '<td><span class="pill priority">' + p.category + '</span></td>' +
                       '<td>' + (p.phone ? "ID: " + p.phone : "—") + '</td>' +
                       '<td><span class="pill waiting">' + p.status + '</span></td>';
        tbody.appendChild(tr);
    });
}
window.addEventListener("DOMContentLoaded", function() {
    loadPriorityRecords();
    setInterval(loadPriorityRecords, 3000);
});